const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
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
    if (!valid) {
        res.status(400).json(validator.errors).send()
        return
    }
    let resData = {}
    resData.sessionKey = data.sessionKey

    const getUsetIdFromSession = require('../../../dao/session/getUser')
    const userId = getUsetIdFromSession(data.sessionKey);

    if (!userId) {
        res.status(401).json({ error: "Invalid session" });
        return;
    }

    resData.userId = userId;

    const getUser = require('../../../dao/user/get')
    const userData = getUser(userId);

    if (userData === 0) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    delete userData.password; // Remove sensitive information
    resData = { ...resData, ...userData };

    res.status(200).json(resData);
})

module.exports = router;