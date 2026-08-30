import React from 'react';
import { Plus, Send, Globe, History, CreditCard, Bot, ArrowDownRight, ArrowUpRight, ChevronRight, Zap } from 'lucide-react';
import { BOT_CONFIG } from '../store/mockDataStore';

export default function UserDashboard({
  currentUser,
  onOpenAddFund,
  onOpenWithdraw,
  onOpenPayUser,
  onOpenBotAlert,
  onNavigateTab
}) {
  const balance = currentUser?.balance || 0;

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      
      {/* 1. Available Balance Glossy Gradient Card (Matches uploaded mockup screenshot) */}
      <div className="relative overflow-hidden rounded-3xl gradient-balance-card p-6 text-white shadow-2xl space-y-5">
        
        {/* Glow decoration circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <p className="text-xs font-semibold text-purple-100/90 tracking-wide uppercase">Available Balance</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
        </div>

        {/* Action Buttons inside Card */}
        <div className="relative z-10 grid grid-cols-2 gap-3 pt-2">
          {/* + Add Fund (White pill button) */}
          <button
            onClick={onOpenAddFund}
            className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 text-slate-900 stroke-[3]" />
            <span>Add Fund</span>
          </button>

          {/* Withdraw (Translucent blue button) */}
          <button
            onClick={onOpenWithdraw}
            className="py-3 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-sm">💸</span>
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Cards Row (Matches mockup: 15 Transactions & 3 Bot Alerts) */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Card 1: Transactions */}
        <div 
          onClick={() => onNavigateTab('wallet')}
          className="bg-[#131b2e] hover:bg-[#18233c] border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all space-y-1 text-center shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-lg group-hover:scale-110 transition-transform">
            📜
          </div>
          <p className="text-xl font-extrabold text-white">15</p>
          <p className="text-[11px] font-semibold text-slate-400">Transactions</p>
        </div>

        {/* Card 2: Bot Alerts */}
        <div 
          onClick={onOpenBotAlert}
          className="bg-[#131b2e] hover:bg-[#18233c] border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all space-y-1 text-center shadow-lg group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-lg group-hover:scale-110 transition-transform">
            🤖
          </div>
          <p className="text-xl font-extrabold text-white">3</p>
          <p className="text-[11px] font-semibold text-slate-400">Bot Alerts</p>
        </div>

      </div>

      {/* 3. Quick Actions Section (Matches 3x2 grid in uploaded screenshot) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">Quick Actions</h3>

        <div className="grid grid-cols-3 gap-3">
          
          {/* Pay User */}
          <button
            onClick={onOpenPayUser}
            className="bg-[#131b2e] hover:bg-[#1c2742] border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              👤
            </div>
            <span className="text-xs font-bold text-slate-200">Pay User</span>
          </button>

          {/* Gateway API */}
          <button
            onClick={() => onNavigateTab('api')}
            className="bg-[#131b2e] hover:bg-[#1c2742] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🌐
            </div>
            <span className="text-xs font-bold text-slate-200">Gateway API</span>
          </button>

          {/* History */}
          <button
            onClick={() => onNavigateTab('wallet')}
            className="bg-[#131b2e] hover:bg-[#1c2742] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📜
            </div>
            <span className="text-xs font-bold text-slate-200">History</span>
          </button>

          {/* Add Fund */}
          <button
            onClick={onOpenAddFund}
            className="bg-[#131b2e] hover:bg-[#1c2742] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💳
            </div>
            <span className="text-xs font-bold text-slate-200">Add Fund</span>
          </button>

          {/* Withdraw */}
          <button
            onClick={onOpenWithdraw}
            className="bg-[#131b2e] hover:bg-[#1c2742] border border-slate-800 hover:border-purple-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💸
            </div>
            <span className="text-xs font-bold text-slate-200">Withdraw</span>
          </button>

          {/* Bot Alert */}
          <button
            onClick={onOpenBotAlert}
            className="bg-[#131b2e] hover:bg-[#1c2742] border border-slate-800 hover:border-rose-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center space-y-2 transition-all shadow-md group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🤖
            </div>
            <span className="text-xs font-bold text-slate-200">Bot Alert</span>
          </button>

        </div>
      </div>

      {/* Official Telegram Announcement Card */}
      <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Telegram Bot & Channel</span>
          <p className="text-xs font-bold text-white">Join @crazyXlootoffical for Live Updates</p>
        </div>
        <a
          href={BOT_CONFIG.channelUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shrink-0 flex items-center space-x-1"
        >
          <span>Join</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
