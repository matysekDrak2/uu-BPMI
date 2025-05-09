const path = require("node:path");
const fs = require("node:fs");

module.exports = function create(task) {
    const filePath = path.join(process.cwd(), 'data.tst', 'tasks.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    data.push(task)

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}