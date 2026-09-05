import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';

export default function PayUserModal({ isOpen, onClose, userBalance, onPayUser }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (numericAmount > userBalance) {
      setError('Insufficient balance in wallet');
      return;
    }
    if (!recipient) {
      setError('Please enter recipient Phone or Telegram ID');
      return;
    }
    setError('');
    onPayUser(recipient, numericAmount);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      setRecipient('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#131b2e] border border-slate-700/80 rounded-3xl shadow-2xl p-5 z-10 animate-in zoom-in-95 duration-150 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">👤</span>
            <h3 className="text-base font-bold text-white">Pay User (Peer Transfer)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              ✓
            </div>
            <h4 className="text-base font-bold text-emerald-400">Transfer Successful!</h4>
            <p className="text-xs text-slate-300">₹{amount} successfully sent to `{recipient}`.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Telegram ID / Phone Number</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. 1234567899 or @txguser"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Funds Now</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
