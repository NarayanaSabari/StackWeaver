// Load environment variables from the .env file
require('dotenv').config();

// Extract environment variables and export them as a configuration object

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
};
