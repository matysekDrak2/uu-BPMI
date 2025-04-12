const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const testUtils = require('../testUtils');

// Import DAO functions
const taskListCreate = require('../../dao/task-list/create');
const taskListGet = require('../../dao/task-list/get');
const taskListGetAll = require('../../dao/task-list/getAll');

const TEST_DATA = {
    taskListId: null,
    userId: uuidv4(),
    taskList: {
        name: 'Test Task List',
        owner: null
    }
};

// Ensure test directories exist
function ensureTestDirectories() {
    const dataDir = path.join(process.cwd(), 'data.tst');
    const taskListsDir = path.join(dataDir, 'task-lists');

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(taskListsDir)) {
        fs.mkdirSync(taskListsDir, { recursive: true });
    }
}

beforeAll(() => {
    TEST_DATA.taskList.owner = TEST_DATA.userId;
    testUtils.setupTestData();
    ensureTestDirectories();
});

afterAll(() => {
    if (TEST_DATA.taskListId) {
        const taskListPath = path.join(process.cwd(), 'data.tst', 'task-lists', `${TEST_DATA.taskListId}.json`);
        if (fs.existsSync(taskListPath)) {
            fs.unlinkSync(taskListPath);
        }
    }
});

describe('Task List DAO', () => {
    test('should create a task list', () => {
        const result = taskListCreate(TEST_DATA.taskList.name, TEST_DATA.userId);
        expect(result).toBeTruthy();
        expect(result.id).toBeTruthy();
        expect(result.name).toBe(TEST_DATA.taskList.name);
        expect(result.owner).toBe(TEST_DATA.userId);

        TEST_DATA.taskListId = result.id;

        const taskListPath = path.join(process.cwd(), 'data.tst', 'task-lists', `${TEST_DATA.taskListId}.json`);
        expect(fs.existsSync(taskListPath)).toBe(true);
    });

    test('should get task list by ID', () => {
        const taskList = taskListGet(TEST_DATA.taskListId);
        expect(taskList).toBeTruthy();
        expect(taskList).not.toBe(0);
        expect(taskList.id).toBe(TEST_DATA.taskListId);
        expect(taskList.name).toBe(TEST_DATA.taskList.name);
        expect(taskList.owner).toBe(TEST_DATA.userId);
    });

    test('should return null for non-existent task list', () => {
        const result = taskListGet('non-existent-id');
        expect(result).toBeFalsy();
    });

    test('should get all task lists', () => {
        const taskLists = taskListGetAll();
        expect(Array.isArray(taskLists)).toBe(true);

        const foundTaskList = taskLists.find(list => list.id === TEST_DATA.taskListId);
        expect(foundTaskList).toBeTruthy();
        expect(foundTaskList.name).toBe(TEST_DATA.taskList.name);
    });
}); 