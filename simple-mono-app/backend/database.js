const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,            // must be 'db' in Docker
  user: process.env.DB_USER,            // root
  password: process.env.DB_PASSWORD,    // rootpassword
  database: process.env.DB_NAME,         // simple_app_db
  port: Number(process.env.DB_PORT),     // IMPORTANT: cast to number
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create connection promise
const promisePool = pool.promise();

// Initialize database with sample table
const initDatabase = async () => {
  try {
    // Create users table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data if table is empty
    const [rows] = await promisePool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      await promisePool.query(`
        INSERT INTO users (name, email) VALUES 
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com'),
        ('Bob Johnson', 'bob@example.com')
      `);
      console.log('Sample data inserted');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = { promisePool, initDatabase };