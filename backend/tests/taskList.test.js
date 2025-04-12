const express = require('express');
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const testUtils = require('./testUtils');

const app = testUtils.setupTestApp();

const TEST_DATA = {
    userId: uuidv4(),
    sessionId: null,
    taskListId: null
};

beforeAll(() => {
    testUtils.setupTestData();

    // Vytvoříme testovací session
    const sessionsDir = path.join(process.cwd(), 'data.tst', 'sessions');
    TEST_DATA.sessionId = uuidv4();
    fs.writeFileSync(path.join(sessionsDir, TEST_DATA.sessionId), TEST_DATA.userId, 'utf8');

    // Vytvoříme testovací seznam úkolů
    const taskListsDir = path.join(process.cwd(), 'data.tst', 'task-lists');
    if (!fs.existsSync(taskListsDir)) {
        fs.mkdirSync(taskListsDir, { recursive: true });
    }

    TEST_DATA.taskListId = uuidv4();
    const taskList = {
        id: TEST_DATA.taskListId,
        name: 'Test Task List',
        owner: TEST_DATA.userId,
        admins: [],
        members: [],
        tasks: []
    };

    fs.writeFileSync(
        path.join(taskListsDir, `${TEST_DATA.taskListId}.json`),
        JSON.stringify(taskList),
        'utf8'
    );
});

afterAll(() => {
    testUtils.cleanupTestData(TEST_DATA);

    // Odstraníme testovací seznam úkolů
    try {
        const taskListPath = path.join(process.cwd(), 'data.tst', 'task-lists', `${TEST_DATA.taskListId}.json`);
        if (fs.existsSync(taskListPath)) {
            fs.unlinkSync(taskListPath);
        }
    } catch (error) {
        console.error('Error during task list cleanup:', error);
    }
});

describe('Task List Tests', () => {
    test('should get user task lists', async () => {
        const res = await request(app)
            .post('/api/v1/user/taskLists')
            .send({ sessionKey: TEST_DATA.sessionId });

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('should get specific task list', async () => {
        const res = await request(app)
            .get(`/api/v1/taskList?listId=${TEST_DATA.taskListId}`)
            .send({ sessionKey: TEST_DATA.sessionId });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(TEST_DATA.taskListId);
    });

    test('should reject access to task list with invalid session', async () => {
        const res = await request(app)
            .get(`/api/v1/taskList?listId=${TEST_DATA.taskListId}`)
            .send({ sessionKey: 'invalid-session-key' });

        expect(res.statusCode).toBe(400);
    });

    test('should reject with invalid task list id', async () => {
        const res = await request(app)
            .get('/api/v1/taskList?listId=non-existing-id')
            .send({ sessionKey: TEST_DATA.sessionId });

        expect(res.statusCode).toBe(404);
    });
}); 