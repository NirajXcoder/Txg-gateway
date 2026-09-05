require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const BOT_TOKEN = process.env.BOT_TOKEN;

// In-memory active OTP store
const activeOtps = {};

// Helper: Send Telegram Message
async function sendTelegramMessage(telegramId, text) {
  if (!BOT_TOKEN || !telegramId) return false;
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: telegramId, text: text, parse_mode: 'Markdown' })
    });
    const data = await response.json();
    return data.ok;
  } catch (e) {
    console.error('Telegram API send error:', e.message);
    return false;
  }
}

// ==========================================
// 1. UNIVERSAL API GATEWAY HANDLER
// ==========================================
const handlePayout = (req, res) => {
  const { token, paytm, upi, paytoNumber, amount, comment } = { ...req.query, ...req.body };
  const receiver = paytm || upi || paytoNumber;
  const payAmount = parseFloat(amount);

  if (!token || !receiver || isNaN(payAmount) || payAmount <= 0) {
    return res.status(400).json({ status: false, message: "Missing or invalid required parameters" });
  }

  db.get(`SELECT * FROM users WHERE api_key = ?`, [token], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ status: false, message: "Invalid Merchant Token" });
    }

    if (user.is_banned || user.is_frozen) {
      return res.status(403).json({ status: false, message: "UPI Gateway currently disabled for this account" });
    }

    if (user.balance < payAmount) {
      return res.status(400).json({ status: false, message: "Insufficient wallet balance" });
    }

    const txnId = 'TXN' + Math.floor(10000000 + Math.random() * 90000000);
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    db.run(
      `UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?`,
      [payAmount, user.id, payAmount],
      function (upErr) {
        if (upErr || this.changes === 0) {
          return res.status(500).json({ status: false, message: "Transaction processing failed" });
        }

        db.run(
          `INSERT INTO transactions (id, type, amount, utr, status, user_id, user_name, telegram_id, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [txnId, 'Payout', payAmount, receiver, 'Approved', user.id, user.username, user.telegram_id, date, time],
          async () => {
            const botMsg = `🚀 *TXG PAYOUT SUCCESS*\n\n💳 *Txn ID:* \`${txnId}\`\n📲 *Receiver:* ${receiver}\n💰 *Amount:* ₹${payAmount}\n💵 *Balance:* ₹${(user.balance - payAmount).toLocaleString('en-IN')}`;
            await sendTelegramMessage(user.telegram_id, botMsg);

            return res.json({
              status: true,
              message: "Transaction Successful",
              txnid: txnId,
              receiver: receiver,
              amount: payAmount.toString(),
              comment: comment || "Payment Transfer"
            });
          }
        );
      }
    );
  });
};

app.all(['/api.php', '/upi.php', '/api/api.php', '/apis/api', '/api/pay', '/api'], handlePayout);

