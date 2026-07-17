import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ChevronRight, CheckCircle2, X,
  Users, Eye, MousePointerClick, Settings, BrainCircuit, Target, Lightbulb
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function NTAGrowthConversation() {
  const [discoveryQuestion, setDiscoveryQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const formRef = useRef(null);

  // Preserve memory logic from original interaction
  useEffect(() => {
    if (isComplete) {
      import('@/lib/journeyMemory').then(({ addCompletedConversation }) => {
         addCompletedConversation('nta_growth');
      });
    }
  }, [isComplete]);

  const scrollToWizard = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAnswer = (questionIndex, answer) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    if (discoveryQuestion < 2) {
      setDiscoveryQuestion(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const getRecommendation = () => {
    const primaryGoal = answers[0] || '';
    if (primaryGoal.includes("Found")) return "Visibility & Growth";
    if (primaryGoal.includes("Trust")) return "Reputation & Authority";
    if (primaryGoal.includes("Operations")) return "Systematization & Scale";
    return "Foundation & Build";
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans flex flex-col selection:bg-blue-500/30">
      <SEOHead 
        title="NTA Growth Conversation™ | Find the Right Next Step"
        description="Start with a practical conversation about your customers, marketing, operations, technology, and goals. NTA helps identify the right next step before recommending tools or services."
      />
      <MarketingNav />

      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">
            The NTA Growth Conversation™
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Let’s Start With What Is Really Happening in Your Business
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Most business owners do not need another salesperson immediately recommending a website, campaign, CRM, automation, or AI tool. They need someone to listen, understand the business, and help identify the real obstacle to growth.
            <br/><br/>
            The NTA Growth Conversation is a practical first step that helps organize what is working, what is frustrating, what depends too heavily on the owner, and what should happen next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToWizard} 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Start the Conversation
            </button>
            <Link 
              to="/operating-system" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
            >
              See the Digital Growth Office
            </Link>
          </div>
        </div>
      </section>

      {/* 2. What this conversation is */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            This Is Not a Traditional Sales Call
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">What It Is</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> A structured conversation about the business</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> A chance to explain what is frustrating or falling behind</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> A way to identify bottlenecks and priorities</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> A practical look at customers, marketing, operations, and technology</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> The beginning of a clear next-step plan</li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">What It Is Not</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> A pressure-filled sales presentation</li>
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> A predetermined package</li>
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> A technical software demonstration</li>
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> A promise that AI will solve everything</li>
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" /> A requirement to replace every tool the business already uses</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <div className="inline-block px-6 py-3 bg-blue-900/20 border border-blue-500/30 text-blue-300 rounded-xl text-lg font-medium">
              The goal is clarity before recommendations.
            </div>
          </div>
        </div>
      </section>

      {/* 3. What we will explore */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            We Look at the Whole Business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <Users className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Customers</h3>
              <p className="text-slate-400 text-sm">How people discover, evaluate, contact, choose, and stay connected to the business.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <Eye className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Visibility and Trust</h3>
              <p className="text-slate-400 text-sm">Website, search presence, reviews, content, reputation, and customer confidence.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <MousePointerClick className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Leads and Follow-Up</h3>
              <p className="text-slate-400 text-sm">How inquiries are captured, answered, tracked, and moved toward a decision.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <Settings className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Operations</h3>
              <p className="text-slate-400 text-sm">Scheduling, customer records, tasks, invoicing, communication, and repetitive work.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <BrainCircuit className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Business Knowledge</h3>
              <p className="text-slate-400 text-sm">What the owner and team know, how it is documented, and where important information gets lost.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
              <Target className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Goals and Readiness</h3>
              <p className="text-slate-400 text-sm">What the owner wants to improve, how quickly change can happen, and what the business is ready to support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Questions business owners often bring */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            You May Be Thinking About Questions Like These
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Why are we not getting enough good leads?",
              "Why does so much still depend on me?",
              "Why are customers not following through?",
              "Are we wasting money on disconnected tools?",
              "What should we fix first?",
              "How can AI actually help without making things more complicated?",
              "How do we organize customer information and follow-up?",
              "How do we turn what we know into a repeatable business system?",
              "What can be automated, and what should remain personal?",
              "How do we grow without creating more chaos?"
            ].map((q, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{q}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 mt-10 text-lg">
            You do not need to have polished answers before beginning. The conversation is meant to help you find them.
          </p>
        </div>
      </section>

      {/* 5. What happens next */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            What Happens After the Growth Conversation?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
              <div className="text-5xl font-black text-slate-800 absolute top-4 right-4">1</div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Listen</h3>
              <p className="text-slate-400 relative z-10 text-sm">NTA learns how the business works today, including strengths, frustrations, priorities, and existing tools.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
              <div className="text-5xl font-black text-slate-800 absolute top-4 right-4">2</div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Clarify</h3>
              <p className="text-slate-400 relative z-10 text-sm">The information is organized into the most important problems, opportunities, and dependencies.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
              <div className="text-5xl font-black text-slate-800 absolute top-4 right-4">3</div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Prioritize</h3>
              <p className="text-slate-400 relative z-10 text-sm">The business identifies what should happen now, what can wait, and what should be protected.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
              <div className="text-5xl font-black text-slate-800 absolute top-4 right-4">4</div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Recommend the Next Step</h3>
              <p className="text-slate-400 relative z-10 text-sm">The next step may include a <Link to="/business-score" className="text-blue-400 hover:underline">Business Score</Link>, Growth Roadmap, immediate fix, focused solution, or a broader <Link to="/operating-system" className="text-blue-400 hover:underline">Digital Growth Office</Link> plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 & 7. Preserve existing interaction & Privacy reassurance */}
      <section ref={formRef} className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Assessment</h2>
            <p className="text-slate-400">Answer three quick questions to help us prepare for our conversation.</p>
          </div>

          {!isComplete ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                <motion.div 
                  className="h-full bg-blue-500" 
                  animate={{ width: `${(discoveryQuestion / 3) * 100}%` }} 
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="mb-6 text-sm font-medium text-slate-500 tracking-wider uppercase">
                Question {discoveryQuestion + 1} of 3
              </div>

              <AnimatePresence mode="wait">
                {discoveryQuestion === 0 && (
                  <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-2xl md:text-3xl text-white font-medium mb-8">What is your primary focus right now?</h3>
                    <div className="space-y-3">
                      {["Getting Found Online", "Building Trust & Reviews", "Streamlining Operations"].map((opt, i) => (
                        <button key={i} onClick={() => handleAnswer(0, opt)} className="w-full text-left p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-lg text-slate-200 flex justify-between items-center group">
                          {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {discoveryQuestion === 1 && (
                  <motion.div key="q2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-2xl md:text-3xl text-white font-medium mb-8">How would you describe your current online presence?</h3>
                    <div className="space-y-3">
                      {["Non-existent or broken", "Outdated but functional", "Good, but we want to dominate"].map((opt, i) => (
                        <button key={i} onClick={() => handleAnswer(1, opt)} className="w-full text-left p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-lg text-slate-200 flex justify-between items-center group">
                          {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {discoveryQuestion === 2 && (
                  <motion.div key="q3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-2xl md:text-3xl text-white font-medium mb-8">Where do you want your business to be in 12 months?</h3>
                    <div className="space-y-3">
                      {["Consistent, predictable lead flow", "The recognized leader in our market", "Scaling smoothly with less manual work"].map((opt, i) => (
                        <button key={i} onClick={() => handleAnswer(2, opt)} className="w-full text-left p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-lg text-slate-200 flex justify-between items-center group">
                          {opt} <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <h3 className="text-xl text-slate-400 mb-6 font-medium">Based on your goals, your recommended Growth Stage is:</h3>
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-8 rounded-2xl mb-8">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  {getRecommendation()}
                </h2>
              </div>
              <p className="text-lg text-slate-300 mb-8">
                We focus on implementing the exact systems you need for this stage, skipping the noise and targeting what actually drives results.
              </p>
              <Link to="/book-call" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                Discuss Your Recommendation
              </Link>
            </div>
          )}
          
          <div className="mt-8 text-center px-6">
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Share only what you are comfortable sharing. This information is used to understand your business and prepare a useful next conversation—not to automatically enroll you in a service.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Alternate starting choices */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Prefer a Different Starting Point?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3">Take the Business Score</h3>
              <p className="text-slate-400 text-sm mb-6">Get a structured view of where the business currently stands across the most important areas of digital growth.</p>
              <Link to="/business-score" className="text-blue-400 font-medium text-sm flex items-center gap-1 hover:underline">Start Assessment <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3">Explore the Full System</h3>
              <p className="text-slate-400 text-sm mb-6">See how NTA connects marketing, customer relationships, knowledge, AI, and operations through the Digital Growth Office.</p>
              <Link to="/operating-system" className="text-indigo-400 font-medium text-sm flex items-center gap-1 hover:underline">Explore System <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3">Book a Direct Conversation</h3>
              <p className="text-slate-400 text-sm mb-6">Skip the assessments and jump straight into a discovery meeting to discuss your goals and a clear path forward.</p>
              <Link to="/book-call" className="text-purple-400 font-medium text-sm flex items-center gap-1 hover:underline">Book a Call <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-24 px-6 text-center bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">You Do Not Need All the Answers to Begin</h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Tell us what is working, what is frustrating, and what you want the business to become. We will help organize the situation and identify a practical next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToWizard} 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Start the Growth Conversation
            </button>
            <Link 
              to="/book-call" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
            >
              Book a Call
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}