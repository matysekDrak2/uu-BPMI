const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
const getUserId = require("../../../dao/session/getUser");
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        taskListId: { type: 'string', maxLength: 36, minLength: 36},
    },
    required: ['taskListId'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

function getTasks(req, res) {
    const query = req.query;
    const userId = getUserId(req.headers.sessionkey)
    if (!validator(query)){
        res.status(400).json(validator.errors).send()
        return
    }

    const taskListGet = require("../../../dao/task-list/get")
    const taskList = taskListGet(query.taskListId)

    if ( taskList.owner !== userId &&
        !taskList.admins.includes(userId) &&
        !taskList.members.includes(userId)
    ){
        res.status(403).send("Not authorized in this task list")
        return
    }

    const daoGetAll = require("../../../dao/task/getAll");
    const data = daoGetAll(query.taskListId);

    res.status(200).json(data).send();
}

module.exports = getTasks;