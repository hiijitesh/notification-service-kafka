const { NotificationModel, PreferenceModel } = require("../models");
const { sendPushNotification } = require("./onesignalPush");
const sendEmail = require("./nodemailer");
const sendSMS = require("./twilioSMS");

module.exports = {
    sendNotificationUser: async (notify) => {
        if (!notify) {
            return "Provide Notify Data";
        }

        let isLimit = true;
        let isDND = true;
        let isAlert = false;

        const NotificationId = notify._id?.toString();
        const userId = notify.userId?.toString();

        console.log(
            "isLimit",
            isLimit,
            "isDND",
            isDND,
            "NotificationId==>",
            NotificationId
        );

        if (!userId) {
            console.log("NO User Id ");
            return;
        }
        const preference = await PreferenceModel.findOne({ userId });
        console.log("preference", preference);

        // channels - email sms push
        // const channels = preference.channels;
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

            console.log("checkLimit====>", checkLimit.length);

            if (checkLimit && checkLimit > limitPerHour) {
                // send the notif
                await scheduleLimitExhaust(NotificationId);
                console.log("LIMIT SCHEDULED=======");
                isLimit = false;
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
                console.log("INSIDE checking QUIET HOURS");
                // in a same eg:- 7AM - 10AM
                if (
                    currentMinute > quietHourStart &&
                    currentMinute < quietHourEnd
                ) {
                    await scheduleDND(quietHourEnd, NotificationId);
                    console.log("DND SCHEDULED------BEFORE");
                    isDND = false;
                }
            } else if (quietHourStart > quietHourEnd) {
                // both are in different day eg:- 10PM - 3AM
                if (
                    currentMinute < quietHourStart &&
                    currentMinute > quietHourEnd
                ) {
                    await scheduleDND(quietHourStart, NotificationId);
                    console.log("DND SCHEDULED-----2 AFTER");
                    isDND = false;
                }
            }

            if (notify.type === "alert") {
                isAlert = await similarAlters(notify);
                console.log("INSIDE ALERT", isAlert);
            }

            console.log("currentMIn-------", currentMinute);

            if (isLimit && isDND && !isAlert) {
                await channelNotification(notify);
            }
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
    console.log("DND Hour Found so ===>> NOTIFY---> Scheduled", updateNotify);
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

    console.log("== IiMIT SCHEDULED======>>>>>", data);

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

async function similarAlters(notify) {
    const oneHourAgo = getOneHourAgo();

    const data = await NotificationModel.find({
        type: "alert",
        userId: notify?.userId,
        isDelivered: true,
        sent_time: { $gte: oneHourAgo },
    });

    if (data?.length >= 2) {
        console.log("SIMILAR ALERT FOUND........");
        return true;
    }

    return false;
}

async function lowPrioritySummary() {
    const data = await NotificationModel.find({
        priority: "low",
        isDelivered: false,
    });

    for (const ele of data) {
        const { type, message, heading } = ele;
        if (type === "order") {
            orderCount++;
        }
        if (type === "product") {
            productCount++;
        }
    }

    const orderSummary = {
        heading: `Your ${orderCount} has been placed`,
        message,
    };

    // }
    // order-4
    // like -3

    // call one signal
}

async function channelNotification(data) {
    if (!data) {
        console.log("provide the data");
        return;
    }

    const { userId, heading, message, metadata } = data;
    const preference = await PreferenceModel.findOne({ userId });
    console.log("channelNotification helper====>>>");

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
                console.log("calling... Nodemailer");
                await sendEmail(msg);
            }
            if (channel === "push") {
                console.log("sending PUSH.....");
                // await sendPushNotification(msg, metadata, heading);
            }
        }
    }
}
