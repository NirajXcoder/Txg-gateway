// TXG Gateway Central Reactive Data Store & Telegram Bot Controller

export const BOT_CONFIG = {
  token: '8818889322:AAHk-tw3ZO961EVonj1zI7hb1p8KK12yT6o',
  botUrl: 'http://t.me/TXGGATEWAY_bot',
  channelUrl: 'https://t.me/crazyXlootoffical',
  supportHandle: '@TXGSERVERS_bot',
  supportUrl: 'https://t.me/TXGSERVERS_bot'
};

const STORAGE_KEY = 'txg_gateway_store_v1';

// Initial pre-loaded state
const defaultStore = {
  currentUser: {
    id: 'usr_001',
    username: 'DemoUser',
    email: 'user@txggateway.com',
    telegramId: '5647839210',
    phone: '5647839210',
    balance: 15450.00,
    role: 'user', // 'user', 'admin', 'owner'
    isBanned: false,
    isFrozen: false,
    apiKey: 'txg_live_98a72b14c5d6e',
    apiSecret: 'sec_7781fbc990112aa',
    createdAt: '2026-08-01'
  },
  users: [
    {
      id: 'usr_001',
      username: 'DemoUser',
      email: 'user@txggateway.com',
      telegramId: '5647839210',
      phone: '5647839210',
      balance: 15450.00,
      role: 'user',
      isBanned: false,
      isFrozen: false,
      password: 'password123',
      apiKey: 'txg_live_98a72b14c5d6e',
      createdAt: '2026-08-01'
    },
    {
      id: 'usr_002',
      username: 'Rohan Sharma',
      email: 'rohan@gmail.com',
      telegramId: '9876543211',
      phone: '9876543211',
      balance: 4200.00,
      role: 'user',
      isBanned: false,
      isFrozen: false,
      password: 'password123',
      createdAt: '2026-08-05'
    }
  ],
  admins: [
    {
      id: 'adm_001',
      username: 'Imran TXG',
      telegramHandle: '@txgimran',
      telegramUid: '589320149',
      role: 'Admin',
      addedBy: 'System Owner',
      addedAt: '2026-07-01'
    },
    {
      id: 'adm_002',
      username: 'Naruto Truested',
      telegramHandle: '@NARUTO_X_TRUESTED',
      telegramUid: '712039482',
      role: 'Admin',
      addedBy: 'System Owner',
      addedAt: '2026-07-05'
    }
  ],
  transactions: [
    {
      id: 'TXN-904812',
      type: 'Add Fund',
      amount: 5000,
      utr: 'UTR98172645102',
      status: 'Approved',
      userId: 'usr_001',
      userName: 'DemoUser',
      telegramId: '5647839210',
      phone: '5647839210',
      date: '2026-08-23',
      time: '10:15:30',
      handledBy: '@txgimran'
    }
  ],
  adminLogs: [
    {
      id: 'LOG-1001',
      date: '2026-08-23',
      time: '10:15:30',
      adminHandle: '@txgimran',
      action: 'Approved Add Fund',
      amount: 5000,
      userPhoneOrTelegram: '5647839210',
      userName: 'DemoUser',
      status: 'Approved',
      txnId: 'TXN-904812'
    }
  ],
  botAlerts: [
    { id: 1, title: 'Gateway System Update v2.4 Live', date: '2026-08-23 08:00', type: 'info' },
    { id: 2, title: 'UPI Instant Payouts Active', date: '2026-08-22 14:30', type: 'success' }
  ],
  activeOtps: {} // { [telegramId]: { code: '123456', expiresAt: timestamp } }
};

export const getStore = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading store:', e);
  }
  return defaultStore;
};

export const saveStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving store:', e);
  }
};

// Send Telegram Message Helper
export const sendTelegramMessage = async (telegramId, text) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_CONFIG.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    const result = await response.json();
    return result.ok;
  } catch (err) {
    console.warn('Telegram Bot API call error:', err);
    return false;
  }
};

// Send Live OTP to User via Telegram Bot
export const sendTelegramOTP = async (telegramId, otpCode) => {
  const messageText = `👋 *Hello! Welcome to TXG Gateway Official Bot.*` +
    `\n\n🔒 *YOUR VERIFICATION CODE IS:* \`${otpCode}\`` +
    `\n\n⏰ *Valid for 30 Seconds only.* Do not share this code with anyone!`;
  
  return await sendTelegramMessage(telegramId, messageText);
};

// Send Approval & Rejection Notifications via Telegram Bot
export const sendTelegramPaymentNotification = async (telegramId, type, amount, status, adminHandle) => {
  const isApproved = status === 'Approved';
  const icon = isApproved ? '✅' : '❌';
  
  const text = `${icon} *TXG GATEWAY ${type.toUpperCase()} ${status.toUpperCase()}*` +
    `\n\n💰 *Amount:* ₹${amount.toLocaleString('en-IN')}` +
    `\n🛡️ *Processed By Admin:* ${adminHandle}` +
    `\n📅 *Date:* ${new Date().toLocaleDateString('en-IN')}` +
    `\n\n${isApproved ? '🎉 Funds credited/processed successfully!' : '⚠️ Payment request was declined.'}`;
  
  return await sendTelegramMessage(telegramId, text);
};

// Polling Telegram Bot Updates for /start and /balance commands
let lastUpdateId = 0;
export const pollTelegramBotCommands = async () => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_CONFIG.token}/getUpdates?offset=${lastUpdateId + 1}&timeout=1`);
    const data = await response.json();
    
    if (data.ok && data.result.length > 0) {
      const currentStore = getStore();

      for (const update of data.result) {
        lastUpdateId = update.update_id;
        const msg = update.message;
        if (!msg || !msg.text) continue;

        const chatId = msg.chat.id.toString();
        const text = msg.text.trim();

        // /start command handling
        if (text.startsWith('/start')) {
          const welcomeMsg = `👋 *Hello! Welcome to TXG Gateway Official Bot.*` +
            `\n\n🔐 This bot dispatches verification OTPs for Login & Register and live payment status alerts.` +
            `\n\nType \`/balance\` anytime to check your TXG Wallet Balance!`;
          await sendTelegramMessage(chatId, welcomeMsg);
        }

        // /balance command handling
        else if (text.startsWith('/balance')) {
          const user = currentStore.users.find((u) => u.telegramId === chatId || u.phone === chatId);
          if (user) {
            const balanceMsg = `💰 *TXG WALLET BALANCE*` +
              `\n\n👤 *User:* ${user.username}` +
              `\n💵 *Available Balance:* ₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            await sendTelegramMessage(chatId, balanceMsg);
          } else {
            const notFoundMsg = `⚠️ *Account Not Found*` +
              `\n\nYour Telegram ID (${chatId}) is not registered yet. Please Register on TXG Gateway first.`;
            await sendTelegramMessage(chatId, notFoundMsg);
          }
        }
      }
    }
  } catch (err) {
    // Ignore offline errors during background polling
  }
};
