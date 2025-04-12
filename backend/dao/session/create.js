const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function create(userID) {
    const sessionsDir = path.join(process.cwd(), 'data.tst', 'sessions');
    if (!fs.existsSync(path.join(process.cwd(), 'data.tst'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data.tst'), { recursive: true });
    }
    if (!fs.existsSync(sessionsDir)) {
        fs.mkdirSync(sessionsDir, { recursive: true });
    }

    /** @type string */
    const sessionKey = uuidv4();

    const sessionPath = path.join(sessionsDir, sessionKey);
    const exists = fs.existsSync(sessionPath);
    if (exists) {
        return create(userID);
    }

    fs.writeFileSync(sessionPath, userID, 'utf8');

    // Auto delete session
    const sessionDelete = require('./delete')
    setTimeout(() => sessionDelete(sessionKey), 60*60*1000)
    return sessionKey;
}

module.exports = create;