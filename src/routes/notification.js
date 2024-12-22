const router = require("express").Router();
const { notificationControllers } = require("../controllers");

router.post("/notify", notificationControllers.sendNotification);
router.post("/topic", notificationControllers.addTopicPartitions);
router.post("/prefer", notificationControllers.addUserPreference);

module.exports = router;
