const { PreferenceModel, NotificationModel } = require("../../models");

module.exports = {
    getUserPreference: async (userId) => {
        try {
            return await PreferenceModel.findOne({ userId });
        } catch (error) {
            console.error(error.message);
            return error;
        }
    },
    createNotification: async (data) => {
        try {
            console.log(data);
            const notify = await NotificationModel.create(data);
            return notify;
        } catch (error) {
            console.error(error.message);
            return error;
        }
    },
    updateUserPreference: async (userId, data) => {
        try {
            return await PreferenceModel.findOneAndUpdate(userId, data, {
                upsert: true,
                new: true,
            });
        } catch (error) {
            console.error(error.message);
            return error;
        }
    },
};
