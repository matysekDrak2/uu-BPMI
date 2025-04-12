const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors:true});
const addFormats = require("ajv-formats")
addFormats(ajv)

const auth = require('../session/auth')
router.use(auth)

router.post('/', (req, res) => {
    const sessionKey = req.body.sessionKey;

    const getUserIdFromSession = require("../../../dao/session/getUser");
    const userId = getUserIdFromSession(sessionKey);

    const getTaskLists = require("../../../dao/task-list/getAll");
    const taskLists = getTaskLists();

    const data = []

    for (const taskList of taskLists) {
        if (taskList.owner === userId) data.push(taskList);
        if (taskList.admins && taskList.admins.includes(userId)) data.push(taskList);
        if (taskList.members && taskList.members.includes(userId)) data.push(taskList);
    }
    res.status(200).json(data)
})

module.exports = router;