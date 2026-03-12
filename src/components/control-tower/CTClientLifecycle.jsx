import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const LIFECYCLE_COLORS = {
  onboarding: '#3b82f6',
  stabilizing: '#8b5cf6',
  growing: '#10b981',
  expansion_ready: '#f59e0b',
  at_risk: '#ef4444',
};

const LIFECYCLE_LABELS = {
  onboarding: 'Onboarding',
  stabilizing: 'Stabilizing',
  growing: 'Growing',
  expansion_ready: 'Expansion Ready',
  at_risk: 'At Risk',
};

export default function CTClientLifecycle({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-3xl p-6 mb-8">
      <h2 className="text-sm font-bold text-slate-200 mb-4">Client Lifecycle Snapshot</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Chart */}
        <div className="lg:col-span-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={index} fill={LIFECYCLE_COLORS[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Stats */}
        <div className="lg:col-span-2 space-y-2">
          {data.map(item => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: LIFECYCLE_COLORS[item.name] }} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-1">
                {LIFECYCLE_LABELS[item.name]}
              </span>
              <span className="text-sm font-black text-white">{item.value}</span>
              <span className="text-xs text-slate-600">{Math.round((item.value / total) * 100)}%</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}