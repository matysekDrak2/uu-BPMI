const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const addFormats = require("ajv-formats")
addFormats(ajv)

// Definice schématu pro tělo požadavku
const body_tmpl = {
    type: 'object',
    properties: {
        sessionKey: { type: 'string', minLength: 36, maxLength: 36 }
    },
    required: ['sessionKey'],
    additionalProperties: true
}
const bodyValidator = ajv.compile(body_tmpl);

// Definice schématu pro query parametry
const query_tmpl = {
    type: 'object',
    properties: {
        sessionKey: { type: 'string', minLength: 36, maxLength: 36 }
    },
    required: ['sessionKey'],
    additionalProperties: true
}
const queryValidator = ajv.compile(query_tmpl);

function auth(req, res, next) {
    console.log("middleware auth");
    console.log("Request method:", req.method);
    console.log("Request body:", req.body);
    console.log("Request query:", req.query);

    // Pokud je to GET požadavek, očekáváme sessionKey v query
    if (req.method === 'GET') {
        const validQuery = queryValidator(req.query);
        if (!validQuery) {
            console.log("Invalid query parameters:", queryValidator.errors);
            res.status(400).json({ error: 'Invalid query parameters', details: queryValidator.errors }).send();
            return;
        }

        const getUsetIdFromSession = require("../../../dao/session/getUser");
        const id = getUsetIdFromSession(req.query.sessionKey);

        if (id === "") {
            console.log("Invalid session in query parameters");
            res.status(401).send();
            return;
        }
    }
    // Jinak očekáváme sessionKey v těle
    else {
        const validBody = bodyValidator(req.body);
        if (!validBody) {
            console.log("Invalid body:", bodyValidator.errors);
            res.status(400).json({ error: 'Invalid request body', details: bodyValidator.errors }).send();
            return;
        }

        const getUsetIdFromSession = require("../../../dao/session/getUser");
        const id = getUsetIdFromSession(req.body.sessionKey);

        if (id === "") {
            console.log("Invalid session in body");
            res.status(401).send();
            return;
        }
    }

    next();
}

module.exports = auth;