const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const addFormats = require("ajv-formats")
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 36, minLength: 36 },
        text: { type: 'string', maxLength: 1200 },
        state: { type: 'number' },
    },
    required: ['id'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

function update(req, res) {
    const body = req.body;
    const userId = req.headers.userId
    if (!validator(body)){
        res.status(400).json(validator.errors)
        return
    }
    const daoGet = require("../../../dao/task/get");
    const prevData = daoGet(body.id);

    if (!prevData) {
        res.status(404).json({ error: "Task not found" });
        return;
    }

    const taskListGet = require("../../../dao/task-list/get")
    const taskList = taskListGet(prevData.taskListId)

    if (!taskList) {
        res.status(404).json({ error: "Task list not found" });
        return;
    }

    if (taskList.owner !== userId &&
        !taskList.admins.includes(userId) &&
        !taskList.members.includes(userId)
    ) {
        res.status(403).json({error: "Not authorized in this task list"})
        return
    }

    const toWrite = {
        ...prevData,
        ...req.body
    }

    const daoDel = require("../../../dao/task/delete");
    daoDel(body.id);

    const daoCreate = require("../../../dao/task/create");
    daoCreate(toWrite);

    res.status(200).json(toWrite);
}

module.exports = update;