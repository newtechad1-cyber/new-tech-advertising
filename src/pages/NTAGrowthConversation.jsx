import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, ChevronRight, CheckCircle2, 
  MapPin, Shield, Search, Users, TrendingUp, Zap, X
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function NTAGrowthConversation() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({});
  const [discoveryQuestion, setDiscoveryQuestion] = useState(0);

  const totalSteps = 10;

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

  const handleAnswer = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    if (discoveryQuestion < 2) {
      setDiscoveryQuestion(prev => prev + 1);
    } else {
      nextStep();
    }
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

  // Determine Recommendation based on answers
  const getRecommendation = () => {
    const primaryGoal = answers[0] || '';
    if (primaryGoal.includes("Found")) return "Visibility & Growth";
    if (primaryGoal.includes("Trust")) return "Reputation & Authority";
    if (primaryGoal.includes("Operations")) return "Systematization & Scale";
    return "Foundation & Build";
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans overflow-hidden flex flex-col relative selection:bg-blue-500/30">
      <SEOHead 
        title="NTA Growth Conversation™ | New Tech Advertising"
        description="An interactive guided presentation to discover your business growth path."
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
            <span className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-xs">N</span>
            NTA Growth Conversation™
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
            className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center"
          >
            {/* --- STEP 1: Welcome --- */}
            {step === 0 && (
              <div className="max-w-4xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-8"
                >
                  Helping Local Businesses <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Get Found Online
                  </span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12 max-w-3xl mx-auto"
                >
                  Helping local businesses confidently navigate the digital world by meeting them where they are and guiding them to where they want to be.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
                  onClick={nextStep}
                  className="inline-flex items-center gap-3 bg-white text-slate-950 font-semibold px-8 py-4 rounded-full text-lg hover:bg-blue-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
                >
                  Begin Your Growth Journey <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* --- STEP 2: The Business Has Changed --- */}
            {step === 1 && (
              <div className="w-full">
                <div className="grid md:grid-cols-2 gap-12 text-left mb-16">
                  <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                    <h3 className="text-slate-500 uppercase tracking-widest font-semibold text-sm mb-4">How It Used To Be</h3>
                    <ul className="space-y-4 text-xl text-slate-300">
                      <li className="flex items-center gap-3"><X className="w-5 h-5 text-slate-600" /> Phonebooks & Yellow Pages</li>
                      <li className="flex items-center gap-3"><X className="w-5 h-5 text-slate-600" /> Expensive Newspaper Ads</li>
                      <li className="flex items-center gap-3"><X className="w-5 h-5 text-slate-600" /> Relying Only on Word of Mouth</li>
                    </ul>
                  </div>
                  <div className="bg-blue-950/20 p-8 rounded-3xl border border-blue-900/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <h3 className="text-blue-400 uppercase tracking-widest font-semibold text-sm mb-4 relative z-10">How It Is Today</h3>
                    <ul className="space-y-4 text-xl text-white relative z-10">
                      <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Digital Search & Maps</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Online Reviews & Reputation</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400" /> Seamless Digital Experiences</li>
                    </ul>
                  </div>
                </div>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                    Technology changes. <br className="hidden md:block"/> People don't.
                  </h2>
                  <p className="text-2xl text-slate-400">They still want businesses they can trust.</p>
                </div>
              </div>
            )}

            {/* --- STEP 3: The Problem --- */}
            {step === 2 && (
              <div className="max-w-4xl">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-10 tracking-tight">
                  You already have a business to run.
                </h2>
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {['Websites', 'Search Algorithms', 'Reviews', 'Marketing', 'CRM Systems', 'Automation'].map((term, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                      className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-full text-slate-400 text-lg"
                    >
                      {term}
                    </motion.span>
                  ))}
                </div>
                <p className="text-2xl text-slate-300 mb-12 leading-relaxed">
                  You shouldn't have to become an expert in all of these just to grow your business.
                </p>
                <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 px-8 py-4 rounded-2xl text-2xl font-semibold shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                  NTA simplifies all of this.
                </div>
              </div>
            )}

            {/* --- STEP 4: NTA Philosophy --- */}
            {step === 3 && (
              <div className="w-full max-w-4xl text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center tracking-tight">
                  Five Simple Questions
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Search, q: "Can people find you?" },
                    { icon: Shield, q: "Can they trust you?" },
                    { icon: CheckCircle2, q: "Will they choose you?" },
                    { icon: Users, q: "Will they stay connected?" },
                    { icon: TrendingUp, q: "Can your business grow without working harder?" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-7 h-7 text-blue-400" />
                      </div>
                      <p className="text-2xl text-white font-medium">{item.q}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 5: Growth Framework --- */}
            {step === 4 && (
              <div className="w-full max-w-5xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 tracking-tight">NTA Growth Framework™</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                  {[
                    { title: "Discover", desc: "Understanding your current position and market gaps." },
                    { title: "Build", desc: "Creating a solid, modern digital foundation." },
                    { title: "Grow", desc: "Expanding your local visibility and traffic." },
                    { title: "Lead", desc: "Becoming the recognized market authority." },
                    { title: "Connect", desc: "Engaging your audience and building relationships." },
                    { title: "Elevate", desc: "Scaling smoothly with automated systems." }
                  ].map((stage, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-colors"
                    >
                      <div className="text-blue-500/20 text-6xl font-black absolute -top-2 -right-2 transition-transform group-hover:scale-110">{i + 1}</div>
                      <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{stage.title}</h3>
                      <p className="text-slate-400 relative z-10">{stage.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 6: Discovery Questions --- */}
            {step === 5 && (
              <div className="max-w-3xl w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight">Let's find your starting point.</h2>
                
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-left shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <motion.div 
                      className="h-full bg-blue-500" 
                      animate={{ width: `${((discoveryQuestion + 1) / 3) * 100}%` }} 
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {discoveryQuestion === 0 && (
                      <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h3 className="text-3xl text-white font-medium mb-8">What is your primary focus right now?</h3>
                        <div className="space-y-4">
                          {["Getting Found Online", "Building Trust & Reviews", "Streamlining Operations"].map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(0, opt)} className="w-full text-left p-6 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-xl text-slate-200 flex justify-between items-center group">
                              {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {discoveryQuestion === 1 && (
                      <motion.div key="q2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h3 className="text-3xl text-white font-medium mb-8">How would you describe your current online presence?</h3>
                        <div className="space-y-4">
                          {["Non-existent or broken", "Outdated but functional", "Good, but we want to dominate"].map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(1, opt)} className="w-full text-left p-6 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-xl text-slate-200 flex justify-between items-center group">
                              {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {discoveryQuestion === 2 && (
                      <motion.div key="q3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h3 className="text-3xl text-white font-medium mb-8">Where do you want your business to be in 12 months?</h3>
                        <div className="space-y-4">
                          {["Consistent, predictable lead flow", "The recognized leader in our market", "Scaling smoothly with less manual work"].map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(2, opt)} className="w-full text-left p-6 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-xl text-slate-200 flex justify-between items-center group">
                              {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* --- STEP 7: Recommendation --- */}
            {step === 6 && (
              <div className="max-w-4xl">
                <h3 className="text-2xl text-slate-400 mb-6 font-medium">Based on your goals, your recommended Growth Stage is:</h3>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                  className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-12 rounded-[3rem] shadow-[0_0_60px_-15px_rgba(59,130,246,0.3)] mb-12"
                >
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                    {getRecommendation()}
                  </h2>
                </motion.div>
                <p className="text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  We focus on implementing the exact systems you need for this stage, skipping the noise and targeting what actually drives results.
                </p>
              </div>
            )}

            {/* --- STEP 8: Roadmap --- */}
            {step === 7 && (
              <div className="w-full max-w-5xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 tracking-tight">Your Growth Roadmap™</h2>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 transform md:-translate-x-1/2"></div>
                  
                  <div className="space-y-12">
                    {[
                      { time: "Today", title: "Audit & Strategy", desc: "Identify gaps in visibility, trust, and readiness." },
                      { time: "90 Days", title: "Foundation & Setup", desc: "Build or repair your core digital presence." },
                      { time: "6 Months", title: "Optimization & Momentum", desc: "Grow local authority and consistent lead flow." },
                      { time: "12 Months", title: "Market Authority", desc: "Become the undisputed choice in your area." },
                      { time: "Long-Term", title: "Systematized Growth", desc: "Scale operations with smart automation." }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                        className={`relative flex items-center justify-between md:justify-normal gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* Dot */}
                        <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-[6px] md:-translate-x-1/2 shadow-[0_0_15px_rgba(59,130,246,0.6)] z-10"></div>
                        
                        <div className="hidden md:block w-1/2"></div>
                        <div className={`w-full pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} text-left`}>
                          <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">{item.time}</span>
                          <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-slate-400 text-lg">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 9: About NTA --- */}
            {step === 8 && (
              <div className="max-w-4xl text-left md:text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-10 mx-auto transform rotate-3 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                  We believe in practical systems,<br/> not marketing hype.
                </h2>
                <p className="text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
                  New Tech Advertising was built on a simple philosophy: help businesses simplify technology and build stronger, more authentic customer relationships.
                </p>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                  We don't sell disconnected tactics. We build reliable, measurable growth systems that work tirelessly in the background so you can focus on running your business.
                </p>
              </div>
            )}

            {/* --- STEP 10: CTA --- */}
            {step === 9 && (
              <div className="w-full max-w-4xl">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 tracking-tight">
                  Ready to Elevate?
                </h2>
                <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
                  <Link 
                    to="/book-call"
                    className="group bg-blue-600 hover:bg-blue-500 text-white p-6 md:p-8 rounded-3xl text-left transition-all shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Schedule a Discovery Meeting</h3>
                      <p className="text-blue-100 text-lg">Discuss your goals and outline a clear path forward.</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link 
                    to="/free-audit"
                    className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-white p-6 md:p-8 rounded-3xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Run a Free Visibility Audit</h3>
                      <p className="text-slate-400 text-lg">Instantly see how your business appears across the web.</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-slate-500 group-hover:text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link 
                    to="/find-your-plan"
                    className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-white p-6 md:p-8 rounded-3xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Begin Building Your Roadmap</h3>
                      <p className="text-slate-400 text-lg">Explore our growth stages and find the right fit.</p>
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
            {step > 0 && (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors px-4 py-2 rounded-full hover:bg-slate-900"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            )}
          </div>
          <div>
            {step < totalSteps - 1 && step !== 5 && (
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 bg-white text-slate-950 font-bold px-6 py-3 rounded-full hover:bg-slate-200 transition-colors shadow-lg"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}