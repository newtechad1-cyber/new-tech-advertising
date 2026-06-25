import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, ChevronUp, Map, Brain, Users, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function DigitalGrowthGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [memory, setMemory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setMemory(getJourneyMemory());
    }
  }, [isOpen, location.pathname]);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Context-aware logic to suggest related modules
  const getContextSuggestions = () => {
    const path = location.pathname;
    
    if (path.includes('/business-score')) {
      return [
        { title: 'Why take this?', desc: 'Discover your operational blind spots.', icon: Info, action: null },
        { title: 'Skip to Learning', desc: 'Jump directly into AI courses.', icon: Brain, action: '/ai-learning-center' }
      ];
    }
    if (path.includes('/learning') || path.includes('/ai-learning-center')) {
      return [
        { title: 'Need a roadmap?', desc: 'Generate a step-by-step personalized plan.', icon: Map, action: '/growth-roadmap-generator' }
      ];
    }
    if (path.includes('/roadmap')) {
      return [
        { title: 'Check Progress', desc: 'View your overall momentum.', icon: Compass, action: '/progress' }
      ];
    }

    // Default suggestions
    return [
      { title: 'Resume Journey', desc: 'Pick up exactly where you left off.', icon: Compass, action: '/my-growth-journey' },
      { title: 'Community Growth', desc: 'Connect and elevate your local network.', icon: Users, action: '/community-growth-conversation' }
    ];
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Your Digital Growth Guide™</h3>
              </div>
              <button onClick={toggleOpen} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-slate-300 leading-relaxed">
                I'm here to help you navigate the NTA Operating System. Based on your current view, here are a few things you can do next:
              </p>

              <div className="space-y-2">
                {getContextSuggestions().map((sug, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      if(sug.action) {
                        navigate(sug.action);
                        setIsOpen(false);
                      }
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${sug.action ? 'cursor-pointer border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all' : 'border-slate-800 bg-slate-900/50'}`}
                  >
                    <sug.icon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{sug.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{sug.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 relative"
      >
        {isOpen ? <ChevronUp className="w-6 h-6 rotate-180" /> : <Compass className="w-6 h-6" />}
      </button>
    </div>
  );
}