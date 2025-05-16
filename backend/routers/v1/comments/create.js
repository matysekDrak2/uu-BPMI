const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const createComment = require('../../../dao/comment/create');
const getUserId = require("../../../dao/session/getUser");
const { v4: uuidv4 } = require('uuid');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const commentSchema = {
    type: 'object',
    properties: {
        taskId: { type: 'string', maxLength: 36, minLength: 36 },
        text: { type: 'string', minLength: 1, maxLength: 800 },
    },
    required: ['taskId', 'text'],
    additionalProperties: false,
};
const validateComment = ajv.compile(commentSchema);

module.exports = function create(req, res) {
    let comment = req.body;
    const userId = getUserId(req.headers.sessionkey)

    if (!validateComment(comment)) {
        res.status(400).json({ error: validateComment.errors }).send();
        return;
    }

    const getTaskById = require('../../../dao/task/get');
    const task = getTaskById(comment.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' }).send();

    const getListById = require('../../../dao/task-list/get');
    const taskList = getListById(task.taskListId);

    if ( taskList.owner !== userId &&
        !taskList.admins.includes(userId) &&
        !taskList.members.includes(userId)
    ){
        res.status(403).json({error: "Not authorized in this task list"}).send()
        return
    }

    comment.creator = userId;
    comment.id = uuidv4();
    comment.createdAt = new Date().toISOString();

    createComment(comment);
    res.status(201).json(comment).send();
};