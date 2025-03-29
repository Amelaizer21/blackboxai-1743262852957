const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: '172.18.0.2',
  database: 'keja_hunt',
  password: 'password',
  port: 5432,
});

async function initSchema() {
  try {
    const schema = fs.readFileSync('./database/schema.sql', 'utf8');
    await pool.query(schema);
    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Error initializing schema:', err);
  } finally {
    await pool.end();
  }
}

initSchema();