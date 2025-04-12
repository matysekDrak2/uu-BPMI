const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const addFormats = require("ajv-formats")
addFormats(ajv)

const auth = require('../session/auth')
router.use(auth)

const user_login_tmpl = {
    type: 'object',
    properties: {
        sessionKey: { type: 'string', minLength: 36, maxLength: 36 }
    },
    required: ['sessionKey'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

// Přidáme middleware pro logování požadavku
router.use((req, res, next) => {
    next();
});

router.get('/', handleTaskLists);
router.post('/', handleTaskLists);

function handleTaskLists(req, res) {
    const sessionKey = req.body.sessionKey || req.query.sessionKey;

    console.log('Session Key:', sessionKey);

    if (!sessionKey) {
        console.log('Missing session key');
        return res.status(400).json({ error: "Session key is required" });
    }

    const getUserIdFromSession = require("../../../dao/session/getUser");
    const userId = getUserIdFromSession(sessionKey);

    if (!userId) {
        console.log('Invalid session');
        return res.status(401).json({ error: "Invalid session" });
    }

    const getTaskLists = require("../../../dao/task-list/getAll");
    const taskLists = getTaskLists();

    const data = []

    for (const taskList of taskLists) {
        if (taskList.owner === userId) {
            console.log('User is owner of task list:', taskList.id);
            data.push(taskList);
        }
        if (taskList.admins && taskList.admins.includes(userId)) {
            console.log('User is admin of task list:', taskList.id);
            data.push(taskList);
        }
        if (taskList.members && taskList.members.includes(userId)) {
            console.log('User is member of task list:', taskList.id);
            data.push(taskList);
        }
    }

    res.status(200).json(data);
}

module.exports = router;