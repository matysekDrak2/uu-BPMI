const express = require('express');
const router = express.Router();

const auth = require('../session/auth');
router.use(auth);


const getFileById = require('./get');
router.get('/', (req, res) => {
    getFileById(req, res)
});

const create = require('./create');
router.post('/', (req, res) => {
    create(req, res);
});

module.exports = router;