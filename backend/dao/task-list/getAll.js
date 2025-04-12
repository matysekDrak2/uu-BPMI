const fs = require('fs');
const path = require('path');

function getAll() {
    const taskListsDir = path.join(process.cwd(), 'data.tst', 'task-lists');

    if (!fs.existsSync(taskListsDir)) {
        return [];
    }

    const files = fs.readdirSync(taskListsDir);
    let data = [];

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
            const filePath = path.join(taskListsDir, file);
            const fileData = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }));
            data.push(fileData);
        } catch (e) {
            console.error(`Error reading task list file ${file}:`, e);
        }
    }

    return data;
}

module.exports = getAll;