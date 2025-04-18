const fs = require("fs");

function readJSON(filePath) {
    const _filePath = process.cwd() + filePath + '.json';

    if (!fs.existsSync(_filePath)) {
        return null;
    }

    const data = fs.readFileSync(_filePath, 'utf8');
    /** @type {Object}*/
    const obj = JSON.parse(data);
    return obj
}

module.exports = readJSON;