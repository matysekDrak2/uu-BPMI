const express = require("express");
const router = express.Router();

// Makes sure that the sessionKey is valid
const auth = require('../session/auth')
router.use(auth)

const get = require("./get");
router.get("/", (req, res) => {
    get(req, res)
});

const update = require("./update");
router.post("/", (req, res) => {
    update(req, res)
})

const create = require("./create");
router.put("/", (req, res) => {
    create(req, res)
})

module.exports = router;