const path = require("node:path");
const fs = require("node:fs");

/**
 * @param taskListId {string} 36 character string UUID
 * @returns {Array<Object>}
 * */
module.exports = function getByTaskListId(taskListId) {

    const filePath = path.join(process.cwd(), 'data.tst', 'tasks.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    return data.filter(task => task.taskListId === taskListId);
}