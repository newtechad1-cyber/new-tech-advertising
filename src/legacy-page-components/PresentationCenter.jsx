import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize, Link as LinkIcon, MonitorPlay, CheckCircle2, Presentation, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';

const presentations = [
  { id: 'business-growth', title: 'Business Growth Conversation™', desc: 'Core discovery presentation for new prospects evaluating their digital readiness.', route: '/growth-conversation', color: 'from-blue-600 to-cyan-600' },
  { id: 'community-growth', title: 'Community Growth Conversation™', desc: 'Ecosystem overview for partners, chambers, and local economic developers.', route: '/community-growth-conversation', color: 'from-purple-600 to-indigo-600' },
  { id: 'ai-learning', title: 'AI Learning Conversation™', desc: 'Educational flow demonstrating the transition from legacy marketing to AI growth systems.', route: '/ai-learning-center', color: 'from-amber-500 to-orange-600' },
  { id: 'relationship-builder', title: 'Relationship Builder™', desc: 'Trust-building module used early in the client lifecycle.', route: '/relationship-builder', color: 'from-rose-500 to-red-600' },
  { id: 'growth-navigator', title: 'Growth Navigator™', desc: 'Strategic routing engine recommending the next best steps.', route: '/operating-system', color: 'from-emerald-500 to-teal-600' },
  { id: 'business-score', title: 'Business Score™ Assessment', desc: 'Interactive scoring module for visibility, foundation, and adoption.', route: '/business-score', color: 'from-indigo-500 to-blue-600' },
  { id: 'operating-system', title: 'Operating System™ Overview', desc: 'High-level architectural view of the NTA platform capabilities.', route: '/operating-system', color: 'from-slate-600 to-slate-800' },
  { id: 'roadmap', title: 'Personalized Roadmap™', desc: 'Strategic 90-day to 12-month action plan presentation.', route: '/growth-roadmap-generator', color: 'from-violet-500 to-purple-600' },
];

export default function PresentationCenter() {
  const navigate = useNavigate();
  const [activePres, setActivePres] = useState(null);

  const handleLaunch = (route) => {
    // In a real app, this might trigger a fullscreen mode API before navigating
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead title="Presentation Center | NTA" description="Immersive meeting presentations and modules." />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
              <Presentation className="w-4 h-4" /> Presenter Mode Ready
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Presentation Center™</h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Launch immersive, full-screen interactive modules for client meetings and discovery sessions.
            </p>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <button className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Copy Direct Links
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((pres, idx) => (
            <motion.div
              key={pres.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-600 transition-all shadow-xl"
            >
              <div className={`h-32 bg-gradient-to-br ${pres.color} p-6 flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <MonitorPlay className="w-8 h-8 text-white/50 relative z-10" />
                <div className="relative z-10 flex justify-between items-end">
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Interactive Module</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{pres.title}</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">{pres.desc}</p>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleLaunch(pres.route)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Maximize className="w-4 h-4" /> Launch Fullscreen
                  </button>
                  <button 
                    onClick={() => setActivePres(pres)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-700"
                    title="View Details"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {activePres && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className={`h-24 bg-gradient-to-r ${activePres.color} relative`}>
                <button onClick={() => setActivePres(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-2">{activePres.title}</h2>
                <p className="text-slate-400 mb-6">{activePres.desc}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    Progress Tracking Enabled
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    Deep Linking Supported
                  </div>
                  <div className="p-3">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Direct Route</label>
                    <code className="text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg block font-mono text-sm border border-blue-500/20">
                      {activePres.route}
                    </code>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setActivePres(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition-colors">
                    Close
                  </button>
                  <button onClick={() => handleLaunch(activePres.route)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> Launch Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}