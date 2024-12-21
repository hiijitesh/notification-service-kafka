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
            const { topic, message, userId, heading, priority, type } =
                req.body;

            if (!topic) {
                return invalidFieldResponse(res, "All fields are mandatory!");
            }

            // topic, key, value
            const notifyObj = {
                notifyBody: { heading, message, priority, type },
                userId,
            };

            const data = await getProducer(notifyObj, topic);

            console.log("PRODUCED, -------------");
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
