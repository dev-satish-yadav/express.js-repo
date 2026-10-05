const express = require('express');
const cors = require('cors');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRoutes = require('./src/routes');
const { apiLimiter } = require('./src/middlewares/rateLimiter.middleware');

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter, apiRoutes);

// Test Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Express API Boilerplate'
    });
});

// Error handling middleware can be added here later

module.exports = app;
