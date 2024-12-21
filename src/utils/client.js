const { Kafka } = require("kafkajs");

const IP = process.env.IP;

exports.kafka = new Kafka({
    clientId: "notification-service",
    brokers: ["192.168.254.238:9092"],
});
