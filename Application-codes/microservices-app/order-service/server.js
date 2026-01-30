const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3003;

app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'rootpassword',
  database: 'microservices_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Routes
app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM orders WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

app.post('/orders', (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  db.query('INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, user_id, product_id, quantity });
  });
});

app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, product_id, quantity } = req.body;
  db.query('UPDATE orders SET user_id = ?, product_id = ?, quantity = ? WHERE id = ?', [user_id, product_id, quantity, id], (err, results) => {
    if (err) throw err;
    res.json({ id, user_id, product_id, quantity });
  });
});

app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM orders WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.json({ message: 'Order deleted' });
  });
});

app.listen(port, () => {
  console.log(`Order service listening at http://localhost:${port}`);
});