// ==========================================
// 2. AUTHENTICATION (Telegram ID + Phone + 60s OTP)
// ==========================================
app.post('/api/auth/send-otp', async (req, res) => {
  const { telegramId, phone } = req.body;
  const key = telegramId || phone;
  if (!key) return res.status(400).json({ success: false, error: 'Telegram ID or Phone is required' });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpData = { code: otpCode, expiresAt: Date.now() + 60000 }; // 60 Seconds Expiry

  if (telegramId) activeOtps[telegramId.trim()] = otpData;
  if (phone) activeOtps[phone.trim()] = otpData;

  const messageText = `👋 *Hello! Welcome to TXG Gateway Official Bot.*` +
    `\n\n🔒 *YOUR VERIFICATION CODE IS:* \`${otpCode}\`` +
    `\n\n⏰ *Valid for 60 Seconds.* Do not share this code with anyone!`;

  if (telegramId) {
    sendTelegramMessage(telegramId, messageText);
  }

  return res.json({
    success: true,
    message: 'OTP generated. Please start the Telegram bot to view code.'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, phone, telegramId, password, otp } = req.body;
  const lookupKey = (telegramId && activeOtps[telegramId]) ? telegramId : phone;
  const otpRecord = activeOtps[lookupKey];

  if (!otpRecord || otpRecord.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'OTP expired after 60 seconds. Please click Get OTP again.' });
  }
  if (otpRecord.code !== otp) {
    return res.status(400).json({ error: 'Invalid OTP code entered.' });
  }

  if (telegramId) delete activeOtps[telegramId];
  if (phone) delete activeOtps[phone];

  const id = 'usr_' + Date.now();
  const apiKey = `txg_live_${telegramId || phone}`;
  const apiSecret = `sec_${Math.random().toString(36).substring(2, 10)}`;

  db.run(
    `INSERT INTO users (id, username, email, telegram_id, phone, password, balance, role, api_key, api_secret) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, username, email, telegramId, phone, password, 0.00, 'user', apiKey, apiSecret],
    function (err) {
      if (err) return res.status(400).json({ error: 'User with this Telegram ID, Phone or Email already exists.' });
      return res.json({
        success: true,
        user: { id, username, email, telegramId, phone, balance: 0.00, role: 'user', apiKey, apiSecret }
      });
    }
  );
});

app.post('/api/auth/login', (req, res) => {
  const { telegramId, phone, password, otp } = req.body;
  const lookupKey = (telegramId && activeOtps[telegramId]) ? telegramId : phone;
  const otpRecord = activeOtps[lookupKey];

  if (!otpRecord || otpRecord.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'OTP expired after 60 seconds. Please request again.' });
  }
  if (otpRecord.code !== otp) {
    return res.status(400).json({ error: 'Invalid OTP code entered.' });
  }

  if (telegramId) delete activeOtps[telegramId];
  if (phone) delete activeOtps[phone];

  const query = telegramId
    ? `SELECT * FROM users WHERE (telegram_id = ? OR phone = ?) AND password = ?`
    : `SELECT * FROM users WHERE phone = ? AND password = ?`;
  const params = telegramId ? [telegramId, phone || telegramId, password] : [phone, password];

  db.get(query, params, (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'Invalid credentials or Password.' });
    if (row.is_banned) return res.status(403).json({ error: 'Your account has been banned by Admins.' });

    return res.json({
      success: true,
      user: {
        id: row.id,
        username: row.username,
        email: row.email,
        telegramId: row.telegram_id,
        phone: row.phone,
        balance: row.balance,
        role: row.role,
        apiKey: row.api_key,
        apiSecret: row.api_secret || `sec_${row.id.slice(-8)}`
      }
    });
  });
});

// ==========================================
// 3. USER REAL-TIME TRANSACTIONS HISTORY
// ==========================================
app.get('/api/user/transactions', (req, res) => {
  const { userId, telegramId, phone } = req.query;
  if (!userId && !telegramId && !phone) {
    return res.status(400).json({ success: false, error: 'User identifier required' });
  }

  const sql = `
    SELECT * FROM transactions 
    WHERE user_id = ? OR telegram_id = ? OR user_id = ?
    ORDER BY date DESC, time DESC 
    LIMIT 50
  `;

  db.all(sql, [userId || '', telegramId || '', phone || ''], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.json({ success: true, transactions: rows || [] });
  });
});

// ==========================================
// 4. ADMIN APPROVAL
// ==========================================
app.post('/api/admin/approve', (req, res) => {
  const { txnId, adminHandle } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  db.get(`SELECT * FROM transactions WHERE id = ?`, [txnId], (err, txn) => {
    if (!txn) return res.status(404).json({ error: 'Transaction not found' });

    db.run(`UPDATE transactions SET status = 'Approved', handled_by = ? WHERE id = ?`, [adminHandle, txnId]);

    if (txn.type === 'Add Fund' || txn.type === 'Earning') {
      db.run(`UPDATE users SET balance = balance + ? WHERE id = ?`, [txn.amount, txn.user_id]);
    } else if (txn.type === 'Withdraw') {
      db.run(`UPDATE users SET balance = GREATEST(0, balance - ?) WHERE id = ?`, [txn.amount, txn.user_id]);
    }

    db.run(
      `INSERT INTO admin_logs (id, date, time, admin_handle, action, amount, user_phone_or_telegram, user_name, status, txn_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['LOG-' + Date.now(), date, time, adminHandle, `Approved ${txn.type}`, txn.amount, txn.telegram_id, txn.user_name, 'Approved', txnId]
    );

    const botMsg = `✅ *TXG GATEWAY ${txn.type.toUpperCase()} APPROVED!*\n\n💰 *Amount Added:* ₹${txn.amount.toLocaleString('en-IN')}\n🛡️ *Processed By:* ${adminHandle}\n📅 *Date:* ${date} ${time}`;
    sendTelegramMessage(txn.telegram_id, botMsg);

    return res.json({ success: true });
  });
});

