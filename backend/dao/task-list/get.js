const fs = require('fs');
const path = require('path');

function get(id) {
    const taskListsDir = path.join(process.cwd(), 'data.tst', 'task-lists');

    if (!fs.existsSync(taskListsDir)) {
        return null;
    }

    const taskListPath = path.join(taskListsDir, `${id}.json`);
    if (!fs.existsSync(taskListPath)) {
        return null;
    }

    try {
        return JSON.parse(fs.readFileSync(taskListPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        return null;
    }
}

module.exports = get;