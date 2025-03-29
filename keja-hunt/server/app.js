const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const listingsRouter = require('./routes/listings');
const authRouter = require('./routes/auth');
const subscriptionsRouter = require('./routes/subscriptions');
const { router: messagesRouter } = require('./routes/messages');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/listings', listingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/subscriptions', subscriptionsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;