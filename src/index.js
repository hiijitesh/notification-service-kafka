require("dotenv").config();
const { version } = require("../package.json");
global.__constant = require("./constant");
global.__utils = require("./utils");
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const router = require("./routes");

const { NotificationModel } = require("./models");
const {
    sendNotificationUser,
    sendNotificationUserBulk,
    addNotification,
} = require("./utils/helper");

const schedule = require("node-schedule");
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
        `Received message from ==>> "TOPIC:${topic}": MESSAGE: ${message.value.toString()}, Partition:${partition}`
    );
    console.log("=====================================");

    const DATA = JSON.parse(message.value);
    console.log("MMmmmmmm", DATA);

    if (topic === "orders") {
        // Handle order notification
        let notify = false;
        // if (meta.deliveryType === "real-time") {
        // }

        if (DATA) {
            notify = await addNotification(DATA);
            await sendNotificationUser(notify);
        }
    }

    if (topic === "error") {
        console.log("error ===>> ALERT");
        // Deduplicate alerts if a similar one has been sent recently (e.g., suppress
        // identical error notifications sent within the last 1 hour)
        if (DATA) {
            notify = await addNotification(DATA);
            // sendNotificationUser(notify);
        }
    }

    // await consumer.commitOffsets([
    //     { topic, partition, offset: message.offset },
    // ]);
};

const runConsumer = async (topics) => {
    // await consumer.connect();
    // await consumer.subscribe({ topic: "order" });

    await subscribeAndListen(topics);
    await consumer.run({
        eachMessage: handleMessage,
    });
};

const topics = ["orders", "alert"];
runConsumer(topics)
    .then(() => {
        console.log("===========================================");
        console.log("Consumer is running.... ✅✅ === ✅✅");
        console.log("===========================================\n\n");
    })
    .catch((error) => {
        console.error("Failed to run kafka consumer", error);
    });

schedule.scheduleJob("*/3 * * * * *", async function () {
    const now = new Date(new Date().toUTCString());
    // console.log("SCHEDULER START===========", now);

    const getNotify = await NotificationModel.find({
        deliveryType: "scheduled",
        priority: "high",
        deliverTime: { $lte: now },
        isDelivered: false,
    });

    // console.log("NOTIF SCHEDULE SEND", getNotif);

    // await sendNotificationUser(getNotify);

    // update isDelivered ;true
});