// ==========================================
// 5. MANUAL BALANCE ADJUSTMENT
// ==========================================
app.post('/api/admin/adjust-balance', (req, res) => {
  const { targetUserId, amount, type, handlerRole, handlerIdentifier, reason } = req.body;
  
  const adjAmount = parseFloat(amount);
  if (!targetUserId || isNaN(adjAmount) || adjAmount <= 0 || !['ADD', 'DEDUCT'].includes(type)) {
    return res.status(400).json({ success: false, error: 'Invalid parameters provided.' });
  }

  db.get(`SELECT * FROM users WHERE id = ? OR telegram_id = ? OR phone = ?`, [targetUserId, targetUserId, targetUserId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ success: false, error: 'Target user not found.' });
    }

    if (type === 'DEDUCT' && user.balance < adjAmount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance to deduct.' });
    }

    const balanceSql = type === 'ADD'
      ? `UPDATE users SET balance = balance + ? WHERE id = ?`
      : `UPDATE users SET balance = balance - ? WHERE id = ?`;

    db.run(balanceSql, [adjAmount, user.id], function(upErr) {
      if (upErr) {
        return res.status(500).json({ success: false, error: 'Failed to update balance.' });
      }

      const logId = 'LOG-' + Date.now();
      const date = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const actionText = `${type === 'ADD' ? 'Credited' : 'Debited'} ₹${adjAmount} (${reason || 'Manual Adjustment'}) by ${handlerRole}`;

      db.run(
        `INSERT INTO admin_logs (id, date, time, admin_handle, action, amount, user_phone_or_telegram, user_name, status, txn_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [logId, date, time, `${handlerRole}: ${handlerIdentifier}`, actionText, adjAmount, user.telegram_id || user.phone, user.username, 'Completed', logId]
      );

      const botMsg = type === 'ADD'
        ? `🎁 *WALLET CREDITED*\n\n💰 *Amount:* +₹${adjAmount.toLocaleString('en-IN')}\n🛡️ *Updated By:* ${handlerRole} (${handlerIdentifier})\n💵 *New Balance:* ₹${(user.balance + adjAmount).toLocaleString('en-IN')}`
        : `⚠️ *WALLET DEBITED*\n\n💰 *Amount:* -₹${adjAmount.toLocaleString('en-IN')}\n🛡️ *Processed By:* ${handlerRole} (${handlerIdentifier})\n💵 *New Balance:* ₹${(user.balance - adjAmount).toLocaleString('en-IN')}`;
      
      sendTelegramMessage(user.telegram_id, botMsg);

      return res.json({
        success: true,
        message: `Successfully ${type === 'ADD' ? 'added' : 'deducted'} ₹${adjAmount}`,
        newBalance: type === 'ADD' ? (user.balance + adjAmount) : (user.balance - adjAmount)
      });
    });
  });
});

app.get('/api/admin/logs', (req, res) => {
  db.all(`SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 100`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: 'Database error' });
    return res.json({ success: true, logs: rows });
  });
});

// ==========================================
// 6. TELEGRAM BOT POLLING
// ==========================================
let lastUpdateId = 0;
async function pollTelegramUpdates() {
  if (!BOT_TOKEN) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=2`);
    const data = await res.json();

    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;
        const msg = update.message;
        if (!msg || !msg.text) continue;

        const chatId = msg.chat.id.toString();
        const text = msg.text.trim();

        if (text.startsWith('/start')) {
          const parts = text.split(' ');
          const payload = parts[1];

          let foundOtp = null;
          if (payload && payload.startsWith('otp_')) {
            const key = payload.replace('otp_', '').trim();
            if (activeOtps[key] && activeOtps[key].expiresAt > Date.now()) {
              foundOtp = activeOtps[key].code;
            }
          }

          if (!foundOtp && activeOtps[chatId] && activeOtps[chatId].expiresAt > Date.now()) {
            foundOtp = activeOtps[chatId].code;
          }

          if (foundOtp) {
            const otpMsg = `🔐 *TXG GATEWAY VERIFICATION CODE*` +
              `\n\nYour OTP is: \`${foundOtp}\`` +
              `\n\n⏰ _Valid for 60 seconds. Enter this code on the website to continue._`;
            await sendTelegramMessage(chatId, otpMsg);
          } else {
            const welcomeMsg = `👋 *Hello! Welcome to TXG Gateway Official Bot.*` +
              `\n\n🔐 Verification & Payout Notification Bot` +
              `\n\nType \`/balance\` anytime to check your TXG Wallet Balance!`;
            await sendTelegramMessage(chatId, welcomeMsg);
          }
        } else if (text.startsWith('/balance')) {
          db.get(`SELECT * FROM users WHERE telegram_id = ?`, [chatId], async (err, row) => {
            if (row) {
              const balanceMsg = `💰 *TXG WALLET BALANCE*` +
                `\n\n👤 *User:* ${row.username}` +
                `\n💵 *Available Balance:* ₹${parseFloat(row.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
              await sendTelegramMessage(chatId, balanceMsg);
            } else {
              await sendTelegramMessage(chatId, `⚠️ Account Not Registered. Please Register on TXG Gateway first.`);
            }
          });
        }
      }
    }
  } catch (e) {
    // Polling error handling
  }
}
setInterval(pollTelegramUpdates, 3000);

// Root & Listen
app.get('/', (req, res) => {
  res.send('🚀 TXG Gateway Backend Server is LIVE and Running!');
});

app.listen(PORT, () => {
  console.log(`🚀 TXG Gateway Express Server running on port ${PORT}`);
});