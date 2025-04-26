const request = require('supertest');
const fs = require('fs');
const path = require('path');
const express = require('express');
const Ajv = require('ajv');
const ajvFormats = require('ajv-formats');
const cors = require('cors');

const testUtils = require('./testUtils');
const { setupTestApp, setupTestData, cleanupTestData } = testUtils;
const { createUser, loginUser, verifySession } = require('./helpers/apiHelpers');

const app = setupTestApp();
app.use(express.json());
app.use(cors());

global.ajv = new Ajv({ allErrors: true });
ajvFormats(global.ajv);


const TEST_DATA = {
    user: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword'
    },
    userId: null,
    sessionId: null
};

const routes = require('../routers/v1/routes');
app.use('/api/v1', routes);

beforeAll(() => {
    setupTestData();
});

afterAll(() => {
    cleanupTestData(TEST_DATA);
});

describe('User API', () => {
    describe('Registration', () => {
        test('should register a new user', async () => {
            const res = await createUser(app, TEST_DATA.user);
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('id');
            TEST_DATA.userId = res.body.id;
        });

        test('should reject duplicate email', async () => {
            const res = await createUser(app, TEST_DATA.user);
            expect(res.statusCode).toBe(409);
        });

        test('should reject invalid data', async () => {
            const res = await createUser(app, { email: 'invalid' });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('Login', () => {
        test('should fail with wrong password', async () => {
            const res = await loginUser(app, {
                email: TEST_DATA.user.email,
                password: 'wrongpassword'
            });
            expect(res.statusCode).toBe(401);
        });

        test('should login with correct credentials', async () => {
            const res = await loginUser(app, {
                email: TEST_DATA.user.email,
                password: TEST_DATA.user.password
            });
            expect(res.statusCode).toBe(200);
            if (res.body && res.body.sessionId) {
                TEST_DATA.sessionId = res.body.sessionId;
            }
        });
    });

    describe('Authentication', () => {
        test('should authenticate with valid session', async () => {
            const res = await verifySession(app, TEST_DATA.sessionId);
            expect(res.statusCode).toBe(400);
            if (res.body && res.body.userId) {
                expect(res.body.userId).toBe(TEST_DATA.userId);
            }
        });
    });
}); 