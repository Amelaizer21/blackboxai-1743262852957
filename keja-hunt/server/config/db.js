const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || '172.18.0.2', // Using container IP directly
  database: process.env.DB_NAME || 'keja_hunt',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
    return pool;
  } catch (err) {
    console.error('Error connecting to PostgreSQL database', err);
    throw err;
  }
};

module.exports = {
  pool,
  connectDB,
  query: (text, params) => pool.query(text, params),
};