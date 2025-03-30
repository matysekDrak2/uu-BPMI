const fs = require('fs');

function login(email, password) {
    const path = process.cwd() +'/data.tst/users/'
    let sessionKey = "0";
    const files = fs.readdirSync(path)
    files.forEach(file=>{
        if (sessionKey !== "0") return;

        const text = fs.readFileSync(path + file, { encoding: 'utf8', flag: 'r' })
        const data = JSON.parse(text);
        if (data.email !== email || data.password !== password) return;

        const getSessionKey = require('../session/create')
        sessionKey = getSessionKey(data.id)

    })

    return sessionKey
}

module.exports = login;