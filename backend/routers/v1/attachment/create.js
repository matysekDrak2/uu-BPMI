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
        id: { type: 'string', minLength: 36, maxLength: 36 }
    },
    required: ['id'],
    additionalProperties: false
};

const validate = ajv.compile(schema);

function saveFile(req, res) {
    const form = new formidable.IncomingForm();

    if(!validate(req.body)) {
        return res.status(500).json(validate.errors);
    }

    const {commentId} = req.body;

    const getCommentById = require("../../../dao/comment/get");
    const comment = getCommentById(commentId);


    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).json({ error: 'Failed to parse form data' });
            return;
        }

        if (!files.file || files.file.length > 3 - comment.attachments.length){
            res.status(400).json({ error: 'Invalid file count. Max of 3 files are allowed.' });
        }

        for (const file of files.file) {
            const stats = fs.statSync(file.filepath);
            if (stats.size > 2 * 1024 * 1024 * 1024) { // 2GB in bytes
                res.status(400).json({ error: 'File size exceeds 2GB limit' });
                return;
            }
        }

        let filesSaved = [];
        for (const file of files.file) {
            const id = uuidv4();
            const newFileName = id + path.extname(file.originalFilename);
            const newPath = path.join(process.cwd(), 'data.tst', 'files', newFileName);
            fs.copyFileSync(file.filepath, newPath);
            filesSaved.push({fileName: file.originalFilename, fileId: id})
        }

        comment.attachments = filesSaved.map(file => file.fileId);

        const updateComment = require("../../../dao/comment/update");
        updateComment(commentId, comment);

        res.status(200).json({ message: 'File saved successfully', savedFiles: filesSaved});
    });
}

module.exports = saveFile;