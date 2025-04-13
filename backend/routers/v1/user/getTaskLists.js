const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
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

router.get('/', (req, res) => {
    const sessionKey = req.query.sessionKey;


    const getUserIdFromSession = require("../../../dao/session/getUser");
    const userId = getUserIdFromSession(sessionKey);

    const getTaskLists = require("../../../dao/task-list/getAll");
    const taskLists = getTaskLists();

    const data = []

    for (const taskList of taskLists) {
        if (taskList.owner === userId) data.push(taskList);
        if (taskList.admins.includes(userId)) data.push(taskList);
        if (taskList.members.includes(userId)) data.push(taskList);
    }
    res.status(200).json(data)
})

module.exports = router;