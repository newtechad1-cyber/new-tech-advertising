import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Activity, CheckCircle, Brain, Users, Award, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import NextStepEngine from '@/components/recommendations/NextStepEngine';
import { getJourneyMemory } from '@/lib/journeyMemory';
import { Link } from 'react-router-dom';

export default function BusinessProfile() {
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    setMemory(getJourneyMemory());
  }, []);

  const score = memory?.businessScore?.score || 0;
  const stage = memory?.businessScore?.stage || 'Getting Started';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <SEOHead title="Business Profile™ | NTA" description="Your business profile within the NTA Operating System." />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <Building2 className="w-4 h-4" /> API-Ready Profile
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold text-white mb-2">
              Business Profile™
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-400">
              Your centralized business identity across the NTA Operating System.
            </motion.p>
          </div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Business Score™</p>
              <p className="text-2xl font-bold text-white">{score > 0 ? score : '--'}/100</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {/* Core Info */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-6">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Industry</p>
                  <p className="text-white font-medium">{memory?.industry || 'Not Specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Growth Stage</p>
                  <p className="text-white font-medium capitalize">{stage}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Role</p>
                  <p className="text-white font-medium capitalize">{memory?.visitor?.role || 'Business Owner'}</p>
                </div>
              </div>
              <Link to="/business-score" className="mt-6 block text-center py-2 text-sm text-blue-400 hover:text-blue-300 font-medium">Update Information</Link>
            </div>

            {/* Community Connections */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Community</h3>
              </div>
              {memory?.completedConversations?.includes('community_growth') ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Partner Connected
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Not connected to community programs.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {/* Activity & Progress */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-6">Operating System Progress</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-800 rounded-xl bg-slate-950 hover:bg-slate-900 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">AI Learning</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-4">{Object.keys(memory?.learningProgress || {}).length} Lessons</p>
                </div>
                
                <div className="p-4 border border-slate-800 rounded-xl bg-slate-950 hover:bg-slate-900 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">Roadmaps</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-4">{memory?.roadmaps?.length || 0} Generated</p>
                </div>
                
                <div className="p-4 border border-slate-800 rounded-xl bg-slate-950 hover:bg-slate-900 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">Modules</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-4">{memory?.completedModules?.length || 0} Completed</p>
                </div>
              </div>
            </div>
            
            {/* Next Steps Inline */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming Recommendations</h3>
              <p className="text-sm text-slate-400 mb-6">Based on your API-ready profile, these are your top priorities.</p>
              <div className="-mx-6 border-t border-slate-800 pt-6">
                <NextStepEngine />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}