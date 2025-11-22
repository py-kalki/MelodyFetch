const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api/v1', apiRoutes);

module.exports = app;
