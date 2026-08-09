import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Zap, Shield, Activity, Map, Calendar, Briefcase, Award } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

const trendData = [
  { month: 'Jan', adoption: 20, growth: 15, participation: 30 },
  { month: 'Feb', adoption: 35, growth: 25, participation: 45 },
  { month: 'Mar', adoption: 55, growth: 42, participation: 60 },
  { month: 'Apr', adoption: 70, growth: 65, participation: 75 },
  { month: 'May', adoption: 85, growth: 78, participation: 85 },
  { month: 'Jun', adoption: 95, growth: 90, participation: 92 },
];

const scoreDist = [
  { name: 'Lead (80-100)', value: 15, color: '#3b82f6' },
  { name: 'Grow (50-79)', value: 45, color: '#10b981' },
  { name: 'Build (30-49)', value: 25, color: '#f59e0b' },
  { name: 'Discover (0-29)', value: 15, color: '#64748b' }
];

export default function CommunityIntelligenceCenter() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead title="Community Intelligence Center | NTA" description="Local business ecosystem health and digital readiness insights." />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500" />
              Community Intelligence Center™
            </h1>
            <p className="text-slate-400 mt-2">Real-time health of the local business ecosystem.</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-xl">
            <span className="text-sm text-slate-400 px-3">Region:</span>
            <select className="bg-slate-800 text-white text-sm border-none rounded-lg px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer">
              <option>North Iowa (Mason City)</option>
              <option>Southern MN (Rochester)</option>
              <option>Global Overview</option>
            </select>
          </div>
        </header>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Avg Digital Readiness', val: '64/100', trend: '+12%', icon: Zap, color: 'text-blue-400' },
            { label: 'AI Adoption Rate', val: '38%', trend: '+8%', icon: Shield, color: 'text-emerald-400' },
            { label: 'Active Partners', val: '24', trend: '+3', icon: Users, color: 'text-purple-400' },
            { label: 'Ecosystem Growth', val: '$2.4M', trend: '+15%', icon: TrendingUp, color: 'text-amber-400' },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
              <kpi.icon className={`absolute right-4 top-4 w-16 h-16 opacity-5 ${kpi.color}`} />
              <p className="text-slate-400 text-sm font-medium mb-1">{kpi.label}</p>
              <h3 className="text-3xl font-bold text-white mb-2">{kpi.val}</h3>
              <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-1 rounded-md">{kpi.trend} This Qtr</span>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-6">Business Growth & AI Adoption Trends</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#475569" tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis stroke="#475569" tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="adoption" name="AI Adoption" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdoption)" />
                  <Area type="monotone" dataKey="growth" name="Business Growth" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-6">Business Score Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={scoreDist} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {scoreDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {scoreDist.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Upcoming Community Events</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">View Calendar</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Chamber Commerce Digital Summit', date: 'Oct 15, 2024', attendees: 45, icon: Users },
                { title: 'AI for Local Retailers Workshop', date: 'Oct 22, 2024', attendees: 28, icon: Briefcase },
                { title: 'NTA Partner Ecosystem Mixer', date: 'Nov 05, 2024', attendees: 60, icon: Award }
              ].map((ev, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">{ev.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{ev.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-white">{ev.attendees}</span>
                    <p className="text-xs text-slate-500">RSVPs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Economic Insights */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-400" /> Economic Development Insights
            </h3>
            <div className="space-y-6">
              <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <h4 className="font-semibold text-indigo-300 mb-2">High Demand: Automation Tools</h4>
                <p className="text-sm text-slate-300 leading-relaxed">Local service businesses show a 40% month-over-month increase in adopting automated booking and follow-up systems to combat labor shortages.</p>
              </div>
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <h4 className="font-semibold text-emerald-300 mb-2">Visibility Gap Closing</h4>
                <p className="text-sm text-slate-300 leading-relaxed">Businesses engaged with NTA over 90 days show an average 65% improvement in their local SEO dominance score.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}