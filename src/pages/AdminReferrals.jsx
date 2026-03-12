import React, { useState } from 'react';
import { Users, DollarSign, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

const REFERRALS = [
  { referrer:'Arctic Climate Group', referred:'Johnson HVAC', status:'converted', credit:200, date:'Mar 1, 2026', mrr:997 },
  { referrer:'Summit Dental Group', referred:'Lakeshore Legal', status:'pending', credit:0, date:'Mar 8, 2026', mrr:0 },
  { referrer:'Arctic Climate Group', referred:'Rivera Plumbing', status:'in_review', credit:0, date:'Mar 10, 2026', mrr:0 },
  { referrer:'FastTrack Auto Group', referred:'Midwest Roofing', status:'converted', credit:200, date:'Feb 20, 2026', mrr:997 },
];

const STATUS_CONFIG = {
  converted: { label:'Converted', badge:'bg-emerald-100 text-emerald-700' },
  pending:   { label:'Pending',   badge:'bg-amber-100 text-amber-700' },
  in_review: { label:'In Review', badge:'bg-blue-100 text-blue-700' },
};

export default function AdminReferrals() {
  const [filter, setFilter] = useState('all');

  const converted = REFERRALS.filter(r => r.status === 'converted');
  const totalCredits = converted.length * 200;
  const totalNewMRR = converted.reduce((s, r) => s + r.mrr, 0);

  const filtered = filter === 'all' ? REFERRALS : REFERRALS.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Referral Program — Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Track client referrals, conversions, and credits issued</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:'Total Referrals', value:REFERRALS.length, icon:Users, color:'text-slate-800' },
            { label:'Converted', value:converted.length, icon:CheckCircle2, color:'text-emerald-600' },
            { label:'Credits Issued', value:`$${totalCredits}`, icon:DollarSign, color:'text-violet-600' },
            { label:'New MRR Generated', value:`$${totalNewMRR.toLocaleString()}`, icon:TrendingUp, color:'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <p className="text-[10px] text-slate-400 uppercase font-medium">{s.label}</p>
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5">
          {[['all','All'],['converted','Converted'],['in_review','In Review'],['pending','Pending']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter===v?'bg-slate-800 text-white':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{l}</button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Referrer','Referred Business','Status','Date','Credit','MRR'].map(h => (
                  <th key={h} className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((r, i) => {
                const cfg = STATUS_CONFIG[r.status];
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{r.referrer}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{r.referred}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.date}</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-600">{r.credit ? `$${r.credit}` : '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-blue-600">{r.mrr ? `$${r.mrr}/mo` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}