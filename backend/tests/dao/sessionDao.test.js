const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const testUtils = require('../testUtils');

const sessionCreate = require('../../dao/session/create');
const sessionGetUser = require('../../dao/session/getUser');
const sessionDelete = require('../../dao/session/delete');

const TEST_DATA = {
    userId: uuidv4(),
    sessionId: null
};

beforeAll(() => {
    testUtils.setupTestData();
});

afterAll(() => {
    testUtils.cleanupTestData(TEST_DATA);
});

describe('Session DAO', () => {
    test('should create a session', () => {
        TEST_DATA.sessionId = sessionCreate(TEST_DATA.userId);

        expect(TEST_DATA.sessionId).not.toBe(null);
        expect(typeof TEST_DATA.sessionId).toBe('string');

        const sessionPath = path.join(process.cwd(), 'data.tst', 'sessions', TEST_DATA.sessionId);
        expect(fs.existsSync(sessionPath)).toBe(true);
    });

    test('should get user ID from session', () => {
        const userId = sessionGetUser(TEST_DATA.sessionId);
        expect(userId).toBe(TEST_DATA.userId);
    });

    test('should return empty string for invalid session', () => {
        const userId = sessionGetUser('invalid-session-id');
        expect(userId).toBe("");
    });

    test('should delete session', () => {
        const result = sessionDelete(TEST_DATA.sessionId);
        expect(result).toBe(0);

        const sessionPath = path.join(process.cwd(), 'data.tst', 'sessions', TEST_DATA.sessionId);
        expect(fs.existsSync(sessionPath)).toBe(false);
    });
}); 