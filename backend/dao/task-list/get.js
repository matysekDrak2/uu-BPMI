const fs = require('node:fs');
const path = require("node:path");

function get(id) {
    const filePath = path.join(process.cwd(), 'data.tst', 'task-list.json')
    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    return data.find((item) => item.id === id)
}

module.exports = get;