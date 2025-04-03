const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { setupTestData, cleanupTestData } = require('./testUtils');
const userCreate = require('../dao/user/create');
const userGet = require('../dao/user/get');
const userLogin = require('../dao/user/login');
const sessionCreate = require('../dao/session/create');
const sessionGetUser = require('../dao/session/getUser');
const sessionDelete = require('../dao/session/delete');

const TEST_DATA = {
    userId: uuidv4(),
    user: {
        id: null,
        name: 'DAO Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword'
    },
    sessionId: null
};

beforeAll(() => {
    TEST_DATA.user.id = TEST_DATA.userId;
    setupTestData();
});

afterAll(() => cleanupTestData(TEST_DATA));

describe('DAO layrr', () => {
    describe('User DAO', () => {
        test('should create and get user', () => {
            expect(userCreate(TEST_DATA.user)).toBe(0);

            const user = userGet(TEST_DATA.userId);
            expect(user.id).toBe(TEST_DATA.userId);
        });

        test('should login successfully', () => {
            TEST_DATA.sessionId = userLogin(TEST_DATA.user.email, TEST_DATA.user.password);
            expect(TEST_DATA.sessionId).not.toBe("0");

            expect(userLogin(TEST_DATA.user.email, 'wrong')).toBe("0");
        });
    });

    describe('Session DAO', () => {
        test('should manage sessions correctly', () => {

            const sessionId = sessionCreate(TEST_DATA.userId);
            expect(sessionId).not.toBe(null);


            expect(sessionGetUser(sessionId)).toBe(TEST_DATA.userId);


            expect(sessionDelete(sessionId)).toBe(0);
            expect(sessionGetUser(sessionId)).toBe("");
        });
    });
}); 