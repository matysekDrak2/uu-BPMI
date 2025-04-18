const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
const getUserId = require("../../../dao/session/getUser");
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        taskListId: { type: 'string', maxLength: 36, minLength: 36},
        text: { type: 'string', maxLength: 200},
        state: { type: 'number' },
    },
    required: ['taskListId', 'text', 'state'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

function create(req, res) {
    const body = req.body;
    const userId = getUserId(req.headers.sessionkey)
    if (!validator(body)){
        res.status(400).json(validator.errors).send()
        return
    }

    const taskListGet = require("../../../dao/task-list/get")
    const taskList = taskListGet(body.taskListId)

    if ( taskList.owner !== userId &&
        !taskList.admins.includes(userId) &&
        !taskList.members.includes(userId)
    ){
        res.status(403).send("Not authorized in this task list")
        return
    }

    const daoCreate = require("../../../dao/task/create");
    const data = daoCreate(body.taskListId, body.text, body.state, userId);

    res.status(200).json(data).send();
}

module.exports = create;