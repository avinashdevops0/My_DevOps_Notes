const mysql = require('mysql2');
require('dotenv').config(); // load .env if running locally

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',       // must match Docker service name
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'simple_app_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise version of the pool (for async/await)
const promisePool = pool.promise();

// Initialize database with retry logic
const initDatabase = async (retries = 10) => {
  while (retries > 0) {
    try {
      // Test connection
      await promisePool.query('SELECT 1');

      // Create users table if not exists
      await promisePool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert sample data if table empty
      const [rows] = await promisePool.query('SELECT COUNT(*) as count FROM users');
      if (rows[0].count === 0) {
        await promisePool.query(`
          INSERT INTO users (name, email) VALUES 
          ('John Doe', 'john@example.com'),
          ('Jane Smith', 'jane@example.com'),
          ('Bob Johnson', 'bob@example.com')
        `);
        console.log('✅ Sample data inserted');
      }

      console.log('✅ Database initialized successfully');
      return; // success
    } catch (error) {
      retries--;
      console.log(`⏳ Waiting for database... Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  throw new Error('❌ Database not ready after retries');
};

module.exports = { promisePool, initDatabase };
