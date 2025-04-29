const fs = require('node:fs');
const path = require('node:path');
/**
 * @param {uuidv4} id
 * @returns {Object | Undefined} comment
 * */
module.exports = function getCommentsById(id) {
    const filePath = path.join(process.cwd(), 'data.tst', 'comments.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
        return undefined;
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const comments = JSON.parse(data);

    return comments.find(comment => comment.id === id);
}