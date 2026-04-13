const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/task.routes');
const authRoutes = require('./routes/auth.routes');

const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

const app = express();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// SERVE FRONTEND IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));
    
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(frontendPath, 'index.html'));
        }
    });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    }
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
