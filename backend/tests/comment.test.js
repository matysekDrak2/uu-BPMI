const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const express = require('express');
const testApp = express();
testApp.use(express.json());

jest.mock('../routers/v1/session/auth', () => {
    return (req, res, next) => {
        req.headers.userId = 'test-user-id';
        next();
    };
});

jest.mock('../dao/task/get', () => {
    return (id) => ({ id, taskListId: 'test-list-id' });
});

jest.mock('../dao/task-list/get', () => {
    return () => ({
        id: 'test-list-id',
        owner: 'test-user-id',
        admins: [],
        members: []
    });
});

jest.mock('../dao/session/getUser', () => {
    return () => 'test-user-id';
});

describe('Comment API', () => {
    let commentRouter;
    const commentPath = path.join(process.cwd(), 'data.tst', 'comments.json');

    beforeEach(() => {
        jest.resetModules();

        commentRouter = require('../routers/v1/comments/router');
        testApp.use('/comment', commentRouter);

        if (!fs.existsSync(path.dirname(commentPath))) {
            fs.mkdirSync(path.dirname(commentPath), { recursive: true });
        }
        fs.writeFileSync(commentPath, JSON.stringify([]));
    });

    it('should get comments for a task', async () => {
        const response = await request(testApp)
            .get(`/comment?id=${uuidv4()}`)
            .set('sessionkey', 'test-session-key');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create a new comment', async () => {
        const taskId = uuidv4();
        const comment = {
            taskId,
            text: 'Test comment content'
        };

        const response = await request(testApp)
            .put('/comment')
            .set('sessionkey', 'test-session-key')
            .send(comment);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('text', 'Test comment content');
    });
}); 