import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, UserPlus, Target, Map, ShieldAlert,
  MessageSquare, Brain, CreditCard, Cpu, CheckSquare,
  Activity, ArrowRight, Settings, BarChart, Eye, Search, Filter
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function RickAdminCenter() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
      <SEOHead 
        title="Rick Admin Center™ | NTA Operating System"
        description="Internal command center for operations and support."
      />
      <MarketingNav />

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6">
                <ShieldAlert className="w-3 h-3" /> Internal Command Center
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Rick Admin Center™
              </h1>
              <p className="text-xl text-slate-400">
                Operations, client support, and OS oversight.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search clients..." 
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors w-64"
                />
              </div>
              <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-300">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Level KPIs */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* New Leads */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">+3 Today</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">12</h3>
              <p className="text-sm text-slate-400">New Leads</p>
            </motion.div>

            {/* Active Clients */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">98% Retention</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">45</h3>
              <p className="text-sm text-slate-400">Active Clients</p>
            </motion.div>

            {/* Support Requests */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-500/20">
                  <MessageSquare className="w-5 h-5 text-rose-400" />
                </div>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md">2 Urgent</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">5</h3>
              <p className="text-sm text-slate-400">Open Tickets</p>
            </motion.div>

            {/* Tasks to Review */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                  <CheckSquare className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">Pending</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">8</h3>
              <p className="text-sm text-slate-400">Tasks To Review</p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Left Column (Wider) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Client Workspaces & Activity */}
              <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" /> Recent Workspace Activity
                  </h3>
                  <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { client: "Johnson Heating", action: "Updated Business Score", time: "2 hours ago", status: "Score: 72" },
                    { client: "Monson Plumbing", action: "Completed AI Module", time: "4 hours ago", status: "Module: Local SEO" },
                    { client: "Papa Everett's", action: "Requested Support", time: "5 hours ago", status: "Urgent" },
                    { client: "North Iowa Roofing", action: "Generated Growth Roadmap", time: "1 day ago", status: "Ready for Review" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors cursor-pointer group">
                      <div>
                        <h4 className="text-white font-medium group-hover:text-indigo-300 transition-colors">{item.client}</h4>
                        <p className="text-sm text-slate-400">{item.action}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 mb-1">{item.time}</div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-md inline-block ${
                          item.status === 'Urgent' ? 'bg-rose-500/10 text-rose-400' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* OS Oversight: Business Scores & Roadmaps */}
              <motion.div variants={fadeIn} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Business Scores</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                      <span className="text-slate-300">Awaiting Review</span>
                      <span className="text-indigo-400 font-bold">4</span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                      <span className="text-slate-300">Avg Score</span>
                      <span className="text-white font-bold">64/100</span>
                    </li>
                    <li className="flex justify-between items-center text-sm pt-1">
                      <span className="text-slate-300">Lowest Category</span>
                      <span className="text-rose-400 font-medium">Reputation</span>
                    </li>
                  </ul>
                  <button className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors">
                    Analyze Scores
                  </button>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                      <Map className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Growth Roadmaps</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                      <span className="text-slate-300">Active Roadmaps</span>
                      <span className="text-emerald-400 font-bold">32</span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                      <span className="text-slate-300">Pending Approvals</span>
                      <span className="text-white font-bold">5</span>
                    </li>
                    <li className="flex justify-between items-center text-sm pt-1">
                      <span className="text-slate-300">Completion Rate</span>
                      <span className="text-blue-400 font-medium">42%</span>
                    </li>
                  </ul>
                  <button className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors">
                    Review Roadmaps
                  </button>
                </div>
              </motion.div>

            </div>

            {/* Right Column (Narrower) */}
            <div className="space-y-6">
              
              {/* Partner Referrals */}
              <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" /> Partner Referrals
                </h3>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-4">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pending Partner Apps</div>
                  <div className="text-2xl font-bold text-white">3</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Mason City Chamber</span>
                    <span className="text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Local Marketing Co</span>
                    <span className="text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded">Reviewing</span>
                  </div>
                </div>
                <button className="text-sm text-amber-400 hover:text-amber-300 font-medium">Manage Partners &rarr;</button>
              </motion.div>

              {/* AI Learning Activity */}
              <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" /> AI Learning Activity
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Total Enrolled</span>
                      <span className="font-medium text-white">84</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Active Learners Today</span>
                      <span className="font-medium text-white">12</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="pt-2">
                     <span className="text-xs text-slate-500 block mb-2">Most Popular Course</span>
                     <span className="text-sm font-medium text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg inline-block">The Role of AI in Local Marketing</span>
                  </div>
                </div>
              </motion.div>

              {/* Infrastructure Placeholders */}
              <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
                 
                 <div className="p-4 border border-dashed border-slate-700 rounded-xl flex items-center gap-3 opacity-60">
                   <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                     <CreditCard className="w-4 h-4 text-slate-400" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-white">Payment Status</h4>
                     <p className="text-xs text-slate-500">Stripe Integration Pending</p>
                   </div>
                 </div>

                 <div className="p-4 border border-dashed border-slate-700 rounded-xl flex items-center gap-3 opacity-60">
                   <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                     <Cpu className="w-4 h-4 text-slate-400" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-white">Viktor Automation</h4>
                     <p className="text-xs text-slate-500">System Integration Pending</p>
                   </div>
                 </div>

              </motion.div>

            </div>
          </div>

        </div>
      </section>

    <SiteFooter />

    </div>
  );
}