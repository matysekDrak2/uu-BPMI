const fs = require('fs');
const readJSON = require('../dev-tools/readJSON')

function getAll(){
    const path = '/data.tst/task-lists/'
    const files = fs.readdirSync(process.cwd() + path);

    let data = [];

    for (const file of files){
        /** @ type {Object} */
        const fileData = readJSON(path + file.substring( 0, file.indexOf( ".json" ) ))
        data.push(fileData)
    }
    return data;
}

module.exports = getAll;