import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import WalletPage from './pages/WalletPage';
import ApiPage from './pages/ApiPage';
import ChannelPage from './pages/ChannelPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

import AddFundModal from './components/Modals/AddFundModal';
import WithdrawModal from './components/Modals/WithdrawModal';
import PayUserModal from './components/Modals/PayUserModal';
import BotAlertModal from './components/Modals/BotAlertModal';
import HiddenPortalModal from './components/Modals/HiddenPortalModal';

import { getStore, saveStore, sendTelegramPaymentNotification, pollTelegramBotCommands } from './store/mockDataStore';

const BACKEND_URL = 'https://txg-gateway-2.onrender.com';

export default function App() {
  const [store, setStore] = useState(getStore);

  // Auto-login on refresh if user is already saved in store
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const current = getStore()?.currentUser;
    return Boolean(current && (current.id || current.telegramId || current.phone));
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isPayUserOpen, setIsPayUserOpen] = useState(false);
  const [isBotAlertOpen, setIsBotAlertOpen] = useState(false);
  const [isHiddenPortalOpen, setIsHiddenPortalOpen] = useState(false);

  // Save store changes
  useEffect(() => {
    saveStore(store);
  }, [store]);

  // Active Telegram Bot Command Polling (/start, /balance)
  useEffect(() => {
    const interval = setInterval(() => {
      pollTelegramBotCommands();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentUser = store.currentUser;

  // Real-time Database Transactions Fetch Hook
  useEffect(() => {
    const fetchRealtimeTransactions = async () => {
      if (!isLoggedIn || !currentUser) return;

      const userId = currentUser.id || '';
      const telegramId = currentUser.telegramId || '';
      const phone = currentUser.phone || '';

      if (!userId && !telegramId && !phone) return;

      try {
        const res = await fetch(
          `${BACKEND_URL}/api/user/transactions?userId=${encodeURIComponent(userId)}&telegramId=${encodeURIComponent(telegramId)}&phone=${encodeURIComponent(phone)}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.transactions)) {
          setStore((prev) => ({
            ...prev,
            transactions: data.transactions
          }));
        }
      } catch (err) {
        console.error('Failed to sync live transactions from database:', err);
      }
    };

    fetchRealtimeTransactions();
  }, [isLoggedIn, currentUser?.id, currentUser?.telegramId, currentUser?.phone]);

  // Handlers
  const handleLoginSuccess = (userData) => {
    setStore((prev) => ({
      ...prev,
      currentUser: userData,
      users: prev.users.some((u) => u.telegramId === userData.telegramId)
        ? prev.users
        : [...prev.users, userData]
    }));
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleGuestPreview = () => {
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setStore((prev) => ({
      ...prev,
      currentUser: null
    }));
    setIsLoggedIn(false);
  };

  // Add Fund submission
  const handleAddFund = (amount, utr) => {
    const newTxn = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'Add Fund',
      amount: amount,
      utr: utr,
      status: 'Pending',
      userId: currentUser?.id || 'usr_001',
      userName: currentUser?.username || 'DemoUser',
      telegramId: currentUser?.telegramId || '5647839210',
      phone: currentUser?.phone || '5647839210',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      handledBy: null
    };

    setStore((prev) => ({
      ...prev,
      transactions: [newTxn, ...prev.transactions]
    }));
  };

  // Withdrawal submission
  const handleWithdraw = (amount, upiId) => {
    const newTxn = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'Withdraw',
      amount: amount,
      upiId: upiId,
      status: 'Pending',
      userId: currentUser?.id || 'usr_001',
      userName: currentUser?.username || 'DemoUser',
      telegramId: currentUser?.telegramId || '5647839210',
      phone: currentUser?.phone || '5647839210',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      handledBy: null
    };

    setStore((prev) => ({
      ...prev,
      transactions: [newTxn, ...prev.transactions]
    }));
  };

  // Peer transfer
  const handlePayUser = (recipient, amount) => {
    setStore((prev) => {
      const updatedUser = { ...prev.currentUser, balance: prev.currentUser.balance - amount };
      return {
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      };
    });
  };

  // Admin / Owner Approve Txn + Trigger Telegram Bot Notification
  const handleApproveTxn = async (txnId, adminHandle = '@txgimran') => {
    const targetTxn = store.transactions.find((t) => t.id === txnId);
    if (targetTxn && targetTxn.telegramId) {
      sendTelegramPaymentNotification(targetTxn.telegramId, targetTxn.type, targetTxn.amount, 'Approved', adminHandle);
    }

    setStore((prev) => {
      const target = prev.transactions.find((t) => t.id === txnId);
      if (!target) return prev;

      const updatedTxns = prev.transactions.map((t) =>
        t.id === txnId ? { ...t, status: 'Approved', handledBy: adminHandle } : t
      );

      let updatedUsers = prev.users;
      let updatedCurrentUser = prev.currentUser;

      if (target.type === 'Add Fund') {
        updatedUsers = prev.users.map((u) =>
          u.id === target.userId ? { ...u, balance: (u.balance || 0) + target.amount } : u
        );
        if (updatedCurrentUser && updatedCurrentUser.id === target.userId) {
          updatedCurrentUser = { ...updatedCurrentUser, balance: (updatedCurrentUser.balance || 0) + target.amount };
        }
      } else if (target.type === 'Withdraw') {
        updatedUsers = prev.users.map((u) =>
          u.id === target.userId ? { ...u, balance: Math.max(0, (u.balance || 0) - target.amount) } : u
        );
        if (updatedCurrentUser && updatedCurrentUser.id === target.userId) {
          updatedCurrentUser = { ...updatedCurrentUser, balance: Math.max(0, (updatedCurrentUser.balance || 0) - target.amount) };
        }
      }

      const newLog = {
        id: 'LOG-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        adminHandle: adminHandle,
        action: `Approved ${target.type}`,
        amount: target.amount,
        userPhoneOrTelegram: target.telegramId || target.phone,
        userName: target.userName,
        status: 'Approved',
        txnId: txnId
      };

      return {
        ...prev,
        transactions: updatedTxns,
        users: updatedUsers,
        currentUser: updatedCurrentUser,
        adminLogs: [newLog, ...prev.adminLogs]
      };
    });
  };

  // Admin / Owner Reject Txn + Trigger Telegram Bot Notification
  const handleRejectTxn = async (txnId, adminHandle = '@txgimran') => {
    const targetTxn = store.transactions.find((t) => t.id === txnId);
    if (targetTxn && targetTxn.telegramId) {
      sendTelegramPaymentNotification(targetTxn.telegramId, targetTxn.type, targetTxn.amount, 'Rejected', adminHandle);
    }

    setStore((prev) => {
      const target = prev.transactions.find((t) => t.id === txnId);
      if (!target) return prev;

      const updatedTxns = prev.transactions.map((t) =>
        t.id === txnId ? { ...t, status: 'Rejected', handledBy: adminHandle } : t
      );

      const newLog = {
        id: 'LOG-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        adminHandle: adminHandle,
        action: `Rejected ${target.type}`,
        amount: target.amount,
        userPhoneOrTelegram: target.telegramId || target.phone,
        userName: target.userName,
        status: 'Rejected',
        txnId: txnId
      };

      return {
        ...prev,
        transactions: updatedTxns,
        adminLogs: [newLog, ...prev.adminLogs]
      };
    });
  };

  // Toggle Ban User
  const handleToggleBanUser = (userId) => {
    setStore((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
    }));
  };

  // Toggle Freeze User
  const handleToggleFreezeUser = (userId) => {
    setStore((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === userId ? { ...u, isFrozen: !u.isFrozen } : u))
    }));
  };

  // Owner Add Admin
  const handleAddAdmin = (adminData) => {
    setStore((prev) => ({
      ...prev,
      admins: [...prev.admins, { ...adminData, id: 'adm_' + Date.now(), role: 'Admin', addedBy: 'Owner' }]
    }));
  };

  // Owner Remove Admin
  const handleRemoveAdmin = (adminId) => {
    setStore((prev) => ({
      ...prev,
      admins: prev.admins.filter((a) => a.id !== adminId)
    }));
  };

  // Profile update
  const handleUpdateProfile = (profileData) => {
    setStore((prev) => {
      const updatedUser = { ...prev.currentUser, ...profileData };
      return {
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      };
    });
  };

  // Password change
  const handleChangePassword = (oldPass, newPass) => {
    setStore((prev) => {
      const updatedUser = { ...prev.currentUser, password: newPass };
      return {
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      };
    });
  };

  if (!isLoggedIn) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} onGuestPreview={handleGuestPreview} />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Header Bar */}
      <Header
        onOpenMenu={() => setIsSidebarOpen(true)}
        currentUser={currentUser}
        onOpenPortalModal={() => setIsHiddenPortalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Responsive Body Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        {activeTab === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            onOpenAddFund={() => setIsAddFundOpen(true)}
            onOpenWithdraw={() => setIsWithdrawOpen(true)}
            onOpenPayUser={() => setIsPayUserOpen(true)}
            onOpenBotAlert={() => setIsBotAlertOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletPage
            transactions={store.transactions}
            currentUser={currentUser}
            onOpenAddFund={() => setIsAddFundOpen(true)}
            onOpenWithdraw={() => setIsWithdrawOpen(true)}
          />
        )}

        {activeTab === 'api' && <ApiPage currentUser={currentUser} />}

        {activeTab === 'channel' && <ChannelPage />}

        {activeTab === 'support' && <SupportPage />}

        {activeTab === 'settings' && (
          <SettingsPage
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            users={store.users}
            admins={store.admins}
            transactions={store.transactions}
            onApproveTxn={handleApproveTxn}
            onRejectTxn={handleRejectTxn}
            onToggleBanUser={handleToggleBanUser}
            onToggleFreezeUser={handleToggleFreezeUser}
          />
        )}

        {activeTab === 'owner' && (
          <OwnerDashboard
            users={store.users}
            admins={store.admins}
            adminLogs={store.adminLogs}
            transactions={store.transactions}
            onAddAdmin={handleAddAdmin}
            onRemoveAdmin={handleRemoveAdmin}
            onApproveTxn={handleApproveTxn}
            onRejectTxn={handleRejectTxn}
            onToggleBanUser={handleToggleBanUser}
            onToggleFreezeUser={handleToggleFreezeUser}
          />
        )}
      </main>

      {/* Navigation Drawer Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Modals */}
      <AddFundModal
        isOpen={isAddFundOpen}
        onClose={() => setIsAddFundOpen(false)}
        onSubmitFund={handleAddFund}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        userBalance={currentUser?.balance || 0}
        onSubmitWithdraw={handleWithdraw}
      />

      <PayUserModal
        isOpen={isPayUserOpen}
        onClose={() => setIsPayUserOpen(false)}
        userBalance={currentUser?.balance || 0}
        onPayUser={handlePayUser}
      />

      <BotAlertModal
        isOpen={isBotAlertOpen}
        onClose={() => setIsBotAlertOpen(false)}
        alerts={store.botAlerts}
      />

      <HiddenPortalModal
        isOpen={isHiddenPortalOpen}
        onClose={() => setIsHiddenPortalOpen(false)}
        onSwitchRole={(role) => setActiveTab(role)}
      />

    </div>
  );
}
