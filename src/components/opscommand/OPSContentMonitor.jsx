import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CONTENT_TABS = ['all', 'article', 'social_post', 'gbp_post', 'email', 'landing_page', 'video_script', 'ad_creative'];

const DAILY_VOLUME = [
  { day: 'Mar 1', count: 38 }, { day: 'Mar 3', count: 42 }, { day: 'Mar 5', count: 51 },
  { day: 'Mar 7', count: 46 }, { day: 'Mar 9', count: 58 }, { day: 'Mar 11', count: 63 }, { day: 'Mar 12', count: 47 },
];

const BY_TYPE = [
  { type: 'Article', count: 142 }, { type: 'Social Post', count: 318 }, { type: 'GBP Post', count: 96 },
  { type: 'Email', count: 44 }, { type: 'Video Script', count: 61 }, { type: 'Ad Creative', count: 38 }, { type: 'Landing Page', count: 22 },
];

const AGENTS = [
  { name: 'Agent Alpha', completed: 142, failed: 3, avg_time: '3.8m', completion_rate: 98 },
  { name: 'Agent Beta', completed: 118, failed: 7, avg_time: '4.2m', completion_rate: 94 },
  { name: 'Agent Gamma', completed: 96, failed: 2, avg_time: '3.5m', completion_rate: 98 },
  { name: 'Agent Delta', completed: 84, failed: 11, avg_time: '5.1m', completion_rate: 88 },
];

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 };

export default function OPSContentMonitor({ jobs = [] }) {
  const [tab, setTab] = useState('all');

  const totalJobs = jobs.length > 0 ? jobs.length : 699;
  const failedJobs = jobs.filter(j => j.status === 'failed').length || 23;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">AI Content Generation Monitor</h2>

      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CONTENT_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${tab === t ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            {t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Generated', value: totalJobs, color: 'text-white' },
          { label: 'Completed', value: totalJobs - failedJobs, color: 'text-emerald-300' },
          { label: 'Failed', value: failedJobs, color: 'text-red-300' },
          { label: 'Avg Gen Time', value: '4.1m', color: 'text-cyan-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume by day */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Generated Content Volume – Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={DAILY_VOLUME} barSize={16}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By type */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Output by Content Type</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={BY_TYPE} barSize={14} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent performance */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Agent Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            <div className="grid grid-cols-5 gap-2 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-wider">
              <span className="col-span-2">Agent</span><span className="text-center">Completed</span><span className="text-center">Failed</span><span className="text-center">Rate</span>
            </div>
            {AGENTS.map((a, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center px-4 py-2.5 hover:bg-slate-700/30">
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-600 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">{a.name[6]}</div>
                  <span className="text-xs text-white">{a.name}</span>
                </div>
                <span className="text-xs text-emerald-300 text-center font-bold">{a.completed}</span>
                <span className={`text-xs text-center font-bold ${a.failed > 5 ? 'text-red-300' : 'text-slate-400'}`}>{a.failed}</span>
                <div>
                  <span className="text-xs text-center block text-slate-300">{a.completion_rate}%</span>
                  <div className="h-1 bg-slate-700 rounded-full mt-0.5">
                    <div className={`h-full rounded-full ${a.completion_rate >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${a.completion_rate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}