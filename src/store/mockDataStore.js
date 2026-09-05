// Initial pre-loaded state (Default empty for new users)
const defaultStore = {
  currentUser: null, // Login/Register ke baad actual user set hoga
  users: [],
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
  transactions: [], // 👈 Blank array (Koi fake transaction nahi aayega)
  adminLogs: [],    // 👈 Blank array (Koi fake admin log nahi aayega)
  botAlerts: [
    { id: 1, title: 'Gateway System Update Live', date: '2026-08-23 08:00', type: 'info' },
    { id: 2, title: 'UPI Instant Payouts Active', date: '2026-08-22 14:30', type: 'success' }
  ],
  activeOtps: {}
};