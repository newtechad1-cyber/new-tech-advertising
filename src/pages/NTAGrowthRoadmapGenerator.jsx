import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Lock, Calendar, Target, Map, 
  ShieldAlert, Cpu, Users, ArrowRight, CheckCircle2, TrendingUp, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';
import NextStepEngine from '@/components/recommendations/NextStepEngine';

export default function NTAGrowthRoadmapGenerator() {
  // Record this step in memory
  React.useEffect(() => {
    import('@/lib/journeyMemory').then(({ addRoadmap }) => {
       addRoadmap({ type: 'digital_strategy', date: new Date().toISOString() });
    });
  }, []);

  // Reusable state holding all roadmap data for future PDF generation & API sync
  const [roadmapData] = useState({
    businessName: "Sample Business LLC",
    growthStage: "Build",
    overallScore: 42,
    audienceType: "Local Business Owner",
    dateGenerated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    priorities: [
      "Establish foundational digital trust across key local directories.",
      "Fix inconsistent business listings and claim missing profiles.",
      "Launch an automated review capture system to build reputation."
    ],
    recommendedModules: [
      { name: "NTA Business Score™", status: "Completed", icon: <Target className="w-5 h-5"/> },
      { name: "Growth Roadmap™", status: "Current", icon: <Map className="w-5 h-5"/> },
      { name: "Visibility Audit™", status: "Next Step", icon: <ShieldAlert className="w-5 h-5"/> },
      { name: "Relationship Builder™", status: "Upcoming", icon: <Users className="w-5 h-5"/> }
    ],
    actionPlan90: [
      {
        month: "Month 1: Foundation",
        tasks: [
          "Claim and optimize Google Business Profile.",
          "Standardize Name, Address, Phone (NAP) across top 50 directories.",
          "Ensure website meets basic mobile and speed compliance."
        ]
      },
      {
        month: "Month 2: Trust & Reputation",
        tasks: [
          "Implement automated SMS review requests for new customers.",
          "Draft initial 'Founder Story' messaging for social proof.",
          "Connect core analytics to track baseline traffic."
        ]
      },
      {
        month: "Month 3: Content Baseline",
        tasks: [
          "Publish 3 foundational SEO service pages.",
          "Launch basic social media presence (2 posts/week).",
          "Conduct first 90-day review and strategy adjustment."
        ]
      }
    ],
    vision6Month: "Transition from unpredictable word-of-mouth to a reliable, search-driven lead engine with a self-sustaining review capture system.",
    vision12Month: "Become the undisputed market leader in your local service category, completely automating foundational relationship building and lead nurturing.",
    opportunities: {
      community: {
        title: "Community Partner Integrations",
        desc: "Partner with the local Chamber of Commerce to cross-promote services and leverage their domain authority."
      },
      ai: {
        title: "AI & Automation",
        desc: "Deploy an AI-powered conversational agent to capture after-hours leads and answer common service questions automatically."
      },
      relationship: {
        title: "Relationship Nurturing",
        desc: "Implement a VIP customer follow-up sequence to encourage repeat business and high-value referrals."
      }
    }
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans pb-24 selection:bg-blue-500/30">
      <SEOHead 
        title="Personalized Growth Roadmap™ | New Tech Advertising"
        description="Your strategic plan for digital business growth."
      />

      {/* Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Map className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">Growth Roadmap™</h1>
              <p className="text-xs text-slate-400">For {roadmapData.businessName}</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700">
              <Download className="w-4 h-4" /> Download Public Version
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Lock className="w-4 h-4" /> Unlock Full Roadmap
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-12">
        {/* Executive Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Strategic Growth Plan</h2>
          <p className="text-xl text-slate-400">Generated on {roadmapData.dateGenerated} based on your discovery data and business maturity profile.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Core Metrics & Priorities */}
          <div className="lg:col-span-1 space-y-8">
            {/* Score & Stage Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div className="mb-8 text-center">
                <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">Overall Score</p>
                <div className="text-7xl font-black text-white mb-2 tracking-tighter">
                  {roadmapData.overallScore}<span className="text-3xl text-slate-600">/100</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" /> Stage: {roadmapData.growthStage}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Top 3 Priorities</p>
                <ul className="space-y-4">
                  {roadmapData.priorities.map((priority, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                      <div className="mt-0.5 flex-shrink-0"><CheckCircle2 className="w-5 h-5 text-blue-400" /></div>
                      {priority}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Recommended Modules */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-slate-400" /> System Modules
              </h3>
              <div className="space-y-3">
                {roadmapData.recommendedModules.map((mod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400">{mod.icon}</div>
                      <span className="text-slate-200 font-medium text-sm">{mod.name}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      mod.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      mod.status === 'Current' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Timeline & Strategy */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 90 Day Action Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-400" /> 90-Day Action Plan
              </h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                {roadmapData.actionPlan90.map((phase, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {idx + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <h4 className="font-bold text-white mb-3 text-lg">{phase.month}</h4>
                      <ul className="space-y-2">
                        {phase.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="text-slate-400 text-sm flex gap-2">
                            <span className="text-blue-400 mt-1">•</span> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Long Term Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-4">6-Month Vision</h4>
                <p className="text-slate-200 text-lg leading-relaxed">{roadmapData.vision6Month}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-3xl p-8 shadow-xl">
                <h4 className="text-blue-400 uppercase tracking-widest text-xs font-bold mb-4">12-Month Vision</h4>
                <p className="text-white text-lg font-medium leading-relaxed">{roadmapData.vision12Month}</p>
              </div>
            </motion.div>

            {/* Opportunities */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-white mb-8">Strategic Opportunities</h3>
              <div className="grid md:grid-cols-3 gap-6">
                
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">{roadmapData.opportunities.community.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{roadmapData.opportunities.community.desc}</p>
                </div>

                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">{roadmapData.opportunities.ai.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{roadmapData.opportunities.ai.desc}</p>
                </div>

                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-5 h-5 text-amber-400" />
                  </div>
                  <h4 className="text-white font-bold mb-2">{roadmapData.opportunities.relationship.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{roadmapData.opportunities.relationship.desc}</p>
                </div>

              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Actions */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-12 bg-blue-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 mix-blend-multiply"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to execute this roadmap?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Stop guessing and start growing. Discuss this exact plan with an NTA Guide and see how our operating system brings it to life.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                to="/book-call" 
                className="bg-white text-blue-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-100 transition-colors w-full sm:w-auto inline-flex justify-center items-center gap-2"
              >
                Schedule Discovery Meeting <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-blue-800/50 border border-blue-400/30 text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-800/80 transition-colors w-full sm:w-auto inline-flex justify-center items-center gap-2">
                <Lock className="w-5 h-5" /> Unlock Full Roadmap
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Download/Unlock (Visible only on small screens) */}
        <div className="md:hidden flex flex-col gap-3 mt-8">
          <button className="flex justify-center items-center gap-2 text-sm font-medium text-slate-300 bg-slate-800 px-4 py-3 rounded-xl border border-slate-700">
            <Download className="w-4 h-4" /> Download Public Version
          </button>
        </div>

      </div>
      
      <NextStepEngine />
    </div>
  );
}