const fs = require('node:fs');
const path = require("node:path");

module.exports = function update(id, newData) {
    const filePath = path.join(process.cwd(), 'data.tst', 'tasks.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
        throw new Error('Item not found');
    }
    data[index] = { ...data[index], ...newData };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    return data[index];
}