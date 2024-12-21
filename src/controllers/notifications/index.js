const {
    invalidFieldResponse,
    errorResponse,
    successResponse,
    forbiddenResponse,
} = require("../../utils");
const getProducer = require("../../utils/producer");

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

            const metadata = { image, entityId, screen };

            // topic, key, value
            const notifyObj = {
                notifyBody: {
                    heading,
                    message,
                    priority,
                    type,
                    deliveryType,
                    metadata,
                    deliveryType,
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
};

module.exports = controller;
