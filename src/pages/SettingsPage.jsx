import React, { useState } from 'react';
import { User, Mail, Lock, Bot, ShieldCheck, Check, AlertCircle, Key, RefreshCw } from 'lucide-react';

export default function SettingsPage({ currentUser, onUpdateProfile, onChangePassword }) {
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [telegramId, setTelegramId] = useState(currentUser?.telegramId || '');

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [passError, setPassError] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({ username, email, telegramId });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPassError('');
    if (!newPass || newPass.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New password and confirmation do not match.');
      return;
    }
    onChangePassword(oldPass, newPass);
    setPassSaved(true);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassSaved(false), 2000);
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      
      {/* Profile Overview Card */}
      <div className="p-5 bg-gradient-to-br from-[#131b2e] to-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-indigo-500/20">
            {currentUser?.username?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">{currentUser?.username || 'User Profile'}</h2>
            <p className="text-xs text-indigo-400 font-mono">Telegram ID: {currentUser?.telegramId}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                ACTIVE
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Balance: ₹{currentUser?.balance?.toLocaleString('en-IN') || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Details Form */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Personal Information</span>
          </h3>
          {profileSaved && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Profile Updated</span>
            </span>
          )}
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Telegram User ID Number</label>
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Security & Password</span>
          </h3>
          {passSaved && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Password Changed</span>
            </span>
          )}
        </div>

        {passError && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Current Password</label>
            <input
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            Update Security Password
          </button>
        </form>
      </div>

    </div>
  );
}
