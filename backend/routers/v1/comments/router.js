const express = require("express");
const router = express.Router();

// Makes sure that the sessionKey is valid
const auth = require('../session/auth');
router.use(auth);

const getComments = require("./get");
router.get("/", (req, res) => {
    getComments(req, res);
});

module.exports = router;