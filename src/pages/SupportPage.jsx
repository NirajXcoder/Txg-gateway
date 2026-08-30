import React, { useState } from 'react';
import { Headset, Bot, ExternalLink, MessageSquare, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import { BOT_CONFIG } from '../store/mockDataStore';

export default function SupportPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      
      {/* Support Hero Box */}
      <div className="p-5 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <Headset className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">24/7 Dedicated Support</h2>
            <p className="text-xs text-emerald-300 font-mono">Telegram: @TXGSERVERS_bot</p>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Have an issue with deposit approval or withdrawal payouts? Connect directly with our support team on Telegram!
        </p>

        <a
          href={BOT_CONFIG.supportUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all uppercase tracking-wider"
        >
          <Bot className="w-4 h-4" />
          <span>Chat with @TXGSERVERS_bot</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Submit Ticket Form */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Create Support Ticket</span>
        </h3>

        {submitted ? (
          <div className="p-4 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-xs font-bold text-emerald-400">Ticket Dispatched!</h4>
            <p className="text-[11px] text-slate-300">Our support staff on @TXGSERVERS_bot will reach out to your registered Telegram ID shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Add Fund UTR verification pending"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message Description</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide transaction details, UTR number, or question..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Ticket</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
