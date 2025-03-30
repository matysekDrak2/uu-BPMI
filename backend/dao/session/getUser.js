const fs = require('fs');

function getUser(sessionKey) {
    const path = process.cwd() +'/data.tst/sessions/' + sessionKey
    const exists = fs.existsSync(path);
    if (!exists) {
        return ""
    }
    return fs.readFileSync(path, { encoding: 'utf8', flag: 'r' })
}

module.exports = getUser;