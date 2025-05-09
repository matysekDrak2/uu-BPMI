const path = require("node:path");
const fs = require("node:fs");

/**
 * @returns {Object}
 * */
module.exports = function get(taskId) {

    const filePath = path.join(process.cwd(), 'data.tst', 'tasks.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    const index = data.findIndex(task => task.id === taskId);

    return data[index];
}