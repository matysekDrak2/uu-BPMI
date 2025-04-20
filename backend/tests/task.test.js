const request = require('supertest');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const testUtils = require('./testUtils');

const app = testUtils.setupTestApp();

const testData = {
    userId: uuidv4(),
    sessionId: uuidv4(),
    taskListId: uuidv4(),
    taskId: null
};

beforeAll(() => {
    testUtils.setupTestData();

    // create test session
    const sessionsDir = path.join(process.cwd(), 'data.tst', 'sessions');
    fs.writeFileSync(path.join(sessionsDir, testData.sessionId), testData.userId, 'utf8');

    // create test task list
    const taskListsDir = path.join(process.cwd(), 'data.tst', 'task-lists');
    if (!fs.existsSync(taskListsDir)) {
        fs.mkdirSync(taskListsDir, { recursive: true });
    }

    const taskList = {
        id: testData.taskListId,
        name: 'Test Task List',
        owner: testData.userId,
        admins: [],
        members: [],
        tasks: []
    };

    fs.writeFileSync(
        path.join(taskListsDir, `${testData.taskListId}.json`),
        JSON.stringify(taskList),
        'utf8'
    );
});

afterAll(() => {
    testUtils.cleanupTestData(testData);

    try {
        const taskListPath = path.join(process.cwd(), 'data.tst', 'task-lists', `${testData.taskListId}.json`);
        if (fs.existsSync(taskListPath)) {
            fs.unlinkSync(taskListPath);
        }
    } catch (error) {
        console.error('Chyba při odstraňování task listu:', error);
    }
});

describe('Task API Tests', () => {

    test('Vytvoření nového tasku', async () => {
        const taskData = {
            taskListId: testData.taskListId,
            text: 'Test úkolu',
            state: 0
        };

        const response = await request(app)
            .put('/api/v1/task')
            .set('sessionkey', testData.sessionId)
            .send(taskData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');

        testData.taskId = response.body.id;
    });

    test('Získání všech tasků v task listu', async () => {
        const response = await request(app)
            .get(`/api/v1/taskList/tasks?taskListId=${testData.taskListId}`)
            .set('sessionkey', testData.sessionId);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        const foundTask = response.body.find(task => task.id === testData.taskId);
        expect(foundTask).toBeDefined();
        expect(foundTask.text).toBe('Test úkolu');
        expect(foundTask.state).toBe(0);
    });

    test('Aktualizace tasku', async () => {
        const updateData = {
            id: testData.taskId,
            text: 'Aktualizovaný úkol',
            state: 1
        };

        const response = await request(app)
            .post('/api/v1/task')
            .set('sessionkey', testData.sessionId)
            .send(updateData);

        expect(response.status).toBe(200);

        const tasksResponse = await request(app)
            .get(`/api/v1/taskList/tasks?taskListId=${testData.taskListId}`)
            .set('sessionkey', testData.sessionId);

        expect(tasksResponse.body.length).toBeGreaterThan(0);

        console.log('Tasks po aktualizaci:', tasksResponse.body);

        const updatedTask = tasksResponse.body.find(
            task => task.text === 'Aktualizovaný úkol' && task.state === 1
        );

        expect(updatedTask).toBeDefined();
        if (updatedTask) {
            expect(updatedTask.text).toBe('Aktualizovaný úkol');
            expect(updatedTask.state).toBe(1);

            if (updatedTask.id !== testData.taskId) {
                console.log(`ID tasku se změnilo z ${testData.taskId} na ${updatedTask.id}`);
                testData.taskId = updatedTask.id;
            }
        }
    });

    test('Neplatná session při získávání tasků', async () => {
        const response = await request(app)
            .get(`/api/v1/taskList/tasks?taskListId=${testData.taskListId}`)
            .set('sessionkey', 'neplatná-session');

        expect(response.status).toBe(400);
    });

    test('Neplatné ID task listu', async () => {
        const response = await request(app)
            .get(`/api/v1/taskList/tasks?taskListId=neplatné-id`)
            .set('sessionkey', testData.sessionId);

        expect(response.status).toBe(400);
    });
}); 