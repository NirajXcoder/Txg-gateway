const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : false
});

// Helper functions SQLite compatible queries ko handle karne ke liye
const db = {
  query: (text, params) => pool.query(text, params),
  
  // Single row fetch
  get: (sql, params, callback) => {
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    pool.query(pgSql, params)
      .then(res => callback(null, res.rows[0]))
      .catch(err => callback(err, null));
  },

  // Multiple rows fetch
  all: (sql, params, callback) => {
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    pool.query(pgSql, params)
      .then(res => callback(null, res.rows))
      .catch(err => callback(err, null));
  },

  // Run insert/update
  run: (sql, params, callback) => {
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    pool.query(pgSql, params)
      .then(res => {
        if (callback) callback.call({ changes: res.rowCount }, null);
      })
      .catch(err => {
        if (callback) callback(err);
      });
  }
};

// Initialize PostgreSQL Tables
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE,
        telegram_id VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        balance NUMERIC(15,2) DEFAULT 0.00,
        role VARCHAR(20) DEFAULT 'user',
        is_banned INT DEFAULT 0,
        is_frozen INT DEFAULT 0,
        api_key VARCHAR(100),
        api_secret VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        telegram_handle VARCHAR(100) NOT NULL,
        telegram_uid VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'Admin',
        added_by VARCHAR(50) DEFAULT 'Owner',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(100) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        amount NUMERIC(15,2) NOT NULL,
        utr VARCHAR(150),
        upi_id VARCHAR(150),
        status VARCHAR(50) DEFAULT 'Pending',
        user_id VARCHAR(100),
        user_name VARCHAR(100),
        telegram_id VARCHAR(100),
        date VARCHAR(50),
        time VARCHAR(50),
        handled_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_logs (
        id VARCHAR(100) PRIMARY KEY,
        date VARCHAR(50),
        time VARCHAR(50),
        admin_handle VARCHAR(100),
        action VARCHAR(255),
        amount NUMERIC(15,2),
        user_phone_or_telegram VARCHAR(100),
        user_name VARCHAR(100),
        status VARCHAR(50),
        txn_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ PostgreSQL Tables initialized successfully!');
  } catch (err) {
    console.error('❌ Error creating PG tables:', err.message);
  }
}

initDb();

module.exports = db;