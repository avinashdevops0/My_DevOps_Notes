const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDatabase } = require('./database.js');
const apiRoutes = require('./routes/api.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files (in production)
app.use(express.static('../frontend'));

// API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../frontend' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();