const path = require('node:path');
const fs = require('node:fs');
const Ajv = require('ajv');

const ajv = new Ajv();

// Define the schema for request parameters
const schema = {
    type: 'object',
    properties: {
        commentId: { type: 'string', minLength: 36, maxLength: 36 }
    },
    required: ['commentId'],
    additionalProperties: false
};
const validate = ajv.compile(schema);

function getFileById(req, res) {
    const params = req.params;

    const valid = validate(params);
    if (!valid) {
        res.status(400).json(validate.errors);
        return;
    }

    const { commentId } = params;
    const filePath = path.join(process.cwd(), 'data.tst', 'files', commentId);

    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found' });
        return;
    }

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to send file' });
        }
    });
}

module.exports = getFileById;