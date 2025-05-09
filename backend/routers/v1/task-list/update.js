const Ajv = require('ajv');
const updateTaskList = require('../../../dao/task-list/update');
const getTaskList = require('../../../dao/task-list/get');

const ajv = new Ajv();
const schema = {
    type: 'object',
    properties: {
        taskListId: { type: 'string', minLength: 36, maxLength: 36 },
        newData: {
            type: 'object',
            properties: {
                name: { type: 'string', maxLength: 200},
                admins: { type: 'array', items: { type: 'string', minLength: 36, maxLength: 36 } },
                members: { type: 'array', items: { type: 'string', minLength: 36, maxLength: 36 } }
            },
            required: [],
            additionalProperties: false
        },
    },
    required: ['taskListId', 'newData'],
    additionalProperties: false,
};
const validate = ajv.compile(schema);

module.exports = function updateTaskListIfAuthorized(req, res) {
    if (!validate(req.body)) {
        return res.status(400).json({ error: validate.errors });
    }

    const { taskListId, newData } = req.body;
    const userId = req.headers.userId
    const taskList = getTaskList(taskListId);

    if (!taskList) {
        return res.status(404).json({ error: 'Task list not found' });
    }

    if (taskList.owner !== userId && !taskList.admins.contains(userId)) {
        return res.status(403).json({ error: 'Unauthorized: You must be the owner or an admin to update this task list' });
    }

    try {
        const updatedTaskList = updateTaskList(taskListId, newData);
        return res.status(200).json(updatedTaskList);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update task list', details: err.message });
    }
};