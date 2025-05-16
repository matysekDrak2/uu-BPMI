const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)

const user_login_tmpl = {
    type: 'object',
    properties: {
        email: { type: 'string', maxLength: 200 },
        password: { type: 'string' }
    },
    required: ['email', 'password'],
    additionalProperties: false
}
const validator = ajv.compile(user_login_tmpl);

router.post('/', (req, res) => {
    const data = req.body;
    const valid = validator(data)
    if ( !valid ) {
        res.status(400).json(validator.errors)
        return
    }

    const userLogIn = require('../../../dao/user/login')
    const sessionId = userLogIn(data.email, data.password)
    let resData = {};
    resData.err = sessionId === "0" ? "Unable to logIn" : ""
    resData.sessionId = sessionId;

    if (sessionId === "0"){
        res.status(401).json(resData)
        return;
    }

    res.status(200).json(resData);
})

module.exports = router;