import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Compass, Layers, Users, Brain, 
  ChevronDown, MonitorPlay, Zap, Globe, MessageSquare, 
  BarChart, ArrowUpRight, Cpu, Target
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function NTAOperatingSystem() {
  const [activeStage, setActiveStage] = useState('Discover');
  const [activeModule, setActiveModule] = useState(null);

  const stages = [
    { id: 'Discover', title: 'Discover', desc: 'Understand where you are today.' },
    { id: 'Build', title: 'Build', desc: 'Create the digital foundation every business needs.' },
    { id: 'Grow', title: 'Grow', desc: 'Increase visibility and customer acquisition.' },
    { id: 'Lead', title: 'Lead', desc: 'Become a trusted leader in your community.' },
    { id: 'Connect', title: 'Connect', desc: 'Strengthen customer relationships and long-term loyalty.' },
    { id: 'Elevate', title: 'Elevate', desc: 'Build an organization prepared for long-term growth.' }
  ];

  const discoveryCards = [
    {
      title: "Business Growth Conversation™",
      purpose: "Evaluate your digital visibility, trust, and growth readiness.",
      time: "10 mins",
      who: "Business Owners",
      link: "/growth-conversation",
      icon: Target
    },
    {
      title: "Community Growth Conversation™",
      purpose: "See how community partners bring value and education to local businesses.",
      time: "10 mins",
      who: "Community Leaders",
      link: "/community-growth-conversation",
      icon: Users
    },
    {
      title: "AI Learning Conversation™",
      purpose: "A guided journey into how AI impacts search and business visibility.",
      time: "15 mins",
      who: "AI Learners",
      link: "/learning-center",
      icon: Brain
    },
    {
      title: "Growth Navigator™",
      purpose: "Find your exact next step in the digital landscape.",
      time: "5 mins",
      who: "Everyone",
      link: "/growth-navigator",
      icon: Compass
    },
    {
      title: "Relationship Builder™",
      purpose: "Discover simple systems for managing referrals and reviews.",
      time: "10 mins",
      who: "Business Owners",
      link: "/relationship-builder",
      icon: MessageSquare
    },
    {
      title: "Growth Roadmap™",
      purpose: "An actionable plan to improve your visibility and conversion systems.",
      time: "15 mins",
      who: "Business Owners",
      link: "/free-audit",
      icon: Layers
    },
    {
      title: "Growth Framework™",
      purpose: "Understand the underlying logic of the NTA Operating System.",
      time: "5 mins",
      who: "Everyone",
      link: "/start",
      icon: Cpu
    }
  ];

  const modules = [
    {
      id: 'visibility',
      title: 'Visibility',
      icon: Globe,
      systems: ['Website Architecture', 'Search Engine Optimization (SEO)', 'Content Strategy', 'Digital Advertising', 'Reputation & Reviews']
    },
    {
      id: 'relationships',
      title: 'Customer Relationships',
      icon: MessageSquare,
      systems: ['CRM Implementation', 'AI Automation Flows', 'Lifecycle Analytics', 'Follow-up Systems']
    },
    {
      id: 'community',
      title: 'Community Partnerships',
      icon: Users,
      systems: ['Partner Training', 'Enablement Tools', 'Co-Marketing Campaigns', 'Revenue Share Tracking']
    }
  ];

  const journeys = [
    {
      title: "Business Owner",
      begins: "Business Growth Conversation™",
      roadmap: "Growth Roadmap™",
      guidance: "Delivers exactly the right tools and strategies at the moment your business is ready to support them, preventing overwhelm."
    },
    {
      title: "Community Leader",
      begins: "Community Growth Conversation™",
      roadmap: "Partnership Growth Plan",
      guidance: "Provides the educational resources and frameworks needed to elevate the local businesses you serve."
    },
    {
      title: "AI Learner",
      begins: "AI Learning Conversation™",
      roadmap: "AI Integration Roadmap",
      guidance: "Translates complex AI concepts into practical, everyday business applications and workflows."
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <SEOHead 
        title="NTA Operating System™ | New Tech Advertising"
        description="The visual command center of the NTA Operating System. A system for continuous growth."
      />

      {/* Opening Screen (Hero) */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-blue-400 text-sm font-medium tracking-wide uppercase mb-8 backdrop-blur-md shadow-2xl"
          >
            <Cpu className="w-4 h-4" /> NTA Operating System™
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight mb-8"
          >
            Welcome to the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">NTA Operating System™</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-slate-300 font-medium mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Helping local businesses confidently navigate the digital world.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl text-slate-400 mb-16 space-y-2"
          >
            <p>Technology changes. People don't.</p>
            <p>Businesses don't need more marketing.</p>
            <p className="text-blue-300 font-medium pt-2">They need a system for continuous growth.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <a href="#stages" className="inline-flex items-center gap-3 bg-white text-slate-950 font-semibold px-8 py-4 rounded-full text-lg hover:bg-blue-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105">
              Explore the Operating System <ArrowDownIcon className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Growth Stages */}
      <section id="stages" className="py-32 relative border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The Growth Stages</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">A predictable, sequential path moving you from uncertainty to market leadership.</p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-indigo-500/20 to-transparent md:-translate-x-1/2"></div>
            
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="w-full md:w-1/2 flex justify-start md:justify-end md:px-8">
                    {/* Empty space for alternating layout */}
                    <div className={`hidden md:block ${index % 2 === 0 ? '' : 'hidden'}`}></div>
                  </div>
                  
                  {/* Node */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] border-4 border-slate-950 md:-translate-x-1/2 z-10"></div>
                  
                  {/* Content Card */}
                  <div className={`w-full pl-20 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                    <div 
                      onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                      className={`cursor-pointer group p-6 rounded-3xl border transition-all duration-300 backdrop-blur-sm ${activeStage === stage.id ? 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
                    >
                      <h3 className={`text-2xl font-bold mb-2 transition-colors ${activeStage === stage.id ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {stage.title}
                      </h3>
                      <AnimatePresence>
                        {activeStage === stage.id && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-lg text-blue-200 mt-4 leading-relaxed"
                          >
                            {stage.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Discovery System */}
      <section className="py-32 relative border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">The NTA Discovery System™</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Premium interactive experiences designed to diagnose, educate, and chart your course.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoveryCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-slate-900/40 border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <card.icon className="w-32 h-32 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
                </div>
                
                <div className="relative z-10 flex-1">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                    <card.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed flex-1">{card.purpose}</p>
                  
                  <div className="space-y-3 mb-8 text-sm">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Estimated Time</span>
                      <span className="text-slate-300 font-medium">{card.time}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Designed For</span>
                      <span className="text-slate-300 font-medium">{card.who}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto pt-4">
                  <Link to={card.link} className="inline-flex items-center gap-2 text-blue-400 font-semibold group-hover:text-blue-300 transition-colors w-full justify-center bg-blue-500/10 hover:bg-blue-500/20 py-3 rounded-xl">
                    Launch Module <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Operating Modules */}
      <section className="py-32 relative border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Operating Modules</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              We do not sell these as standalone services. <br className="hidden md:block"/>
              They are comprehensive systems activated only when a Growth Roadmap™ recommends them.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {modules.map((mod, index) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                className={`cursor-pointer rounded-3xl border transition-all duration-300 overflow-hidden ${activeModule === mod.id ? 'bg-indigo-900/20 border-indigo-500/40 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'}`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${activeModule === mod.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                      <mod.icon className="w-7 h-7" />
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${activeModule === mod.id ? 'rotate-180' : ''}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{mod.title}</h3>
                  <p className="text-slate-400 text-sm">Tap to view activated systems</p>
                </div>
                
                <AnimatePresence>
                  {activeModule === mod.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-indigo-500/20 bg-indigo-950/20"
                    >
                      <ul className="p-8 space-y-4">
                        {mod.systems.map((sys, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-300">
                            <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{sys}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Three Guided Journeys */}
      <section className="py-32 relative border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Three Guided Journeys</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">The Operating System adapts entirely to who you are and what you need to achieve.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {journeys.map((journey, index) => (
              <motion.div
                key={journey.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-3xl p-8 lg:p-10 relative overflow-hidden group hover:border-blue-500/50 transition-colors"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/20 transition-colors"></div>
                
                <h3 className="text-3xl font-bold text-white mb-8 relative z-10">{journey.title}</h3>
                
                <div className="space-y-8 relative z-10">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Begins With</span>
                    <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-blue-300 font-medium">
                      {journey.begins}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Receives</span>
                    <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-indigo-300 font-medium">
                      {journey.roadmap}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">How It Guides You</span>
                    <p className="text-slate-300 leading-relaxed">
                      {journey.guidance}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Operating Philosophy */}
      <section className="py-40 relative border-t border-slate-800/50 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 z-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-white mb-12 leading-tight">
              "We don't sell marketing.<br/>
              <span className="text-slate-400">We help business owners understand how to grow."</span>
            </h2>
            
            <div className="w-24 h-px bg-blue-500/50 mx-auto mb-12"></div>
            
            <div className="text-2xl md:text-3xl text-slate-300 space-y-4 font-light tracking-wide">
              <p>Technology changes.</p>
              <p>People don't.</p>
              <p className="text-blue-400 font-medium mt-6">Strong businesses build strong communities.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 6: Future Vision */}
      <section className="py-32 relative border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            
            <MonitorPlay className="w-16 h-16 text-indigo-400 mx-auto mb-8 relative z-10" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 relative z-10 tracking-tight">
              Your Business Never Stops Growing.
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto relative z-10 font-light">
              The NTA Operating System™ is not a static product. It is designed to <span className="text-white font-medium">evolve alongside you</span>, introducing the exact right tools, systems, and education required for your next stage of growth, precisely when you're ready for them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Closing Screen */}
      <section className="py-40 relative border-t border-slate-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/5 z-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight"
          >
            Every Great Business <br/>
            <span className="text-blue-400">Runs on a System.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-16 max-w-3xl mx-auto"
          >
            The NTA Operating System™ helps business owners replace uncertainty with confidence by providing clear guidance, practical education, and proven systems that evolve as their business grows.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
          >
            <Link to="/growth-navigator" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25">
              Start My Discovery <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/book-call" className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600">
              Meet With Rick <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/community-partner" className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600">
              Become a Community Partner <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/learning-center" className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600">
              Explore AI Learning <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

// Inline Icon to keep imports clean for simple uses
function ArrowDownIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  );
}