const fs = require('node:fs');
const path = require("node:path");

module.exports = function getAll() {
    const filePath = path.join(process.cwd(), 'data.tst', 'task-list.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}