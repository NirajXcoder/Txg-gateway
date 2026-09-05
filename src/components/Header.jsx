import React, { useRef } from 'react';
import { Menu, LogOut, User } from 'lucide-react';

export default function Header({ onOpenMenu, currentUser, onOpenPortalModal, onLogout }) {
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const handleSecretTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);

    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      onOpenPortalModal();
    }
  };

  return (
    <header className="w-full max-w-md mx-auto px-4 pt-3 pb-2 flex flex-col space-y-2">
      {/* 7-Tap Secret Trigger on the Title */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSecretTap}
          className="text-xs font-black tracking-widest bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent active:scale-95 transition-transform select-none cursor-pointer py-1 px-3 rounded-full hover:bg-slate-800/40"
          title="⚡ TXG GATEWAY ⚡"
        >
          ⚡ TXG GATEWAY ⚡
        </button>
      </div>

      {/* Top Header Bar */}
      <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMenu}
            className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl hover:bg-slate-700 transition"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
              {currentUser?.username?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-white leading-tight">
                {currentUser?.username || 'Welcome'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                UID: {currentUser?.telegramId || '5647839210'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}