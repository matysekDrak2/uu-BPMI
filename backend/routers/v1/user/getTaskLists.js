const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
    const userId = req.headers.userId

    const getTaskLists = require("../../../dao/task-list/getAll");
    const taskLists = getTaskLists();

    const data = []

    for (const taskList of taskLists) {
        if (taskList.owner === userId)                             data.push(taskList);
        if (taskList.admins  && taskList.admins.includes(userId))  data.push(taskList);
        if (taskList.members && taskList.members.includes(userId)) data.push(taskList);
    }
    res.status(200).json(data)
})

module.exports = router;