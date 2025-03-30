const express = require("express");
const router = express.Router();


const login = require("./login");
router.use("/login", login)

const signin = require("./signin");
router.use("/signin", signin)

const authTest = require('./authTest');
router.use('/authTest', authTest)

module.exports = router;