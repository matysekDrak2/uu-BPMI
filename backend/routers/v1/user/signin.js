const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)


const { v4: uuidv4 } = require('uuid');

const user_login_tmpl = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 80},
        email: { type: 'string', format: 'email', maxLength: 200 },
        password: { type: 'string' }
    },
    required: ['name', 'email', 'password'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

router.post('/', (req, res) => {
    const data = req.body;
    const valid = validator(data)
    if ( !valid ) {
        res.status(400).json(validator.errors).send()
        return
    }
    data.id = uuidv4()

    const userSignIn = require("../../../dao/user/create")
    userSignIn(data)

    res.json(data)
})

module.exports = router;