const express = require('express');
const router = express.Router();
const { promisePool } = require('../database.js');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Get single user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Create new user
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const [result] = await promisePool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    const [newUser] = await promisePool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: newUser[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const [result] = await promisePool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const [updatedUser] = await promisePool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    res.json({ 
      success: true, 
      message: 'User updated successfully',
      data: updatedUser[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const [result] = await promisePool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

module.exports = router;