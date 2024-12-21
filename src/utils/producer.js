const { kafka } = require("./client");
// const readline = require("readline");

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

async function getProducer(notifyObj, topic) {
    const producer = kafka.producer();

    console.log("Connecting Producer...");
    await producer.connect();
    console.log("Producer Connected Successfully");

    // rl.setPrompt("> ");
    // rl.prompt();

    // rl.on("line", async function (line) {
    //     const [riderName, location] = line.split(" ");
    //     // const [topicName, NumberOfPartition] = line.split(" ");
    //     console.log("location", location, "riderName");

    //     // topic, key, value

    //     await producer.send({
    //         topic: "sms",
    //         messages: [
    //             {
    //                 partition: location.toLowerCase() === "north" ? 0 : 1,
    //                 key: "userId", //
    //                 value: JSON.stringify({ name: riderName, location }),
    //                 timestamp: new Date(),
    //             },
    //         ],
    //     });
    // }).on("close", async () => {
    //     await producer.disconnect();
    // });

    let data;
    if (topic === "orders" || topic === "sell") {
        const { userId, notifyBody } = notifyObj;

        const lastChar = userId.slice(-1).charCodeAt(0);
        const partitionNumber = lastChar % 2; // NumberOfPartition
        console.log(lastChar, notifyObj, partitionNumber);

        data = await producer.send({
            topic: topic,
            messages: [
                {
                    partition: partitionNumber,
                    key: userId,
                    value: JSON.stringify(notifyBody),
                    timestamp: new Date(),
                },
            ],
        });

        if (data.length > 0) {
            console.log("==== Produced data ====>>>", data);
        } else {
            console.log("==== Couldn't Produced the topic <<<====\n");
        }
    }

    await producer.disconnect();
    return data || ["Invalid Topic"];
}

module.exports = getProducer;
