import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Download, Lock, Calendar, Target, 
  Layers, Users, Brain, MessageSquare, Compass, BarChart, CheckCircle2, Zap
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function GrowthRoadmapGenerator() {
  // In a real flow, this data would be populated from Context or a backend store
  // based on the user's inputs in Growth Navigator and Business Score.
  const [roadmapData] = useState({
    businessScore: 68,
    growthStage: 'Grow',
    audienceType: 'Business Owner',
    topPriorities: [
      'Establish a high-converting website foundation',
      'Automate customer review generation',
      'Create a consistent local content strategy'
    ],
    recommendedModules: [
      { name: 'Website Architecture', icon: Layers },
      { name: 'Reputation Management', icon: MessageSquare },
      { name: 'Local SEO System', icon: Target }
    ],
    actionPlan90: [
      'Launch foundational digital assets',
      'Implement basic CRM tracking',
      'Start local visibility campaign'
    ],
    vision6Month: 'Predictable lead generation from local search and clear visibility across primary channels.',
    vision12Month: 'Recognized as a market leader with automated follow-ups and strong community presence.',
    opportunities: {
      community: 'Partner with 2 local organizations to run co-marketing campaigns.',
      ai: 'Implement AI chat for instant lead capture and FAQ responses.',
      relationship: 'Set up an automated past-customer re-engagement sequence.'
    }
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden pt-24 pb-20">
      <SEOHead 
        title="Personalized Growth Roadmap™ | New Tech Advertising"
        description="Your strategic plan for digital business growth."
      />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-sm font-medium tracking-wide uppercase mb-6 shadow-xl">
            <Compass className="w-4 h-4" /> Personalized Plan
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Your Growth Roadmap™
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Based on your discovery profile, here is the clear, sequential path to build your digital foundation and increase your market leadership.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column - Core Metrics */}
          <div className="md:col-span-4 space-y-8">
            <motion.div 
              initial="hidden" animate="visible" variants={fadeIn}
              className="bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Score</h3>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-6xl font-bold text-white">{roadmapData.businessScore}</span>
                <span className="text-xl text-slate-400 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-4">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${roadmapData.businessScore}%` }}></div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden" animate="visible" variants={fadeIn}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8"
            >
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Current Stage</h3>
              <div className="text-3xl font-bold text-blue-400 mb-6">{roadmapData.growthStage}</div>
              
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Audience Type</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200">
                <Users className="w-4 h-4 text-slate-400" /> {roadmapData.audienceType}
              </div>
            </motion.div>

            {/* Opportunities (Community, AI, Relationship) */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeIn}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" /> Key Opportunities
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-blue-400 mb-2 font-medium">
                    <Users className="w-4 h-4" /> Community
                  </div>
                  <p className="text-sm text-slate-400">{roadmapData.opportunities.community}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 mb-2 font-medium">
                    <Brain className="w-4 h-4" /> Artificial Intelligence
                  </div>
                  <p className="text-sm text-slate-400">{roadmapData.opportunities.ai}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 mb-2 font-medium">
                    <MessageSquare className="w-4 h-4" /> Relationships
                  </div>
                  <p className="text-sm text-slate-400">{roadmapData.opportunities.relationship}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Strategy */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Top Priorities */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeIn}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Top Three Priorities</h3>
              <div className="space-y-4">
                {roadmapData.topPriorities.map((priority, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-lg text-slate-200 mt-1">{priority}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeIn}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" /> Strategic Timeline
              </h3>
              
              <div className="relative pl-8 space-y-10 before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                
                {/* 90 Day */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-slate-500 group-[.is-active]:text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-[-2.5rem] md:left-1/2 md:top-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">90-Day Action Plan</h4>
                    <ul className="space-y-2">
                      {roadmapData.actionPlan90.map((item, i) => (
                        <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 6 Month */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-[-2.5rem] md:left-1/2 md:top-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                    <h4 className="font-bold text-white mb-2">6-Month Vision</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{roadmapData.vision6Month}</p>
                  </div>
                </div>

                {/* 12 Month */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 absolute left-[-2.5rem] md:left-1/2 md:top-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                    <h4 className="font-bold text-white mb-2">12-Month Vision</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{roadmapData.vision12Month}</p>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Recommended Modules */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeIn}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Recommended NTA Modules</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {roadmapData.recommendedModules.map((mod, index) => (
                  <div key={index} className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl text-center">
                    <div className="w-12 h-12 mx-auto bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                      <mod.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-slate-200 font-medium text-sm">{mod.name}</h4>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeIn}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 pt-12 border-t border-slate-800/50"
        >
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors border border-slate-700">
            <Download className="w-5 h-5 text-slate-400" /> Download Public Version
          </button>
          
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors border border-slate-700">
            <Lock className="w-5 h-5 text-amber-400" /> Unlock Full Roadmap
          </button>

          <Link to="/book-call" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-blue-500/25">
            Schedule Discovery Meeting <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}