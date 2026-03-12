import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TOOLTIP_STYLE = { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11 };

const REACH_TREND = [
  { day: 'W1', reach: 12400 }, { day: 'W2', reach: 14800 }, { day: 'W3', reach: 13900 },
  { day: 'W4', reach: 16200 }, { day: 'W5', reach: 18700 }, { day: 'W6', reach: 17400 },
  { day: 'W7', reach: 21300 }, { day: 'W8', reach: 24800 },
];

const ENGAGEMENT_TREND = [
  { day: 'W1', rate: 3.2 }, { day: 'W2', rate: 3.8 }, { day: 'W3', rate: 4.1 },
  { day: 'W4', rate: 3.9 }, { day: 'W5', rate: 4.4 }, { day: 'W6', rate: 4.8 },
  { day: 'W7', rate: 5.1 }, { day: 'W8', rate: 5.6 },
];

const LEADERBOARD = [
  { client: 'Arctic Air HVAC', campaign: 'Spring HVAC Promo', reach: 42800, engagement: 6.2, conversion: 'strong', platform: 'Instagram' },
  { client: 'Citywide Dental', campaign: 'New Patient Drive', reach: 38400, engagement: 5.8, conversion: 'strong', platform: 'Facebook' },
  { client: 'Precision Plumbing', campaign: 'Emergency Service', reach: 31200, engagement: 5.4, conversion: 'strong', platform: 'TikTok' },
  { client: 'ProHeat Systems', campaign: 'Heat Season', reach: 28900, engagement: 4.9, conversion: 'moderate', platform: 'Facebook' },
  { client: 'Mesa Grill Group', campaign: 'Happy Hour Reels', reach: 22400, engagement: 4.4, conversion: 'moderate', platform: 'Instagram' },
  { client: 'Apex Law Partners', campaign: 'Legal Tips Series', reach: 18100, engagement: 3.9, conversion: 'moderate', platform: 'YouTube' },
];

const PLATFORM_BREAKDOWN = [
  { platform: 'Instagram', reach: 84200, eng: 5.4 },
  { platform: 'Facebook', reach: 62400, eng: 4.2 },
  { platform: 'TikTok', reach: 48900, eng: 6.8 },
  { platform: 'YouTube', reach: 31200, eng: 3.1 },
];

const CONVERSION_COLOR = { strong: 'text-emerald-300', moderate: 'text-amber-300', weak: 'text-red-300' };

export default function CPSocialDashboard({ signals = [] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Social & Video Engagement Dashboard</h2>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Portfolio Reach', value: '226K', color: 'text-violet-300' },
          { label: 'Avg Engagement Rate', value: '5.2%', color: 'text-emerald-300' },
          { label: 'Share Velocity', value: '↑ 34%', color: 'text-teal-300' },
          { label: 'Audience Growth', value: '+12.4K', color: 'text-cyan-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Short-Form Video Reach Growth</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={REACH_TREND} barSize={16}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [v.toLocaleString(), 'Reach']} />
                <Bar dataKey="reach" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Engagement Rate Trend (%)</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={ENGAGEMENT_TREND}>
                <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[2, 7]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [`${v}%`, 'Engagement']} />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Top Campaign Performance Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-700/50">
            <div className="hidden sm:grid grid-cols-6 gap-2 px-4 py-2 text-[10px] text-slate-600 uppercase tracking-wider">
              <span>#</span><span className="col-span-2">Client / Campaign</span><span>Platform</span><span>Reach</span><span>Eng / Conv</span>
            </div>
            {LEADERBOARD.map((item, i) => (
              <div key={i} className="flex flex-col sm:grid sm:grid-cols-6 gap-1 sm:gap-2 items-start sm:items-center px-4 py-3 hover:bg-slate-700/30">
                <span className="text-sm font-bold text-slate-500">#{i + 1}</span>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-white">{item.client}</p>
                  <p className="text-[10px] text-slate-500">{item.campaign}</p>
                </div>
                <Badge className="text-[9px] bg-violet-950 text-violet-300 w-fit">{item.platform}</Badge>
                <p className="text-xs font-bold text-violet-300">{item.reach.toLocaleString()}</p>
                <div>
                  <p className="text-xs text-emerald-300 font-bold">{item.engagement}%</p>
                  <p className={`text-[10px] ${CONVERSION_COLOR[item.conversion]}`}>{item.conversion}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}