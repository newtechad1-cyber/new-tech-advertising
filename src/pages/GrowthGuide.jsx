import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Target, Activity, Map, ArrowRight, LayoutDashboard, CheckCircle2, RotateCcw, Briefcase } from 'lucide-react';

export default function GrowthGuide() {
  const navigate = useNavigate();
  
  // State is preserved in localStorage
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('nta_growth_guide_state');
    return saved ? JSON.parse(saved) : { step: 0, name: '', audience: '', challenge: '' };
  });

  useEffect(() => {
    localStorage.setItem('nta_growth_guide_state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetGuide = () => {
    if(window.confirm("Are you sure you want to reset your guided journey?")) {
        setState({ step: 0, name: '', audience: '', challenge: '' });
    }
  };

  const steps = [
    { id: 0, title: 'Welcome' },
    { id: 1, title: 'Introduction' },
    { id: 2, title: 'Your Role' },
    { id: 3, title: 'Your Focus' },
    { id: 4, title: 'Your Path' }
  ];

  const audienceOptions = [
    { id: 'business', title: 'Local Business Owner', desc: 'I run a local service or retail business', icon: Target },
    { id: 'community', title: 'Community Partner', desc: 'Chamber of commerce, economic development, or network leader', icon: Map },
    { id: 'agency', title: 'Agency / Consultant', desc: 'I help other businesses with marketing', icon: Briefcase }
  ];

  const challengeOptions = [
    { id: 'visibility', title: 'We need more visibility and consistent leads', desc: 'Getting found online is our biggest hurdle' },
    { id: 'foundation', title: 'Our digital presence feels outdated', desc: 'We need a modern website and better reputation' },
    { id: 'community', title: 'I want to help my network grow', desc: 'Looking for tools to support local businesses' },
    { id: 'explore', title: 'Just exploring', desc: "Seeing what the Operating System has to offer" }
  ];

  const RecommendationCard = ({ title, description, icon: Icon, path }) => (
    <div onClick={() => navigate(path)} className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 hover:bg-slate-800/80 cursor-pointer transition-all group shadow-lg flex flex-col h-full">
      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 flex-1">{description}</p>
      <div className="flex items-center text-blue-400 text-sm font-bold group-hover:text-blue-300">
        <span>Launch Module</span>
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return (
          <motion.div 
            key="step-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl"
          >
            <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Compass className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Welcome to Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Digital Growth Guide™</span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl">
              I'm here to help you understand where your business is today and guide you toward your next right step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => updateState({step: 1})} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/20">
                <span>Start My Guided Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/operating-system')} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all text-center">
                I'd Rather Explore The Operating System
              </button>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            key="step-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Let's start with an introduction.</h2>
            <p className="text-xl text-slate-400 mb-10">What should I call you?</p>
            <input 
              type="text" 
              autoFocus 
              value={state.name} 
              onChange={(e) => updateState({name: e.target.value})} 
              onKeyDown={(e) => e.key === 'Enter' && state.name.trim() && updateState({step: 2})}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-6 py-5 text-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all mb-8 shadow-inner" 
              placeholder="Your first name" 
            />
            <button 
              onClick={() => updateState({step: 2})} 
              disabled={!state.name.trim()} 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Nice to meet you, {state.name}.</h2>
            <p className="text-xl text-slate-400 mb-10">To make sure I point you in the right direction, tell me a bit about your role.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {audienceOptions.map(opt => (
                <div 
                  key={opt.id} 
                  onClick={() => updateState({ audience: opt.id, step: 3 })}
                  className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-blue-500 hover:bg-slate-800 cursor-pointer transition-all group text-left shadow-lg"
                >
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-5 text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <opt.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{opt.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{opt.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">What is the primary challenge you're facing right now?</h2>
            <p className="text-xl text-slate-400 mb-10">This helps me recommend the most relevant tools for you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {challengeOptions.map(opt => (
                <div 
                  key={opt.id} 
                  onClick={() => updateState({ challenge: opt.id, step: 4 })}
                  className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-blue-500 hover:bg-slate-800 cursor-pointer transition-all group text-left shadow-lg"
                >
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{opt.title}</h3>
                  <p className="text-sm text-slate-400">{opt.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl w-full"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Here is your recommended path forward.</h2>
            <p className="text-xl text-slate-400 mb-10">Based on what you've shared, I've organized the most valuable modules for you to explore.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <RecommendationCard 
                title={state.audience === 'community' ? "Community Growth Conversation" : "NTA Growth Conversation"}
                description="An interactive discovery session tailored to your focus to help identify precise gaps."
                icon={Compass}
                path={state.audience === 'community' ? "/community-growth-conversation" : "/growth-conversation"}
              />
              <RecommendationCard 
                title="NTA Business Score™"
                description="Evaluate your current operations across six categories and uncover blind spots."
                icon={Activity}
                path="/business-score"
              />
              <RecommendationCard 
                title="Growth Roadmap Generator™"
                description="Create a step-by-step personalized digital strategy document for your business."
                icon={Map}
                path="/growth-roadmap-generator"
              />
              <RecommendationCard 
                title="NTA Operating System™"
                description="Access your central command center to monitor, learn, and deploy resources."
                icon={LayoutDashboard}
                path="/operating-system"
              />
            </div>
            
            <div className="p-5 bg-blue-900/20 border border-blue-800/50 rounded-xl flex items-start space-x-4 max-w-3xl">
              <CheckCircle2 className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-white font-bold mb-1">Your progress is safely stored</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You can always return to <strong className="text-white">Your Digital Growth Guide™</strong> to find your next step. We'll remember where you left off.
                </p>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-50 font-sans absolute inset-0 z-50 overflow-hidden">
      
      {/* Sidebar / Timeline */}
      <div className="hidden md:flex w-80 bg-slate-900/30 border-r border-slate-800/50 p-8 flex-col shrink-0 z-10 backdrop-blur-xl">
        <div className="flex items-center space-x-3 mb-16 mt-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Compass className="text-blue-400 w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xl text-white">NTA Guide™</span>
        </div>
        
        <div className="space-y-10 relative flex-1">
          <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-slate-800/50 z-0"></div>
          
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center space-x-5 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                state.step > s.id 
                  ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                  : state.step === s.id 
                    ? 'bg-slate-950 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                    : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}>
                {state.step > s.id ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`font-semibold tracking-wide transition-colors duration-300 ${
                state.step >= s.id ? 'text-white' : 'text-slate-600'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto pb-4">
          <button 
            onClick={resetGuide} 
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Journey</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-6 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <Compass className="text-blue-400 w-5 h-5" />
            <span className="font-heading font-bold text-lg text-white">NTA Guide™</span>
          </div>
          <button onClick={resetGuide} className="text-slate-500 hover:text-white">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 relative z-10">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}