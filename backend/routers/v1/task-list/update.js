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

    const isOwnerOrAdmin = taskList.owner === userId || taskList.admins.includes(userId);

    // Check if this is a self-removal from members only
    const isSelfRemovalFromMembers = (
        !isOwnerOrAdmin &&
        taskList.members.includes(userId) &&
        newData.members &&
        Array.isArray(newData.members) &&
        !newData.members.includes(userId) &&
        // Exactly one member should be removed (the current user)
        newData.members.length === taskList.members.length - 1 &&
        // All remaining members should be from the original list (no new members added)
        newData.members.every(id => taskList.members.includes(id)) &&
        // If admins are provided, they should remain unchanged
        (!newData.admins || (Array.isArray(newData.admins) &&
            taskList.admins.length === newData.admins.length &&
            taskList.admins.every(id => newData.admins.includes(id)))) &&
        // No other fields should be changed
        Object.keys(newData).every(key => key === 'members' || key === 'admins')
    );

    if (!isOwnerOrAdmin && !isSelfRemovalFromMembers) {
        return res.status(403).json({ error: 'NUnauthorized: You must be the owner or an admin to update this task list or remove yourself from the members' });
    }

    try {
        const updatedTaskList = updateTaskList(taskListId, newData);
        return res.status(200).json(updatedTaskList);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update task list', details: err.message });
    }
};