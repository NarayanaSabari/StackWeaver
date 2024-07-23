const express = require('express');
const { verifyToken } = require('@middleware/verifyToken');

// Creating an app instance
const app = express.Router();

const appService = require('@controller/app.service.js');

app.get('/', (req, res) => {
    res.json({ connectionStatus: 'API/app connected' });
});

app.get('/test', appService.getTest);

module.exports = app;
