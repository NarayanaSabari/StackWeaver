require('module-alias/register');
const express = require('express');
const cors = require('cors');
const route = require('@routes/routes');
const { connectToDatabase } = require('@mongodb/db')

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true, withCredentials: true }));

// Routes
app.use('/api', route);
app.get('/', (req, res) => {
  res.send('Welcome to Stremix Server-side!'); 
});

// Function to start the server
const startServer = async () => {
  try {
    await connectToDatabase();
    return app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export for testing
module.exports = { app, startServer };