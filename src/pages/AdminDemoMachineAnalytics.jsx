import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PAGES = ['DemoProblem', 'DemoPlatform', 'DemoFeatures', 'DemoExamples', 'DemoPricing', 'DemoRoi', 'DemoNext'];
const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AdminDemoMachineAnalytics() {
  const [interactions, setInteractions] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    base44.entities.DemoInteractions.list('-created_date', 500).then(setInteractions);
    base44.entities.DemoConversions.list('-created_date', 200).then(setConversions);
    base44.entities.DemoSessions.list('-created_date', 200).then(setSessions);
  }, []);

  const funnelData = PAGES.map(page => ({
    name: page.replace('Demo', ''),
    views: interactions.filter(i => i.page_path === page && i.interaction_type === 'page_view').length,
  }));

  const conversionData = ['start_trial', 'book_call', 'request_setup', 'proposal_accept'].map(type => ({
    name: type.replace(/_/g, ' '),
    value: conversions.filter(c => c.conversion_type === type).length,
  })).filter(d => d.value > 0);

  const industryData = Object.entries(
    sessions.reduce((acc, s) => { const k = s.industry || 'general'; acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const avgScore = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.lead_score || 0), 0) / sessions.length) : 0;
  const hotLeads = sessions.filter(s => (s.lead_score || 0) >= 71).length;
  const convRate = sessions.length ? ((conversions.length / sessions.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminDemoMachine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <h1 className="text-2xl font-bold">Demo Analytics</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Sessions', value: sessions.length },
            { label: 'Avg Lead Score', value: avgScore },
            { label: 'Hot Leads', value: hotLeads },
            { label: 'Conversion Rate', value: `${convRate}%` },
          ].map(({ label, value }) => (
            <Card key={label} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 text-white">Demo Funnel — Page Views</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={funnelData}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 text-white">Conversions by Type</h3>
              {conversionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={conversionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                      {conversionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-48 text-slate-500 text-sm">No conversions yet</div>}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-4 text-white">Sessions by Industry</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={industryData}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}