const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        listId: { type: 'string'},
    },
    required: ['listId'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

function get(req, res) {
    const param = req.query
    const valid = validator(param);
    if (!valid) {
        res.status(400).json(validator.errors).send()
        return
    }
    const getUserId = require("../../../dao/session/getUser");
    const userId = getUserId(req.body.sessionKey)

    const getTaskList = require("../../../dao/task-list/get");
    const taskList = getTaskList(param.listId);

    if (taskList === null) {
        res.status(404).json({error: "Task list not found"}).send();
        return
    }

    if (taskList.owner === userId || taskList.admins.includes(userId) || taskList.members.includes(userId)) {
        res.status(200).json(taskList).send();
        return;
    }
    res.status(403).json({error: "You are not allowed to access this task list"}).send();
}

module.exports = get;