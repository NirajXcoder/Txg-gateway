import React, { useState } from 'react';
import { Plus, Send, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

export default function WalletPage({ transactions, currentUser, onOpenAddFund, onOpenWithdraw }) {
  const [filterType, setFilterType] = useState('All');

  const filteredTxns = transactions.filter((t) => {
    if (filterType === 'All') return true;
    return t.type === filterType || t.status === filterType;
  });

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      
      {/* Wallet Balance Hero Card */}
      <div className="p-5 bg-gradient-to-br from-slate-900 via-[#131b2e] to-indigo-950/70 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Total Wallet Balance</p>
            <h2 className="text-3xl font-extrabold text-white mt-0.5">
              ₹{currentUser?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
            </h2>
          </div>
          <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 text-xl font-bold">
            💼
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onOpenAddFund}
            className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Deposit Fund</span>
          </button>
          <button
            onClick={onOpenWithdraw}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>💸</span>
            <span>Withdraw Payout</span>
          </button>
        </div>
      </div>

      {/* Transactions List Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Transaction History</h3>
          <div className="flex items-center space-x-1 text-xs">
            {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterType(status)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  filterType === status 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredTxns.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-400">No transactions found under filter `{filterType}`.</p>
            </div>
          ) : (
            filteredTxns.map((txn) => {
              const isDeposit = txn.type === 'Add Fund';
              return (
                <div
                  key={txn.id}
                  className="p-3.5 bg-[#131b2e] border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${
                      isDeposit 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-white">{txn.type}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          txn.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : txn.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {txn.utr ? `UTR: ${txn.utr}` : `UPI: ${txn.upiId}`} • {txn.date} {txn.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-extrabold ${isDeposit ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {isDeposit ? '+' : '-'}₹{txn.amount?.toLocaleString('en-IN')}
                    </p>
                    {txn.handledBy && (
                      <p className="text-[9px] text-indigo-400 font-mono mt-0.5">Admin: {txn.handledBy}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
