import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { week: 'Week 1', visibility: 2400 },
  { week: 'Week 2', visibility: 2810 },
  { week: 'Week 3', visibility: 3200 },
  { week: 'Week 4', visibility: 3890 },
];

export default function VisibilityTrendChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Visibility Growth</h2>
      <p className="text-slate-600 mb-6">
        Your business appeared in more searches and feeds this month.
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
          />
          <Line 
            type="monotone" 
            dataKey="visibility" 
            stroke="#059669" 
            strokeWidth={3}
            dot={{ fill: '#059669', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
        <div>
          <p className="text-sm text-slate-600 mb-1">Google Views</p>
          <p className="text-2xl font-bold text-slate-900">1,240</p>
        </div>
        <div>
          <p className="text-sm text-slate-600 mb-1">Social Reach</p>
          <p className="text-2xl font-bold text-slate-900">3,180</p>
        </div>
        <div>
          <p className="text-sm text-slate-600 mb-1">Video Impressions</p>
          <p className="text-2xl font-bold text-slate-900">2,940</p>
        </div>
      </div>
    </div>
  );
}