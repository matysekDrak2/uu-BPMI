const express = require("express");
const router = express.Router();

// Makes sure that the sessionKey is valid
const auth = require('../session/auth')
router.use(auth)

const get = require("./get");
router.get("/", (req, res) => {
    get(req, res)
});

const create = require("./create");
router.post("/", (req, res) => {
    create(req, res)
})

const getTasks = require("./getTasks");
router.get("/tasks", (req, res) => {
    getTasks(req, res)
})

module.exports = router;