import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Lock, Calendar, Target, Map, 
  ShieldAlert, Cpu, Users, ArrowRight, CheckCircle2, TrendingUp, 
  MessageSquare, Globe, ArrowDown, Activity, Lightbulb, Shield,
  Brain, FileText, CheckCircle, ChevronRight, Copy, Printer, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function NTAGrowthRoadmapGenerator() {
  const roadmapRef = useRef(null);

  // States
  const [hasScore, setHasScore] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [savedRoadmap, setSavedRoadmap] = useState(null);
  const [viewState, setViewState] = useState('START'); // START, WIZARD, RESULT
  const [wizardStep, setWizardStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [useScore, setUseScore] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');

  // Setup: Check memory for score and saved roadmap
  useEffect(() => {
    import('@/lib/journeyMemory').then(({ getJourneyMemory }) => {
      const memory = getJourneyMemory();
      if (memory.businessScore && memory.businessScore.overall !== null) {
        setHasScore(true);
        setScoreData(memory.businessScore);
      }
    });

    const stored = localStorage.getItem('nta_growth_roadmap');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedRoadmap(parsed);
      } catch (e) {
        // ignore invalid json
      }
    }
  }, []);

  const scrollToRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleStartWizard = () => {
    setViewState('WIZARD');
    setWizardStep(0);
    setAnswers({});
    scrollToRoadmap();
  };

  const handleUseScore = (use) => {
    setUseScore(use);
    handleStartWizard();
  };

  const handleAnswer = (questionIndex, value) => {
    const newAnswers = { ...answers, [questionIndex]: value };
    setAnswers(newAnswers);

    if (wizardStep < wizardQuestions.length - 1) {
      setWizardStep(prev => prev + 1);
    } else {
      generateRoadmap(newAnswers);
    }
  };

  // Generate logic
  const generateRoadmap = (finalAnswers) => {
    const q1 = finalAnswers[0] || '';
    const q4 = finalAnswers[3] || ''; // Urgency
    const q6 = finalAnswers[5] || ''; // Protect

    // Mappings
    let priority1 = { category: 'Visibility', title: 'Improve Search & Local Visibility', route: '/free-audit', reason: 'Getting found consistently is the first requirement.', action: 'Audit current business listings and search presence.', progress: 'Increase in organic local search impressions.' };
    let priority2 = { category: 'Trust', title: 'Strengthen Reviews and Proof', route: '/relationship-builder', reason: 'Once found, people need to trust the business before calling.', action: 'Implement a systematic way to request and display reviews.', progress: 'Consistent monthly growth in 5-star reviews.' };
    let priority3 = { category: 'Operations', title: 'Organize Operations and Reduce Owner Dependency', route: '/operating-system', reason: 'To handle more trust and visibility without owner burnout, operations must be documented.', action: 'Document the most common repeated process.', progress: 'One key daily task successfully delegated or automated.' };

    // Simple heuristic
    if (q1.includes('Getting found')) {
      // default is fine
    } else if (q1.includes('trust')) {
      priority1 = { category: 'Trust', title: 'Strengthen Reviews and Proof', route: '/relationship-builder', reason: 'You identified building trust as the most critical bottleneck.', action: 'Implement an automated review request system.', progress: 'A visible increase in recent customer reviews.' };
      priority2 = { category: 'Leads', title: 'Create One Reliable Inquiry Process', route: '/growth-conversation', reason: 'Once trusted, leads must be captured and organized reliably.', action: 'Consolidate all incoming lead sources into one tracker.', progress: 'Zero missed lead follow-ups.' };
    } else if (q1.includes('following up')) {
      priority1 = { category: 'Leads', title: 'Organize Lead Information and Follow-Up', route: '/operating-system', reason: 'You identified capturing leads as the biggest current challenge.', action: 'Establish clear response expectations and a tracking system.', progress: 'Increase in lead-to-appointment conversion rate.' };
      priority2 = { category: 'Relationships', title: 'Establish Ongoing Communication', route: '/relationship-builder', reason: 'After capturing leads, keeping them connected builds lifetime value.', action: 'Deploy a post-sale or check-in follow-up sequence.', progress: 'More repeat purchases or referrals.' };
    } else if (q1.includes('Operations') || q1.includes('Connecting tools')) {
      priority1 = { category: 'Operations', title: 'Document One Repeated Process and Reduce Data Entry', route: '/back-office-solutions', reason: 'You identified owner dependency and scattered tools as the bottleneck.', action: 'Determine the single source of truth for customer information.', progress: 'Reduction in hours spent on administrative tasks.' };
      priority2 = { category: 'Visibility', title: 'Clarify Website Messaging', route: '/services/website-rebuilds', reason: 'Once operations are stable, ensure your public message is clear.', action: 'Update website to clearly state what you do and who you serve.', progress: 'Lower website bounce rate.' };
    }

    // Blend Score if used
    if (useScore && hasScore && scoreData) {
      if (scoreData.lowest === 'Customer Relationships') {
        priority2 = { category: 'Customer Relationships', title: 'Create a Review and Communication Process', route: '/relationship-builder', reason: 'Your Business Score identified this as an area of vulnerability.', action: 'Start asking for referrals consistently.', progress: 'Growth in active customer communication.' };
      } else if (scoreData.lowest === 'Digital Foundation') {
        priority2 = { category: 'Digital Foundation', title: 'Strengthen the Core Website', route: '/free-audit', reason: 'Your Business Score identified foundational vulnerabilities.', action: 'Ensure website is fast, accessible, and clear.', progress: 'Higher engagement on the core website.' };
      }
    }

    let p1Pace = 'Next 30 Days';
    let p2Pace = 'Next 60–90 Days';
    if (q4.includes('Immediately')) {
      p1Pace = 'Next 14 Days';
    } else if (q4.includes('6–12 months')) {
      p1Pace = 'Next 60 Days';
      p2Pace = 'Next 3-6 Months';
    }

    const generated = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      answers: finalAnswers,
      scoreUsed: useScore ? scoreData : null,
      protect: q6,
      now: {
        label: p1Pace,
        title: priority1.title,
        category: priority1.category,
        reason: priority1.reason,
        action: priority1.action,
        progress: priority1.progress,
        route: priority1.route
      },
      next: {
        label: p2Pace,
        title: priority2.title,
        category: priority2.category,
        reason: priority2.reason,
        action: priority2.action,
        progress: priority2.progress,
        route: priority2.route
      },
      later: {
        label: 'Next 3–12 Months',
        title: priority3.title,
        category: priority3.category,
        reason: 'This longer-term capability becomes valuable after the foundation is stronger.',
        action: priority3.action,
        progress: priority3.progress,
        route: priority3.route
      }
    };

    localStorage.setItem('nta_growth_roadmap', JSON.stringify(generated));
    setSavedRoadmap(generated);
    setViewState('RESULT');

    // Trigger journey memory completion
    import('@/lib/journeyMemory').then(({ addRoadmap }) => {
      addRoadmap({ type: 'digital_strategy', date: new Date().toISOString() });
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!savedRoadmap) return;
    const text = `NTA Growth Roadmap™
Generated: ${new Date(savedRoadmap.timestamp).toLocaleDateString()}

PROTECT:
${savedRoadmap.protect || 'Existing systems'}

NOW (${savedRoadmap.now.label}):
Priority: ${savedRoadmap.now.title}
Action: ${savedRoadmap.now.action}

NEXT (${savedRoadmap.next.label}):
Priority: ${savedRoadmap.next.title}
Action: ${savedRoadmap.next.action}

LATER (${savedRoadmap.later.label}):
Priority: ${savedRoadmap.later.title}
Action: ${savedRoadmap.later.action}
`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    }).catch(() => {
      setCopyFeedback('Failed to copy');
    });
  };

  const wizardQuestions = [
    {
      q: "What needs the most attention right now?",
      options: [
        "Getting found by more customers",
        "Building trust and credibility",
        "Capturing and following up with leads",
        "Staying connected with customers",
        "Organizing operations and reducing owner dependency",
        "Connecting tools, data, and AI",
        "I am not sure yet"
      ]
    },
    {
      q: "What is causing the most frustration?",
      options: [
        "Not enough good leads",
        "Leads are not followed up consistently",
        "Too much depends on me",
        "Information is scattered or entered more than once",
        "Customers do not stay connected",
        "Marketing and content are inconsistent",
        "We have tools but no clear system"
      ]
    },
    {
      q: "What would create the greatest relief?",
      options: [
        "More consistent customer inquiries",
        "Clearer priorities",
        "Better follow-up",
        "Fewer repetitive tasks",
        "Better organization",
        "Less owner involvement in everyday work",
        "A clearer plan for using AI"
      ]
    },
    {
      q: "How quickly does something need to change?",
      options: [
        "Immediately",
        "Within the next 30 days",
        "Within the next 90 days",
        "Over the next 6–12 months",
        "I am still exploring"
      ]
    },
    {
      q: "What can the business realistically support now?",
      options: [
        "One small immediate improvement",
        "One focused project",
        "Several connected improvements",
        "A broader system build",
        "I am not sure yet"
      ]
    },
    {
      q: "What should not be disrupted?",
      options: [
        "Strong customer relationships",
        "Trusted employees",
        "Current website",
        "Existing lead sources",
        "Current software",
        "Community reputation",
        "A process that already works",
        "Nothing specific"
      ]
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      <SEOHead 
        title="NTA Growth Roadmap™ | Build the Right Priorities in the Right Order"
        description="Turn your Business Score into a practical sequence of immediate priorities, near-term improvements, and longer-term growth systems based on your business’s real needs and readiness."
      />
      <MarketingNav />

      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">
            The NTA Growth Roadmap™
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Turn What You Have Learned Into a Practical Order of Action
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            The Business Score helps show where the business is strong and where growth may be getting stuck. The Growth Roadmap turns that understanding into a clearer sequence of priorities, immediate actions, and longer-term improvements.
            <br /><br />
            The goal is not to create a larger to-do list. The goal is to help the business move forward without creating more confusion or unnecessary work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToRoadmap}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Build Your Growth Roadmap
            </button>
            <Link 
              to="/business-score" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
            >
              Take the Business Score First
            </Link>
          </div>
        </div>
      </section>

      {/* 2. What a roadmap should do */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            A Roadmap Should Create Focus
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <Shield className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Protect What Is Working</h3>
              <p className="text-slate-400 text-sm">Identify strong systems, relationships, processes, and capabilities that should not be disrupted.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <ShieldAlert className="w-8 h-8 text-rose-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Identify the Bottleneck</h3>
              <p className="text-slate-400 text-sm">Find the issue creating the greatest drag, dependency, lost opportunity, customer frustration, or owner overload.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <ListOrderedIcon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Choose the Right Sequence</h3>
              <p className="text-slate-400 text-sm">Separate what needs attention now from what should happen next and what can wait.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <Target className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Match the Plan to Reality</h3>
              <p className="text-slate-400 text-sm">Consider time, budget, staff, readiness, existing tools, and the owner’s ability to support change.</p>
            </div>
          </div>
          <div className="text-center">
            <div className="inline-block px-6 py-3 bg-blue-900/20 border border-blue-500/30 text-blue-300 rounded-xl text-lg font-medium">
              The best plan is not the biggest plan. It is the plan the business can actually follow.
            </div>
          </div>
        </div>
      </section>

      {/* 3. How the roadmap fits the NTA journey */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            From Clarity to Action
          </h2>
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4">
            <Link to="/growth-conversation" className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-colors group">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2 block">Step 1</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Growth Conversation</h3>
              <p className="text-slate-400 text-sm">Understand what is happening in the business.</p>
            </Link>
            <div className="hidden lg:flex items-center justify-center text-slate-700">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="flex lg:hidden justify-center text-slate-700 py-2">
              <ArrowDown className="w-6 h-6" />
            </div>
            
            <Link to="/business-score" className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-colors group">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2 block">Step 2</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Business Score</h3>
              <p className="text-slate-400 text-sm">Measure strengths, vulnerabilities, and connected growth areas.</p>
            </Link>
            <div className="hidden lg:flex items-center justify-center text-slate-700">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="flex lg:hidden justify-center text-slate-700 py-2">
              <ArrowDown className="w-6 h-6" />
            </div>

            <div className="flex-1 bg-blue-900/30 border border-blue-500/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.15)]">
              <span className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2 block">Step 3</span>
              <h3 className="text-xl font-bold text-white mb-2">Growth Roadmap</h3>
              <p className="text-blue-100/80 text-sm">Choose priorities and determine the right order of work.</p>
            </div>
            <div className="hidden lg:flex items-center justify-center text-slate-700">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="flex lg:hidden justify-center text-slate-700 py-2">
              <ArrowDown className="w-6 h-6" />
            </div>

            <Link to="/operating-system" className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-colors group">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2 block">Step 4</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Digital Growth Office</h3>
              <p className="text-slate-400 text-sm">Build and operate the connected system over time.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. What the roadmap considers */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            The Right Plan Looks at the Whole Business
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Visibility", desc: "How consistently the right people discover the business online." },
              { icon: Target, title: "Digital Foundation", desc: "Website, digital presence, listings, accessibility, and essential customer information." },
              { icon: MessageSquare, title: "Trust & Reputation", desc: "Reviews, messaging, reputation, proof, and customer confidence." },
              { icon: Activity, title: "Leads & Follow-Up", desc: "How inquiries are captured, answered, tracked, and moved forward." },
              { icon: Users, title: "Customer Relationships", desc: "Communication, retention, referrals, and ongoing connection." },
              { icon: Cpu, title: "Operations & Dependency", desc: "Scheduling, records, tasks, internal workflow, and owner dependency." },
              { icon: FileText, title: "Business Knowledge", desc: "How the owner’s and team’s experience is documented, organized, and reused." },
              { icon: Brain, title: "AI & Technology", desc: "Whether tools support the business or create more confusion and duplication." },
              { icon: Map, title: "Community Presence", desc: "Local connections, partnerships, and localized visibility." },
              { icon: TrendingUp, title: "Growth Systems", desc: "Repeatable processes for sustained business growth." },
              { icon: CheckCircle, title: "Goals & Readiness", desc: "Urgency, budget, leadership capacity, and ability to implement change." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4">
                <item.icon className="w-6 h-6 text-slate-500 shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expectation setting */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <p className="text-lg text-slate-300">
            Answer based on the business as it operates today. The roadmap is most useful when it reflects the real limits, frustrations, priorities, and readiness of the business.
            <br/><br/>
            <span className="font-semibold text-white">You are not committing to a package by creating a roadmap.</span>
          </p>
        </div>
      </section>

      {/* 5, 6, 10. The Roadmap Result Container / Wizard */}
      <section ref={roadmapRef} className="py-16 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          
          {viewState === 'START' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
              {savedRoadmap ? (
                <>
                  <h2 className="text-3xl font-bold text-white mb-6">You Have a Saved Roadmap</h2>
                  <p className="text-slate-400 mb-8">We found a roadmap generated on {new Date(savedRoadmap.timestamp).toLocaleDateString()}.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setViewState('RESULT')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                      View Saved Roadmap
                    </button>
                    <button onClick={handleStartWizard} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl transition-all">
                      Build a New Roadmap
                    </button>
                  </div>
                </>
              ) : hasScore ? (
                <>
                  <h2 className="text-3xl font-bold text-white mb-6">We Found Your Business Score</h2>
                  <p className="text-slate-400 mb-8">We can use your recent NTA Business Score result (Overall: {scoreData.overall}) to help organize this roadmap.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => handleUseScore(true)} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                      Use My Business Score
                    </button>
                    <button onClick={() => handleUseScore(false)} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl transition-all">
                      Build Without It
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-6">Start Your Roadmap</h2>
                  <p className="text-slate-400 mb-8">The Business Score provides the strongest foundation for creating a useful roadmap.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/business-score" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                      Take the Business Score First
                    </Link>
                    <button onClick={handleStartWizard} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl transition-all">
                      Continue Without a Score
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {viewState === 'WIZARD' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${(wizardStep / wizardQuestions.length) * 100}%` }}
                />
              </div>
              <div className="mb-6 text-blue-400 font-medium tracking-widest uppercase text-sm">
                Question {wizardStep + 1} of {wizardQuestions.length}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">{wizardQuestions[wizardStep].q}</h3>
              <div className="space-y-3">
                {wizardQuestions[wizardStep].options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(wizardStep, opt)}
                    className="w-full text-left p-5 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all text-lg text-slate-200 flex justify-between items-center group focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>{opt}</span>
                    <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {viewState === 'RESULT' && savedRoadmap && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-slate-950 px-6 py-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                    <Map className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-xl">Your Growth Roadmap™</h2>
                    <p className="text-sm text-slate-400">Generated {new Date(savedRoadmap.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors border border-slate-700 flex">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button onClick={handleCopy} className="flex-1 sm:flex-none justify-center items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors flex relative">
                    <Copy className="w-4 h-4" /> {copyFeedback || 'Copy Roadmap'}
                  </button>
                </div>
              </div>
              
              <div className="p-8 md:p-10 space-y-10">
                {/* Protect */}
                <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-2xl">
                  <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Do Not Break What Is Already Working
                  </h3>
                  <p className="text-slate-300 text-lg">
                    <strong>Protect:</strong> {savedRoadmap.protect}
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Growth planning should actively identify and protect strong points. Progress should enhance your existing strengths, not erase them.
                  </p>
                </div>

                {/* Horizons */}
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-0.5 before:bg-slate-800">
                  
                  {/* NOW */}
                  <div className="relative flex items-start gap-6">
                    <div className={`w-11 h-11 rounded-full border-4 border-slate-900 bg-rose-500 flex items-center justify-center shadow shrink-0 z-10 text-white font-bold text-sm`}>
                      1
                    </div>
                    <div className="flex-1 p-6 md:p-8 rounded-2xl bg-slate-950 border border-slate-800">
                      <h4 className="font-bold text-white text-xl mb-1">Now</h4>
                      <p className="text-sm font-semibold uppercase tracking-wider text-rose-400 mb-6">{savedRoadmap.now.label}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Primary Priority</p>
                          <p className="text-white text-lg font-medium">{savedRoadmap.now.title}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Why it matters</p>
                          <p className="text-slate-300">{savedRoadmap.now.reason}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Practical First Action</p>
                          <p className="text-slate-300">{savedRoadmap.now.action}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Sign of Progress</p>
                          <p className="text-slate-300">{savedRoadmap.now.progress}</p>
                        </div>
                        {savedRoadmap.now.route && (
                          <div className="pt-4">
                            <Link to={savedRoadmap.now.route} className="text-rose-400 hover:text-rose-300 font-medium text-sm flex items-center gap-1">
                              View Related Resource <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NEXT */}
                  <div className="relative flex items-start gap-6">
                    <div className={`w-11 h-11 rounded-full border-4 border-slate-900 bg-amber-500 flex items-center justify-center shadow shrink-0 z-10 text-white font-bold text-sm`}>
                      2
                    </div>
                    <div className="flex-1 p-6 md:p-8 rounded-2xl bg-slate-950 border border-slate-800">
                      <h4 className="font-bold text-white text-xl mb-1">Next</h4>
                      <p className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-6">{savedRoadmap.next.label}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">System Improvement</p>
                          <p className="text-white text-lg font-medium">{savedRoadmap.next.title}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Why it follows</p>
                          <p className="text-slate-300">{savedRoadmap.next.reason}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Implementation Step</p>
                          <p className="text-slate-300">{savedRoadmap.next.action}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Sign of Progress</p>
                          <p className="text-slate-300">{savedRoadmap.next.progress}</p>
                        </div>
                        {savedRoadmap.next.route && (
                          <div className="pt-4">
                            <Link to={savedRoadmap.next.route} className="text-amber-400 hover:text-amber-300 font-medium text-sm flex items-center gap-1">
                              View Related Resource <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* LATER */}
                  <div className="relative flex items-start gap-6">
                    <div className={`w-11 h-11 rounded-full border-4 border-slate-900 bg-blue-500 flex items-center justify-center shadow shrink-0 z-10 text-white font-bold text-sm`}>
                      3
                    </div>
                    <div className="flex-1 p-6 md:p-8 rounded-2xl bg-slate-950 border border-slate-800">
                      <h4 className="font-bold text-white text-xl mb-1">Later</h4>
                      <p className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-6">{savedRoadmap.later.label}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Long-term Capability</p>
                          <p className="text-white text-lg font-medium">{savedRoadmap.later.title}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Why it should wait</p>
                          <p className="text-slate-300">{savedRoadmap.later.reason}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Preparation Step</p>
                          <p className="text-slate-300">{savedRoadmap.later.action}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Sign of Progress</p>
                          <p className="text-slate-300">{savedRoadmap.later.progress}</p>
                        </div>
                        {savedRoadmap.later.route && (
                          <div className="pt-4">
                            <Link to={savedRoadmap.later.route} className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-1">
                              View Related Resource <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* How to use the roadmap */}
                <div className="mt-12 bg-blue-900/10 border border-blue-500/20 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4">How to Use This Roadmap</h3>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> <strong>Review it:</strong> Share and discuss this sequence with your leadership team.</li>
                    <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> <strong>Choose one immediate priority:</strong> Start with the "Now" phase. Focus beats volume.</li>
                    <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> <strong>Assign responsibility:</strong> Determine who owns the execution of the first step.</li>
                    <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> <strong>Decide what should wait:</strong> Explicitly delay the "Next" and "Later" phases until the foundation is secure.</li>
                    <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-blue-400 shrink-0" /> <strong>Revisit:</strong> Return to this plan and update it as the business changes and grows.</li>
                  </ul>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center">
                  <button onClick={handleStartWizard} className="flex items-center gap-2 mx-auto text-slate-400 hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" /> Start Over
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* 7. Priority hierarchy */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Not Every Recommendation Has Equal Weight
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-rose-400 mb-3">Critical</h3>
              <p className="text-slate-300 text-sm">An issue causing immediate risk, lost revenue, customer frustration, or operational breakdown. These require attention now.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-amber-400 mb-3">Important</h3>
              <p className="text-slate-300 text-sm">A meaningful improvement that should follow once urgent problems are controlled and a foundation is set.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Strategic</h3>
              <p className="text-slate-300 text-sm">A longer-term capability that can create leverage, consistency, or scale after the business is stabilized.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. What should be protected */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Do Not Break What Is Already Working
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed mb-10">
            Growth planning should actively identify and protect your strong customer relationships, effective processes, trusted employees, valuable tools, owner expertise, reliable lead sources, community reputation, and systems customers already understand.
          </p>
          <p className="text-lg text-emerald-400 font-medium">
            Progress should enhance your existing strengths, not erase them.
          </p>
        </div>
      </section>

      {/* 9. Recommended next steps */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Choose the Next Level of Help
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link to="/growth-conversation" className="bg-slate-900 border border-slate-800 hover:border-blue-500 p-8 rounded-2xl group transition-all">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Talk Through the Roadmap</h3>
              <p className="text-sm text-slate-400 mb-6">Review what is working, what is creating the greatest drag, and whether the order of priorities fits the reality of the business.</p>
              <span className="text-blue-400 font-medium text-sm flex items-center gap-1">Start Conversation <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link to="/operating-system" className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-8 rounded-2xl group transition-all">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">Explore the Digital Growth Office</h3>
              <p className="text-sm text-slate-400 mb-6">See how NTA connects marketing, customer relationships, business knowledge, AI, and operations into one working environment.</p>
              <span className="text-indigo-400 font-medium text-sm flex items-center gap-1">Explore System <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link to="/free-audit" className="bg-slate-900 border border-slate-800 hover:border-purple-500 p-8 rounded-2xl group transition-all">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Request a Focused Gap Audit</h3>
              <p className="text-sm text-slate-400 mb-6">Take a deeper look at a specific part of the business before committing to a larger implementation.</p>
              <span className="text-purple-400 font-medium text-sm flex items-center gap-1">Get an Audit <ArrowRight className="w-4 h-4" /></span>
            </Link>

            <Link to="/book-call" className="bg-slate-900 border border-slate-800 hover:border-emerald-500 p-8 rounded-2xl group transition-all">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Book a Direct Conversation</h3>
              <p className="text-sm text-slate-400 mb-6">Speak with an NTA advisor directly to figure out exactly where to apply your focus based on this plan.</p>
              <span className="text-emerald-400 font-medium text-sm flex items-center gap-1">Book a Call <ArrowRight className="w-4 h-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Final CTA */}
      <section className="py-24 px-6 text-center bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">A Clear Order Makes Growth More Manageable</h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            You do not need to solve every problem today. Start with the issue that matters most, protect what is already working, and build the next capability when the business is ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartWizard}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Build Your Growth Roadmap
            </button>
            <Link 
              to="/operating-system" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
            >
              Explore the Digital Growth Office
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const ListOrderedIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="10" x2="21" y1="6" y2="6"/>
    <line x1="10" x2="21" y1="12" y2="12"/>
    <line x1="10" x2="21" y1="18" y2="18"/>
    <path d="M4 6h1v4"/>
    <path d="M4 10h2"/>
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
  </svg>
);