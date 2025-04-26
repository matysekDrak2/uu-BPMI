const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Mock data paths
const commentPath = path.join(process.cwd(), 'data.tst', 'comments.json');

// Helpers
function setupTestData() {
    const taskId = uuidv4();
    const userId = uuidv4();
    const testComment = {
        id: uuidv4(),
        task: taskId,
        creator: userId,
        text: "Test comment",
        createdAt: new Date().toISOString()
    };
    return { taskId, userId, testComment };
}

describe('Comment DAO', () => {
    let getCommentsByTaskId;
    let createComment;

    beforeEach(() => {
        getCommentsByTaskId = require('../../dao/comment/get');
        createComment = require('../../dao/comment/create');

        if (fs.existsSync(commentPath)) {
            fs.writeFileSync(commentPath, JSON.stringify([]));
        }
    });

    it('should create a comment', () => {
        const { testComment } = setupTestData();
        const result = createComment(testComment);
        expect(result).toEqual(testComment);
    });

    it('should get comments by task ID', () => {
        const { taskId, testComment } = setupTestData();
        createComment(testComment);

        const comments = getCommentsByTaskId(taskId);
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(1);
        expect(comments[0]).toEqual(testComment);
    });

    it('should return empty array for task with no comments', () => {
        const nonExistingTaskId = uuidv4();
        const comments = getCommentsByTaskId(nonExistingTaskId);
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
    });
}); 