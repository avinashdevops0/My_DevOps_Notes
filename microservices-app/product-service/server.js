const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3002;

app.use(express.json());

const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'rootpassword',
  database: 'microservices_db'
});

const connectWithRetry = () => {
  db.connect(err => {
    if (err) {
      console.error('MySQL not ready, retrying in 5s...', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected to MySQL');
    }
  });
};

connectWithRetry();

// Routes
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/products/:id', (req, res) => {
  db.query(
    'SELECT * FROM products WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0]);
    }
  );
});

app.post('/products', (req, res) => {
  const { name, price } = req.body;
  db.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ id: results.insertId, name, price });
    }
  );
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Product service listening on port ${port}`);
});
