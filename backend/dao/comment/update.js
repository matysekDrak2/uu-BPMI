const fs = require('fs');
const path = require('path');

module.exports = function getUpdateByCommentId(id, comment) {
    const filePath = path.join(process.cwd(), 'data.tst', 'comments.json');

    if (!fs.existsSync(filePath)) {
        fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(filePath, JSON.stringify([]))
        return {};
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const comments = JSON.parse(data);

    const index = comments.findIndex(comment => comment.id === id);

    if (index === -1) {

        return null;
    }

    comments[index] =  {
        ...comments[index],
        ...comment
    };

    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2), 'utf8');

    return comments[index];
}