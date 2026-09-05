import React from 'react';
import { Send, ExternalLink, ShieldCheck, Flame, Bell, Sparkles } from 'lucide-react';
import { BOT_CONFIG } from '../store/mockDataStore';

export default function ChannelPage() {
  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      
      {/* Telegram Channel Card */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-[#131b2e] border border-indigo-500/30 rounded-3xl space-y-4 shadow-2xl text-center">
        <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg shadow-cyan-500/20">
          <Send className="w-8 h-8 text-cyan-400" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-white">Official Telegram Channel</h2>
          <p className="text-xs text-cyan-300 font-mono mt-0.5">@crazyXlootoffical</p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
          Get real-time alerts for payment updates, exclusive bonus codes, high-speed UPI gateways, and 24/7 maintenance notices!
        </p>

        <a
          href={BOT_CONFIG.channelUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all uppercase tracking-wider"
        >
          <Send className="w-4 h-4" />
          <span>Join @crazyXlootoffical Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Highlights List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">Channel Features</h3>

        <div className="space-y-2">
          <div className="p-3.5 bg-[#131b2e] border border-slate-800 rounded-2xl flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Daily Loot Offers & Bonuses</h4>
              <p className="text-[11px] text-slate-400">Instant cashback & merchant giveaway codes</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#131b2e] border border-slate-800 rounded-2xl flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Instant UPI Status Broadcasts</h4>
              <p className="text-[11px] text-slate-400">Live gateway success rates and server health</p>
            </div>
          </div>

          <div className="p-3.5 bg-[#131b2e] border border-slate-800 rounded-2xl flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">API Update Logs</h4>
              <p className="text-[11px] text-slate-400">Be the first to test new webhook & payouts features</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
