const fs = require("fs");
const path = require("path");

function writeJSON(filePath, dataJSON) {
    const _filePath = process.cwd() + filePath + '.json';
    const data_string = JSON.stringify(dataJSON, null, 2)

    fs.mkdir(path.dirname(_filePath), { recursive: true }, (err) => {})

    fs.writeFileSync(_filePath, data_string, 'utf8')
}

module.exports = writeJSON;