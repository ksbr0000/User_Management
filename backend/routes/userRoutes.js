const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// Update Email
router.post('/email', authenticate, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findById(req.user.id);
        user.email = email;
        await user.save();
        res.status(200).json({ message: 'Email updated!', email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Error updating email.', error });
    }
});

// Update Password
router.post('/password', authenticate, async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findById(req.user.id);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password.', error });
    }
});

// Logout (optional - clear token on client side)
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out!' });
});

module.exports = router;
