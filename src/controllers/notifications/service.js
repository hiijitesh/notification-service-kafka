const { PreferenceModel, NotificationModel } = require("../../models");
const sendEmail = require("../../utils/nodemailer");
const sendSMS = require("../../utils/twilioSMS");
const sendPushNotification = require("../../utils/onesignalPush");

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

    channelNotification: async (userId, heading, message, metadata) => {
        const preference = await PreferenceModel.findOne({ userId });
        if (preference) {
            const channels = preference.channels;
            let msg = {
                from: '"Jitesh Kumar" <jiteshece@gmail.email>', // sender address
                to: "jitesbharti@gmail.com", // list of receivers
                // bcc: "abc@gmail.com",
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
                    // await sendPushNotification(msg);
                }
            }
        }
    },
};
