const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware'); // Adjust the path as necessary
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check if the email or username already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ email, password: hashedPassword, username });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully!', token, username: newUser.username });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Include the username in the response
    res.json({ token, username: user.username });
});


// Update user details (protected route)
router.put('/update', authenticateToken, async (req, res) => {
    try {
        const { email, password } = req.body;
        const userId = req.user.id; // This comes from the decoded token

        const updates = {};
        if (email) updates.email = email;
        if (password) updates.password = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }); // Return the updated user
        res.json({ message: 'User updated successfully!', user: updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
