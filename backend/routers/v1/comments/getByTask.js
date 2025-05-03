const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const getUserId = require('../../../dao/session/getUser');
const getCommentsByTaskId = require('../../../dao/comment/get');
const getTask = require('../../../dao/task/get');
const getTaskList = require('../../../dao/task-list/get');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const requestSchema = {
    type: 'object',
    properties: {
        taskId: { type: 'string', maxLength: 36, minLength: 36 },
    },
    required: ['taskId'],
    additionalProperties: false,
};
const validateRequest = ajv.compile(requestSchema);

module.exports = function getCommentsByTask(req, res) {
    const query = req.query;
    const userId = getUserId(req.headers.sessionkey);

    if (!validateRequest(query)) {
        res.status(400).json(validateRequest.errors).send();
        return;
    }

    const task = getTask(query.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' }).send();

    const taskList = getTaskList(task.taskListId);
    if (
        taskList.owner !== userId &&
        !taskList.admins.includes(userId) &&
        !taskList.members.includes(userId)
    ) {
        res.status(403).send('Not authorized to access this task list');
        return;
    }

    const comments = getCommentsByTaskId(query.taskId);
    res.status(200).json(comments || []).send();
}; 