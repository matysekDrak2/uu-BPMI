const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)

const auth = require('../session/auth')
router.use(auth)

router.get('/', (req, res) => {
    let resData = {}
    resData.sessionKey = req.headers.sessionkey

    const getUserIdFromSession = require('../../../dao/session/getUser')
    resData.userId = getUserIdFromSession(req.headers.sessionkey);

    const getUser = require('../../../dao/user/get')
    resData = {...resData, ...getUser(resData.userId)}

    res.status(200).json(resData);
})

module.exports = router;