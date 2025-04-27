const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const getUser = require('../../../dao/user/get');
const getUserId = require('../../../dao/session/getUser');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const requestSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 36, minLength: 36 },
    },
    required: ['id'],
    additionalProperties: false,
};
const validateRequest = ajv.compile(requestSchema);

module.exports = function getUserById(req, res) {
    const query = req.query;
    const userId = getUserId(req.headers.sessionkey);

    if (!validateRequest(query)) {
        res.status(400).json(validateRequest.errors).send();
        return;
    }

    const user = getUser(query.id);

    if (!user) {
        res.status(404).json({ error: 'User not found' }).send();
        return;
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword).send();
} 