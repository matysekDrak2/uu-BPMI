const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const testUtils = require('../testUtils');

const taskCreate = require('../../dao/task/create');
const taskGet = require('../../dao/task/get');
const taskUpdate = require('../../dao/task/update');
const taskListGetTasks = require('../../dao/taskList/getTasks');

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
        const result = taskCreate(testData.taskListId, testData.task);
        expect(result).toBe(0); // Úspěch = 0

        // verify that task was added to task list
        const tasks = taskListGetTasks(testData.taskListId);
        expect(Array.isArray(tasks)).toBe(true);

        // verify that task exists in task list
        const taskExists = tasks.some(task => task.id === testData.taskId);
        expect(taskExists).toBe(true);
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
        const updatedTask = {
            id: testData.taskId,
            text: 'Aktualizovaný Task',
            state: 1
        };

        const result = taskUpdate(updatedTask);
        expect(result).toBe(0); // Úspěch = 0

        const task = taskGet(testData.taskId);
        if (task) {
            expect(task.text).toBe('Aktualizovaný Task');
            expect(task.state).toBe(1);
        }
    });

    test('Získání všech tasků v task listu', () => {
        const tasks = taskListGetTasks(testData.taskListId);

        expect(Array.isArray(tasks)).toBe(true);
        expect(tasks.length).toBeGreaterThan(0);

        const task = tasks.find(t => t.id === testData.taskId);
        expect(task).toBeDefined();
        expect(task.text).toBe('Aktualizovaný Task');
        expect(task.state).toBe(1);
    });
}); 