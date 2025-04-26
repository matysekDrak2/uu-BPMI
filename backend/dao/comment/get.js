const fs = require('fs');
const path = require('path');

module.exports = function getCommentsByTaskId(id) {
    const filePath = path.join(process.cwd(), 'data.tst', 'comments.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
        return [];
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const comments = JSON.parse(data);

    return comments.filter(comment => comment.task === id);
}