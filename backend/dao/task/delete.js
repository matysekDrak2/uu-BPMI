const path = require("node:path");
const fs = require("node:fs");

module.exports = function del(taskId) {
    const filePath = path.join(process.cwd(), 'data.tst', 'tasks.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    const index = data.findIndex(task => task.id === taskId);

    data.splice(index, 1);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}