const readline = require("readline");
const { kafka } = require("../client");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function init() {
    rl.setPrompt("> ");
    rl.prompt();

    const admin = kafka.admin();
    console.log("Admin connecting...");
    admin.connect();
    console.log("Admin Connection Success... ✅✅✅");

    // create topics

    rl.on("line", async function (line) {
        const [topicName, NumberOfPartition] = line.split(" ");
        await admin.createTopics({
            topics: [
                {
                    topic: topicName,
                    numPartitions: NumberOfPartition,
                },
            ],
        });
        console.log(
            `Topic Created Successfully, Topic: ${topicName} and partition count: ${NumberOfPartition}`
        );
        console.log("Disconnecting Admin..");
        await admin.disconnect();
    });
}

init();
