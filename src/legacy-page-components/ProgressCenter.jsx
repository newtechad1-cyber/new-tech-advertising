import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, CheckCircle, BarChart3, Users, Brain, Map } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import NextStepEngine from '@/components/recommendations/NextStepEngine';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function ProgressCenter() {
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    setMemory(getJourneyMemory());
  }, []);

  const calcPercentage = (val, max) => Math.min(100, Math.round((val / max) * 100));

  const score = memory?.businessScore?.score || 0;
  const learningCount = Object.keys(memory?.learningProgress || {}).length;
  const roadmapCount = memory?.roadmaps?.length || 0;
  const moduleCount = memory?.completedModules?.length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 flex flex-col">
      <SEOHead title="Progress Center™ | NTA" description="Track your digital growth progress." />
      <MarketingNav />
      
      <div className="max-w-7xl mx-auto px-6 py-12 pt-32 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Target className="w-4 h-4" /> Goal Tracking
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            Progress Center™
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-400">
            A visual overview of your momentum across the NTA Operating System. Every step forward is a step toward market leadership.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Main Score Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 bg-gradient-to-br from-blue-900/20 to-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Business Score™ Trend</h3>
              <div className="flex items-end gap-4 mt-6">
                <span className="text-6xl font-bold text-white">{score}</span>
                <span className="text-blue-400 font-medium pb-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Baseline Set
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-4">Your score determines your readiness for advanced AI integration.</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <BarChart3 className="w-48 h-48" />
            </div>
          </motion.div>

          {/* Overall OS Completion */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl">
            <h3 className="text-lg font-semibold text-slate-300 mb-6">OS Completion</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">Foundation Built</span>
                  <span className="text-emerald-400 font-bold">{score > 0 ? '100%' : '0%'}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 transition-all duration-1000 ${score > 0 ? 'w-full' : 'w-0'}`} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">AI Learning Progress</span>
                  <span className="text-blue-400 font-bold">{calcPercentage(learningCount, 12)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${calcPercentage(learningCount, 12)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">Module Mastery</span>
                  <span className="text-purple-400 font-bold">{calcPercentage(moduleCount, 5)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${calcPercentage(moduleCount, 5)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Learning Modules', value: learningCount, icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Roadmaps Created', value: roadmapCount, icon: Map, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Modules Completed', value: moduleCount, icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'Community Status', value: memory?.completedConversations?.includes('community_growth') ? 'Active' : 'Pending', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <NextStepEngine />
      </div>
      <SiteFooter />
    </div>
  );
}