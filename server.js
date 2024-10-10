const express = require('express');
const connectDB = require('./backend/config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./backend/routes/auth');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: ['http://localhost:5000', 'https://user-management-kappa-one.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes
app.use('/api/auth', authRoutes);

// Serve the main index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
