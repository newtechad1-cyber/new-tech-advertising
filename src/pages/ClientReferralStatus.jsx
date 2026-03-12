import React from 'react';
import { Gift, Users, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

const REFERRALS = [
  { name:'Mike Johnson', company:'Johnson HVAC', status:'converted', reward:'$200 credit', date:'Mar 1, 2026' },
  { name:'Sara Williams', company:'Williams Dental', status:'pending', reward:'$200 credit', date:'Mar 8, 2026' },
  { name:'Tom Rivera', company:'Rivera Plumbing', status:'in_review', reward:'$200 credit', date:'Mar 10, 2026' },
];

const STATUS_CONFIG = {
  converted:  { label:'Converted', badge:'bg-emerald-100 text-emerald-700', icon:CheckCircle2 },
  pending:    { label:'Pending',   badge:'bg-amber-100 text-amber-700',   icon:Clock },
  in_review:  { label:'In Review', badge:'bg-blue-100 text-blue-700',     icon:Clock },
};

export default function ClientReferralStatus() {
  const earned = REFERRALS.filter(r => r.status === 'converted').length * 200;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Referral Status</h1>
          <p className="text-slate-500 text-sm mt-1">Track your referrals and earned rewards</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Total Referred', value:REFERRALS.length, icon:Users, color:'text-blue-600', bg:'bg-blue-50 border-blue-200' },
            { label:'Converted', value:REFERRALS.filter(r=>r.status==='converted').length, icon:CheckCircle2, color:'text-emerald-600', bg:'bg-emerald-50 border-emerald-200' },
            { label:'Credits Earned', value:`$${earned}`, icon:Gift, color:'text-violet-600', bg:'bg-violet-50 border-violet-200' },
          ].map(s => (
            <div key={s.label} className={`border rounded-2xl p-4 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-[9px] text-slate-500 font-bold uppercase">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-sm font-black text-slate-800">Your Referrals</p>
          </div>
          <div className="divide-y divide-slate-50">
            {REFERRALS.map((r, i) => {
              const cfg = STATUS_CONFIG[r.status];
              const Icon = cfg.icon;
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-600 text-sm flex-shrink-0">{r.name[0]}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{r.name}</p>
                    <p className="text-[11px] text-slate-500">{r.company} · Referred {r.date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${cfg.badge}`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                    {r.status === 'converted' && <span className="text-xs font-black text-emerald-600">{r.reward}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="font-black text-lg mb-1">Refer Another Business</p>
            <p className="text-white/80 text-sm">Earn $200 credit for every new client you refer.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white text-violet-700 rounded-xl font-bold text-sm hover:bg-violet-50 transition-colors flex-shrink-0">
            Refer Now <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}