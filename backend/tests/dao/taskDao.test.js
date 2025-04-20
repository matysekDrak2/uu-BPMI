const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const testUtils = require('../testUtils');

const taskCreate = require('../../dao/task/create');
const taskGet = require('../../dao/task/get');
const taskDelete = require('../../dao/task/delete');
const taskListGetTasks = require('../../dao/task/getAll');

const testData = {
    userId: uuidv4(),
    taskListId: uuidv4(),
    taskId: uuidv4(),
    task: {
        id: null,
        text: 'Test Task',
        state: 0
    }
};

beforeAll(() => {
    testData.task.id = testData.taskId;
    testUtils.setupTestData();

    // create test task list directory
    const taskListsDir = path.join(process.cwd(), 'data.tst', 'task-lists');
    if (!fs.existsSync(taskListsDir)) {
        fs.mkdirSync(taskListsDir, { recursive: true });
    }

    // create test task list
    const taskList = {
        id: testData.taskListId,
        name: 'Test List',
        owner: testData.userId,
        admins: [],
        members: [],
        tasks: []
    };

    // save test task list
    fs.writeFileSync(
        path.join(taskListsDir, `${testData.taskListId}.json`),
        JSON.stringify(taskList),
        'utf8'
    );
});

// cleanup after tests
afterAll(() => {
    testUtils.cleanupTestData(testData);

    // delete test task list
    try {
        const taskListPath = path.join(process.cwd(), 'data.tst', 'task-lists', `${testData.taskListId}.json`);
        if (fs.existsSync(taskListPath)) {
            fs.unlinkSync(taskListPath);
        }
    } catch (error) {
        console.error('Chyba při odstraňování task listu:', error);
    }
});

describe('Task DAO testy', () => {
    test('Vytvoření tasku', () => {
        const result = taskCreate(testData.taskListId, testData.task.text, testData.task.state, testData.userId);
        expect(result).not.toBe(null); 

        const tasks = taskListGetTasks(testData.taskListId);
        expect(Array.isArray(tasks)).toBe(true);

        const createdTask = tasks.find(task => task.taskListId === testData.taskListId &&
            task.text === testData.task.text &&
            task.state === testData.task.state);
        expect(createdTask).toBeDefined();

        if (createdTask) {
            testData.taskId = createdTask.id;
        }
    });

    test('Získání tasku podle ID', () => {
        const task = taskGet(testData.taskId);

        expect(task).not.toBe(null);
        if (task) {
            expect(task.id).toBe(testData.taskId);
            expect(task.text).toBe(testData.task.text);
            expect(task.state).toBe(testData.task.state);
        }
    });

    test('Aktualizace tasku', () => {
        const existingTask = taskGet(testData.taskId);

        const updatedText = 'Aktualizovaný Task';
        const updatedState = 1;

        taskDelete(testData.taskId);


        const result = taskCreate(testData.taskListId, updatedText, updatedState, testData.userId);
        expect(result).not.toBe(null);

        const tasks = taskListGetTasks(testData.taskListId);
        const updatedTask = tasks.find(task => task.text === updatedText && task.state === updatedState);
        expect(updatedTask).toBeDefined();

        if (updatedTask) {
            testData.taskId = updatedTask.id;
        }
    });

    test('Získání všech tasků v task listu', () => {
        const tasks = taskListGetTasks(testData.taskListId);

        expect(Array.isArray(tasks)).toBe(true);
        expect(tasks.length).toBeGreaterThan(0);

        const task = tasks.find(t => t.id === testData.taskId);
        expect(task).toBeDefined();
        if (task) {
            expect(task.text).toBe('Aktualizovaný Task');
            expect(task.state).toBe(1);
        }
    });
}); 