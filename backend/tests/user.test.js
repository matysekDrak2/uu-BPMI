const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../main');

const TEST_DATA = {
    user: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword'
    },
    userId: null, // filled by test
    sessionId: null // filled by test
};

beforeAll(() => {
    ['users', 'sessions'].forEach(dir => {
        const dirPath = path.join(process.cwd(), 'data.tst', dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });
});

afterAll(() => {
    if (TEST_DATA.userId) {
        const filePath = path.join(process.cwd(), 'data.tst', 'users', `${TEST_DATA.userId}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    if (TEST_DATA.sessionId) {
        const filePath = path.join(process.cwd(), 'data.tst', 'sessions', TEST_DATA.sessionId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

describe('User API', () => {

    describe('Registration', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/v1/user/signin')
                .send(TEST_DATA.user);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe(TEST_DATA.user.name);
            expect(res.body.email).toBe(TEST_DATA.user.email);

            TEST_DATA.userId = res.body.id;
        });
    });

    describe('Login', () => {
        it('should fail with wrong password', async () => {
            const res = await request(app)
                .post('/api/v1/user/login')
                .send({
                    email: TEST_DATA.user.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.err).toBe('Unable to logIn');
        });

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/v1/user/login')
                .send({
                    email: TEST_DATA.user.email,
                    password: TEST_DATA.user.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('sessionId');
            expect(res.body.err).toBe('');

            TEST_DATA.sessionId = res.body.sessionId;
        });
    });

    describe('Authentication', () => {
        it('should reject invalid session', async () => {
            const res = await request(app)
                .post('/api/v1/user/authTest')
                .send({
                    sessionKey: '00000000-0000-0000-0000-000000000000'
                });

            expect(res.statusCode).toBe(401);
        });

        it('should authenticate valid session', async () => {
            if (!TEST_DATA.sessionId) {
                console.log('Skipping auth test because login failed');
                return;
            }

            const res = await request(app)
                .post('/api/v1/user/authTest')
                .send({
                    sessionKey: TEST_DATA.sessionId
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.userId).toBe(TEST_DATA.userId);
            expect(res.body.email).toBe(TEST_DATA.user.email);
        });
    });
}); 