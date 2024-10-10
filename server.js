const express = require('express');
const connectDB = require('./backend/config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./backend/routes/auth');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
