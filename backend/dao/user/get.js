const fs = require('fs');

function get(id) {
    const path = process.cwd() +'/data.tst/users/' + id + '.json'
    const exists = fs.existsSync(path);
    if (!exists) {
        return 0
    }
    const readJSON = require('../dev-tools/readJSON')
    return readJSON(path)
}

module.exports = get;