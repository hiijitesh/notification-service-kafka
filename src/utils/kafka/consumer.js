const { kafka } = require("../client");

const group = "consumer-1";

async function kafkaConsumerInit() {
    const consumer = kafka.consumer({ groupId: group });
    await consumer.connect();

    addSubscriber(consumer, ["orders"]);

    getMessages(consumer);
}

// module.exports = kafkaConsumerInit;
kafkaConsumerInit();

async function addSubscriber(consumer, topics) {
    await consumer.subscribe({
        topics: topics, // ["order"]
        fromBeginning: true,
    });
}

async function getMessages() {
    const eachMessage = async ({
        topic,
        partition,
        message,
        heartbeat,
        pause,
    }) => {
        console.log("==== Consumer ====");
        // insert into db
        // trigger sms based on user preference
        console.log(
            `${group}: [${topic}]: PART:${partition}:`,
            message.value.toString()
        );
    };

    return eachMessage;
}

module.exports = { addSubscriber, getMessages };

// async function Unsubscribe(obj) {
//     const { topic } = obj;
//     await consumer.subscribe({
//         topics: topic, // ["order"],
//         fromBeginning: true,
//     });
// }
