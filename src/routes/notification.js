const router = require("express").Router();
const { notificationControllers } = require("../controllers");

router.post("/notify", notificationControllers.sendNotification);
// router.post("/login", notificationControllers.login);

module.exports = router;
