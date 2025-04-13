const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)


const user_login_tmpl = {
    type: 'object',
    properties: {
        sessionKey: { type: 'string', minLength: 36, maxLength: 36 }
    },
    required: ['sessionKey'],
    additionalProperties: true
}
const validator = ajv.compile(user_login_tmpl);

function auth(req, res, next){
    console.log("middleware auth")

    const sessionKeyFromBody = req.body?.sessionKey;
    const sessionKeyFromQuery = req.query?.sessionKey;
    const sessionKey = sessionKeyFromBody || sessionKeyFromQuery;

    const valid = validator({ sessionKey });
    if ( !valid ) {
        res.status(400).json(validator.errors).send()
        return
    }

    const getUsetIdFromSession = require("../../../dao/session/getUser");
    const id = getUsetIdFromSession(sessionKey)

    if (id === ""){
        res.status(401).send()
        return;
    }

    next()
}

module.exports = auth;