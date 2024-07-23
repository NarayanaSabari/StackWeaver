// Importing the express module
const express = require('express');

// Creating a router instance
const router = express.Router();

// Importing the app controller using the alias
const app = require('@controller/app.controller');

router.use('/app', app);
router.get('/', async (req, res) => {
  res.json({ connectionStatus: 'API connected' });
});

// Exporting the router for use in other modules
module.exports = router;
