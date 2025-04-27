const express = require("express");
const router = express.Router();


const login = require("./login");
router.use("/login", login)

const signin = require("./signin");
router.use("/signin", signin)

const authTest = require('./authTest');
router.use('/authTest', authTest)

const getTaskLists = require("./getTaskLists");
router.use("/taskLists", getTaskLists)

const getUserById = require('./get');
router.use("/get", getUserById)

module.exports = router;