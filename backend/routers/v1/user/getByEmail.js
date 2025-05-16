const express = require('express');
const router = express.Router();
const getUserByEmail = require('../../../dao/user/getByEmail');
const auth = require('../session/auth');

// Makes sure that the sessionKey is valid
router.use(auth);

router.get('/', (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
    }

    const user = getUserByEmail(email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Don't send the password
    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
});

module.exports = router; 