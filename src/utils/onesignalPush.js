require("dotenv").config();
const OneSignal = require("onesignal-node");

const API_KEY = process.env.ONE_SIGNAL_API_KEYS;
const APP_ID = process.env.ONE_SIGNAL_APP_ID;

module.exports = {
    sendPushNotification: async (notifications) => {
        const client = new OneSignal.UserClient({
            APP_ID,
            API_KEY,
        });
        const notification = {
            contents: {
                tr: "Yeni bildirim",
                en: "New notification",
            },
            included_segments: ["Subscribed Users"],
            filters: [{ field: "tag", key: "level", relation: ">", value: 10 }],
        };

        // using async/await
        try {
            const response = await client.createNotification(notification);
            console.log(response.body.id);
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

        // or you can use promise style:
        client
            .createNotification(notification)
            .then((response) => {})
            .catch((e) => {});
    },
};
