const express = require("express");
const router = express.Router();

// Makes sure that the sessionKey is valid
const auth = require('../session/auth');
router.use(auth);

const getComments = require("./get");
router.get("/", (req, res) => {
    getComments(req, res);
});

const getCommentsByTask = require("./getByTask");
router.get("/byTask", (req, res) => {
    getCommentsByTask(req, res);
});

const updateComment = require("./update");
router.post("/", (req, res) => {
    updateComment(req, res);
});

const createComment = require("./create");
router.put("/", (req, res) => {
    createComment(req, res);
});

module.exports = router;