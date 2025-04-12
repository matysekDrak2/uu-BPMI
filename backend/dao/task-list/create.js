const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function create(name, ownerId) {
    const taskListsDir = path.join(process.cwd(), 'data.tst', 'task-lists');
    if (!fs.existsSync(path.join(process.cwd(), 'data.tst'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data.tst'), { recursive: true });
    }
    if (!fs.existsSync(taskListsDir)) {
        fs.mkdirSync(taskListsDir, { recursive: true });
    }

    /** @type string */
    const id = uuidv4();

    const data ={
        id: id,
        name: name,
        owner: ownerId,
        admins: [],
        members: []
    }

    const taskListPath = path.join(taskListsDir, `${id}.json`);
    fs.writeFileSync(taskListPath, JSON.stringify(data, null, 2), 'utf8');

    return data
}

module.exports = create;