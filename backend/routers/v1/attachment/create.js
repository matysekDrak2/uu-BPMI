const path = require("node:path");
const fs = require("node:fs");
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');

const Ajv = require('ajv');
const ajv = new Ajv();

// Define the schema
const schema = {
    type: 'object',
    properties: {
        commentId: { type: 'string', minLength: 36, maxLength: 36 },
        taskId: { type: 'string', minLength: 36, maxLength: 36 }
    },
    oneOf: [
        { required: ['commentId'] },
        { required: ['taskId'] }
    ],
    additionalProperties: false
};

const validate = ajv.compile(schema);

function saveFile(req, res) {
    const form = new formidable.IncomingForm();

    if (!validate(req.query)) {
        return res.status(500).json(validate.errors);
    }

    const { commentId, taskId } = req.query;

    let targetId, targetType, targetObject, updateFunction;

    if (commentId) {
        // Handle comment attachment
        const getCommentById = require("../../../dao/comment/getById");
        targetObject = getCommentById(commentId);
        targetId = commentId;
        targetType = 'comment';

        if (!targetObject) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        updateFunction = require("../../../dao/comment/update");
    } else if (taskId) {
        // Handle task attachment
        const getTaskById = require("../../../dao/task/get");
        targetObject = getTaskById(taskId);
        targetId = taskId;
        targetType = 'task';

        if (!targetObject) {
            return res.status(404).json({ error: 'Task not found' });
        }

        updateFunction = require("../../../dao/task/update");
    }

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).json({ error: 'Failed to parse form data' });
            return;
        }

        const currentFileCount = targetObject.attachments ? targetObject.attachments.length : 0;
        if (!files.file || files.file.length > 3 - currentFileCount) {
            return res.status(400).json({ error: 'Invalid file count. Max of 3 files are allowed.' });
        }

        for (const file of files.file) {
            const stats = fs.statSync(file.filepath);
            if (stats.size > 2 * 1024 * 1024 * 1024) { // 2GB in bytes
                return res.status(400).json({ error: 'File size exceeds 2GB limit' });
            }
        }

        let filesSaved = [];
        for (const file of files.file) {
            const id = uuidv4();
            const newFileName = id + path.extname(file.originalFilename);
            const newPath = path.join(process.cwd(), 'data.tst', 'files', newFileName);
            fs.copyFileSync(file.filepath, newPath);
            filesSaved.push({ fileName: file.originalFilename, fileId: id, fileType: path.extname(file.originalFilename) });
        }

        // Initialize attachments array if it doesn't exist
        if (!targetObject.attachments) {
            targetObject.attachments = [];
        }

        targetObject.attachments = [...targetObject.attachments, ...filesSaved.map(file => file.fileId + file.fileType)];

        // Update the task or comment
        updateFunction(targetId, targetObject);

        res.status(200).json({
            message: 'File saved successfully',
            savedFiles: filesSaved,
            targetType: targetType,
            targetId: targetId
        });
    });
}

module.exports = saveFile;