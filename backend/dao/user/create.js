const fs = require('fs');


function create(user){
    const userDir = process.cwd() +'/data.tst/users/'
    const path = userDir +user.id+'.json'
    const exists = fs.existsSync(path);
    if (exists) {
        return 2
    }

    // check for dupe emails
    const files = fs.readdirSync(userDir);
    for (const file of files) {
        try {
            const userData = JSON.parse(fs.readFileSync(userDir + file, { encoding: 'utf8', flag: 'r' }));
            if (userData.email && userData.email.toLowerCase() === user.email.toLowerCase()) {
                return 1;
            }
        } catch (error) {
            console.error("Chyba při čtení souboru uživatele:", error);
        }
    }

    const writeJSON = require('../dev-tools/writeJSON')
    writeJSON('/data.tst/users/' +user.id +'.json', user)
    return 0
}

module.exports = create;