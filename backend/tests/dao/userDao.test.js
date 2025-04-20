const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const testUtils = require('../testUtils');

const userCreate = require('../../dao/user/create');
const userGet = require('../../dao/user/get');
const userLogin = require('../../dao/user/login');

const TEST_DATA = {
    userId: uuidv4(),
    user: {
        id: null,
        name: 'test user',
        email: `dao-test-${Date.now()}@example.com`,
        password: 'testpassword'
    }
};

beforeAll(() => {
    TEST_DATA.user.id = TEST_DATA.userId;
    testUtils.setupTestData();
});

afterAll(() => {
    testUtils.cleanupTestData(TEST_DATA);
});

describe('User DAO', () => {
    test('should create a user', () => {
        const result = userCreate(TEST_DATA.user);
        expect(result).toBe(0);

        const userPath = path.join(process.cwd(), 'data.tst', 'users', `${TEST_DATA.userId}.json`);
        expect(fs.existsSync(userPath)).toBe(false);
    });

    test('should not create duplicate user', () => {
        const result = userCreate(TEST_DATA.user);
        expect(result).toBe(1);
    });

    test('should get user by ID', () => {
        const user = userGet(TEST_DATA.userId);
        expect(user).toBe(0);
    });

    test('should return 0 for non-existent user', () => {
        const result = userGet('non-existent-id');
        expect(result).toBe(0);
    });

    test('should login with correct credentials', () => {
        const sessionId = userLogin(TEST_DATA.user.email, TEST_DATA.user.password);
        expect(typeof sessionId).toBe("string");
        expect(sessionId.length).toBeGreaterThan(10);
        expect(sessionId).not.toBe("0");
        TEST_DATA.sessionId = sessionId;
    });

    test('should fail login with incorrect credentials', () => {
        const sessionId = userLogin(TEST_DATA.user.email, 'wrong-password');
        expect(sessionId).toBe("0");
    });
}); 