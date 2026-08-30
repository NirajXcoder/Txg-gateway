const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Establish SQLite Database Connection
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite Database:', err.message);
  } else {
    console.log('✅ Connected to SQLite Database successfully!');
  }
});

// 2. Initialize Tables and Seed Initial Data
db.serialize(() => {
  // A. Users Table (Stores user accounts, balance, security status, API keys, and API secrets)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    telegram_id TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0.0,
    role TEXT DEFAULT 'user',
    is_banned INTEGER DEFAULT 0,
    is_frozen INTEGER DEFAULT 0,
    api_key TEXT,
    api_secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Ensure api_secret column exists if table was created earlier without it
  db.run(`ALTER TABLE users ADD COLUMN api_secret TEXT`, (err) => {
    // Ignore error if column already exists
  });

  // B. Admins Table (Stores whitelisted administrators added by Owner)
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    telegram_handle TEXT NOT NULL,
    telegram_uid TEXT NOT NULL,
    role TEXT DEFAULT 'Admin',
    added_by TEXT DEFAULT 'Owner',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // C. Transactions Table (Stores deposit/add-fund and withdrawal requests)
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    utr TEXT,
    upi_id TEXT,
    status TEXT DEFAULT 'Pending',
    user_id TEXT,
    user_name TEXT,
    telegram_id TEXT,
    date TEXT,
    time TEXT,
    handled_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // D. Admin Audit Logs Table (Tracks all admin actions, approvals, and rejections)
  db.run(`CREATE TABLE IF NOT EXISTS admin_logs (
    id TEXT PRIMARY KEY,
    date TEXT,
    time TEXT,
    admin_handle TEXT,
    action TEXT,
    amount REAL,
    user_phone_or_telegram TEXT,
    user_name TEXT,
    status TEXT,
    txn_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 3. Seed Default Records (Inserts if not already present)
  db.run(`INSERT OR IGNORE INTO users (id, username, email, telegram_id, phone, password, balance, role, api_key, api_secret)
    VALUES ('usr_001', 'DemoUser', 'user@txggateway.com', '5647839210', '5647839210', 'password123', 00.00, 'user', 'txg_live_98a72b14c5d6e', 'sec_98a72b14')`);

  db.run(`INSERT OR IGNORE INTO admins (id, username, telegram_handle, telegram_uid)
    VALUES ('adm_001', 'Imran TXG', '@txgimran', '589320149')`);

  db.run(`INSERT OR IGNORE INTO admins (id, username, telegram_handle, telegram_uid)
    VALUES ('adm_002', 'Naruto Truested', '@NARUTO_X_TRUESTED', '712039482')`);

  db.run(`INSERT OR IGNORE INTO transactions (id, type, amount, utr, status, user_id, user_name, telegram_id, date, time, handled_by)
    VALUES ('TXN-904812', 'Add Fund', 5000, 'UTR98172645102', 'Approved', 'usr_001', 'DemoUser', '5647839210', '2026-08-23', '10:15:30', '@txgimran')`);
});

module.exports = db;
