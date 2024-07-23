const express = require('express');

// Creating an app instance
const app = express.Router();

const appService = require('@services/app.service');

app.get('/', (req, res) => {
    res.json({ connectionStatus: 'API/app connected' });
});

app.get('/test', appService.getTest);

module.exports = app;
