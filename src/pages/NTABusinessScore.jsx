import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, ChevronRight, X, 
  BarChart2, Target, Globe, MessageSquare, 
  Brain, Users, Cpu, Activity, Lightbulb
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
  const formRef = useRef(null);
  
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

  const scrollToAssessment = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (step === 0) {
      nextStep();
    }
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setDirection(1);
      if (step === questions.length) {
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

  const getResults = () => {
    const values = Object.entries(scores).map(([k, v]) => ({ category: k, score: v || 0 }));
    
    const totalPoints = values.reduce((sum, item) => sum + item.score, 0);
    const overallScore = Math.round(totalPoints / 6);
    
    const sorted = [...values].sort((a, b) => a.score - b.score);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];

    import('@/lib/journeyMemory').then(({ setBusinessScore, setGrowthStage }) => {
       setBusinessScore({ overall: overallScore, lowest: lowest.category, highest: highest.category });
       setGrowthStage(overallScore >= 90 ? 'Elevate' : overallScore >= 75 ? 'Connect' : overallScore >= 60 ? 'Grow' : 'Build');
    });

    let stage = "Establishing the Foundation";
    if (overallScore >= 40 && overallScore <= 59) stage = "Building Consistency";
    if (overallScore >= 60 && overallScore <= 74) stage = "Connecting the System";
    if (overallScore >= 75 && overallScore <= 89) stage = "Ready to Expand";
    if (overallScore >= 90) stage = "Strengthening for Scale";

    const recommendations = {
      'Visibility': { name: 'Growth Roadmap™', route: '/growth-roadmap-generator' },
      'Digital Foundation': { name: 'Growth Roadmap™', route: '/growth-roadmap-generator' },
      'Customer Relationships': { name: 'Relationship Builder™', route: '/relationship-builder' },
      'AI Readiness': { name: 'AI Learning Conversation™', route: '/learning-center' },
      'Community Presence': { name: 'Community Growth Conversation™', route: '/community-growth-conversation' },
      'Growth Systems': { name: 'Growth Navigator™', route: '/operating-system' }
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
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans flex flex-col selection:bg-indigo-500/30">
      <SEOHead 
        title="NTA Business Score™ | See Where Growth Is Getting Stuck"
        description="Assess your business across visibility, trust, leads, customer relationships, operations, knowledge, technology, and readiness to identify the right next priority."
      />
      <MarketingNav />

      {step === 0 && (
        <>
          {/* 1. Hero Section */}
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-indigo-400 font-medium text-sm tracking-widest uppercase mb-6">
                The NTA Business Score™
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                See Where Your Business Is Strong—and Where Growth Is Getting Stuck
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                A business can look successful from the outside while still depending too heavily on the owner, losing leads, using disconnected tools, or struggling to follow through consistently.
                <br /><br />
                The NTA Business Score gives you a structured view of the business across visibility, trust, customer relationships, operations, knowledge, technology, and readiness for growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={scrollToAssessment}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                >
                  Take the Business Score
                </button>
                <Link 
                  to="/growth-conversation" 
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
                >
                  Start With a Growth Conversation
                </Link>
              </div>
            </div>
          </section>

          {/* 2. What the score measures */}
          <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
                A Business Is More Than Its Marketing
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <Globe className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Visibility</h3>
                  <p className="text-slate-400 text-sm">How consistently the right people discover the business online.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <Target className="w-8 h-8 text-indigo-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Digital Foundation</h3>
                  <p className="text-slate-400 text-sm">Website, digital presence, listings, accessibility, and essential customer information.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <MessageSquare className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Customer Relationships</h3>
                  <p className="text-slate-400 text-sm">Communication, retention, referrals, reviews, and ongoing connection.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <Brain className="w-8 h-8 text-amber-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">AI Readiness</h3>
                  <p className="text-slate-400 text-sm">Whether AI and technology tools support the business or create more confusion and duplication.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <Users className="w-8 h-8 text-rose-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Community Presence</h3>
                  <p className="text-slate-400 text-sm">Reviews, messaging, reputation, proof, and local confidence.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <Cpu className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Growth Systems</h3>
                  <p className="text-slate-400 text-sm">Scheduling, customer records, tasks, internal workflow, and repeatable processes.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. How to think about your score */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                Your Score Is a Starting Point, Not a Verdict
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-start gap-3 bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">A high score does not mean the business has finished growing.</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">A low score does not mean everything must be rebuilt.</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">A strong area may need to be protected rather than changed.</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">One weak dependency may matter more than several average scores.</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">The owner’s capacity and priorities affect what should happen next.</span>
                </div>
                <div className="flex items-start gap-3 bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">The goal is to make better decisions in the right order.</span>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block bg-indigo-900/20 border border-indigo-500/30 text-indigo-300 px-8 py-4 rounded-xl text-lg font-medium">
                  The number matters less than what it helps you see.
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 4. The Assessment Area */}
      <div ref={formRef}>
        {(step > 0 && step <= questions.length) && (
          <div className="relative z-40 bg-slate-950 border-y border-slate-800 sticky top-0">
            <div className="h-1.5 bg-slate-900 w-full">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / questions.length) * 100}%` }}
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
        )}

        <main className={`flex-1 flex items-center justify-center relative px-6 ${step > 0 ? 'py-16' : 'py-0'} min-h-[60vh]`}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            
            {step === 0 && (
              <motion.div key="step-0-start" className="w-full text-center pb-24 border-t border-slate-800/50 pt-24 bg-slate-900/50">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Ready to see your score?
                  </h2>
                  <p className="text-lg text-slate-400 mb-10">
                    Answer based on how the business works today—not how you hope it will work later. There are no perfect answers, and the score is most useful when it reflects the real situation.
                  </p>
                  <button 
                    onClick={scrollToAssessment}
                    className="inline-flex items-center gap-3 bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                  >
                    Start the Assessment <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

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
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
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
                className="w-full max-w-5xl mx-auto pb-12 pt-12"
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
                          <div className="md:col-span-1 bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-400"></div>
                            <span className="text-slate-400 uppercase tracking-widest font-semibold text-xs mb-4">Overall Score</span>
                            <div className="text-8xl font-bold text-white mb-2">{results.overallScore}</div>
                            <div className="text-indigo-300 font-medium px-4 py-2 mt-4 rounded-xl bg-indigo-900/30 border border-indigo-500/20 w-full">
                              Condition: {results.stage}
                            </div>
                          </div>

                          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                              <span className="text-emerald-400 uppercase tracking-widest font-semibold text-xs mb-2 block">Strongest Area To Protect</span>
                              <h3 className="text-2xl font-bold text-white mb-2">{results.highest.category}</h3>
                              <p className="text-sm text-slate-400 mb-4">This system is working. Don't disrupt it unnecessarily.</p>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${results.highest.score}%` }}></div>
                                </div>
                                <span className="text-slate-400 text-sm font-medium">{results.highest.score}</span>
                              </div>
                            </div>
                            
                            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                              <span className="text-amber-400 uppercase tracking-widest font-semibold text-xs mb-2 block">Biggest Bottleneck</span>
                              <h3 className="text-2xl font-bold text-white mb-2">{results.lowest.category}</h3>
                              <p className="text-sm text-slate-400 mb-4">This vulnerability may be creating the greatest drag on growth.</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                          {results.values.map(val => {
                            const isStrong = val.score >= 70;
                            const isAverage = val.score >= 45 && val.score < 70;
                            return (
                              <div key={val.category} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col h-full">
                                <h4 className="text-lg font-bold text-slate-200 mb-2">{val.category}</h4>
                                <p className="text-sm text-slate-400 mb-6 flex-grow">
                                  {isStrong && "This area is performing well. Protect these systems and processes."}
                                  {isAverage && "Functioning but could be more consistent or reliable."}
                                  {!isStrong && !isAverage && "This may deserve attention before adding new tools."}
                                </p>
                                <div>
                                  <div className="flex items-end justify-between mb-2">
                                    <span className="text-2xl font-bold text-white">{val.score}</span>
                                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Score</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${isStrong ? 'bg-emerald-500' : isAverage ? 'bg-indigo-500' : 'bg-amber-500'}`} 
                                      style={{ width: `${val.score}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* From score to priorities */}
                        <div className="py-12 border-t border-slate-800">
                          <h2 className="text-3xl font-bold text-center text-white mb-10">What Should You Do With the Result?</h2>
                          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                              <h3 className="font-bold text-lg text-white mb-2">1. Protect What Is Working</h3>
                              <p className="text-sm text-slate-400">Identify strong systems, relationships, processes, or capabilities that should not be disrupted.</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                              <h3 className="font-bold text-lg text-white mb-2">2. Find the Real Bottleneck</h3>
                              <p className="text-sm text-slate-400">Look for the issue that creates the greatest drag, dependency, missed opportunity, or customer frustration.</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                              <h3 className="font-bold text-lg text-white mb-2">3. Choose One Priority</h3>
                              <p className="text-sm text-slate-400">Select the most useful next improvement based on impact, readiness, time, and budget.</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                              <h3 className="font-bold text-lg text-white mb-2">4. Build in the Right Order</h3>
                              <p className="text-sm text-slate-400">Use the result to guide a practical plan rather than trying to repair everything at once.</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="inline-block px-6 py-3 bg-slate-800 rounded-lg text-slate-300 font-medium border border-slate-700">
                              A useful score should create focus—not a longer list of things to worry about.
                            </span>
                          </div>
                        </div>

                        {/* Recommended Next Steps */}
                        <div className="py-12 border-t border-slate-800">
                          <h2 className="text-3xl font-bold text-center text-white mb-12">Your Score Should Lead Somewhere Useful</h2>
                          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Link to="/growth-conversation" className="bg-slate-900 border border-slate-800 hover:border-blue-500 p-8 rounded-2xl group transition-all">
                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Talk Through the Result</h3>
                              <p className="text-sm text-slate-400 mb-6">Use the score as the starting point for a broader conversation about what is working, what is frustrating, and what should happen next.</p>
                              <span className="text-blue-400 font-medium text-sm flex items-center gap-1">Start a Conversation <ArrowRight className="w-4 h-4" /></span>
                            </Link>

                            <Link to="/operating-system" className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-8 rounded-2xl group transition-all">
                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">See the Connected System</h3>
                              <p className="text-sm text-slate-400 mb-6">Understand how the NTA Digital Growth Office connects marketing, customer relationships, business knowledge, AI, and operations.</p>
                              <span className="text-indigo-400 font-medium text-sm flex items-center gap-1">Explore System <ArrowRight className="w-4 h-4" /></span>
                            </Link>

                            <Link to="/growth-roadmap-generator" className="bg-slate-900 border border-slate-800 hover:border-purple-500 p-8 rounded-2xl group transition-all">
                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Create a Growth Roadmap</h3>
                              <p className="text-sm text-slate-400 mb-6">Turn your score into a clearer sequence of priorities, immediate actions, and longer-term improvements.</p>
                              <span className="text-purple-400 font-medium text-sm flex items-center gap-1">Build Your Growth Roadmap <ArrowRight className="w-4 h-4" /></span>
                            </Link>

                            <Link to="/book-call" className="bg-slate-900 border border-slate-800 hover:border-emerald-500 p-8 rounded-2xl group transition-all">
                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Book a Direct Conversation</h3>
                              <p className="text-sm text-slate-400 mb-6">Speak with an NTA advisor directly to figure out exactly where to apply your focus.</p>
                              <span className="text-emerald-400 font-medium text-sm flex items-center gap-1">Book a Call <ArrowRight className="w-4 h-4" /></span>
                            </Link>
                          </div>
                        </div>

                        {/* Final CTA */}
                        <div className="py-16 text-center border-t border-slate-800">
                          <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Clarity Makes the Next Decision Easier</h2>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                              Your result does not need to become another report that gets ignored. Use it to identify what should be protected, what is creating the greatest drag, and what practical next step would make the biggest difference.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <button 
                                onClick={() => {
                                  setScores({
                                    Visibility: null,
                                    'Digital Foundation': null,
                                    'Customer Relationships': null,
                                    'AI Readiness': null,
                                    'Community Presence': null,
                                    'Growth Systems': null
                                  });
                                  setStep(1);
                                  scrollToAssessment();
                                }}
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                              >
                                Retake the Business Score
                              </button>
                              <Link 
                                to="/growth-conversation" 
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
                              >
                                Start a Growth Conversation
                              </Link>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Footer Navigation */}
      {step > 0 && step <= questions.length && (
        <div className="fixed bottom-0 left-0 w-full p-6 md:p-8 pt-32 z-40 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none pb-safe">
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