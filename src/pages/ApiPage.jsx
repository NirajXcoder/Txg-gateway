import React, { useState } from 'react';
import { Copy, Check, Code2, Terminal, Link2 } from 'lucide-react';

export default function ApiPage({ currentUser }) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState('url');

  // 1. Dynamic User Credentials (token & key)
  const apiKey = currentUser?.apiKey || `txg_live_${currentUser?.telegramId || '5249309895'}`;
  const apiSecret = currentUser?.apiSecret || `sec_${currentUser?.id ? currentUser.id.slice(-8) : '72297738'}`;

  // 2. Exact Combined API URL Format
  const customApiUrl = `https://TXGGATEWAY/APIs/api?token=${apiKey}&key=${apiSecret}&paytoNumber={number}&amount={amount}&comment={comment}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const codeSnippets = {
    url: customApiUrl,
    python: `import requests

# TXG Gateway dynamic API call
url = "${customApiUrl}"
# Replace placeholders
url = url.replace("{number}", "9876543210").replace("{amount}", "500").replace("{comment}", "Referral_Bonus")

response = requests.get(url)
print(response.json())`,
    node: `const axios = require('axios');

let url = "${customApiUrl}";
url = url.replace("{number}", "9876543210").replace("{amount}", "500").replace("{comment}", "Referral_Bonus");

axios.get(url)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));`
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Merchant Gateway API</h2>
            <p className="text-xs text-slate-400">Direct endpoint for Telegram bots, callbacks & payouts</p>
          </div>
        </div>
      </div>

      {/* Dynamic Combined Payment URL Box */}
      <div className="p-5 bg-[#131b2e] border border-cyan-500/40 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>Combined Payment API URL</span>
          </h3>
          <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold">
            GET ENDPOINT
          </span>
        </div>

        <p className="text-[11px] text-slate-400">
          Aapke <code>token</code> aur <code>key</code> ke sath ready URL jise bot me call karna hai:
        </p>

        <div className="flex items-center justify-between bg-slate-950 border border-cyan-500/30 px-3.5 py-3 rounded-2xl text-xs font-mono text-cyan-300 break-all space-x-2">
          <span className="select-all font-semibold">{customApiUrl}</span>
          <button
            type="button"
            onClick={() => copyToClipboard(customApiUrl, 'url')}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition shrink-0"
            title="Copy API Link"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Individual Credentials Section */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Individual Credentials</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
            LIVE PRODUCTION
          </span>
        </h3>

        {/* User API Token */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">User API Token (token)</label>
          <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-mono text-cyan-300">
            <span className="truncate">{apiKey}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(apiKey, 'key')}
              className="p-1 text-slate-400 hover:text-white transition"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Secret Security Key */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Secret Security Key (key)</label>
          <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 rounded-xl text-xs font-mono text-purple-300">
            <span className="truncate">{apiSecret}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(apiSecret, 'secret')}
              className="p-1 text-slate-400 hover:text-white transition"
            >
              {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="p-5 bg-[#131b2e] border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Code Integration Example</span>
          </h3>
          <div className="flex space-x-1 text-xs">
            {['url', 'python', 'node'].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveTab(lang)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                  activeTab === lang 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre">
          {codeSnippets[activeTab]}
        </div>
      </div>

    </div>
  );
}