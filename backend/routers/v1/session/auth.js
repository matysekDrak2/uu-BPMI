const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)


const user_login_tmpl = {
    type: 'string',
    minLength: 36,
    maxLength: 36
}
const validator = ajv.compile(user_login_tmpl);

function auth(req, res, next){
    console.log("middleware auth")

    const sessionKey = req.headers.sessionkey;

    const valid = validator( sessionKey );
    if ( !valid ) {
        res.status(400).json(validator.errors)
        return
    }

    const getUserIdFromSession = require("../../../dao/session/getUser");
    const id = getUserIdFromSession(sessionKey)

    if (id === ""){
        res.status(401).send()
        return;
    }

    req.headers.userId = id

    next()
}

module.exports = auth;