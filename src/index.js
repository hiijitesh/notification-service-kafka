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

const { kafka } = require("./utils/client");
const group = "consumer-1";

const consumer = kafka.consumer({ groupId: group });
consumer.connect();
console.log("consumer running");

kafkaConsumerInit.addSubscriber(consumer, ["order"]);

const kfk = consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log("CONSUMER RUNNING");
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}#${message.value}`);
    },
});

// const run = async () => {
//     await consumer.connect();
//     await consumer.subscribe({ topic: ["order"], fromBeginning: true });
//     await consumer.run({
//         eachMessage: async ({ topic, partition, message }) => {
//             console.log("CONSUMER RUNNING");
//             const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
//             console.log(`- ${prefix} ${message.key}#${message.value}`);
//         },
//     });
// };

// run().catch((e) => console.error(`[example/consumer] ${e.message}`, e));

// kfk().catch((e) => console.error(`[example/consumer] ${e.message}`, e));
