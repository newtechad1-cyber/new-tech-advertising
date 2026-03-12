import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CTRevenueChart({ data }) {
  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-3xl p-6 h-80">
      <h2 className="text-sm font-bold text-slate-200 mb-1">Revenue Momentum</h2>
      <p className="text-[10px] text-slate-600 mb-4">6-month trajectory + forward projection</p>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ stroke: '#1e293b' }}
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12, fontSize: 11 }}
            formatter={(val) => [`$${val.toLocaleString()}`, 'MRR']}
          />
          <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} name="Actual" />
          <Line type="monotone" dataKey="projected" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Projection" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}