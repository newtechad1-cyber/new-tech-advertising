import React, { useState } from 'react';
import { Gift, Users, ChevronRight, Copy, CheckCircle2 } from 'lucide-react';

const REFERRAL_LINK = 'https://ntaplatform.com/ref/arctic-climate';

export default function ClientReferrals() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Refer a Business</h1>
          <p className="text-slate-500 text-sm mt-1">Share NTA with other local businesses and earn credits for every referral that signs up.</p>
        </div>

        {/* Reward card */}
        <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl p-8 text-white">
          <Gift className="w-10 h-10 mb-4 text-white/80" />
          <p className="text-3xl font-black mb-2">Earn $200 Credit</p>
          <p className="text-white/80 text-sm leading-relaxed max-w-md">For every business you refer that becomes an NTA client, you'll receive a $200 account credit — applied automatically to your next invoice.</p>
        </div>

        {/* Referral link */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Your Referral Link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-mono truncate">{REFERRAL_LINK}</div>
            <button onClick={copy} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex-shrink-0 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
              {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-black text-slate-800 mb-4">How It Works</p>
          <div className="space-y-3">
            {[
              { step:'1', text:'Share your referral link with a local business owner you know.' },
              { step:'2', text:'They sign up and start their NTA marketing plan.' },
              { step:'3', text:'You automatically receive a $200 credit on your account.' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{s.step}</div>
                <p className="text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <a href="/client/referral-status" className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-bold text-slate-800">View My Referrals</p>
              <p className="text-xs text-slate-500">Track status and earned credits</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </a>
      </div>
    </div>
  );
}