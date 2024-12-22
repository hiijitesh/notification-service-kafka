const {
    invalidFieldResponse,
    errorResponse,
    successResponse,
    forbiddenResponse,
} = require("../../utils");
const getProducer = require("../../utils/producer");
const createTopicAndPartitions = require("../../utils/topicPartition");
const {
    getUserPreference,
    createNotification,
    updateUserPreference,
} = require("./service");

const sendEmail = require("../../utils/nodemailer");
const sendSMS = require("../../utils/sendSMS");
const sendPushNotification = require("../../utils/onesignalPush");

const controller = {
    sendNotification: async (req, res) => {
        try {
            const {
                topic,
                message,
                userId,
                heading,
                priority,
                type,
                deliveryType,
                image,
                entityId,
                entityType,
                screen,
            } = req.body;

            if (
                !topic ||
                !message ||
                !type ||
                !priority ||
                !heading ||
                !userId ||
                !deliveryType
            ) {
                return invalidFieldResponse(res, "All fields are mandatory!");
            }

            // let setPriority;
            // if (!priority) {
            //     setPriority = type === "alert" ? "high" : "low";
            // }

            const metadata = { image, entityId, screen, entityType };
            // console.log("deliveryType", deliveryType);
            // topic, key, value
            const notifyBody = {
                heading,
                message,
                userId,
                priority,
                type,
                deliveryType,
                deliveryTime:
                    deliveryType === "real-time"
                        ? new Date()
                        : addMinutes(new Date(), 1),

                isDelivered: deliveryType === "real-time" ? true : false,
                metadata,
            };
            const notifyObj = {
                notifyBody,
                userId,
            };

            // Query 5: Urgent Alerts in Real Time
            if (priority === "high") {
                // get channels preference
                // call twilio

                await channelNotification(userId, heading, message);

                // db entry
                const highData = await createNotification(notifyBody);
                console.log("High Priority data created==>", highData);
                return successResponse(
                    res,
                    highData,
                    "High Priority data created"
                );
            } else {
                const data = await getProducer(notifyObj, topic);
                // console.log("PRODUCED", data);
                if (data) {
                    return successResponse(
                        res,
                        data,
                        "Notification send to Kafka Producer!!!"
                    );
                }
            }
        } catch (error) {
            console.error(error);
            return errorResponse(res, {}, "something went wrong!");
        }
    },

    addTopicPartitions: async (req, res) => {
        try {
            const { topics } = req.body;

            if (!topics || !Array.isArray(topics)) {
                return errorResponse(
                    res,
                    {},
                    "provide an array with {topic, numberOfPartition"
                );
            }

            for (const topicsData of topics) {
                const { topic, numberOfPartition } = topicsData;
                await createTopicAndPartitions(topic, numberOfPartition);

                console.log("topic & partition Creating...");
            }
            return successResponse(res, {}, "TOPIC & PARTITIONS Created");
        } catch (error) {
            console.error(error);
            return errorResponse(res, {}, "something went wrong!");
        }
    },

    addUserPreference: async (req, res) => {
        try {
            // const { userId, quietHourEnd, quietHourEnd } = req.body;

            if (!userId || !quietHourEnd || !quietHourEnd) {
                return errorResponse(res, {}, "provide userId or Hours");
            }

            const prefObj = {
                userId,
                quietHourStart: quietHourEnd,
                quietHourEnd: quietHourEnd,
            };

            const ok = console.log("PREF DONE", ok);
            const pref = await updateUserPreference(prefObj);
            return successResponse(res, pref, "TOPIC & PARTITIONS Created");
        } catch (error) {
            console.error(error);
            return errorResponse(res, {}, "something went wrong!");
        }
    },
};

module.exports = controller;

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

async function channelNotification(userId, heading, message) {
    const preference = await getUserPreference(userId);
    if (preference) {
        const channels = preference.channels;
        let msg = {
            from: '"Jitesh Kumar" <jiteshece@gmail.email>', // sender address
            to: "jitesbharti@gmail.com", // list of receivers
            bcc: "vinishbhaskar321@gmail.com",
            subject: heading, // Subject line
            text: message, // plain text body
            // html: "<b>Hello world?</b>", // html body
        };

        for (const channel of channels) {
            if (channel === "sms") {
                console.log("calling twilio");
                await sendSMS({ body: message });
            }
            if (channel === "email") {
                console.log("calling Nodemailer");
                await sendEmail(msg);
            }
            if (channel === "push") {
                console.log("PUSH.....");
                await sendPushNotification(msg);
            }
        }
    }
}
