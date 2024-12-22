const { NotificationModel, PreferenceModel } = require("../models");

module.exports = {
    sendNotificationUser: async (notify) => {
        if (notify) {
            const TRIGGER_NOTIFICATION = false;
            const NotificationId = notify._id?.toString();

            // get user preferences
            const preference = PreferenceModel.findOne({ userId });

            // channels - email sms push
            const channels = preference.channels;

            // DND hrs -
            const quietHourStart = new Date(preference.quietHourStart);
            const quietHourEnd = new Date(preference.quietHourEnd);

            const now = new Date();

            // If a notification falls within quiet hours, reschedule it for the user’s next active hour
            if (now < quietHourStart && now > quietHourEnd) {
                TRIGGER_NOTIFICATION = true;

                const deliverTime = quietHourEnd.setTime(
                    quietHourEnd.getTime() + 1000 * 60
                );

                const updateNotifyObj = {
                    deliveryType: "scheduled",
                    deliverTime,
                };

                const updateNotify = await NotificationModel.findByIdAndUpdate(
                    NotificationId,
                    updateNotifyObj
                );
                console.log(
                    "DND Hour Found so ===>> NOTIF---> Scheduled",
                    updateNotify
                );
            }

            // Limit Per Hrs
            //  check recent notifications sent to a user, ensuring the
            //  count does not exceed the hourly limit.
            const limitPerHour = preference.limitPerHour;
            const { startOfHour, endOfHour } = getStartEndHour();

            const checkLimit = NotificationModel.find({
                userId,
                createdAt: {
                    $gte: startOfHour,
                    $lt: endOfHour,
                },
            });

            if (checkLimit && checkLimit < limitPerHour) {
                // send the notif
                TRIGGER_NOTIFICATION = true;
            }

            // send notif to prefs
        }
    },

    sendNotificationUserBulk: async (getNotif) => {
        if (getNotif) {
            // get user preferences
            // channels - email sms push
            // DND hrs -
            // Limit Per Hrs
            // send notif to prefs
        }
    },

    addNotification: async (data) => {
        console.log(data);
        const notify = await NotificationModel.create(data);
        console.log("Notify data====>", notify);
        return notify;
    },
};

function getStartEndHour() {
    const now = new Date();

    const startOfHour = new Date(now);
    startOfHour.setMinutes(0, 0, 0); //  minutes, seconds, and milliseconds to 0

    console.log(startOfHour);
    const endOfHour = new Date(startOfHour);
    endOfHour.setHours(startOfHour.getHours() + 1); // Adding 1 hour

    console.log(endOfHour);

    return { startOfHour, endOfHour };
}

function getOneHourAgo() {
    let now = new Date();
    now.setHours(0, 0, 0, 0);

    let end = new Date();
    end.setHours(23, 59, 59, 999);

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    return oneHourAgo;
}
