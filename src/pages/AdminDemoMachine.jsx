import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Users, TrendingUp, CheckCircle, Calendar, BarChart2, ArrowRight, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDemoMachine() {
  const [sessions, setSessions] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    base44.entities.DemoSessions.list('-created_date', 100).then(setSessions);
    base44.entities.DemoConversions.list('-created_date', 100).then(setConversions);
    base44.entities.DemoInteractions.list('-created_date', 200).then(setInteractions);
  }, []);

  const completed = sessions.filter(s => s.completed).length;
  const avgPct = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.completion_percentage || 0), 0) / sessions.length) : 0;
  const pricingViews = interactions.filter(i => i.page_path === 'DemoPricing').length;
  const roiUses = interactions.filter(i => i.interaction_type === 'roi_use').length;
  const trialStarts = conversions.filter(c => c.conversion_type === 'start_trial').length;
  const callsBooked = conversions.filter(c => c.conversion_type === 'book_call').length;

  const QUICK_LINKS = [
    { label: 'Demo Paths', page: 'AdminDemoMachinePaths', icon: Play, desc: 'Manage demo path sequences' },
    { label: 'Sessions', page: 'AdminDemoMachineSessions', icon: Users, desc: 'View active & historical sessions' },
    { label: 'Analytics', page: 'AdminDemoMachineAnalytics', icon: BarChart2, desc: 'Conversion & engagement data' },
  ];

  const METRICS = [
    { label: 'Demo Starts', value: sessions.length, icon: Play, color: 'text-blue-400' },
    { label: 'Avg Completion', value: `${avgPct}%`, icon: TrendingUp, color: 'text-purple-400' },
    { label: 'Pricing Views', value: pricingViews, icon: BarChart2, color: 'text-yellow-400' },
    { label: 'ROI Calc Uses', value: roiUses, icon: Zap, color: 'text-green-400' },
    { label: 'Trial Starts', value: trialStarts, icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Calls Booked', value: callsBooked, icon: Calendar, color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Demo Machine</h1>
            <p className="text-slate-400 mt-1">AI-guided demo system · engagement tracking · conversion optimization</p>
          </div>
          <Link to={createPageUrl('DemoStart')} target="_blank">
            <Button className="bg-blue-600 hover:bg-blue-700"><Play className="w-4 h-4 mr-2" /> Preview Demo</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {METRICS.map(({ label, value, icon: MetricIcon, color }) => (
            <Card key={label} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 text-center">
                <MetricIcon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {QUICK_LINKS.map(({ label, page, icon: NavIcon, desc }) => (
            <Link key={page} to={createPageUrl(page)}>
              <Card className="bg-slate-900 border-slate-800 hover:border-blue-600 transition-colors cursor-pointer h-full">
                <CardContent className="p-5">
                  <NavIcon className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="font-semibold text-white">{label}</div>
                  <div className="text-xs text-slate-400 mt-1">{desc}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Recent Demo Sessions</h2>
              <Link to={createPageUrl('AdminDemoMachineSessions')}>
                <Button variant="ghost" size="sm" className="text-blue-400">View All</Button>
              </Link>
            </div>
            {sessions.length === 0 ? (
              <p className="text-slate-500 text-sm">No sessions yet. Share the demo link to start tracking.</p>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 8).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white">{s.session_key?.slice(0, 16)}…</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {s.industry || 'General'} · Last: {s.current_step || 'Start'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Completion</div>
                        <div className="text-sm font-bold text-white">{s.completion_percentage || 0}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Score</div>
                        <div className={`text-sm font-bold ${(s.lead_score || 0) >= 71 ? 'text-red-400' : (s.lead_score || 0) >= 41 ? 'text-orange-400' : 'text-slate-400'}`}>
                          {s.lead_score || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}