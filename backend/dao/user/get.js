const fs = require('fs');

function get(id) {
    const path = process.cwd() +'/data.tst/users/' + id + '.json'
    const exists = fs.existsSync(path);
    if (!exists) {
        return 0
    }
    return JSON.parse(fs.readFileSync(path, { encoding: 'utf8', flag: 'r' }))
}

module.exports = get;