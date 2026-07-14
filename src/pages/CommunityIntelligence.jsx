import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Activity, TrendingUp, Users, Target, Zap, Globe, 
  Calendar, ArrowUpRight, BarChart2, ShieldCheck, MapPin, Briefcase
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

// Placeholder Datasets
const growthData = [
  { month: 'Jan', revenue: 4000, searches: 2400 },
  { month: 'Feb', revenue: 3000, searches: 1398 },
  { month: 'Mar', revenue: 2000, searches: 9800 },
  { month: 'Apr', revenue: 2780, searches: 3908 },
  { month: 'May', revenue: 1890, searches: 4800 },
  { month: 'Jun', revenue: 2390, searches: 3800 },
  { month: 'Jul', revenue: 3490, searches: 4300 },
];

const adoptionData = [
  { industry: 'Retail', ai: 45, traditional: 55 },
  { industry: 'Services', ai: 70, traditional: 30 },
  { industry: 'Health', ai: 25, traditional: 75 },
  { industry: 'Food', ai: 40, traditional: 60 },
  { industry: 'Real Estate', ai: 60, traditional: 40 },
];

const scoreDistribution = [
  { name: 'Leader (80-100)', value: 15, color: '#10b981' },
  { name: 'Growing (60-79)', value: 35, color: '#3b82f6' },
  { name: 'Emerging (40-59)', value: 30, color: '#f59e0b' },
  { name: 'At Risk (<40)', value: 20, color: '#ef4444' },
];

const communityEvents = [
  { id: 1, title: 'AI for Local Retailers Workshop', date: 'Oct 15, 2025', location: 'Chamber of Commerce', attendees: 45 },
  { id: 2, title: 'Digital Readiness Summit', date: 'Nov 02, 2025', location: 'Virtual', attendees: 120 },
  { id: 3, title: 'Partner Networking Mixer', date: 'Nov 18, 2025', location: 'Downtown Hub', attendees: 30 }
];

export default function CommunityIntelligence() {
  const [activeRegion, setActiveRegion] = useState('All Regions');
  const regions = ['All Regions', 'North Iowa', 'Southern MN', 'Des Moines Area'];

  return (
    <div className="bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <SEOHead 
        title="Community Intelligence Center™ | NTA"
        description="Monitor the health, digital readiness, and growth trends of your local business ecosystem."
      />
{/* Header */}
      <header className="relative py-16 border-b border-slate-800/50 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                <Globe className="w-4 h-4" />
                Ecosystem Monitoring
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Community Intelligence Center™
              </h1>
              <p className="text-slate-400 max-w-xl text-lg">
                Real-time insights into the digital readiness, AI adoption, and growth trajectory of local businesses.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
              {regions.map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeRegion === region 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Ecosystem Health Score', value: '64/100', trend: '+4.2%', icon: Activity, color: 'text-emerald-400' },
            { label: 'AI Adoption Rate', value: '38%', trend: '+12.5%', icon: Zap, color: 'text-indigo-400' },
            { label: 'Active Businesses', value: '1,245', trend: '+2.1%', icon: Briefcase, color: 'text-blue-400' },
            { label: 'Community Partners', value: '42', trend: '+5.0%', icon: Users, color: 'text-purple-400' }
          ].map((kpi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 ${kpi.color}`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3" /> {kpi.trend}
                </div>
              </div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">{kpi.label}</h3>
              <div className="text-3xl font-bold text-white">{kpi.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white">Digital Visibility Trends</h3>
                <p className="text-sm text-slate-400">Aggregated search impressions vs conversion events</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Area type="monotone" dataKey="searches" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorSearches)" name="Local Searches" />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Conversion Events" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Business Score Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Business Score™ Spread</h3>
            <p className="text-sm text-slate-400 mb-6">Distribution across the ecosystem</p>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#f1f5f9' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {scoreDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div className="text-sm text-slate-300">
                      <span className="font-medium text-white block">{item.value}%</span>
                      {item.name.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Adoption by Industry */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-white mb-2">AI Adoption by Industry</h3>
            <p className="text-sm text-slate-400 mb-8">Percentage of businesses utilizing AI systems</p>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adoptionData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="industry" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <RechartsTooltip 
                    cursor={{fill: '#1e293b', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  />
                  <Bar dataKey="ai" name="AI Adopters (%)" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                  <Bar dataKey="traditional" name="Traditional (%)" fill="#334155" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Community Events & Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Community Engagement</h3>
              <button className="text-sm font-medium text-blue-400 hover:text-blue-300">View Calendar</button>
            </div>
            
            <div className="space-y-4 flex-1">
              {communityEvents.map(event => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-2xl transition-colors">
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-700 shrink-0">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">{event.date.split(' ')[0]}</span>
                      <span className="text-lg font-bold text-white leading-none">{event.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200">{event.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.attendees} Registered</span>
                      </div>
                    </div>
                  </div>
                  <button className="sm:ml-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto">
                    RSVP
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Next Partner Briefing:</span>
                <span className="font-medium text-white flex items-center gap-1"><Calendar className="w-4 h-4 text-blue-400" /> Friday, 2:00 PM</span>
              </div>
            </div>
          </div>
        </div>

      </main>
</div>
  );
}