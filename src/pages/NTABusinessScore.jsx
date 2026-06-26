import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, ChevronRight, X, 
  BarChart2, Target, Globe, MessageSquare, 
  Brain, Users, Cpu, Activity
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import NextStepEngine from '@/components/recommendations/NextStepEngine';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function NTABusinessScore() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Store scores per category
  const [scores, setScores] = useState({
    Visibility: null,
    'Digital Foundation': null,
    'Customer Relationships': null,
    'AI Readiness': null,
    'Community Presence': null,
    'Growth Systems': null
  });

  const questions = [
    {
      category: 'Visibility',
      icon: Globe,
      question: "How easy is it for new customers to find your business online?",
      options: [
        { text: "We are difficult to find online.", points: 20 },
        { text: "We show up in some places but not consistently.", points: 45 },
        { text: "We are visible locally but need improvement.", points: 70 },
        { text: "We are easy to find and clearly positioned.", points: 90 }
      ]
    },
    {
      category: 'Digital Foundation',
      icon: Target,
      question: "How confident are you in your website and online presence?",
      options: [
        { text: "We do not have a strong online foundation.", points: 20 },
        { text: "We have a website, but it feels outdated or unclear.", points: 45 },
        { text: "Our foundation is decent but needs improvement.", points: 70 },
        { text: "Our website and online presence clearly support growth.", points: 90 }
      ]
    },
    {
      category: 'Customer Relationships',
      icon: MessageSquare,
      question: "How consistent is your follow-up with customers and past buyers?",
      options: [
        { text: "We do not have a consistent follow-up system.", points: 20 },
        { text: "We follow up occasionally but not systematically.", points: 45 },
        { text: "We have some systems but they could be stronger.", points: 70 },
        { text: "We consistently stay connected with customers.", points: 90 }
      ]
    },
    {
      category: 'AI Readiness',
      icon: Brain,
      question: "How prepared is your business to use AI tools?",
      options: [
        { text: "We do not know where to begin.", points: 20 },
        { text: "We have tried AI but do not use it consistently.", points: 45 },
        { text: "We use some AI tools and want to improve.", points: 70 },
        { text: "We are actively using AI to save time and improve operations.", points: 90 }
      ]
    },
    {
      category: 'Community Presence',
      icon: Users,
      question: "How connected is your business to the local community?",
      options: [
        { text: "We are not very connected locally.", points: 20 },
        { text: "We participate occasionally but without a clear strategy.", points: 45 },
        { text: "We have local relationships but could use them better.", points: 70 },
        { text: "We are recognized and connected in the community.", points: 90 }
      ]
    },
    {
      category: 'Growth Systems',
      icon: Cpu,
      question: "How organized is your business growth process?",
      options: [
        { text: "We mostly react to problems as they happen.", points: 20 },
        { text: "We have some plans but no consistent system.", points: 45 },
        { text: "We are organized in some areas but need better coordination.", points: 70 },
        { text: "We have clear systems for ongoing growth.", points: 90 }
      ]
    }
  ];

  const totalSteps = questions.length + 2; // Opening + 6 Qs + Results

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      if (step === questions.length) {
        // Transition to results
        setIsCalculating(true);
        setStep(prev => prev + 1);
        setTimeout(() => setIsCalculating(false), 2000);
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 0 && !isCalculating) {
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const handleAnswer = (category, points) => {
    setScores(prev => ({ ...prev, [category]: points }));
    nextStep();
  };

  // Results Logic
  const getResults = () => {
    const values = Object.entries(scores).map(([k, v]) => ({ category: k, score: v || 0 }));
    
    // Calculate average
    const totalPoints = values.reduce((sum, item) => sum + item.score, 0);
    const overallScore = Math.round(totalPoints / 6);
    
    // Lowest and Highest
    const sorted = [...values].sort((a, b) => a.score - b.score);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];

    // Record score in memory
    import('@/lib/journeyMemory').then(({ setBusinessScore, setGrowthStage }) => {
       setBusinessScore({ overall: overallScore, lowest: lowest.category, highest: highest.category });
       setGrowthStage(overallScore >= 90 ? 'Elevate' : overallScore >= 75 ? 'Connect' : overallScore >= 60 ? 'Grow' : 'Build');
    });

    // Stage
    let stage = "Discover";
    if (overallScore >= 40 && overallScore <= 59) stage = "Build";
    if (overallScore >= 60 && overallScore <= 74) stage = "Grow";
    if (overallScore >= 75 && overallScore <= 89) stage = "Connect";
    if (overallScore >= 90) stage = "Elevate";

    // Recommended Module Map
    const recommendations = {
      'Visibility': { name: 'Growth Roadmap™', route: '/free-audit' },
      'Digital Foundation': { name: 'Growth Roadmap™', route: '/free-audit' },
      'Customer Relationships': { name: 'Relationship Builder™', route: '/relationship-builder' },
      'AI Readiness': { name: 'AI Learning Conversation™', route: '/learning-center' },
      'Community Presence': { name: 'Community Growth Conversation™', route: '/community-growth-conversation' },
      'Growth Systems': { name: 'Growth Navigator™', route: '/growth-navigator' }
    };

    return {
      overallScore,
      stage,
      lowest,
      highest,
      recommendedModule: recommendations[lowest.category],
      values
    };
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98
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
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  const renderProgress = () => {
    // 0 is opening, 1-6 are questions, 7 is results
    const progress = step === 0 ? 0 : step === totalSteps - 1 ? 100 : (step / questions.length) * 100;
    
    return (
      <div className="sticky top-[72px] md:top-[80px] left-0 w-full z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="h-1.5 bg-slate-900 w-full">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-xs">
              <BarChart2 className="w-4 h-4" />
            </span>
            NTA Business Score™
          </div>
          <Link to="/operating-system" className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800">
            <X className="w-6 h-6" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans flex flex-col relative selection:bg-indigo-500/30">
      <SEOHead 
        title="NTA Business Score™ | New Tech Advertising"
        description="A business growth maturity assessment to help you understand your digital position."
      />
      <MarketingNav />

      {renderProgress()}

      <main className="flex-1 flex items-center justify-center relative px-6 py-24 min-h-[80vh]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          
          {/* STEP 0: OPENING */}
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-4xl mx-auto text-center"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-indigo-900/30 border border-indigo-500/30 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-[0_0_50px_rgba(99,102,241,0.2)]"
              >
                <Activity className="w-12 h-12 text-indigo-400" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-8">
                Know Where Your <br/>
                <span className="text-indigo-400">Business Stands.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12 max-w-3xl mx-auto">
                Most business owners are told what they should buy before anyone helps them understand where they are. The NTA Business Score™ gives you a clearer picture of your current growth position so you can make better decisions.
              </p>
              <button 
                onClick={nextStep}
                className="inline-flex items-center gap-3 bg-white text-slate-950 font-semibold px-8 py-4 rounded-full text-lg hover:bg-indigo-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Start My Business Score <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* QUESTIONS 1-6 */}
          {step > 0 && step <= questions.length && (
            <motion.div
              key={`step-${step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-3xl mx-auto"
            >
              <div className="mb-4 text-indigo-400 font-medium tracking-widest uppercase text-sm">
                Category {step} of {questions.length}
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                {React.createElement(questions[step - 1].icon, { className: "w-10 h-10 text-indigo-500" })}
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {questions[step - 1].category}
                </h2>
              </div>
              
              <p className="text-2xl text-slate-300 mb-12 leading-relaxed">
                {questions[step - 1].question}
              </p>
              
              <div className="space-y-4">
                {questions[step - 1].options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(questions[step - 1].category, opt.points)} 
                    className="w-full text-left p-6 md:p-8 rounded-2xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800 hover:border-indigo-500 transition-all text-xl text-slate-200 flex justify-between items-center group"
                  >
                    <span className="pr-4">{opt.text}</span>
                    <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {step > questions.length && (
            <motion.div
              key="results"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-5xl mx-auto pb-12"
            >
              {isCalculating ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-8"></div>
                  <h2 className="text-3xl font-bold text-white mb-2">Analyzing Your Business</h2>
                  <p className="text-slate-400">Calculating your growth position...</p>
                </div>
              ) : (
                (() => {
                  const results = getResults();
                  return (
                    <div>
                      <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Your NTA Business Score™</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                          The goal is not to do everything at once. The goal is to know what matters next.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Overall Score */}
                        <div className="md:col-span-1 bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-400"></div>
                          <span className="text-slate-400 uppercase tracking-widest font-semibold text-xs mb-4">Overall Score</span>
                          <div className="text-8xl font-bold text-white mb-2">{results.overallScore}</div>
                          <div className="text-indigo-300 font-medium px-4 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/20">
                            Stage: {results.stage}
                          </div>
                        </div>

                        {/* Top & Opportunity */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                            <span className="text-emerald-400 uppercase tracking-widest font-semibold text-xs mb-2 block">Strongest Area</span>
                            <h3 className="text-2xl font-bold text-white mb-2">{results.highest.category}</h3>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${results.highest.score}%` }}></div>
                              </div>
                              <span className="text-slate-400 text-sm font-medium">{results.highest.score}</span>
                            </div>
                          </div>
                          
                          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                            <span className="text-amber-400 uppercase tracking-widest font-semibold text-xs mb-2 block">Biggest Opportunity</span>
                            <h3 className="text-2xl font-bold text-white mb-2">{results.lowest.category}</h3>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${results.lowest.score}%` }}></div>
                              </div>
                              <span className="text-slate-400 text-sm font-medium">{results.lowest.score}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Six Category Cards */}
                      <h3 className="text-2xl font-bold text-white mb-6">Detailed Breakdown</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
                        {results.values.map(val => (
                          <div key={val.category} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="text-lg font-medium text-slate-200 mb-4">{val.category}</h4>
                            <div className="flex items-end justify-between">
                              <span className="text-3xl font-bold text-white">{val.score}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full mt-3 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${val.score >= 70 ? 'bg-emerald-500' : val.score >= 45 ? 'bg-indigo-500' : 'bg-amber-500'}`} 
                                style={{ width: `${val.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recommended Module */}
                      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-indigo-500/20 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div>
                          <span className="text-indigo-400 font-semibold uppercase tracking-widest text-sm block mb-2">Recommended Next Step</span>
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{results.recommendedModule.name}</h3>
                          <p className="text-slate-400 text-lg max-w-xl">
                            Based on your score in {results.lowest.category}, this module is exactly what you need to focus on next to build momentum.
                          </p>
                        </div>
                        <Link 
                          to={results.recommendedModule.route}
                          className="w-full md:w-auto text-center shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors whitespace-nowrap"
                        >
                          Continue to Module
                        </Link>
                      </div>

                      {/* Final CTAs */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <Link to="/free-audit" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-6 rounded-2xl flex items-center justify-between transition-colors group">
                          <span className="font-semibold text-white">Create My Growth Roadmap</span>
                          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                        </Link>
                        <Link to="/book-call" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-6 rounded-2xl flex items-center justify-between transition-colors group">
                          <span className="font-semibold text-white">Schedule a Discovery Meeting</span>
                          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                        </Link>
                        <Link to="/operating-system" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-6 rounded-2xl flex items-center justify-between transition-colors group">
                          <span className="font-semibold text-white">Return to Operating System</span>
                          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                        </Link>
                      </div>
                    </div>
                  );
                })()
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      {step > 0 && step <= questions.length && (
        <div className="fixed bottom-0 left-0 w-full p-6 md:p-8 z-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/50 pointer-events-none pb-safe">
          <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto pb-4">
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors px-4 py-2 rounded-full hover:bg-slate-900"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          </div>
        </div>
      )}

      {(step === 0 || step > questions.length) && (
        <div className="pb-12">
          <NextStepEngine />
        </div>
      )}

      <div className="relative z-10 pt-20">
        <SiteFooter />
      </div>
    </div>
  );
}