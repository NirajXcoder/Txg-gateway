import React from 'react';
import { X, LayoutDashboard, Wallet, Code2, Send, Headset, Settings, ExternalLink, LogOut } from 'lucide-react';
import { BOT_CONFIG } from '../store/mockDataStore';

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab, currentUser, onLogout }) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'api', label: 'API Gateway', icon: Code2 },
    { id: 'channel', label: 'Channel', icon: Send, badge: 'Telegram' },
    { id: 'support', label: 'Support', icon: Headset, badge: 'Live' },
    { id: 'settings', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-72 max-w-[85vw] bg-[#0d1424] border-r border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#11192e]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-500/30">
              TXG
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wider text-white">TXG GATEWAY</h1>
              <p className="text-[10px] text-indigo-400 font-medium">Production Gateway</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold">
            {currentUser?.username?.charAt(0) || 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{currentUser?.username || 'User'}</p>
            <p className="text-[11px] text-emerald-400 font-semibold">₹{currentUser?.balance?.toLocaleString('en-IN') || '0.00'}</p>
            <p className="text-[10px] text-slate-400 truncate">ID: {currentUser?.telegramId}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-md font-medium border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick External Links */}
          <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1">
            <a
              href={BOT_CONFIG.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Join Channel (@crazyXlootoffical)</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <a
              href={BOT_CONFIG.supportUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Headset className="w-3.5 h-3.5 text-emerald-400" />
                <span>Support (@TXGSERVERS_bot)</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-800 bg-[#0a0f1c]">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}