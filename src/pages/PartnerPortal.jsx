import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, DollarSign, Briefcase, FileText, BookOpen, 
  Map, Video, Calendar, ArrowUpRight, Award, ChevronRight, 
  Download, ExternalLink, Activity, BarChart, Target, Zap, LayoutDashboard, Brain
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import NextStepEngine from '@/components/recommendations/NextStepEngine';

export default function PartnerPortal() {
  const [activeTab, setActiveTab] = useState('overview');

  // Placeholder Data Structures for Future CRM Integration
  const partnerData = {
    name: "North Iowa Chamber of Commerce",
    type: "Community Partner",
    joinDate: "2024-02-15",
    tier: "Strategic Alliance",
    metrics: {
      activeBusinesses: 14,
      totalReferrals: 32,
      pendingMeetings: 5,
      totalCommissions: 4250,
      thisMonthCommissions: 850
    }
  };

  const businesses = [
    { id: 1, name: "Apex HVAC Services", stage: "Grow", score: 68, status: "Active Client", joined: "Oct 2024", roadmap: "Available" },
    { id: 2, name: "River City Dental", stage: "Build", score: 45, status: "Roadmap Delivered", joined: "Nov 2024", roadmap: "Available" },
    { id: 3, name: "Downtown Cafe", stage: "Discover", score: 32, status: "Meeting Scheduled", joined: "Dec 2024", roadmap: "Pending" },
    { id: 4, name: "Main Street Boutique", stage: "Lead", score: 85, status: "Active Client", joined: "Jan 2025", roadmap: "Available" }
  ];

  const recentActivity = [
    { id: 1, type: 'referral', text: 'New referral submitted: Main Street Boutique', date: '2 days ago', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 2, type: 'commission', text: 'Commission payout processed ($850)', date: '1 week ago', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 3, type: 'roadmap', text: 'Roadmap generated for River City Dental', date: '2 weeks ago', icon: Map, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 4, type: 'meeting', text: 'Discovery meeting completed with Apex HVAC', date: '3 weeks ago', icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' }
  ];

  const resources = [
    { title: 'Partner Success Playbook', type: 'PDF Guide', size: '2.4 MB', icon: BookOpen },
    { title: 'Digital Growth Presentation Deck', type: 'Slide Deck', size: '15.1 MB', icon: FileText },
    { title: 'Email Outreach Templates', type: 'Swipe File', size: '1.2 MB', icon: FileText },
    { title: 'NTA Operating System Overview', type: 'Video Training', size: '12 Min', icon: Video }
  ];

  const trainingModules = [
    { title: 'AI Learning Conversation™ Guide', status: 'Completed', length: '45 mins' },
    { title: 'Understanding the NTA Business Score™', status: 'In Progress', length: '30 mins' },
    { title: 'Presenting the Growth Roadmap™', status: 'Not Started', length: '60 mins' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'businesses', label: 'My Businesses', icon: Briefcase },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'training', label: 'Training Center', icon: Zap },
    { id: 'resources', label: 'Marketing Materials', icon: Download }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      <SEOHead 
        title="Community Partner Portal™ | New Tech Advertising"
        description="Dedicated workspace for NTA community partners and media representatives."
      />
{/* Top Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">Partner Portal™</h1>
              <p className="text-xs text-blue-400">{partnerData.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {partnerData.tier}
            </div>
            <Link to="/community-partner" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Program Details
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 border-r border-slate-800/50 p-6 space-y-2 shrink-0 md:h-[calc(100vh-73px)] md:sticky md:top-[73px] overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-8 mt-8 border-t border-slate-800/50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-4">Quick Actions</h3>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-all font-medium text-sm border border-slate-700 hover:border-slate-600 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              Submit Referral
            </button>
            <Link to="/book-call" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-all font-medium text-sm border border-slate-700 hover:border-slate-600">
              <Calendar className="w-4 h-4 text-purple-400" />
              Book Co-Meeting
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 pb-24 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeIn} className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {partnerData.name.split(' ')[0]}</h2>
                    <p className="text-slate-400">Here's a summary of your community impact and rewards.</p>
                  </div>
                </div>

                {/* Glassmorphism Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Businesses', value: partnerData.metrics.activeBusinesses, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Total Referrals', value: partnerData.metrics.totalReferrals, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Pending Meetings', value: partnerData.metrics.pendingMeetings, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'This Month', value: `$${partnerData.metrics.thisMonthCommissions}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-colors">
                      <div className={`absolute top-0 right-0 p-4 opacity-20 ${stat.color}`}>
                        <stat.icon className="w-16 h-16 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 border border-white/5`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                      <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
                    </div>
                    <div className="space-y-6">
                      {recentActivity.map(act => (
                        <div key={act.id} className="flex gap-4">
                          <div className={`w-10 h-10 rounded-full ${act.bg} flex items-center justify-center shrink-0 border border-white/5`}>
                            <act.icon className={`w-4 h-4 ${act.color}`} />
                          </div>
                          <div>
                            <p className="text-slate-200 text-sm font-medium">{act.text}</p>
                            <p className="text-slate-500 text-xs mt-1">{act.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Resources */}
                  <div className="bg-gradient-to-b from-blue-900/20 to-slate-900/40 border border-blue-900/30 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Partner Toolout</h3>
                    <div className="space-y-4">
                      <Link to="/growth-conversation" className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700 transition-colors group">
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-slate-200">Start Growth Conversation</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </Link>
                      <Link to="/business-score" className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700 transition-colors group">
                        <div className="flex items-center gap-3">
                          <BarChart className="w-5 h-5 text-indigo-400" />
                          <span className="text-sm font-medium text-slate-200">Run Business Score™</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </Link>
                      <Link to="/community-growth-conversation" className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700 transition-colors group">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-purple-400" />
                          <span className="text-sm font-medium text-slate-200">Community Presentation</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* BUSINESSES TAB */}
            {activeTab === 'businesses' && (
              <motion.div key="businesses" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeIn} className="space-y-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">My Businesses</h2>
                    <p className="text-slate-400">Track the progress and health of your referred community members.</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg">
                    Add New Referral
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900/80 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Business Name</th>
                          <th className="px-6 py-4 font-semibold">Growth Stage</th>
                          <th className="px-6 py-4 font-semibold">Biz Score</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold">Roadmap</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 bg-slate-900/30">
                        {businesses.map(biz => (
                          <tr key={biz.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-white">{biz.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">Joined {biz.joined}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                                {biz.stage}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${biz.score > 60 ? 'text-emerald-400' : biz.score > 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                  {biz.score}
                                </span>
                                <span className="text-xs text-slate-500">/100</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-300">{biz.status}</td>
                            <td className="px-6 py-4">
                              {biz.roadmap === 'Available' ? (
                                <Link to="/growth-roadmap-generator" className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-md transition-colors">
                                  <Map className="w-3 h-3" /> View
                                </Link>
                              ) : (
                                <span className="text-xs text-slate-500 italic">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-slate-400 hover:text-white transition-colors p-2">
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TRAINING TAB */}
            {activeTab === 'training' && (
              <motion.div key="training" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Training Center</h2>
                  <p className="text-slate-400">Master the NTA Operating System™ to better serve your community.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* AI Learning Link */}
                  <div className="bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <Brain className="w-10 h-10 text-indigo-400 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">AI Learning Center</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">Access our full library of educational articles, videos, and guides designed for small businesses and partners.</p>
                    <Link to="/learning-center" className="inline-flex items-center justify-between w-full p-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-medium transition-colors group-hover:text-indigo-200">
                      Explore AI Resources <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Modules */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Partner Modules</h3>
                    <div className="space-y-4">
                      {trainingModules.map((mod, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                          <div>
                            <h4 className="font-medium text-slate-200 mb-1">{mod.title}</h4>
                            <span className="text-xs text-slate-500">{mod.length}</span>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                            mod.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                            mod.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {mod.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <motion.div key="resources" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Marketing Materials</h2>
                  <p className="text-slate-400">Assets and resources to help you introduce NTA to your network.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {resources.map((res, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 hover:border-slate-600 rounded-3xl p-6 transition-all group flex items-start justify-between cursor-pointer">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                          <res.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">{res.title}</h3>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="bg-slate-800 px-2 py-0.5 rounded">{res.type}</span>
                            <span>{res.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 text-slate-500 group-hover:text-blue-400 transition-colors bg-slate-800/50 group-hover:bg-blue-500/10 rounded-lg">
                        <Download className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* COMMISSIONS TAB (Placeholder) */}
            {activeTab === 'commissions' && (
              <motion.div key="commissions" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Commissions & Revenue</h2>
                  <p className="text-slate-400">Financial overview and history.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
                  <DollarSign className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-300 mb-2">Revenue Tracking System</h3>
                  <p className="text-slate-500 max-w-md mx-auto">Full commission tracking, payout history, and forecasting will be available here when your account connects to the billing system.</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
      <NextStepEngine />
</div>
  );
}