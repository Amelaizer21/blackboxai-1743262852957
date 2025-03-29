const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { auth } = require('../middleware/auth');
const { Server } = require('socket.io');

// Initialize Socket.io
const io = new Server();

// Get all messages between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const result = await query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [currentUserId, userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    // Verify receiver exists
    const receiver = await query('SELECT * FROM users WHERE id = $1', [receiverId]);
    if (receiver.rows.length === 0) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Save message to database
    const result = await query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [senderId, receiverId, content]
    );

    // Emit real-time message via Socket.io
    io.emit('newMessage', result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all conversations for current user
router.get('/', auth, async (req, res) => {
  try {
    const result = await query(
      `SELECT DISTINCT u.id, u.first_name, u.last_name, u.user_type
       FROM users u
       JOIN messages m ON u.id = m.sender_id OR u.id = m.receiver_id
       WHERE (m.sender_id = $1 OR m.receiver_id = $1) AND u.id != $1
       ORDER BY u.first_name`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = { router, io };
