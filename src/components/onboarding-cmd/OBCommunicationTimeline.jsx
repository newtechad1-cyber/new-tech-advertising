import React from 'react';
import { Phone, BarChart2, Rocket, Calendar, Star } from 'lucide-react';

const TIMELINE = [
  { icon: Phone, color: '#3b82f6', label: 'Kickoff Call', desc: 'Strategy overview, brand intake, introductions', timing: 'Day 1–3', done: true },
  { icon: Calendar, color: '#8b5cf6', label: 'Strategy Alignment Call', desc: 'Content plan review, channel setup, first campaign', timing: 'Week 2', done: false },
  { icon: Rocket, color: '#10b981', label: 'Launch Milestone', desc: 'Website live, content publishing begins, first report', timing: 'Day 14–21', done: false },
  { icon: Calendar, color: '#f59e0b', label: 'Month 1 Review', desc: 'Performance snapshot, optimization discussion', timing: 'Day 30', done: false },
  { icon: BarChart2, color: '#06b6d4', label: 'Monthly Reporting', desc: 'Full ROI report + visibility score + strategy update', timing: 'Monthly', done: false },
  { icon: Star, color: '#ec4899', label: 'Quarterly Strategy Review', desc: 'Deep performance review + next quarter planning', timing: 'Quarterly', done: false },
];

export default function OBCommunicationTimeline() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
      <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-400" /> Communication Schedule
      </h3>
      <div className="space-y-3">
        {TIMELINE.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              item.done ? 'border-green-800/40 bg-green-950/15' : 'border-slate-700/40 bg-slate-800/30'
            }`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}18` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white text-xs font-bold">{item.label}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: item.color, background: `${item.color}18` }}>{item.timing}</span>
                  {item.done && <span className="text-xs text-green-400 font-bold">✓ Completed</span>}
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}