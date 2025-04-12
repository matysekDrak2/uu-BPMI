const fs = require('fs');
const path = require('path');

function create(user) {
    // Ensure directories exist
    const usersDirPath = path.join(process.cwd(), 'data.tst', 'users');
    if (!fs.existsSync(path.join(process.cwd(), 'data.tst'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data.tst'), { recursive: true });
    }
    if (!fs.existsSync(usersDirPath)) {
        fs.mkdirSync(usersDirPath, { recursive: true });
    }

    // Rest of the function
    const userPath = path.join(usersDirPath, `${user.id}.json`);
    const fileExists = fs.existsSync(userPath);

    if (fileExists) {
        return 1;
    }

    // Check for duplicate email
    const files = fs.readdirSync(usersDirPath);
    for (const file of files) {
        const userData = JSON.parse(fs.readFileSync(path.join(usersDirPath, file), 'utf8'));
        if (userData.email === user.email) {
            return 1;
        }
    }

    fs.writeFileSync(userPath, JSON.stringify(user), 'utf8');
    return 0;
}

module.exports = create;