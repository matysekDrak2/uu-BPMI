const fs = require('fs');
const path = require('path');

module.exports = function create(comment) {
    const filePath = path.join(process.cwd(), 'data.tst', 'comments.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const comments = JSON.parse(data);

    comments.push(comment)

    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');

    return comment
}