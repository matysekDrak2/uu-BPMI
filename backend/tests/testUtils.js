const fs = require('fs');
const path = require('path');
const express = require('express');
const Ajv = require('ajv');
const ajvFormats = require('ajv-formats');
const cors = require('cors');

// dirs path
const dataDir = path.join(process.cwd(), 'data.tst');
const usersDir = path.join(dataDir, 'users');
const sessionsDir = path.join(dataDir, 'sessions');

function setupTestApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    global.ajv = new Ajv({ allErrors: true });
    ajvFormats(global.ajv);

    const routes = require('../routers/v1/routes');
    app.use('/api/v1', routes);

    return app;
}

function setupTestData() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(usersDir)) {
        fs.mkdirSync(usersDir, { recursive: true });
    }
    if (!fs.existsSync(sessionsDir)) {
        fs.mkdirSync(sessionsDir, { recursive: true });
    }
}

function cleanupTestData(testData) {
    try {
        if (testData.userId) {
            const userPath = path.join(usersDir, `${testData.userId}.json`);
            if (fs.existsSync(userPath)) {
                fs.unlinkSync(userPath);
            }
        }

        if (testData.sessionId) {
            const sessionPath = path.join(sessionsDir, testData.sessionId);
            if (fs.existsSync(sessionPath)) {
                fs.unlinkSync(sessionPath);
            }
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

function createTestUser(userData) {
    const userCreate = require('../dao/user/create');
    userCreate(userData);
    return userData.id;
}

function createTestSession(userId) {
    const sessionCreate = require('../dao/session/create');
    return sessionCreate(userId);
}

module.exports = {
    setupTestApp,
    setupTestData,
    cleanupTestData,
    createTestUser,
    createTestSession
}; 