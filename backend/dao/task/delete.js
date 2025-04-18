const fs = require('fs');

function taskDelete(id){
    fs.unlinkSync(process.cwd() + '/data.tst/tasks/' + id + '.json')
}

module.exports = taskDelete;