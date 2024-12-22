const { Kafka } = require("kafkajs");
const ip = require("ip");

const host = ip.address(); // process.env.HOST_IP ||
console.log(host);

exports.kafka = new Kafka({
    clientId: "notification-service",
    brokers: [`${host}:9092`],
});
