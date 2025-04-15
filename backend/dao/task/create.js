const { v4: uuidv4 } = require('uuid');
const JsonWrite = require("../dev-tools/writeJSON");

function create(taskListId, text, state, userId) {
    /** @type string */
    const id = uuidv4();

    const data = {
        id: id,
        taskListId: taskListId,
        text: text,
        state: state,
        creatorId: userId
    }
    JsonWrite("/data.tst/tasks/" + id, data)
    return data;
}

module.exports = create;