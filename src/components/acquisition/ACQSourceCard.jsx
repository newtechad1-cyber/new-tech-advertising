import React from 'react';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

const CATEGORY_BADGE = {
  inbound:  'bg-blue-100 text-blue-700',
  outbound: 'bg-amber-100 text-amber-700',
  referral: 'bg-green-100 text-green-700',
  paid:     'bg-pink-100 text-pink-700',
  event:    'bg-purple-100 text-purple-700',
};

export default function ACQSourceCard({ source, recentLeads, isTop }) {
  const { name, category, color, leads, demos, opportunities, closed_won, revenue, close_rate, demo_conversion, avg_deal } = source;

  return (
    <div className={`bg-white rounded-2xl border-2 p-4 transition-shadow hover:shadow-md ${isTop ? 'shadow-sm' : ''}`}
      style={{ borderColor: isTop ? color : '#e2e8f0' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            <p className="text-xs font-black text-slate-900">{name}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${CATEGORY_BADGE[category] || 'bg-slate-100 text-slate-600'}`}>
            {category}
          </span>
        </div>
        {isTop && <span className="text-xs font-black px-2 py-1 rounded-lg text-white" style={{ background: color }}>Top Source</span>}
      </div>

      {/* Funnel mini-stats */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[
          { label: 'Leads', val: leads },
          { label: 'Demos', val: demos },
          { label: 'Opps', val: opportunities },
          { label: 'Won', val: closed_won },
        ].map(s => (
          <div key={s.label} className="text-center p-2 rounded-xl bg-slate-50">
            <p className="text-base font-black text-slate-900">{s.val}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Performance metrics */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Close rate</span>
          <span className="font-black text-slate-900">{close_rate}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Demo conversion</span>
          <span className="font-black text-slate-900">{demo_conversion}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Avg deal value</span>
          <span className="font-black text-slate-900">${avg_deal?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Revenue attributed</span>
          <span className="font-black text-green-600">${revenue?.toLocaleString()}</span>
        </div>
      </div>

      {/* 30-day activity bar */}
      {recentLeads > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(recentLeads * 10, 100)}%`, background: color }} />
          </div>
          <span className="text-xs font-bold text-slate-400">{recentLeads} last 30d</span>
        </div>
      )}
    </div>
  );
}