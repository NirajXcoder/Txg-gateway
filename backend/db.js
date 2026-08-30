const { Pool } = require('pg');

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper: Convert SQLite '?' placeholders to PostgreSQL '$1, $2, $3'
function formatQuery(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

// Database Wrapper: SQLite compatible methods
const db = {
  // Execute queries without return or with callback (like INSERT, UPDATE, DELETE)
  run: (sql, params = [], callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    const formattedSql = formatQuery(sql);
    pool.query(formattedSql, params)
      .then((result) => {
        if (callback) {
          // Emulate SQLite's 'this.lastID' and 'this.changes'
          callback.call({ lastID: result.rows[0]?.id || null, changes: result.rowCount }, null);
        }
      })
      .catch((err) => {
        console.error('Database run error:', err.message);
        if (callback) callback(err);
      });
  },

  // Fetch a single row (SQLite db.get)
  get: (sql, params = [], callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    const formattedSql = formatQuery(sql);
    pool.query(formattedSql, params)
      .then((result) => {
        if (callback) callback(null, result.rows[0] || null);
      })
      .catch((err) => {
        console.error('Database get error:', err.message);
        if (callback) callback(err);
      });
  },

  // Fetch multiple rows (SQLite db.all)
  all: (sql, params = [], callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    const formattedSql = formatQuery(sql);
    pool.query(formattedSql, params)
      .then((result) => {
        if (callback) callback(null, result.rows);
      })
      .catch((err) => {
        console.error('Database all error:', err.message);
        if (callback) callback(err);
      });
  },

  // Promise-based query (if needed)
  query: (text, params) => {
    return pool.query(formatQuery(text), params);
  },

  pool
};

// Auto-initialize Tables if they don't exist
async function initTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(150),
        telegram_id VARCHAR(100),
        phone VARCHAR(50),
        password VARCHAR(255),
        balance NUMERIC(15, 2) DEFAULT 0.00,
        role VARCHAR(20) DEFAULT 'user',
        is_banned INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50) DEFAULT 'superadmin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100),
        amount NUMERIC(15, 2),
        type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        utr VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_logs (
        id VARCHAR(100) PRIMARY KEY,
        admin_id VARCHAR(100),
        action TEXT,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ PostgreSQL Database connected and tables verified.');
  } catch (err) {
    console.error('❌ Table initialization error:', err.message);
  }
}

initTables();

module.exports = db;