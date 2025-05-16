const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
const daoGetAll = require("../../../dao/task/getAll");
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        listId: { type: 'string', maxLength: 36, minLength: 36},
    },
    required: ['listId'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

function get(req, res) {
    const param = req.query
    const valid = validator(param);
    if (!valid) {
        res.status(400).json(validator.errors)
        return
    }
    const userId = req.headers.userId

    const getTaskList = require("../../../dao/task-list/get");
    const taskList = getTaskList(param.listId);

    if (taskList === null) {
        res.status(404).json({error: "Task list not found"});
        return
    }

    if (taskList.owner === userId || taskList.admins.includes(userId) || taskList.members.includes(userId)) {
        const daoGetAll = require("../../../dao/task/getAll");
        const data = daoGetAll(param.listId);
        res.status(200).json({...taskList, tasks: data});
        return;
    }
    res.status(403).json({error: "You are not allowed to access this task list"});
}

module.exports = get;