const { NotificationModel, PreferenceModel } = require("../models");

module.exports = {
    sendNotificationUser: async (notify) => {
        if (notify) {
            const TRIGGER_NOTIFICATION = true;
            const NotificationId = notify._id?.toString();
            const userId = notify.userId?.toString();
            console.log(
                "TRIGGER_NOTIFICATION",
                TRIGGER_NOTIFICATION,
                "NotificationId==>",
                NotificationId
            );

            // get user preferences

            if (!userId) {
                console.log("NO User Id ");
                return;
            }
            const preference = await PreferenceModel.findOne({ userId });
            console.log("preference", preference);

            // channels - email sms push
            const channels = preference.channels;
            // scheduled ---> schedule it

            // real-time -->
            // 1. correct time(not dnd, has limit)
            // 2. limit exhausted --> schedule it after 1 hr
            // 3. DND Period --> schedule it after quietHrs

            if (preference && notify.deliveryType === "real-time") {
                // 2. limit exhausted-- > schedule it after 1 hr
                const limitPerHour = preference.limitPerHour;
                const checkLimit = await NotificationModel.find({
                    userId,
                    $and: [
                        {
                            deliveryTime: {
                                $gte: new Date(
                                    new Date().getTime() - 1000 * 60 * 60
                                ),
                            },
                        },
                        {
                            deliveryTime: {
                                $lte: new Date(),
                            },
                        },
                    ],
                });

                if (checkLimit && checkLimit > limitPerHour) {
                    // send the notif
                    await scheduleLimitExhaust(NotificationId);
                    console.log("LMIT SCHEDULED");
                    TRIGGER_NOTIFICATION = false;
                }

                // DND hrs -
                const quietHourStart = preference.quietHourStart; // number
                const quietHourEnd = preference.quietHourEnd; // number

                const now = new Date();
                const currentMinute = now.getHours() * 60 + now.getMinutes();

                // pref fetch s, e ---> num,  new Date()--> convert into minute --> .getHour()*60+.getMinutes;

                // 7am - 10pm //  end > start -->  deliveryTime = end +1-minute

                // 10pm-3AM // start > end     -->>  currMinute < start
                // </start > deliveryTime = start + 1 - minute

                if (quietHourStart < quietHourEnd) {
                    // in a same eg:- 7AM - 10AM
                    if (
                        currentMinute > quietHourStart &&
                        currentMinute < quietHourEnd
                    ) {
                        TRIGGER_NOTIFICATION = false;
                        await scheduleDND(quietHourEnd, NotificationId);
                        console.log("DND SCHEDULED");
                    }
                } else if (quietHourStart > quietHourEnd) {
                    // both are in different day eg:- 10PM - 3AM
                    if (
                        currentMinute < quietHourStart &&
                        currentMinute > quietHourEnd
                    ) {
                        TRIGGER_NOTIFICATION = false;
                        await scheduleDND(quietHourStart, NotificationId);
                        console.log("DND SCHEDULED");
                    }
                }

                console.log("currentMIn", currentMinute);
            }

            // send notif to prefs
        }
    },

    sendNotificationUserBulk: async (data) => {
        if (data) {
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

async function scheduleDND(date, NotificationId) {
    let start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const deliverTime = addMinutes(start, date + 1);

    const updateNotifyObj = {
        deliveryType: "scheduled",
        deliverTime,
    };

    const updateNotify = await NotificationModel.findByIdAndUpdate(
        NotificationId,
        updateNotifyObj,
        { new: true }
    );
    console.log("DND Hour Found so ===>> NOTIF---> Scheduled", updateNotify);
}
async function scheduleLimitExhaust(NotificationId) {
    // scheduled to 1 hr later
    const updateNotifyObj = {
        deliveryTime: {
            $gte: new Date(ISODate().getTime() + 1000 * 60 * 60),
        },
    };

    const data = await NotificationModel.findByIdAndUpdate(
        NotificationId,
        updateNotifyObj,
        {
            new: true,
        }
    );

    console.log("LMIT SCHEDULED======>>>>>", data);

    return data;
}

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

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

async function lowPrioritySummary(params) {
    const data = await NotificationModel.find({
        priority: "low",
        isDelivered: false,
    });

    for (const ele of data) {
        const { type, message, heading } = ele;
    }

    // order-4
    // like -3

    // call one signal
}
