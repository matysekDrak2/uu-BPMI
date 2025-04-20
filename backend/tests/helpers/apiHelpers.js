const request = require('supertest');

function createUser(app, userData) {
    return request(app)
        .post('/api/v1/user/signin')
        .send(userData);
}

function loginUser(app, credentials) {
    return request(app)
        .post('/api/v1/user/login')
        .send(credentials);
}

function verifySession(app, sessionKey) {
    return request(app)
        .post('/api/v1/user/authTest')
        .set('sessionkey', sessionKey);
}

function createTask(app, sessionKey, taskData) {
    return request(app)
        .put('/api/v1/task')
        .set('sessionkey', sessionKey)
        .send(taskData);
}

function updateTask(app, sessionKey, taskData) {
    return request(app)
        .post('/api/v1/task')
        .set('sessionkey', sessionKey)
        .send(taskData);
}

function getTasksByList(app, sessionKey, taskListId) {
    return request(app)
        .get(`/api/v1/taskList/tasks?taskListId=${taskListId}`)
        .set('sessionkey', sessionKey);
}

module.exports = {
    createUser,
    loginUser,
    verifySession,
    createTask,
    updateTask,
    getTasksByList
}; 