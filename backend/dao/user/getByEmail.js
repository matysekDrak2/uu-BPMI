const fs = require('fs');
const path = require('path');

function getByEmail(email) {
    const userDirPath = path.join(process.cwd(), 'data.tst', 'users');

    if (!fs.existsSync(userDirPath)) {
        return null;
    }

    const files = fs.readdirSync(userDirPath);

    for (const file of files) {
        try {
            const filePath = path.join(userDirPath, file);
            const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            if (userData.email === email) {
                return userData;
            }
        } catch (err) {
            console.error(`Error reading user file ${file}:`, err);
        }
    }

    return null;
}

module.exports = getByEmail; 