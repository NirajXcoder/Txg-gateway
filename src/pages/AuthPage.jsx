import React, { useState } from 'react';

// Live Render Backend URL
const BACKEND_URL = 'https://txg-gateway-2.onrender.com';
const BOT_USERNAME = 'TXGGATEWAY_bot';

export default function AuthPage({ onLoginSuccess, onAuthSuccess, onGuestPreview }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [showBotModal, setShowBotModal] = useState(false);

  // 1. Send OTP Button Click -> Triggers OTP & Opens the Bot Start Popup
  const handleSendOtp = async () => {
    if (!telegramId && !phone) {
      setError('Please enter your Phone Number and Telegram ID first.');
      return;
    }
    setError('');
    setStatusMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          telegramId: telegramId ? telegramId.trim() : '', 
          phone: phone ? phone.trim() : '' 
        })
      });
      const data = await res.json();

      if (data.success) {
        // Modal popup open karega
        setShowBotModal(true);
      } else {
        setError(data.error || 'Failed to dispatch OTP. Please check your details.');
      }
    } catch (err) {
      // Network delay ke case me bhi popup open ho jayega
      setShowBotModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 2. Redirect to Telegram Bot
  const handleRedirectToBot = () => {
    const payload = telegramId ? telegramId.trim() : phone.trim();
    window.open(`https://t.me/${BOT_USERNAME}?start=otp_${payload}`, '_blank');
    setShowBotModal(false);
  };

  // 3. Submit Login / Register
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
      ? { telegramId, phone, password, otp }
      : { username, email, phone, telegramId, password, otp };

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          const userObj = data.user;
          if (onLoginSuccess) onLoginSuccess(userObj);
          if (onAuthSuccess) onAuthSuccess(userObj);
        } else {
          setStatusMsg('🎉 Account Created Successfully! Please Login.');
          setIsLogin(true);
          setOtp('');
          setPassword('');
        }
      } else {
        setError(data.error || 'Authentication failed. Please verify your details.');
      }
    } catch (err) {
      setError('Authentication server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-white px-4 relative font-sans">
      <div className="max-w-md w-full bg-[#131b2e] border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-1">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          {isLogin ? 'Login to your TXG Gateway account' : 'Register for TXG Payment Gateway'}
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
                  placeholder="Enter username"
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

          {/* Phone Number Field */}
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Telegram ID Field with Get OTP Button */}
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Get OTP'}
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
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

      {/* POPUP MODAL: BOT KO START KARO TO HI OTP AAYEGA */}
      {showBotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-[#131b2e] border border-indigo-500/40 max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center">
            
            {/* Warning / Bot Icon */}
            <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border border-indigo-500/30">
              🤖
            </div>
            
            <h3 className="text-base font-bold text-white mb-2">
              Telegram Bot Verification
            </h3>
            
            {/* Required Message */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 font-medium mb-4 leading-relaxed">
              ⚠️ <strong>Note:</strong> Bot ko start karoge tabhi OTP aayega!
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Neeche diye gaye button par click karein aur Telegram bot me <strong className="text-white">START</strong> dabayein. Aapka 6-digit OTP bot ke chat me turant aa jayega.
            </p>

            <div className="bg-[#090d16] border border-slate-800 rounded-lg p-3 text-xs text-slate-400 mb-5 text-left space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">1.</span> <strong>Start Bot & Get OTP</strong> button click karein.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-400 font-bold">2.</span> Telegram par <strong className="text-white">/start</strong> press karein.
              </p>
              <p className="flex items-center gap-2 text-rose-400">
                <span className="font-bold">3.</span> OTP sirf <strong>60 seconds</strong> tak valid rahega.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRedirectToBot}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold py-2.5 rounded-lg transition shadow-lg shadow-indigo-600/30"
              >
                🚀 Start Bot & Get OTP
              </button>
              <button
                type="button"
                onClick={() => setShowBotModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-lg transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
