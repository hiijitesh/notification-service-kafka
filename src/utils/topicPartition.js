const { kafka } = require("./client");

async function createTopicAndPartitions(topicName, NumberOfPartition) {
    const admin = kafka.admin();
    console.log("Admin connecting...");
    admin.connect();
    console.log("Admin Connection Success... ✅✅✅\n");

    const data = await admin.createTopics({
        topics: [
            {
                topic: topicName,
                numPartitions: NumberOfPartition,
            },
        ],
    });
    console.log("\n\n==============================================");
    console.log(
        `TOPIC:${topicName} <==> PARTITIONS:${NumberOfPartition} created...,`
    );
    console.log("==============================================\n\n");
    console.log("Disconnecting Admin..");
    await admin.disconnect();
    return data;
}

module.exports = createTopicAndPartitions;
