const fs = require('fs');
const path = require('path');

function get(userId) {
    const usersDir = path.join(process.cwd(), 'data.tst', 'users');

    // Ensure users directory exists
    if (!fs.existsSync(usersDir)) {
        return 0;
    }

    const userPath = path.join(usersDir, `${userId}.json`);
    if (!fs.existsSync(userPath)) {
        return 0;
    }

    try {
        return JSON.parse(fs.readFileSync(userPath, { encoding: 'utf8', flag: 'r' }));
    } catch (e) {
        return 0;
    }
}

module.exports = get;