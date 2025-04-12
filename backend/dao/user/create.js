const fs = require('fs');


function create(user){
    const path = process.cwd() +'/data.tst/users/'+user.id+'.json'
    const exists = fs.existsSync(path);
    if (exists) {
        return 1
    }
    const data_string = JSON.stringify(user, null, 2)
    fs.writeFileSync(path, data_string, 'utf8');
    return 0
}

module.exports = create;