import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Activity, Map, Users, Brain, 
  MessageSquare, HeartHandshake, Calendar, FileText, 
  Mail, RefreshCw, BarChart2, Server, LayoutDashboard,
  ShieldCheck, ArrowRight
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import { useNTAData } from '@/lib/NTADataContext';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function NTADataHub() {
  const { data } = useNTAData();
  const [activeTab, setActiveTab] = useState('overview');

  const DATA_MODULES = [
    { id: 'profiles', name: 'Business Profiles', icon: Database, value: data.businessProfiles.length, label: 'Active Profiles' },
    { id: 'scores', name: 'Growth Scores', icon: BarChart2, value: data.growthScores.length, label: 'Scored Entities' },
    { id: 'stages', name: 'Growth Stages', icon: Activity, value: data.growthStages.length, label: 'Mapped Stages' },
    { id: 'roadmaps', name: 'Roadmaps', icon: Map, value: data.roadmaps.length, label: 'Generated' },
    { id: 'partners', name: 'Community Partners', icon: Users, value: data.communityPartners.length, label: 'Enrolled' },
    { id: 'learners', name: 'AI Learners', icon: Brain, value: data.aiLearners.length, label: 'Active Learners' },
    { id: 'discovery', name: 'Discovery Convos', icon: MessageSquare, value: data.discoveryConversations.length, label: 'Logged Sessions' },
    { id: 'relationships', name: 'Relationship Builder', icon: HeartHandshake, value: data.relationshipBuilderResults.length, label: 'Analyzed' },
  ];

  const INTEGRATION_MODULES = [
    { id: 'meeting', name: 'Meeting Scheduling', icon: Calendar, status: data.meetingScheduling.status, metric: 'N/A' },
    { id: 'pdf', name: 'PDF Generation', icon: FileText, status: data.pdfGeneration.status, metric: `${data.pdfGeneration.queue} in queue` },
    { id: 'email', name: 'Email Automation', icon: Mail, status: data.emailAutomation.status, metric: `${data.emailAutomation.pending} pending` },
    { id: 'crm', name: 'CRM Sync', icon: RefreshCw, status: data.crmSync.status, metric: 'Last sync: Just now' },
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      <SEOHead 
        title="NTA Data Hub™ | Internal Architecture"
        description="Centralized data routing and state management for the NTA Operating System."
      />
      <MarketingNav />

      {/* Internal Header */}
      <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                NTA Data Hub™
                <span className="bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                  Architecture
                </span>
              </h1>
              <p className="text-xs text-slate-400">Centralized Operating System Data Routing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              Infrastructure Protected
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="md:w-64 shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'data' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Database className="w-4 h-4" />
            Data Models
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'integrations' 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Integrations
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {(activeTab === 'overview' || activeTab === 'data') && (
            <section>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-1">Shared Data Architecture</h2>
                <p className="text-sm text-slate-400">Reusable state management ready for external API connections.</p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DATA_MODULES.map((mod, idx) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-colors group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                        <mod.icon className="w-5 h-5 text-slate-400" />
                      </div>
                      <span className="bg-slate-800 text-slate-300 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border border-slate-700">
                        Model
                      </span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-slate-300 font-medium text-sm mb-1">{mod.name}</h3>
                      <div className="flex items-end gap-2 text-white font-bold text-2xl">
                        {mod.value}
                        <span className="text-xs text-slate-500 font-normal mb-1">{mod.label}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'overview' || activeTab === 'integrations') && (
            <section className="pt-4">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-1">Infrastructure Integrations</h2>
                <p className="text-sm text-slate-400">Placeholder interfaces mapped to core system utilities.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {INTEGRATION_MODULES.map((mod, idx) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                        <mod.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">{mod.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{mod.metric}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${mod.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <span className="text-xs font-medium text-slate-400 capitalize">{mod.status}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    <SiteFooter />
    </div>
  );
}