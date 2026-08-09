import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronRight, X, Compass, MapPin } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function NTAGrowthNavigator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({
    audience: '',
    situation: '',
    confidence: ''
  });

  const totalSteps = 7;

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    nextStep();
  };

  // Apple-style transition variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  // Logic to determine stage and module
  const getGrowthStage = () => {
    const { audience, situation } = answers;
    if (audience === "I want to learn how to use AI.") return "Discover";
    if (audience === "I represent a community organization." || 
        audience === "I'm exploring partnership opportunities." ||
        situation === "I want to help other businesses grow.") {
      return "Lead";
    }
    
    if (situation === "I need better follow-up with customers.") return "Connect";
    if (situation === "My website or online presence needs work.") return "Build";
    if (situation === "I need more visibility.") return "Grow";
    if (situation === "I'm not sure how to use AI.") return "Elevate";
    if (situation === "I need a clearer growth plan.") return "Discover";
    
    return "Discover"; // Default
  };

  const stageDescriptions = {
    "Discover": "You don't need to do everything at once. You need clarity about what matters first.",
    "Build": "You're ready to strengthen the foundation your growth depends on.",
    "Grow": "You're ready to become more visible and consistent in how customers find and understand you.",
    "Lead": "You're ready to use your position, influence, or relationships to help others grow.",
    "Connect": "You're ready to build stronger systems for staying connected with customers and your community.",
    "Elevate": "You're ready to move beyond basic marketing and begin operating with a more complete growth system."
  };

  const getRecommendedModule = () => {
    const stage = getGrowthStage();
    const { audience } = answers;

    if (audience === "I want to learn how to use AI.") {
      return {
        name: "AI Learning Conversation™",
        desc: "A guided journey into how AI impacts search and business visibility.",
        route: "/learning-center"
      };
    }

    if (stage === "Lead") {
      return {
        name: "Community Growth Conversation™",
        desc: "See how community partners are bringing value and education to local businesses.",
        route: "/community-growth-conversation"
      };
    }

    if (stage === "Connect") {
      return {
        name: "Relationship Builder™",
        desc: "Discover simple systems for managing referrals, reviews, and customer follow-up.",
        route: "/relationship-builder"
      };
    }

    if (stage === "Discover") {
      if (answers.situation === "I need a clearer growth plan.") {
        return {
          name: "NTA Business Score™",
          desc: "A business growth maturity assessment to show you exactly where to focus.",
          route: "/business-score"
        };
      }
      return {
        name: "Business Growth Conversation™",
        desc: "A step-by-step evaluation of your digital visibility, trust, and growth readiness.",
        route: "/growth-conversation"
      };
    }

    // Default for Build/Grow/Elevate
    return {
      name: "Growth Roadmap™",
      desc: "An actionable plan to improve your visibility, trust, and conversion systems.",
      route: "/free-audit"
    };
  };

  const stage = getGrowthStage();
  const recommendedModule = getRecommendedModule();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans overflow-hidden flex flex-col relative selection:bg-blue-500/30">
      <SEOHead 
        title="NTA Growth Navigator™ | New Tech Advertising"
        description="Find your exact next step in your digital growth journey."
      />

      {/* Progress Bar & Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1.5 bg-slate-900 w-full">
          <motion.div 
            className="h-full bg-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-xs">
              <Compass className="w-4 h-4" />
            </span>
            Growth Navigator™
          </div>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
            <X className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center relative px-6 mt-16 pb-24">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center"
          >
            {/* Step 0: Opening Screen */}
            {step === 0 && (
              <div className="max-w-3xl">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 bg-blue-900/30 border border-blue-500/30 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                >
                  <MapPin className="w-10 h-10 text-blue-400" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-8"
                >
                  Every Business Needs a <span className="text-blue-400">Next Right Step.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12"
                >
                  Most business owners don't struggle because they lack options. They struggle because the digital world gives them too many. The Growth Navigator™ helps turn confusion into direction.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
                  onClick={nextStep}
                  className="inline-flex items-center gap-3 bg-white text-slate-950 font-semibold px-8 py-4 rounded-full text-lg hover:bg-blue-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
                >
                  Start My Navigation <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* Step 1: Audience Selection */}
            {step === 1 && (
              <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">
                  Which path best describes you?
                </h2>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {[
                    "I own or manage a local business.",
                    "I represent a community organization.",
                    "I want to learn how to use AI.",
                    "I'm exploring partnership opportunities."
                  ].map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer('audience', opt)} 
                      className="w-full text-left p-6 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-xl text-slate-200 flex justify-between items-center group"
                    >
                      {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Current Situation */}
            {step === 2 && (
              <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">
                  Where do you feel most stuck right now?
                </h2>
                <div className="space-y-4 max-w-2xl mx-auto h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  {[
                    "I need more visibility.",
                    "My website or online presence needs work.",
                    "I'm not sure how to use AI.",
                    "I need better follow-up with customers.",
                    "I need a clearer growth plan.",
                    "I want to help other businesses grow.",
                    "I'm not sure yet."
                  ].map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer('situation', opt)} 
                      className="w-full text-left p-6 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-xl text-slate-200 flex justify-between items-center group flex-shrink-0"
                    >
                      {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Confidence Check */}
            {step === 3 && (
              <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">
                  How confident do you feel about your current digital growth direction?
                </h2>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {[
                    "Not confident",
                    "Somewhat confident",
                    "Confident, but need guidance",
                    "Very confident and ready to grow"
                  ].map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer('confidence', opt)} 
                      className="w-full text-left p-6 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-xl text-slate-200 flex justify-between items-center group"
                    >
                      {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Growth Stage Assignment */}
            {step === 4 && (
              <div className="max-w-3xl">
                <h3 className="text-xl text-slate-400 uppercase tracking-widest font-semibold mb-6">Discovery Complete</h3>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                  className="bg-slate-900 border border-slate-800 p-12 rounded-[3rem] shadow-2xl mb-10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 relative z-10">
                    Your Current Growth Stage:<br/>
                    <span className="text-blue-400 mt-2 block">{stage}</span>
                  </h2>
                  <p className="text-2xl text-slate-300 leading-relaxed relative z-10">
                    {stageDescriptions[stage]}
                  </p>
                </motion.div>
                <motion.button 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  onClick={nextStep}
                  className="inline-flex items-center gap-3 bg-white text-slate-950 font-semibold px-8 py-4 rounded-full text-lg hover:bg-slate-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
                >
                  See My Next Step <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* Step 5: Recommended Next Module */}
            {step === 5 && (
              <div className="max-w-3xl w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">
                  Recommended Next Step
                </h2>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="group bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/40 p-8 md:p-12 rounded-3xl text-left transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-blue-600/30 rounded-2xl flex items-center justify-center">
                      <Compass className="w-8 h-8 text-blue-400" />
                    </div>
                    <span className="text-blue-400 font-medium bg-blue-900/30 px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
                      Module
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{recommendedModule.name}</h3>
                  <p className="text-xl text-slate-300 mb-10 leading-relaxed">{recommendedModule.desc}</p>
                  
                  <Link 
                    to={recommendedModule.route}
                    className="inline-flex items-center justify-between w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-4 rounded-xl text-lg transition-all"
                  >
                    Start {recommendedModule.name} <ArrowRight className="w-6 h-6" />
                  </Link>
                </motion.div>
                
                <div className="mt-8">
                  <button onClick={nextStep} className="text-slate-400 hover:text-white transition-colors">
                    See other options
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Closing Screen */}
            {step === 6 && (
              <div className="w-full max-w-4xl text-center">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                  You Don't Need More Noise.<br/>
                  <span className="text-blue-400">You Need Direction.</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-16 max-w-3xl mx-auto">
                  The NTA Operating System™ was built to help local businesses and community leaders move through digital change with clarity, confidence, and practical next steps.
                </p>
                
                <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto text-left">
                  <Link 
                    to={recommendedModule.route}
                    className="group bg-blue-600 hover:bg-blue-500 text-white p-6 md:p-8 rounded-3xl transition-all shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)] flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Continue to Recommended Module</h3>
                      <p className="text-blue-100 text-lg">Start {recommendedModule.name}</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link 
                    to="/book-call"
                    className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-white p-6 md:p-8 rounded-3xl transition-all flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Schedule a Discovery Meeting</h3>
                      <p className="text-slate-400 text-lg">Discuss your goals with an NTA guide.</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-slate-500 group-hover:text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link 
                    to="/"
                    className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-white p-6 md:p-8 rounded-3xl transition-all flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Return to Overview</h3>
                      <p className="text-slate-400 text-lg">Explore the NTA Operating System™</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-slate-500 group-hover:text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 w-full p-6 md:p-8 z-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <div>
            {step > 0 && step < totalSteps - 1 && (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors px-4 py-2 rounded-full hover:bg-slate-900"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}