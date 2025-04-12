const fs = require('fs');
const path = require('path');

function getUser(sessionKey) {
    const sessionsDir = path.join(process.cwd(), 'data.tst', 'sessions');

    if (!fs.existsSync(sessionsDir)) {
        return "";
    }

    const sessionPath = path.join(sessionsDir, sessionKey);
    if (!fs.existsSync(sessionPath)) {
        return "";
    }

    return fs.readFileSync(sessionPath, { encoding: 'utf8', flag: 'r' });
}

module.exports = getUser;