const router = require("express").Router();
const { notificationControllers } = require("../controllers");

router.post("/notify", notificationControllers.sendNotification);
router.post("/topic", notificationControllers.AddTopicPartitions);

module.exports = router;
