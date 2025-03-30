const fs = require('fs');

function remove(userID) {
    const path = process.cwd() +'/data.tst/sessions/' + userID
    const exists = fs.existsSync(path);
    if (exists) {
        fs.unlinkSync(path)
    }
    return 0
}

module.exports = remove;