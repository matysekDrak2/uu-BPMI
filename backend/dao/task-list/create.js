
function create(name, ownerId) {

    const { v4: uuidv4 } = require('uuid');
    /** @type string */
    const id = uuidv4();

    const data ={
        id: id,
        name: name,
        owner: ownerId,
        admins: [],
        members: []
    }

    const writeJSON = require("../dev-tools/writeJSON");
    writeJSON( '/data.tst/task-lists/' + id, data)

    return data
}

module.exports = create;