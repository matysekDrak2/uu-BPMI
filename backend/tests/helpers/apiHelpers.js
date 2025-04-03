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
        .send({ sessionKey });
}

module.exports = {
    createUser,
    loginUser,
    verifySession
}; 