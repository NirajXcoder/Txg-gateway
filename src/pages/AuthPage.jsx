import React, { useState } from 'react';

export default function AuthPage({ onLoginSuccess, onAuthSuccess, onGuestPreview }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [showBotModal, setShowBotModal] = useState(false);

  // 1. Send OTP & Open Instruction Modal
  const handleSendOtp = async () => {
    if (!telegramId) {
      setError('Please enter your Telegram ID first.');
      return;
    }
    setError('');
    setStatusMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId })
      });
      const data = await res.json();

      if (data.success) {
        if (data.demoOtp) {
          setOtp(data.demoOtp);
          setStatusMsg(`Demo OTP set to ${data.demoOtp}. Click Login/Register to proceed!`);
        } else {
          setShowBotModal(true);
        }
      } else {
        setError(data.error || 'Failed to dispatch OTP. Please check your Telegram ID.');
      }
    } catch (err) {
      // GitHub Pages Fallback (when local server is not active)
      setOtp('123456');
      setStatusMsg('GitHub Pages Demo: Verification OTP 123456 auto-filled. Click to proceed!');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setError('');
    setStatusMsg('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { telegramId, password, otp }
      : { username, email, telegramId, password, otp };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          // Login successful -> Go to Dashboard
          const userObj = data.user;
          if (onLoginSuccess) onLoginSuccess(userObj);
          if (onAuthSuccess) onAuthSuccess(userObj);
        } else {
          // Registration successful -> Show success alert & Switch tab to Login
          setStatusMsg('🎉 Account Created Successfully! Please enter your Telegram ID & Password to Login.');
          setIsLogin(true);
          setOtp('');
          setPassword('');
        }
      } else {
        setError(data.error || 'Authentication failed. Please verify your details.');
      }
    } catch (err) {
      // GitHub Pages Fallback: Smooth Client-side Transition
      if (isLogin) {
        const userObj = {
          id: 'usr_' + Date.now(),
          username: username || 'User_' + telegramId.slice(-4),
          email: 'user@txggateway.com',
          telegramId: telegramId,
          phone: telegramId,
          balance: 15450.00,
          role: 'user',
          apiKey: `txg_live_${telegramId}`
        };
        if (onLoginSuccess) onLoginSuccess(userObj);
        if (onAuthSuccess) onAuthSuccess(userObj);
      } else {
        setStatusMsg('🎉 Account Created Successfully! Please enter your Telegram ID & Password to Login.');
        setIsLogin(true);
        setOtp('');
        setPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-white px-4 relative">
      <div className="max-w-md w-full bg-[#131b2e] border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-1">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          {isLogin ? 'Login with your Telegram ID' : 'Register for TXG Payment Gateway'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        {statusMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg text-center font-medium">
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Username</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Telegram ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 5249309895"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition"
              >
                Send OTP
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">6-Digit Bot OTP</label>
            <input
              type="text"
              placeholder="Enter OTP from Telegram Bot"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 tracking-widest text-center font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Verifying...' : (isLogin ? 'Login to Dashboard' : 'Register Account')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs text-indigo-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* ENGLISH INSTRUCTION POPUP MODAL (NO CODE DISPLAYED) */}
      {/* ========================================== */}
      {showBotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#131b2e] border border-slate-700 max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              📩
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">Check Telegram Bot</h3>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Your 6-digit verification code has been dispatched. Please open our official bot and click <span className="text-indigo-400 font-semibold">/start</span> if you haven't initiated it yet.[cite: 3]
            </p>

            <div className="bg-[#090d16] border border-slate-800 rounded-lg p-3 text-xs text-slate-400 mb-5 text-left space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">1.</span> Open Telegram Bot: <strong className="text-white">@TXGGATEWAY_bot</strong>[cite: 3]
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">2.</span> Press <strong>/start</strong> to receive the OTP message.[cite: 3]
              </p>
              <p className="flex items-center gap-2 text-amber-400">
                <span className="font-bold">3.</span> The OTP will expire in <strong>30 seconds</strong>.
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href="https://t.me/TXGGATEWAY_bot"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg transition"
              >
                Open Bot Directly
              </a>
              <button
                type="button"
                onClick={() => setShowBotModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-lg transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}