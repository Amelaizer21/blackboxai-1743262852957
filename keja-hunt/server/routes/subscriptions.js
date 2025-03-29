const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { auth } = require('../middleware/auth');
const axios = require('axios'); // For M-Pesa API integration

// Get user's subscription status
router.get('/', auth, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY end_date DESC LIMIT 1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.json({ subscriptionType: 'free', status: 'inactive' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create new subscription (initiate payment)
router.post('/', auth, async (req, res) => {
  try {
    const { subscriptionType, phoneNumber } = req.body;
    
    // Validate subscription type
    if (!['premium'].includes(subscriptionType)) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }
    
    // Check if user already has active subscription
    const activeSub = await query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2 AND end_date > NOW()',
      [req.user.id, 'active']
    );
    
    if (activeSub.rows.length > 0) {
      return res.status(400).json({ message: 'User already has active subscription' });
    }
    
    // Calculate amount based on subscription type
    const amount = subscriptionType === 'premium' ? 299 : 0;
    
    // In production, this would call the M-Pesa API
    // For now, we'll simulate a successful payment
    const paymentResponse = await simulateMpesaPayment(phoneNumber, amount);
    
    if (paymentResponse.success) {
      // Create subscription record
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      const result = await query(
        `INSERT INTO subscriptions (
          user_id, 
          subscription_type, 
          start_date, 
          end_date, 
          status
        ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [req.user.id, subscriptionType, startDate, endDate, 'active']
      );
      
      // Record payment
      await query(
        `INSERT INTO payments (
          user_id,
          amount,
          payment_method,
          status
        ) VALUES ($1, $2, $3, $4)`,
        [req.user.id, amount, 'M-Pesa', 'completed']
      );
      
      return res.json(result.rows[0]);
    } else {
      return res.status(400).json({ message: 'Payment failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Helper function to simulate M-Pesa payment
async function simulateMpesaPayment(phoneNumber, amount) {
  // In a real implementation, this would call the M-Pesa API
  // For development, we'll simulate a successful response
  return { 
    success: true,
    transactionId: 'SIM' + Math.random().toString(36).substring(2, 15),
    amount: amount,
    phoneNumber: phoneNumber
  };
}

module.exports = router;