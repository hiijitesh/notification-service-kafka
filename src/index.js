require("dotenv").config();
const { version } = require("../package.json");
global.__constant = require("./constant");
global.__utils = require("./utils");
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const router = require("./routes");
const kafkaConsumerInit = require("./utils/consumer");
// const { AuthMiddleware } = require("./utils/auth");

// mongoose.set("debug", true);
const app = express();

const MongoURI = process.env.MONGO_URI || "";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));

app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
    );
    next();
});

if (app.settings.env === "development") {
    app.use("/v1", router);
}

mongoose
    .connect(MongoURI, { useNewUrlParser: true })
    .then(() => {
        console.log(`Connected to MongoDB at ${MongoURI} ✅ ✅ ✅`);
        return app.listen(process.env.PORT, () => {
            console.log(
                `Server version ${version} is running on port ${process.env.PORT} in ${app.settings.env} mode ✅ ✅`
            );
        });
    })
    .catch((err) => {
        console.error(err);
    });

// KAFKA Consumer Setup
const { kafka } = require("./utils/client");
const group = "consumer-1";
const consumer = kafka.consumer({ groupId: group });
consumer.connect();

async function subscribeAndListen(topics) {
    try {
        // await consumer.connect();
        console.log("GOT THE TOPICs", topics);
        // Subscribe to each topic dynamically
        for (const topic of topics) {
            await consumer.subscribe({ topic, fromBeginning: true });
            console.log("=====================================");
            console.log(`Consumer Subscribed to topic: [${topic}]`);
            console.log("=====================================\n");
        }
    } catch (error) {
        console.error("Error in Kafka Consumer:", error);
    }
}

const handleMessage = async ({ topic, partition, message }) => {
    console.log("=====================================");
    console.log(
        `Received message from ==>> "TOPIC:${topic}": MESSAGE: ${message.value.toString()}`
    );
    console.log("=====================================");

    if (topic === "order") {
        // Handle order notification
        console.log("=====================================");
        console.log(
            "Handling order notification:=>",
            "partition:",
            partition,
            "message:",
            message.value.toString()
        );
        console.log("=====================================");
    }

    // await consumer.commitOffsets([
    //     { topic, partition, offset: message.offset },
    // ]);
};

const runConsumer = async (topics) => {
    // await consumer.connect();
    // await consumer.subscribe({ topic: "order" });

    await subscribeAndListen(topics);
    // console.log("=====================================");
    // console.log("Consumer subscribed to topics: order");
    // console.log("=====================================\n");

    await consumer.run({
        eachMessage: handleMessage,
    });
};

const topics = ["order"];
runConsumer(topics)
    .then(() => {
        console.log("===========================================");
        console.log("Consumer is running ✅✅ Bale Bale ✅✅");
        console.log("===========================================\n\n");
    })
    .catch((error) => {
        console.error("Failed to run kafka consumer", error);
    });
