const express = require("express");
const router = express.Router();


const login = require("./login");
router.use("/login", login)

const signin = require("./signin");
router.use("/signin", signin)

const authTest = require('./authTest');
router.use('/authTest', authTest)

const auth = require('../session/auth')
const getTaskLists = require("./getTaskLists");
router.use("/taskLists", auth, getTaskLists)


const getUserById = require('./get');
router.get("/get", auth, (req, res) => {
    getUserById(req, res)
})

module.exports = router;