import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Eye, Users, MousePointerClick, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KPICard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function GoogleAnalyticsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke('getGoogleAnalytics', {});
    if (res.data?.error) {
      setError(res.data.error);
    } else {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-500">
      <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading analytics...
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
      <AlertCircle className="w-8 h-8" />
      <p className="font-medium">{error}</p>
      <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
    </div>
  );

  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n?.toLocaleString() ?? '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Website Analytics</h2>
          <p className="text-sm text-slate-500">Last 30 days · Google Analytics</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Eye} label="Page Views" value={fmt(data.summary.pageViews)} color="bg-blue-500" />
        <KPICard icon={Users} label="Unique Visitors" value={fmt(data.summary.uniqueVisitors)} color="bg-purple-500" />
        <KPICard icon={MousePointerClick} label="Sessions" value={fmt(data.summary.sessions)} color="bg-emerald-500" />
        <KPICard icon={TrendingDown} label="Bounce Rate" value={`${data.summary.bounceRate}%`} color="bg-amber-500" />
      </div>

      {/* Daily Trend Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-700 mb-4">Daily Traffic (30 days)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pageViews" stroke="#3b82f6" strokeWidth={2} dot={false} name="Page Views" />
            <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-base font-semibold text-slate-700 mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.trafficSources} dataKey="sessions" nameKey="source" cx="50%" cy="50%" outerRadius={80} label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {data.trafficSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-base font-semibold text-slate-700 mb-4">Sessions by Channel</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.trafficSources} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="source" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="sessions" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}