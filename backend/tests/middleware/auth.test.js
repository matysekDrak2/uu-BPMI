const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const testUtils = require('../testUtils');

const auth = require('../../routers/v1/session/auth');

const TEST_DATA = {
    userId: uuidv4(),
    sessionId: null
};

const app = express();
app.use(express.json());

app.post('/protected-route', auth, (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});

beforeAll(() => {
    testUtils.setupTestData();

    const sessionsDir = path.join(process.cwd(), 'data.tst', 'sessions');
    TEST_DATA.sessionId = uuidv4();
    fs.writeFileSync(path.join(sessionsDir, TEST_DATA.sessionId), TEST_DATA.userId, 'utf8');
});

afterAll(() => {
    testUtils.cleanupTestData(TEST_DATA);
});

describe('Auth Middleware', () => {
    test('should allow access with valid session', async () => {
        const res = await request(app)
            .post('/protected-route')
            .send({ sessionKey: TEST_DATA.sessionId });

        expect(res.statusCode).toBe(200);
    });
}); 