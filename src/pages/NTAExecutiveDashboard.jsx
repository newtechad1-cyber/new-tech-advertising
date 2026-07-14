import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell
} from 'recharts';
import { 
  Activity, Target, Compass, Users, Map, Calendar, Briefcase, Zap, 
  LineChart as LineChartIcon, FileText, ChevronRight, Award, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';
import { base44 } from '@/api/base44Client';

export default function NTAExecutiveDashboard() {
  
  // Placeholder API hook for future implementation
  // const { data: metrics, isLoading } = useQuery({
  //   queryKey: ['execMetrics'],
  //   queryFn: async () => await base44.functions.invoke('getExecutiveDashboardMetrics')
  // });

  // Placeholder Data
  const metrics = {
    totalConversations: 142,
    roadmapsGenerated: 89,
    meetingsScheduled: 34,
    avgScore: 48,
    communityPartners: 15,
    aiLearners: 210,
    relationshipBuilders: 56
  };

  const stageData = [
    { name: 'Discover', businesses: 120 },
    { name: 'Build', businesses: 85 },
    { name: 'Grow', businesses: 150 },
    { name: 'Lead', businesses: 40 },
    { name: 'Connect', businesses: 60 },
    { name: 'Elevate', businesses: 25 },
  ];

  const trendData = [
    { name: 'Week 1', roadmaps: 12, meetings: 4 },
    { name: 'Week 2', roadmaps: 19, meetings: 7 },
    { name: 'Week 3', roadmaps: 15, meetings: 5 },
    { name: 'Week 4', roadmaps: 25, meetings: 12 },
    { name: 'Week 5', roadmaps: 32, meetings: 15 },
  ];

  const activityFeed = [
    { id: 1, type: 'business', icon: <Briefcase className="w-4 h-4 text-blue-400"/>, title: 'New Business: Apex HVAC', time: '10 mins ago', desc: 'Completed Business Score (45/100)' },
    { id: 2, type: 'roadmap', icon: <Map className="w-4 h-4 text-emerald-400"/>, title: 'Roadmap Generated', time: '1 hour ago', desc: 'Stage: Grow. Priorities: Reviews, SEO.' },
    { id: 3, type: 'meeting', icon: <Calendar className="w-4 h-4 text-purple-400"/>, title: 'Discovery Meeting Booked', time: '2 hours ago', desc: 'Sarah Jenkins (Plumbing Co.)' },
    { id: 4, type: 'partner', icon: <Users className="w-4 h-4 text-amber-400"/>, title: 'New Community Partner', time: '5 hours ago', desc: 'Mason City Chamber of Commerce' },
    { id: 5, type: 'learning', icon: <Zap className="w-4 h-4 text-pink-400"/>, title: 'AI Learner Milestone', time: '1 day ago', desc: 'Jim (Roofing) finished 3 modules.' }
  ];

  const barColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

  return (
    <div className="bg-slate-950 text-slate-200 font-sans pb-24 selection:bg-blue-500/30">
      <SEOHead 
        title="Executive Dashboard™ | New Tech Advertising"
        description="Rick's command center for operational metrics."
      />
{/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">Executive Dashboard™</h1>
              <p className="text-xs text-slate-400">NTA Operational Command Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              Live Systems
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">

        {/* Top KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Discovery Conversations</h3>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><Compass className="w-4 h-4 text-blue-400"/></div>
            </div>
            <div className="text-3xl font-bold text-white">{metrics.totalConversations}</div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +12% this month</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Roadmaps Generated</h3>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Map className="w-4 h-4 text-emerald-400"/></div>
            </div>
            <div className="text-3xl font-bold text-white">{metrics.roadmapsGenerated}</div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +24% this month</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Meetings Scheduled</h3>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Calendar className="w-4 h-4 text-purple-400"/></div>
            </div>
            <div className="text-3xl font-bold text-white">{metrics.meetingsScheduled}</div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">From Roadmap Funnel</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 text-sm font-medium">Average Biz Score</h3>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Target className="w-4 h-4 text-amber-400"/></div>
            </div>
            <div className="text-3xl font-bold text-white">{metrics.avgScore}<span className="text-lg text-slate-500">/100</span></div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">Across all intakes</div>
          </motion.div>
        </div>

        {/* Secondary KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Community Partners</p>
              <div className="text-2xl font-bold text-white">{metrics.communityPartners}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><Users className="w-5 h-5 text-slate-300"/></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">AI Learners</p>
              <div className="text-2xl font-bold text-white">{metrics.aiLearners}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><Zap className="w-5 h-5 text-slate-300"/></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Relationship Builders</p>
              <div className="text-2xl font-bold text-white">{metrics.relationshipBuilders}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700"><Award className="w-5 h-5 text-slate-300"/></div>
          </motion.div>
        </div>

        {/* Charts & Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-8">
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-blue-400" /> Businesses by Growth Stage
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '12px' }}
                      cursor={{fill: '#1e293b'}}
                    />
                    <Bar dataKey="businesses" radius={[4, 4, 0, 0]}>
                      {stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" /> System Engagement Trends
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRoadmaps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="roadmaps" name="Roadmaps Generated" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRoadmaps)" />
                    <Area type="monotone" dataKey="meetings" name="Meetings Booked" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMeetings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>

          {/* Activity Feed Column */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-400" /> Live Feed
                </h3>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">Live</span>
              </div>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
                {activityFeed.map((activity, idx) => (
                  <div key={activity.id} className="relative flex items-start gap-4 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 text-white shadow shrink-0 z-10">
                      {activity.icon}
                    </div>
                    <div className="pt-1 w-full bg-slate-800/30 border border-slate-700/50 p-3 rounded-xl">
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h4 className="font-medium text-sm text-slate-200">{activity.title}</h4>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{activity.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{activity.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-3 text-sm font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/50 flex justify-center items-center gap-2">
                View All Activity <ChevronRight className="w-4 h-4"/>
              </button>
            </motion.div>
          </div>

        </div>
      </div>
</div>
  );
}