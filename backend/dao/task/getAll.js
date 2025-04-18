const JSONread = require('../dev-tools/readJSON');
const fs = require("fs");

function get(taskId) {
    const path = '/data.tst/tasks/'
    const files = fs.readdirSync(process.cwd() + path);

    let data = [];

    for (const file of files){
        /** @ type {Object} */
        const fileData = JSONread(path + file.substring( 0, file.indexOf( ".json" ) ))
        if(fileData.taskListId === taskId){
            data.push(fileData)
        }
    }
    return data;
}

module.exports = get;