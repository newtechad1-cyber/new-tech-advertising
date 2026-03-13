import React from 'react';
import { Flame, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SFUKPIBar({ sequences = [] }) {
  const active = sequences.filter(s => s.status === 'active').length;
  const burning = sequences.filter(s => s.engagement_tier === 'burning').length;
  const hot = sequences.filter(s => s.engagement_tier === 'hot').length;
  const critical = sequences.filter(s => s.priority_flag === 'critical' || s.priority_flag === 'urgent').length;
  const won = sequences.filter(s => s.status === 'won').length;
  const dueToday = sequences.filter(s => {
    if (!s.next_follow_up_date) return false;
    const d = new Date(s.next_follow_up_date);
    const today = new Date();
    return d.toDateString() === today.toDateString() || d < today;
  }).length;

  const cards = [
    { label: 'Active Sequences', value: active, icon: Clock, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Burning / Hot', value: `${burning} / ${hot}`, icon: Flame, color: '#dc2626', bg: '#fef2f2' },
    { label: 'Priority Alerts', value: critical, icon: AlertTriangle, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Due for Follow-Up', value: dueToday, icon: TrendingUp, color: '#d97706', bg: '#fffbeb' },
    { label: 'Closed Won', value: won, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-2xl p-4 border border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                <Icon className="w-4 h-4" style={{ color: c.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}