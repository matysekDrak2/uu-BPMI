const path = require("node:path");
const fs = require("node:fs");
const { formidable } = require('formidable');
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
    anyOf: [
        { required: ['commentId'] },
        { required: ['taskId'] }
    ],
    additionalProperties: true
};

const validate = ajv.compile(schema);

function saveFile(req, res) {
    console.log("Received attachment request with query:", req.query);

    if (!validate(req.query)) {
        console.error("Validation errors:", validate.errors);
        return res.status(400).json(validate.errors);
    }

    const { commentId, taskId } = req.query;
    console.log("Processing request with commentId:", commentId, "taskId:", taskId);

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

    // Make sure the data.tst/files directory exists
    const filesDir = path.join(process.cwd(), 'data.tst', 'files');
    if (!fs.existsSync(filesDir)) {
        fs.mkdirSync(filesDir, { recursive: true });
    }

    // Initialize new formidable (v3.x syntax)
    const form = formidable({
        multiples: true,
        maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
        uploadDir: filesDir,
        keepExtensions: true
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            return res.status(500).json({ error: 'Failed to parse form data' });
        }

        console.log("Parsed files:", files);

        // Initialize attachments array if it doesn't exist
        if (!targetObject.attachments) {
            targetObject.attachments = [];
        }

        const currentFileCount = targetObject.attachments.length;

        // Handle files.file being an array or a single file
        let uploadedFiles = [];
        if (files.file) {
            uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
        }

        console.log("uploadedFiles:", uploadedFiles.length);

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        if (uploadedFiles.length > 3 - currentFileCount) {
            return res.status(400).json({ error: 'Invalid file count. Max of 3 files are allowed.' });
        }

        let filesSaved = [];
        for (const file of uploadedFiles) {
            if (!file) continue;

            const id = uuidv4();
            const fileExtension = path.extname(file.originalFilename || '');
            const newFileName = id + fileExtension;
            const newPath = path.join(filesDir, newFileName);

            try {
                // Rename the temporary file to its final name
                fs.renameSync(file.filepath, newPath);

                filesSaved.push({
                    fileName: file.originalFilename,
                    fileId: id,
                    fileType: fileExtension
                });

                console.log("Saved file:", newFileName);
            } catch (fileErr) {
                console.error("Error saving file:", fileErr);
            }
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