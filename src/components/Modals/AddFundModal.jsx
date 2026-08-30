import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Upload, AlertCircle } from 'lucide-react';

export default function AddFundModal({ isOpen, onClose, onSubmitFund }) {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Updated UPI ID requested by user
  const upiId = 'skimran876@fam';

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!utr || utr.length < 6) {
      setError('Please enter valid 12-digit UTR/Reference Number');
      return;
    }
    setError('');
    onSubmitFund(parseFloat(amount), utr);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      setUtr('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#131b2e] border border-slate-700/80 rounded-3xl shadow-2xl p-5 z-10 animate-in zoom-in-95 duration-150 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">💳</span>
            <h3 className="text-base font-bold text-white">Add Fund to Wallet</h3>
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
            <h4 className="text-base font-bold text-emerald-400">Request Submitted!</h4>
            <p className="text-xs text-slate-300">Your Add Fund request of ₹{amount} with UTR `{utr}` has been sent to Admins (@txgimran) for approval.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* UPI QR Section */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-2">
              <p className="text-[11px] font-semibold text-slate-400">Scan QR or Copy UPI ID to Pay</p>
              
              <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto shadow-md flex items-center justify-center">
                <div className="text-center text-slate-900">
                  <QrCode className="w-24 h-24 mx-auto text-slate-900" />
                  <span className="text-[9px] font-bold tracking-tight block">TXG GATEWAY UPI</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-800/80 px-3 py-1.5 rounded-xl text-xs">
                <span className="font-mono text-indigo-300 font-bold">{upiId}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-slate-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* UTR reference input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">UTR / Transaction Reference Number</label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. UTR98172645102"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all uppercase tracking-wider"
            >
              Submit Deposit Request
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
