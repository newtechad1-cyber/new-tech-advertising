import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, 
  MapPin, Shield, Search, Users, TrendingUp, Zap, X, 
  HeartHandshake, Presentation, BarChart, Settings, Share2, Award, Building2
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import NextStepEngine from '@/components/recommendations/NextStepEngine';

export default function CommunityGrowthConversation() {
  const [step, setStep] = useState(0);

  // Record this step in memory
  React.useEffect(() => {
    import('@/lib/journeyMemory').then(({ addCompletedConversation }) => {
       addCompletedConversation('community_growth');
    });
  }, []);
  const [direction, setDirection] = useState(1);

  const totalSteps = 9;

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

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans overflow-hidden flex flex-col relative selection:bg-blue-500/30">
      <SEOHead 
        title="Community Growth Conversation™ | New Tech Advertising"
        description="Strengthen local businesses and your community through partnership."
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
            Community Growth Conversation™
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
            {/* --- STEP 0: Welcome --- */}
            {step === 0 && (
              <div className="max-w-4xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-8"
                >
                  Strengthen Local Businesses.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Strengthen Your Community.
                  </span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12 max-w-3xl mx-auto"
                >
                  New Tech Advertising helps community partners bring practical digital visibility education, business growth tools, and relationship-building systems to the businesses they serve.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
                  onClick={nextStep}
                  className="inline-flex items-center gap-3 bg-white text-slate-950 font-semibold px-8 py-4 rounded-full text-lg hover:bg-blue-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
                >
                  Begin Community Growth Conversation™ <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* --- STEP 1: Why This Matters --- */}
            {step === 1 && (
              <div className="max-w-4xl text-left md:text-center">
                <div className="w-20 h-20 bg-blue-600/20 border border-blue-500/30 rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                  <Building2 className="w-10 h-10 text-blue-400" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 tracking-tight leading-tight">
                  Local businesses are the <span className="text-blue-400">heartbeat</span> of every community.
                </h2>
                <div className="space-y-6 text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-12">
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    They employ our neighbors, support local causes, sponsor events, serve families, and keep local economies alive.
                  </motion.p>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-blue-300 font-medium">
                    But many are falling behind because technology keeps changing faster than they can keep up.
                  </motion.p>
                </div>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                  onClick={nextStep}
                  className="inline-flex items-center gap-3 bg-blue-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:scale-105 mx-auto"
                >
                  See the hidden problem <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* --- STEP 2: The Hidden Problem --- */}
            {step === 2 && (
              <div className="max-w-4xl w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                  Many business owners don't have a marketing problem.
                </h2>
                <p className="text-2xl text-blue-400 font-semibold mb-12">
                  They have a visibility and relationship problem.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                  {[
                    "They are hard to find online.",
                    "They don't always look trustworthy before the first phone call.",
                    "They don't have consistent ways to stay connected with past customers.",
                    "They don't have simple systems for referrals, reviews, and follow-up."
                  ].map((problem, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                      className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex items-start gap-4"
                    >
                      <X className="w-6 h-6 text-slate-500 flex-shrink-0 mt-1" />
                      <p className="text-xl text-slate-300">{problem}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 3: The NTA Discovery System™ --- */}
            {step === 3 && (
              <div className="w-full max-w-5xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The NTA Discovery System™</h2>
                <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
                  This gives partners a simple way to introduce businesses to the right next step without overwhelming them.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                  {[
                    { title: "Discover", desc: "Understanding gaps in visibility and trust." },
                    { title: "Build", desc: "Creating a solid, modern digital foundation." },
                    { title: "Grow", desc: "Expanding local reach and search traffic." },
                    { title: "Lead", desc: "Becoming the recognized market authority." },
                    { title: "Connect", desc: "Engaging and retaining past customers." },
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

            {/* --- STEP 4: How Community Partners Help --- */}
            {step === 4 && (
              <div className="max-w-4xl w-full text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight text-center">
                  How Community Partners Help
                </h2>
                <p className="text-2xl text-blue-400 font-medium mb-12 text-center">
                  Partners do not need to become marketing experts.
                </p>

                <div className="space-y-4">
                  {[
                    "Introducing local businesses to NTA",
                    "Sharing Digital Visibility Audits",
                    "Hosting educational workshops",
                    "Promoting the AI Learning Center",
                    "Helping businesses understand their next step",
                    "Strengthening the local business community"
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-xl md:text-2xl text-slate-200 font-medium">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 5: What NTA Provides --- */}
            {step === 5 && (
              <div className="max-w-4xl w-full text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 tracking-tight text-center">
                  What NTA Handles For You
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Search, text: "Visibility audits" },
                    { icon: Presentation, text: "Growth conversations" },
                    { icon: Shield, text: "Websites and digital foundations" },
                    { icon: MapPin, text: "Google visibility" },
                    { icon: Award, text: "Content and reputation building" },
                    { icon: HeartHandshake, text: "Relationship Builder™ systems" },
                    { icon: Zap, text: "AI and automation tools" },
                    { icon: BarChart, text: "Reporting and client support" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800"
                    >
                      <item.icon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                      <span className="text-lg text-slate-200">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* --- STEP 6: Partner Opportunity --- */}
            {step === 6 && (
              <div className="max-w-4xl text-center">
                <div className="w-20 h-20 bg-emerald-600/20 border border-emerald-500/30 rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                  <Share2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                  Create Value & Revenue
                </h2>
                <div className="space-y-6 text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-12">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    Community partners can create immense local value while also creating a recurring revenue opportunity.
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-slate-200 font-medium">
                    When a business becomes an NTA client through your referral or program, your organization or partnership can participate in ongoing revenue sharing.
                  </motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-emerald-400 font-bold">
                    Focus on impact first, revenue second.
                  </motion.p>
                </div>
              </div>
            )}

            {/* --- STEP 7: Strong Businesses Build Strong Communities™ --- */}
            {step === 7 && (
              <div className="max-w-5xl text-center">
                <h2 className="text-4xl md:text-7xl font-black text-white mb-12 tracking-tight leading-tight">
                  Strong Businesses Build<br/>
                  <span className="text-blue-500">Strong Communities™</span>
                </h2>
                
                <div className="flex flex-col items-center gap-6 mb-12 max-w-2xl mx-auto">
                  {[
                    "They employ people.",
                    "They support local causes.",
                    "They serve families.",
                    "They create opportunity."
                  ].map((term, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (i * 0.3) }}
                      className="text-2xl md:text-3xl text-slate-300 font-medium"
                    >
                      {term}
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
                  className="text-3xl md:text-4xl text-white font-bold border-t border-slate-800 pt-10 mt-10"
                >
                  Helping them grow benefits everyone.
                </motion.div>
              </div>
            )}

            {/* --- STEP 8: CTA / Next Step --- */}
            {step === 8 && (
              <div className="w-full max-w-4xl">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 tracking-tight">
                  Take The Next Step
                </h2>
                <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto">
                  <Link 
                    to="/book-call"
                    className="group bg-blue-600 hover:bg-blue-500 text-white p-6 md:p-8 rounded-3xl text-left transition-all shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-1 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Schedule a Partner Conversation</h3>
                      <p className="text-blue-100 text-lg">Discuss how we can work together to help your community.</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link 
                    to="/free-audit"
                    className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-white p-6 md:p-8 rounded-3xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Share a Free Visibility Audit</h3>
                      <p className="text-slate-400 text-lg">Run an audit for a local business to see how they appear online.</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-slate-500 group-hover:text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link 
                    to="/community-partner"
                    className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-white p-6 md:p-8 rounded-3xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-2">View Community Partner Program</h3>
                      <p className="text-slate-400 text-lg">Learn more about our program for organizations and influencers.</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-slate-500 group-hover:text-white transform group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
                <div className="mt-16">
                   <NextStepEngine />
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
            {step < totalSteps - 1 && step !== 0 && step !== 1 && (
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