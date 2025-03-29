const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jijiListingsRouter = require('./routes/jiji-listings');
const authRouter = require('./routes/auth');
const config = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for Jiji listings'))
.catch(err => console.log(err));

// Routes
app.use('/api/jiji-listings', jijiListingsRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Jiji listings server running on port ${PORT}`);
});