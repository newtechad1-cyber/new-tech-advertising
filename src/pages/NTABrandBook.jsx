import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Target, Compass, Sparkles, HeartHandshake, 
  Zap, CheckCircle2, GraduationCap, MapPin, 
  Unlock, Lightbulb, TrendingUp, Layers, Users, 
  MessageSquare, LayoutTemplate, Briefcase, FileText, Bot, 
  PlayCircle, Search, MonitorSmartphone
} from 'lucide-react';

export default function NTABrandBook() {
  // 10 Principles
  const principles = [
    { title: "Education Before Automation", icon: <GraduationCap className="text-blue-500 w-6 h-6" /> },
    { title: "Relationships Are the Greatest Business Asset", icon: <HeartHandshake className="text-blue-500 w-6 h-6" /> },
    { title: "Simplicity Creates Growth", icon: <Sparkles className="text-blue-500 w-6 h-6" /> },
    { title: "AI Should Empower People", icon: <Zap className="text-blue-500 w-6 h-6" /> },
    { title: "Growth Is Built One Step at a Time", icon: <TrendingUp className="text-blue-500 w-6 h-6" /> },
    { title: "Local Businesses Matter", icon: <MapPin className="text-blue-500 w-6 h-6" /> },
    { title: "Teach Independence", icon: <Unlock className="text-blue-500 w-6 h-6" /> },
    { title: "Never Stop Learning", icon: <BookOpen className="text-blue-500 w-6 h-6" /> },
    { title: "Innovation Must Serve Purpose", icon: <Lightbulb className="text-blue-500 w-6 h-6" /> },
    { title: "Leave Every Business Better Than We Found It", icon: <CheckCircle2 className="text-blue-500 w-6 h-6" /> }
  ];

  const osSteps = [
    "Visibility", "Education", "Trust", "Relationships", "Automation", "Sustainable Growth"
  ];

  const ecosystem = [
    { name: "Digital Visibility Audit™", icon: <Search className="w-5 h-5 text-blue-400" /> },
    { name: "Digital Growth Guide™", icon: <Bot className="w-5 h-5 text-blue-400" /> },
    { name: "Growth Roadmap™", icon: <MapPin className="w-5 h-5 text-blue-400" /> },
    { name: "Relationship Builder™", icon: <HeartHandshake className="w-5 h-5 text-blue-400" /> },
    { name: "AI Learning Center™", icon: <GraduationCap className="w-5 h-5 text-blue-400" /> },
    { name: "Community Partner Program™", icon: <Users className="w-5 h-5 text-blue-400" /> },
    { name: "Discovery Meeting™", icon: <MessageSquare className="w-5 h-5 text-blue-400" /> },
    { name: "Monthly Growth System™", icon: <Layers className="w-5 h-5 text-blue-400" /> }
  ];

  const voiceTraits = [
    "Clear", "Practical", "Educational", "Encouraging", "Honest", "Friendly", "Never overly technical"
  ];

  const kbNavigation = [
    { title: "Brand Book", active: true, icon: <BookOpen className="w-5 h-5" /> },
    { title: "NTA Operating System", icon: <MonitorSmartphone className="w-5 h-5" /> },
    { title: "Founder's Handbook", icon: <Briefcase className="w-5 h-5" /> },
    { title: "Partner Program", icon: <Users className="w-5 h-5" /> },
    { title: "Media Partners", icon: <PlayCircle className="w-5 h-5" /> },
    { title: "AI Learning Center", icon: <GraduationCap className="w-5 h-5" /> },
    { title: "Sales Scripts", icon: <MessageSquare className="w-5 h-5" /> },
    { title: "Prompt Library", icon: <FileText className="w-5 h-5" /> },
    { title: "NTA Playbook", icon: <LayoutTemplate className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
          >
            <BookOpen className="w-4 h-4" />
            The NTA Knowledge Base™
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
          >
            The NTA Brand Book™
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            The foundation behind the NTA Operating System™ — built to help small businesses grow through education, AI, relationships, and practical systems.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/operating-system" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
              Explore the NTA Operating System™
            </Link>
            <Link to="/book-call" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-semibold transition-all backdrop-blur-sm">
              Schedule a Discovery Meeting
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2 & 3. Why NTA Exists & Founder's Letter */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-4">
                <Target className="w-5 h-5" />
                Why NTA Exists
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Replacing Confusion With Clarity</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Small businesses are not failing because they lack passion. They struggle because the digital world has become complicated, fragmented, and overwhelming.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                NTA exists to simplify that world. We believe that technology should be a tool that empowers, not a burden that distracts.
              </p>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative">
              <div className="absolute top-8 right-8 text-blue-100 opacity-50">
                <BookOpen size={80} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 relative z-10">A Letter from the Founder</h3>
              <div className="space-y-4 text-slate-600 leading-relaxed mb-8 relative z-10 text-lg">
                <p>
                  "After decades of working with small businesses, I saw owners being sold websites, ads, tools, and software they didn’t fully understand."
                </p>
                <p className="font-medium text-slate-800">
                  "The industry was selling confusion, not solutions."
                </p>
                <p>
                  "NTA was created to replace that confusion with clarity, giving local businesses the honest foundation they need to thrive."
                </p>
              </div>
              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-slate-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  RH
                </div>
                <div>
                  <div className="font-bold text-slate-900">Rick Hesse</div>
                  <div className="text-sm text-slate-500">Founder, New Tech Advertising</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 & 5. Mission & Vision */}
      <section className="py-24 bg-slate-50 border-y border-slate-200/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 text-white p-12 rounded-3xl relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={120} />
              </div>
              <div className="inline-flex items-center gap-2 text-blue-400 font-semibold mb-6">
                <Target className="w-5 h-5" />
                Our Mission
              </div>
              <p className="text-xl leading-relaxed text-slate-300 font-medium">
                "To empower small businesses through education, practical AI, and proven growth systems that simplify technology and create lasting customer relationships."
              </p>
            </div>
            <div className="bg-blue-600 text-white p-12 rounded-3xl relative overflow-hidden group shadow-lg shadow-blue-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Compass size={120} />
              </div>
              <div className="inline-flex items-center gap-2 text-blue-100 font-semibold mb-6">
                <Compass className="w-5 h-5" />
                Our Vision
              </div>
              <p className="text-xl leading-relaxed text-blue-50 font-medium">
                "To become the trusted digital growth platform for local businesses, helping communities thrive by making modern technology understandable, accessible, and useful."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The NTA Principles™ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">The NTA Principles™</h2>
            <p className="text-lg text-slate-600">The core beliefs that guide every product we build, every service we offer, and every conversation we have.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {principles.map((principle, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {principle.icon}
                </div>
                <h3 className="font-bold text-slate-900 leading-snug">{principle.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. The NTA Operating System™ & 8. Product Ecosystem */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6">
              <Layers className="w-4 h-4" />
              Ecosystem
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">The NTA Operating System™</h2>
            <p className="text-xl text-slate-300">
              NTA’s services are not disconnected products. They are applications inside one connected operating system for growth.
            </p>
          </div>

          {/* OS Flow */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
            <div className="hidden md:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 -translate-y-1/2 rounded-full w-full opacity-50" />
            
            {osSteps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center mb-8 md:mb-0">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-blue-400 font-bold mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  {idx + 1}
                </div>
                <div className="font-semibold text-slate-200">{step}</div>
              </div>
            ))}
          </div>

          {/* Ecosystem Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystem.map((product, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors flex items-start gap-4">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                  {product.icon}
                </div>
                <div className="font-medium text-slate-200 mt-1">{product.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 & 10. Brand Voice & How to Use */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <MessageSquare className="text-blue-500" /> 
                Our Brand Voice
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Every communication from New Tech Advertising should reflect who we are and respect the intelligence of the business owners we serve.
              </p>
              <div className="flex flex-wrap gap-3">
                {voiceTraits.map((trait, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm border border-blue-100">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <LayoutTemplate className="text-blue-500" /> 
                How to Use This Book
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                This Brand Book is the definitive guide for all NTA communications. Use it to align:
              </p>
              <ul className="space-y-3">
                {[
                  "Website copy and structure",
                  "Sales conversations and pitches",
                  "Partner presentations",
                  "AI system prompts and logic",
                  "Community outreach",
                  "Media partnerships and press",
                  "Future internal training"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Knowledge Base Navigation */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore the Knowledge Base</h2>
            <p className="text-slate-600">Access the core documentation, guides, and playbooks that power the NTA Operating System™.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {kbNavigation.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                  item.active 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer text-slate-700 hover:text-blue-600'
                }`}
              >
                <div className={`p-3 rounded-xl ${item.active ? 'bg-white/20' : 'bg-white border border-slate-200'}`}>
                  {item.icon}
                </div>
                <div className="font-semibold">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Final CTA */}
      <section className="py-24 bg-blue-600 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to see how the NTA Operating System™ can help your business grow?</h2>
          <p className="text-xl text-blue-100 mb-10">Join the local businesses and community partners leading the way.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/book-call" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 hover:bg-slate-50 rounded-full font-bold transition-colors shadow-lg">
              Schedule a Discovery Meeting
            </Link>
            <Link to="/community-partner" className="w-full sm:w-auto px-8 py-4 bg-blue-700 hover:bg-blue-800 border border-blue-500 text-white rounded-full font-bold transition-colors">
              Become a Community Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}