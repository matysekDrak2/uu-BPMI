const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
const getUserId = require("../../../dao/session/getUser");
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 36, minLength: 36},
    },
    required: ['id'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

function create(req, res) {
    const body = req.query;
    const userId = getUserId(req.headers.sessionkey)
    if (!validator(body)){
        res.status(400).json(validator.errors).send()
        return
    }

    const daoGet = require("../../../dao/task/get");
    const data = daoGet(body.id);


    const taskListGet = require("../../../dao/task-list/get")
    const taskList = taskListGet(data.taskListId)

    if ( taskList.owner !== userId &&
        !taskList.admins.includes(userId) &&
        !taskList.members.includes(userId)
    ){
        res.status(403).send("Not authorized in this task list")
        return
    }



    res.status(200).json(data).send();
}

module.exports = create;