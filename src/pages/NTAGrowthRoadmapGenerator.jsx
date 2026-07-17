import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Lock, Calendar, Target, Map, 
  ShieldAlert, Cpu, Users, ArrowRight, CheckCircle2, TrendingUp, 
  MessageSquare, Globe, ArrowDown, Activity, Lightbulb, Shield,
  Brain, FileText, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function NTAGrowthRoadmapGenerator() {
  const roadmapRef = useRef(null);

  // Record this step in memory
  useEffect(() => {
    import('@/lib/journeyMemory').then(({ addRoadmap }) => {
       addRoadmap({ type: 'digital_strategy', date: new Date().toISOString() });
    });
  }, []);

  // Reusable state holding all roadmap data for future PDF generation & API sync
  const [roadmapData] = useState({
    businessName: "Sample Business LLC",
    growthStage: "Build",
    overallScore: 42,
    audienceType: "Local Business Owner",
    dateGenerated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    priorities: [
      "Establish foundational digital trust across key local directories.",
      "Fix inconsistent business listings and claim missing profiles.",
      "Launch an automated review capture system to build reputation."
    ],
    recommendedModules: [
      { name: "NTA Business Score™", status: "Completed", icon: <Target className="w-5 h-5"/> },
      { name: "Growth Roadmap™", status: "Current", icon: <Map className="w-5 h-5"/> },
      { name: "Visibility Audit™", status: "Next Step", icon: <ShieldAlert className="w-5 h-5"/> },
      { name: "Relationship Builder™", status: "Upcoming", icon: <Users className="w-5 h-5"/> }
    ],
    actionPlan90: [
      {
        month: "Month 1: Foundation",
        tasks: [
          "Claim and optimize Google Business Profile.",
          "Standardize Name, Address, Phone (NAP) across top 50 directories.",
          "Ensure website meets basic mobile and speed compliance."
        ]
      },
      {
        month: "Month 2: Trust & Reputation",
        tasks: [
          "Implement automated SMS review requests for new customers.",
          "Draft initial 'Founder Story' messaging for social proof.",
          "Connect core analytics to track baseline traffic."
        ]
      },
      {
        month: "Month 3: Content Baseline",
        tasks: [
          "Publish 3 foundational SEO service pages.",
          "Launch basic social media presence (2 posts/week).",
          "Conduct first 90-day review and strategy adjustment."
        ]
      }
    ],
    vision6Month: "Transition from unpredictable word-of-mouth to a reliable, search-driven lead engine with a self-sustaining review capture system.",
    vision12Month: "Become the undisputed market leader in your local service category, completely automating foundational relationship building and lead nurturing.",
    opportunities: {
      community: {
        title: "Community Partner Integrations",
        desc: "Partner with the local Chamber of Commerce to cross-promote services and leverage their domain authority."
      },
      ai: {
        title: "AI & Automation",
        desc: "Deploy an AI-powered conversational agent to capture after-hours leads and answer common service questions automatically."
      },
      relationship: {
        title: "Relationship Nurturing",
        desc: "Implement a VIP customer follow-up sequence to encourage repeat business and high-value referrals."
      }
    }
  });

  const scrollToRoadmap = () => {
    roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

      {/* 5, 6, 10. The Roadmap Result Container */}
      <section ref={roadmapRef} className="py-16 px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          {/* Header Bar within Result */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl overflow-hidden">
            <div className="px-6 py-6 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <Map className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-xl md:text-2xl leading-tight">Growth Roadmap™</h2>
                  <p className="text-sm text-slate-400">For {roadmapData.businessName} • Generated {roadmapData.dateGenerated}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none justify-center items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl transition-colors border border-slate-700 flex">
                  <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span> Public Version
                </button>
                <button className="flex-1 md:flex-none justify-center items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)] flex">
                  <Lock className="w-4 h-4" /> Unlock Full Roadmap
                </button>
              </div>
            </div>

            <div className="p-8 md:p-10">
              {/* Executive Summary in Roadmap */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-1 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">
                  <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-2">Overall Score</p>
                  <div className="text-6xl font-black text-white mb-2">
                    {roadmapData.overallScore}<span className="text-2xl text-slate-600">/100</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                    <TrendingUp className="w-4 h-4" /> Stage: {roadmapData.growthStage}
                  </div>
                </div>
                <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-4">Initial Priorities</h3>
                  <ul className="space-y-3">
                    {roadmapData.priorities.map((priority, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                        <span>{priority}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Time Horizons: Now, Next, Later */}
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Recommended Sequence</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-0.5 before:bg-slate-800">
                {[
                  { label: "Now", timeframe: "Next 30 Days", data: roadmapData.actionPlan90[0], color: "text-rose-400", bg: "bg-rose-500", border: "border-rose-500/30", bgLight: "bg-rose-500/10" },
                  { label: "Next", timeframe: "Next 60–90 Days", data: roadmapData.actionPlan90[1], color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/30", bgLight: "bg-amber-500/10" },
                  { label: "Later", timeframe: "Next 3–12 Months", data: roadmapData.actionPlan90[2], color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/30", bgLight: "bg-blue-500/10" }
                ].map((phase, idx) => (
                  <div key={idx} className="relative flex items-start gap-6">
                    <div className={`w-11 h-11 rounded-full border-4 border-slate-900 ${phase.bg} flex items-center justify-center shadow shrink-0 z-10 text-white font-bold text-sm`}>
                      {idx + 1}
                    </div>
                    <div className={`flex-1 p-6 md:p-8 rounded-2xl bg-slate-950 border border-slate-800`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <h4 className="font-bold text-white text-xl flex items-center gap-3">
                            {phase.label} <span className="text-slate-500 font-normal text-base">| {phase.data.month}</span>
                          </h4>
                          <p className={`text-sm font-semibold uppercase tracking-wider ${phase.color} mt-1`}>
                            Timeframe: {phase.timeframe}
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50">
                        <h5 className="text-white font-medium mb-3 text-sm">Focus Objectives:</h5>
                        <ul className="space-y-3">
                          {phase.data.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="text-slate-300 text-sm flex gap-3 items-start">
                              <span className={`${phase.color} mt-0.5`}>•</span> {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Long Term Vision / Capabilities */}
              <div className="mt-12 grid md:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-3">6-Month Vision</h4>
                  <p className="text-slate-200 text-base leading-relaxed">{roadmapData.vision6Month}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-3">12-Month Vision</h4>
                  <p className="text-slate-200 text-base leading-relaxed">{roadmapData.vision12Month}</p>
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

            </div>
          </div>
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
              onClick={scrollToRoadmap}
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