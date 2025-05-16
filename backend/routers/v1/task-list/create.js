const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
const getUserId = require("../../../dao/session/getUser");
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 200}
    },
    required: ['name'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

function create(req, res) {
    const body = req.body
    const valid = validator(body);
    if (!valid) {
        res.status(400).json(validator.errors)
        return
    }

    const userId = getUserId(req.headers.sessionkey)


    const daoCreate = require("../../../dao/task-list/create");
    const data = daoCreate(body.name, userId);

    res.status(200).json(data);
}

module.exports = create;