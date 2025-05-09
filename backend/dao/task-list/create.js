const { v4: uuidv4 } = require('uuid');
const fs = require("node:fs");
const path = require("node:path");

module.exports = function create(name, ownerId) {
    const filePath = path.join(process.cwd(), 'data.tst', 'task-list.json')
    if (!fs.existsSync(filePath)) {

        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    const newItem ={
        id: uuidv4(),
        name: name,
        owner: ownerId,
        admins: [],
        members: []
    }
    data.push(newItem)

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    return newItem
}