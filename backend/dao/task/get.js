const JSONread = require('../dev-tools/readJSON');

function get(taskId) {
    return JSONread( '/data.tst/tasks/' + taskId)
}

module.exports = get;