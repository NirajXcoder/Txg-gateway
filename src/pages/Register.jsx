import React, { useState } from 'react';

export default function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Send OTP (Bot Only)
  const handleSendOtp = async () => {
    if (!telegramId) {
      setError('Please enter your Telegram ID first');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://txg-gateway-2.onrender.com/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        alert('✅ OTP has been sent directly to your Telegram Bot (@TXGGATEWAY_bot). Please check and enter the 6-digit code.');
      } else {
        setError(data.error || 'Failed to send OTP. Please start the bot @TXGGATEWAY_bot first.');
      }
    } catch (err) {
      setError('Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !telegramId || !password || !otp) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://txg-gateway-2.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, telegramId, password, otp })
      });
      const data = await res.json();

      if (data.success) {
        alert('🎉 Registration Successful! Welcome to TXG Gateway.');
        if (onRegisterSuccess) onRegisterSuccess(data.user);
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-white px-4">
      <div className="max-w-md w-full bg-[#131b2e] border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Create TXG Account</h2>
        <p className="text-sm text-slate-400 text-center mb-6">Register to get Merchant Keys & Instant Payout APIs</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
            <input
              type="text"
              placeholder="e.g. Niraj Kumar"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Telegram ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 5249309895"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition"
              >
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Set Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">6-Digit Bot OTP</label>
            <input
              type="text"
              placeholder="Enter OTP from @TXGGATEWAY_bot"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 tracking-widest text-center"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-medium py-3 rounded-lg text-sm transition mt-2 shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}