const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)

const auth = require('../session/auth')
router.use(auth)

const user_login_tmpl = {
    type: 'object',
    properties: {
        sessionKey: { type: 'string', minLength: 36, maxLength: 36 }
    },
    required: ['sessionKey'],
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
    let resData = {}
    resData.sessionKey = data.sessionKey

    const getUsetIdFromSession = require('../../../dao/session/getUser')
    resData.userId = getUsetIdFromSession(data.sessionKey);

    const getUser = require('../../../dao/user/get')
    resData = {...resData, ...getUser(resData.userId)}

    res.status(200).json(resData);
})

module.exports = router;