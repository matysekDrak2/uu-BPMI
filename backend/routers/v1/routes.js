const express = require("express");
const router = express.Router();

const user = require("./user/router");
router.use("/user", user)

const taskList = require("./task-list/router");
router.use("/taskList", taskList)

module.exports = router;