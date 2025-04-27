const fs = require('fs');

function get(id) {
    const readJSON = require('../dev-tools/readJSON')
    const user = readJSON('/data.tst/users/' + id)
    return user
}

module.exports = get;