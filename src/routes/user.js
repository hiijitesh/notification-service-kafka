const router = require("express").Router();
const { userControllers } = require("../controllers");

router.post("/signup", userControllers.signup);
router.post("/login", userControllers.login);

module.exports = router;
