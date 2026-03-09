import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Play, MousePointer, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminVideoEngineAnalytics() {
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    base44.entities.VideoPerformance.list('-views', 50).then(setPerformance);
  }, []);

  const totals = performance.reduce((acc, p) => ({
    views: acc.views + (p.views || 0),
    clicks: acc.clicks + (p.clicks || 0),
    leads: acc.leads + (p.leads_generated || 0),
  }), { views: 0, clicks: 0, leads: 0 });

  const chartData = performance.slice(0, 10).map(p => ({
    id: p.video_request_id?.slice(-6),
    views: p.views || 0,
    watch_rate: Math.round(p.watch_rate || 0),
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminVideoEngine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Video Analytics</h1>
            <p className="text-slate-400 text-sm mt-0.5">Performance tracking across all published videos</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Views', value: totals.views, icon: Eye, color: 'text-blue-400' },
            { label: 'Total Clicks', value: totals.clicks, icon: MousePointer, color: 'text-purple-400' },
            { label: 'Leads Generated', value: totals.leads, icon: TrendingUp, color: 'text-green-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="bg-slate-900 border-slate-800">
              <CardContent className="p-5">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {chartData.length > 0 && (
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Top Videos by Views</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="id" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4">All Video Performance</h3>
            {performance.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Play className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No performance data yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="text-left pb-2">Video ID</th>
                    <th className="text-right pb-2">Views</th>
                    <th className="text-right pb-2">Watch %</th>
                    <th className="text-right pb-2">Clicks</th>
                    <th className="text-right pb-2">CTR %</th>
                    <th className="text-right pb-2">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {performance.map(p => (
                    <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-2 text-slate-300 font-mono text-xs">{p.video_request_id?.slice(-10)}</td>
                      <td className="text-right text-white">{p.views || 0}</td>
                      <td className="text-right text-slate-300">{Math.round(p.watch_rate || 0)}%</td>
                      <td className="text-right text-white">{p.clicks || 0}</td>
                      <td className="text-right text-slate-300">{(p.ctr || 0).toFixed(1)}%</td>
                      <td className="text-right text-green-400">{p.leads_generated || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}