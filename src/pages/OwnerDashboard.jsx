import React, { useState, useEffect } from 'react';
import { Crown, Search, Plus, Trash2, CheckCircle2, XCircle, ShieldCheck, TrendingUp, Users, Clock, AlertTriangle, UserPlus, ListOrdered, Ban, Snowflake, Check, X, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function OwnerDashboard({
  users = [],
  admins = [],
  adminLogs: initialLogs = [],
  transactions = [],
  onAddAdmin,
  onRemoveAdmin,
  onApproveTxn,
  onRejectTxn,
  onToggleBanUser,
  onToggleFreezeUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [logs, setLogs] = useState(initialLogs);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

  // New admin form state
  const [newAdminHandle, setNewAdminHandle] = useState('');
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [adminAddedNotice, setAdminAddedNotice] = useState(false);

  // 1. Fetch live admin audit logs from backend
  const fetchLogs = async () => {
    setIsFetchingLogs(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/logs');
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch admin logs:', err);
    } finally {
      setIsFetchingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 2. Search logic by Telegram UID, Phone, or Username
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

  // 3. Owner Balance Add / Deduct Function
  const handleBalanceAdjust = async (type) => {
    const amountNum = parseFloat(adjustAmount);
    if (!selectedUser || isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    setIsAdjusting(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedUser.id || selectedUser.telegramId,
          amount: amountNum,
          type: type, // 'ADD' ya 'DEDUCT'
          handlerRole: 'Owner',
          handlerIdentifier: 'TXG#master',
          reason: `Owner Manual ${type === 'ADD' ? 'Credit' : 'Debit'}`
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setSelectedUser((prev) => ({
          ...prev,
          balance: data.newBalance
        }));
        setAdjustAmount('');
        fetchLogs(); // Log update refresh
      } else {
        alert(data.error || 'Failed to adjust balance.');
      }
    } catch (err) {
      alert('Unable to connect to backend server.');
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleAddAdminSubmit = (e) => {
    e.preventDefault();
    if (!newAdminHandle || !newAdminUid) return;
    onAddAdmin({
      username: newAdminName || newAdminHandle,
      telegramHandle: newAdminHandle.startsWith('@') ? newAdminHandle : `@${newAdminHandle}`,
      telegramUid: newAdminUid
    });
    setAdminAddedNotice(true);
    setNewAdminHandle('');
    setNewAdminUid('');
    setNewAdminName('');
    setTimeout(() => setAdminAddedNotice(false), 2000);
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

  const pieData = [
    { name: 'Approved', value: totalApproved, color: '#10b981' },
    { name: 'Pending', value: totalPending, color: '#f59e0b' },
    { name: 'Rejected', value: totalRejected, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      
      {/* Owner Banner */}
      <div className="p-5 bg-gradient-to-r from-amber-950 via-[#131b2e] to-slate-900 border border-amber-500/40 rounded-3xl space-y-2 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">HIDDEN OWNER DASHBOARD</h2>
              <p className="text-xs text-amber-400 font-mono">Master Audit Trail & System Management</p>
            </div>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-amber-500/30">
            MASTER OWNER
          </span>
        </div>
      </div>

      {/* Graphical Metrics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-[#131b2e] border border-amber-500/30 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-amber-400">Total Approved Funds</p>
          <p className="text-xl font-black text-emerald-400">₹{totalApproved.toLocaleString('en-IN')}</p>
          <p className="text-[9px] text-slate-500">Gross Volume</p>
        </div>

        <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-400">Total Pending Funds</p>
          <p className="text-xl font-black text-amber-400">₹{totalPending.toLocaleString('en-IN')}</p>
          <p className="text-[9px] text-slate-500">Pipeline Requests</p>
        </div>

        <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-400">Total Rejected Funds</p>
          <p className="text-xl font-black text-rose-400">₹{totalRejected.toLocaleString('en-IN')}</p>
          <p className="text-[9px] text-slate-500">Declined Amount</p>
        </div>

        <div className="p-4 bg-[#131b2e] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-400">Total System Users</p>
          <p className="text-xl font-black text-white">{users.length}</p>
          <p className="text-[9px] text-slate-500">{admins.length} Staff Admins</p>
        </div>
      </div>

      {/* Search User & Owner Controls (Balance Add/Deduct + Moderation) */}
      <div className="p-5 bg-[#131b2e] border border-amber-500/40 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
          <Search className="w-4 h-4 text-amber-400" />
          <span>Search & Inspect User Details (Owner Controls)</span>
        </h3>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search Telegram UID, Phone Number, or Username..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-amber-500/40 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {selectedUser ? (
          <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
                  <span>{selectedUser.username}</span>
                  {selectedUser.isBanned && <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 py-0.5 rounded font-bold">BANNED</span>}
                  {selectedUser.isFrozen && <span className="bg-cyan-500/20 text-cyan-300 text-[9px] px-1.5 py-0.5 rounded font-bold">FROZEN</span>}
                </h4>
                <p className="text-xs text-indigo-400 font-mono">Telegram UID: {selectedUser.telegramId}</p>
                <p className="text-[11px] text-slate-400 font-mono">Phone: {selectedUser.phone} | Email: {selectedUser.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400">Wallet Balance</p>
                <p className="text-base font-black text-emerald-400">₹{selectedUser.balance?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Owner Balance Adjustment Input & Actions */}
            <div className="p-3 bg-[#131b2e] border border-amber-500/30 rounded-xl space-y-2">
              <label className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                <span>Owner Wallet Adjustment (Add / Deduct)</span>
                <span className="text-[10px] text-amber-400 font-mono">Instant Execution</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Enter Amount (₹)"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  onClick={() => handleBalanceAdjust('ADD')}
                  disabled={isAdjusting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-md shadow-emerald-600/20"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => handleBalanceAdjust('DEDUCT')}
                  disabled={isAdjusting}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-md shadow-rose-600/20"
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>Deduct</span>
                </button>
              </div>
            </div>

            {/* Ban & Freeze Controls */}
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
          <p className="text-[11px] text-slate-500 text-center italic">Search Telegram UID or Phone above to view user details & apply moderation actions.</p>
        )}
      </div>

      {/* Financial Graphic Distribution Pie Chart */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Financial Graphic Distribution</h3>
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 text-xs font-semibold">
          <span className="flex items-center text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>Approved</span>
          <span className="flex items-center text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span>Pending</span>
          <span className="flex items-center text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-400 mr-1.5"></span>Rejected</span>
        </div>
      </div>

      {/* Admin Action Audit Trail & Logs */}
      <div className="p-5 bg-[#131b2e] border border-amber-500/30 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
            <ListOrdered className="w-4 h-4 text-amber-400" />
            <span>Admin Payment & Balance Action Audit Trail</span>
          </h3>
          <button
            onClick={fetchLogs}
            disabled={isFetchingLogs}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-lg font-mono border border-slate-700 flex items-center space-x-1 transition"
          >
            <RefreshCw className={`w-3 h-3 ${isFetchingLogs ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No admin activity logs recorded yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{log.admin_handle || log.adminHandle}</span>
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    log.status === 'Approved' || log.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] pt-1">
                  <div>
                    <p className="font-semibold text-slate-200">Action: {log.action}</p>
                    <p className="text-[10px] text-indigo-400">
                      Target: {log.user_name || log.userName} ({log.user_phone_or_telegram || log.userPhoneOrTelegram})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-extrabold ${log.action?.includes('Debited') ? 'text-rose-400' : 'text-amber-400'}`}>
                      ₹{log.amount?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[9px] text-slate-500">{log.date} {log.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Management: Add New Admin by Telegram ID */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <UserPlus className="w-4 h-4 text-indigo-400" />
          <span>Add Admin by Telegram ID</span>
        </h3>

        {adminAddedNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            ✅ New Admin successfully added to the system!
          </div>
        )}

        <form onSubmit={handleAddAdminSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Admin Display Name</label>
            <input
              type="text"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              placeholder="e.g. Imran Admin"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Telegram Handle</label>
              <input
                type="text"
                value={newAdminHandle}
                onChange={(e) => setNewAdminHandle(e.target.value)}
                placeholder="e.g. @txgimran"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Telegram UID</label>
              <input
                type="text"
                value={newAdminUid}
                onChange={(e) => setNewAdminUid(e.target.value)}
                placeholder="e.g. 589320149"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 uppercase tracking-wider flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin Access</span>
          </button>
        </form>

        {/* Existing Admins List */}
        <div className="pt-2 space-y-2">
          <p className="text-[11px] font-bold text-slate-400">Current Admins ({admins.length})</p>
          {admins.map((adm) => (
            <div key={adm.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">{adm.username} <span className="text-amber-400 font-mono">({adm.telegramHandle})</span></p>
                <p className="text-[10px] text-slate-400 font-mono">UID: {adm.telegramUid}</p>
              </div>
              <button
                onClick={() => onRemoveAdmin(adm.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                title="Remove Admin"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}