const express = require('express');
const router = express.Router()
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const addFormats = require("ajv-formats")
addFormats(ajv)


const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

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

    const userDir = process.cwd() + '/data.tst/users/';
    let emailExists = false;

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    const files = fs.readdirSync(userDir);
    for (const file of files) {
        try {
            const userData = JSON.parse(fs.readFileSync(userDir + file, { encoding: 'utf8', flag: 'r' }));
            if (userData.email && userData.email.toLowerCase() === data.email.toLowerCase()) {
                emailExists = true;
                break;
            }
        } catch (error) {
            console.error("Chyba při čtení souboru uživatele:", error);
        }
    }

    if (emailExists) {
        res.status(409).json({ error: "Uživatel s tímto emailem již existuje" });
        return;
    }

    data.id = uuidv4();
    const userSignIn = require("../../../dao/user/create");
    const result = userSignIn(data);

    if (result !== 0) {
        res.status(500).json({ error: "Nepodařilo se vytvořit uživatele" });
        return;
    }

    const { password, ...userWithoutPassword } = data;
    res.status(201).json(userWithoutPassword);
})

module.exports = router;