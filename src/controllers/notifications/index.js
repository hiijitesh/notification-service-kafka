const {
    invalidFieldResponse,
    errorResponse,
    successResponse,
    forbiddenResponse,
} = require("../../utils");
const getProducer = require("../../utils/producer");
const createTopicAndPartitions = require("../../utils/topicPartition");

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
                screen,
            } = req.body;

            if (!topic) {
                return invalidFieldResponse(res, "All fields are mandatory!");
            }

            let setPriority;
            if (!priority) {
                setPriority = type === "alert" ? "high" : "low";
            }

            const metadata = { image, entityId, screen };
            // console.log("deliveryType", deliveryType);
            // topic, key, value
            const notifyObj = {
                notifyBody: {
                    heading,
                    message,
                    priority: setPriority,
                    type,
                    deliveryType,
                    deliveryTime:
                        deliveryType === "real-time"
                            ? new Date()
                            : addMinutes(new Date(), 1),

                    isDelivered: deliveryType === "real-time" ? true : false,
                    metadata,
                },
                userId,
            };

            const data = await getProducer(notifyObj, topic);
            // console.log("PRODUCED", data);
            if (data) {
                return successResponse(res, data);
            }
        } catch (error) {
            console.error(error);
            return errorResponse(res, {}, "something went wrong!");
        }
    },

    scheduleNotifications: async (req, res) => {
        try {
            job = schedule.scheduleJob("*/5 * * * *", function () {});
        } catch (error) {
            console.error(error);
            return errorResponse(res, {}, "something went wrong!");
        }
    },

    AddTopicPartitions: async (req, res) => {
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

                console.log("topic & partition Creating.....");
            }
            return successResponse(res, {}, "TOPIC & PARTITIONS Created");
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
