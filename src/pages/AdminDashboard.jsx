import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, Ban, Snowflake, Users, TrendingUp, Clock, PlusCircle, MinusCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function AdminDashboard({
  users = [],
  admins = [],
  transactions = [],
  onApproveTxn,
  onRejectTxn,
  onToggleBanUser,
  onToggleFreezeUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSelectedUser(null);
      return;
    }
    const found = users.find(
      (u) =>
        (u.phone && u.phone.includes(query)) ||
        (u.telegramId && u.telegramId.includes(query)) ||
        (u.username && u.username.toLowerCase().includes(query.toLowerCase()))
    );
    setSelectedUser(found || null);
  };

  // Balance Add / Remove API Call Function
  const handleBalanceAdjust = async (type) => {
    const amountNum = parseFloat(adjustAmount);
    if (!selectedUser || isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    setIsAdjusting(true);
    try {
      const res = await fetch('https://txg-gateway-2.onrender.com/api/admin/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser.id || selectedUser.telegramId,
          amount: amountNum,
          type: type, // 'ADD' ya 'DEDUCT'
          handlerRole: 'Admin',
          handlerIdentifier: '@txgimran',
          reason: `Manual Admin ${type === 'ADD' ? 'Credit' : 'Debit'}`
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Local state me balance update reflect karna
        setSelectedUser((prev) => ({
          ...prev,
          balance: data.newBalance
        }));
        setAdjustAmount('');
      } else {
        alert(data.error || 'Failed to adjust balance.');
      }
    } catch (err) {
      alert('Unable to connect to backend server.');
    } finally {
      setIsAdjusting(false);
    }
  };

  const totalApproved = transactions
    .filter((t) => t.status === 'Approved')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalRejected = transactions
    .filter((t) => t.status === 'Rejected')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalPending = transactions
    .filter((t) => t.status === 'Pending')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingTxns = transactions.filter((t) => t.status === 'Pending');

  const chartData = [
    { name: 'Approved', amount: totalApproved, fill: '#10b981' },
    { name: 'Pending', amount: totalPending, fill: '#f59e0b' },
    { name: 'Rejected', amount: totalRejected, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      
      {/* Portal Header */}
      <div className="p-5 bg-gradient-to-r from-indigo-950 via-[#131b2e] to-slate-900 border border-indigo-500/40 rounded-3xl space-y-2 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">HIDDEN ADMIN DASHBOARD</h2>
              <p className="text-xs text-indigo-400 font-mono">Control Portal & User Approval Engine</p>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-bold border border-indigo-500/30">
            ADMIN LEVEL
          </span>
        </div>
      </div>

      {/* Graphical Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Approved</span>
          </p>
          <p className="text-xl font-black text-emerald-400">₹{totalApproved.toLocaleString('en-IN')}</p>
          <p className="text-[9px] text-slate-500">Completed Payments</p>
        </div>

        <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Funds</span>
          </p>
          <p className="text-xl font-black text-amber-400">₹{totalPending.toLocaleString('en-IN')}</p>
          <p className="text-[9px] text-slate-500">{pendingTxns.length} Requests Awaiting</p>
        </div>

        <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Total Rejected</span>
          </p>
          <p className="text-xl font-black text-rose-400">₹{totalRejected.toLocaleString('en-IN')}</p>
          <p className="text-[9px] text-slate-500">Declined Transactions</p>
        </div>

        <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Total Users</span>
          </p>
          <p className="text-xl font-black text-white">{users.length}</p>
          <p className="text-[9px] text-slate-500">Registered Accounts</p>
        </div>
      </div>

      {/* Graphical Bar Chart Visualizer */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fund Flow Graphical Analytics</h3>
        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search User by Phone or Telegram ID Section */}
      <div className="p-5 bg-[#131b2e] border border-indigo-500/30 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Search User Details (Phone / Telegram ID)</span>
        </h3>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Type Phone Number or Telegram ID..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-indigo-500/50 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {selectedUser ? (
          <div className="p-4 bg-slate-900 border border-indigo-500/40 rounded-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <span>{selectedUser.username}</span>
                  {selectedUser.isBanned && <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 py-0.5 rounded font-bold">BANNED</span>}
                  {selectedUser.isFrozen && <span className="bg-cyan-500/20 text-cyan-300 text-[9px] px-1.5 py-0.5 rounded font-bold">FROZEN</span>}
                </h4>
                <p className="text-xs text-indigo-400 font-mono">Telegram ID: {selectedUser.telegramId}</p>
                <p className="text-[11px] text-slate-400 font-mono">Phone: {selectedUser.phone} | Email: {selectedUser.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400">Wallet Balance</p>
                <p className="text-base font-black text-emerald-400">₹{selectedUser.balance?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Manual Balance Add / Deduct Controls */}
            <div className="p-3 bg-[#131b2e] border border-slate-800 rounded-xl space-y-2">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>Manage User Wallet Balance</span>
                <span className="text-[10px] text-indigo-400 font-mono">Instant Update</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Enter Amount (₹)"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-mono"
                />
                <button
                  onClick={() => handleBalanceAdjust('ADD')}
                  disabled={isAdjusting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-md shadow-emerald-600/20"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => handleBalanceAdjust('DEDUCT')}
                  disabled={isAdjusting}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-md shadow-rose-600/20"
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>Deduct</span>
                </button>
              </div>
            </div>

            {/* Ban / Freeze Controls */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onToggleBanUser(selectedUser.id)}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  selectedUser.isBanned
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{selectedUser.isBanned ? 'Unban User' : 'Ban User'}</span>
              </button>

              <button
                onClick={() => onToggleFreezeUser(selectedUser.id)}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                  selectedUser.isFrozen
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>{selectedUser.isFrozen ? 'Unfreeze Account' : 'Freeze Account'}</span>
              </button>
            </div>
          </div>
        ) : searchQuery ? (
          <p className="text-xs text-rose-400 text-center py-2">No user matching `{searchQuery}` found.</p>
        ) : (
          <p className="text-[11px] text-slate-500 text-center italic">Enter phone or Telegram ID above to inspect user controls.</p>
        )}
      </div>

      {/* Pending Add Fund & Withdrawal Approvals */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Pending Approvals & Rejections ({pendingTxns.length})</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">ACTION REQUIRED</span>
        </h3>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {pendingTxns.length === 0 ? (
            <div className="p-6 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-emerald-400">All Clean!</p>
              <p className="text-[11px] text-slate-400">No pending deposit or withdrawal requests.</p>
            </div>
          ) : (
            pendingTxns.map((txn) => (
              <div key={txn.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-white">{txn.type} Request</span>
                    <p className="text-[11px] text-indigo-400 font-mono">User: {txn.userName} ({txn.telegramId || txn.phone})</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {txn.utr ? `UTR: ${txn.utr}` : `UPI: ${txn.upiId}`} • {txn.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-amber-400">₹{txn.amount?.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onApproveTxn(txn.id, '@txgimran')}
                    className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Fund</span>
                  </button>

                  <button
                    onClick={() => onRejectTxn(txn.id, '@txgimran')}
                    className="py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Request</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pre-configured Team Admins List */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Active Team Admins List</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">{admins.length} Admins</span>
        </h3>

        <div className="space-y-2">
          {admins.map((adm) => (
            <div key={adm.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white flex items-center space-x-1">
                    <span>{adm.username}</span>
                    <span className="text-indigo-400 font-mono text-[11px]">({adm.telegramHandle})</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Telegram UID: `{adm.telegramUid}`</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                ACTIVE ADMIN
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}