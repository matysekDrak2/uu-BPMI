const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function create(userID) {

    /** @type string */
    const sessionKey = uuidv4();

    const path = process.cwd() +'/data.tst/sessions/' + sessionKey
    const exists = fs.existsSync(path);
    if (exists) {
        return create(userID)
    }

    fs.writeFileSync(path, userID, 'utf8');

    // Auto delete session
    const sessionDelete = require('./delete')
    setTimeout(() => sessionDelete(sessionKey), 60*60*1000)
    return sessionKey
}

module.exports = create;