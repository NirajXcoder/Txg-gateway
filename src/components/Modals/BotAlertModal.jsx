import React from 'react';
import { X, ExternalLink, Bot, Bell, ShieldCheck, Zap } from 'lucide-react';
import { BOT_CONFIG } from '../../store/mockDataStore';

export default function BotAlertModal({ isOpen, onClose, alerts }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#131b2e] border border-slate-700/80 rounded-3xl shadow-2xl p-5 z-10 animate-in zoom-in-95 duration-150 text-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">🤖</span>
            <div>
              <h3 className="text-base font-bold text-white">Bot Alerts & Telegram Bot</h3>
              <p className="text-[10px] text-amber-400 font-mono">@TXGGATEWAY_bot</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Bot Connection Box */}
        <div className="p-3.5 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Official Verification & Alert Bot</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            All your wallet OTPs, withdrawal alerts, and payment approvals are broadcast live through our Telegram Bot.
          </p>
          <a
            href={BOT_CONFIG.botUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all uppercase tracking-wider"
          >
            <Bot className="w-4 h-4" />
            <span>Open @TXGGATEWAY_bot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Alerts Feed */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Recent System Broadcasts</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{alerts?.length || 0} Alerts</span>
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {alerts && alerts.map((alert) => (
              <div key={alert.id} className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>{alert.title}</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">{alert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
