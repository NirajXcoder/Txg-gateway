import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function WithdrawModal({ isOpen, onClose, userBalance, onSubmitWithdraw }) {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
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
      setError(`Insufficient balance! Your available balance is ₹${userBalance}`);
      return;
    }
    if (!upiId || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    setError('');
    onSubmitWithdraw(numericAmount, upiId);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      setUpiId('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#131b2e] border border-slate-700/80 rounded-3xl shadow-2xl p-5 z-10 animate-in zoom-in-95 duration-150 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">💸</span>
            <h3 className="text-base font-bold text-white">Withdraw Funds</h3>
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
            <h4 className="text-base font-bold text-emerald-400">Withdrawal Request Placed!</h4>
            <p className="text-xs text-slate-300">₹{amount} withdrawal request sent to Admins (@txgimran) for Payout to `{upiId}`.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Available Balance</span>
              <span className="text-sm font-extrabold text-emerald-400">₹{userBalance?.toLocaleString('en-IN') || '0.00'}</span>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Withdrawal Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your UPI ID or Bank VPA</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. 9876543210@paytm"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all uppercase tracking-wider"
            >
              Confirm Withdrawal
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
