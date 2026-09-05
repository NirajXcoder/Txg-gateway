import React, { useState } from 'react';
import { Shield, User, Lock, X, AlertCircle } from 'lucide-react';

export default function HiddenPortalModal({ isOpen, onClose, onSwitchRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuthorize = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    // 1. Owner Credentials Verification
    if (cleanUser === 'TXG#master' && cleanPass === 'TXG@ownermaster001') {
      onSwitchRole('owner');
      onClose();
      setUsername('');
      setPassword('');
      return;
    }

    // 2. Admin Credentials Verification
    if (cleanUser === 'AdminTXG#team701' && cleanPass === 'TXG@teamkey9012') {
      onSwitchRole('admin');
      onClose();
      setUsername('');
      setPassword('');
      return;
    }

    setError('Invalid Master Username or Password!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Shield className="w-5 h-5" />
            <h3 className="font-bold text-sm text-white">Master Secret Portal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Enter authorized administrative credentials to unlock elevated panels.
        </p>

        {error && (
          <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuthorize} className="space-y-3">
          {/* Master Username */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Master Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Master Password */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Master Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex space-x-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 font-bold text-xs text-white rounded-xl shadow-lg transition"
            >
              Verify & Unlock
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}