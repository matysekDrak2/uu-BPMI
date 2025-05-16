const express = require("express");
const router = express.Router();


const login = require("./login");
router.use("/login", (req, res) => {
    login(req, res);
})

const signin = require("./signin");
router.use("/signin", (req, res) => {
    signin(req, res);
})

const authTest = require('./authTest');
router.post('/authTest', (req, res) => {
    authTest(req, res);
})

const auth = require('../session/auth')
const getTaskLists = require("./getTaskLists");
router.use("/taskLists", auth, getTaskLists)


const getUserById = require('./get');
router.use('/get', getUserById)

const getByEmail = require('./getByEmail');
router.use('/getByEmail', getByEmail)

module.exports = router;