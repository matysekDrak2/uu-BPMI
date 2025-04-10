const fs = require('fs');

function get(id) {
    const readJSON = require('../dev-tools/readJSON')
    return readJSON('/data.tst/task-lists/' + id)
}

module.exports = get;