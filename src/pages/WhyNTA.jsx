import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, CheckCircle2, XCircle, ArrowRight, Lightbulb, Compass, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/shared/SEOHead';

export default function WhyNTA() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden pb-20">
      <SEOHead 
        title="Why NTA | New Tech Advertising"
        description="Learn about the New Tech Advertising philosophy, who we work with, and how we build trust with local businesses."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg">
              <Compass className="w-4 h-4" /> Our Philosophy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              A Different Kind of <br className="hidden md:block"/> Growth Partner
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We aren't a typical marketing agency. We are an education-first growth partner that believes in earning trust through visible progress and honest conversations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Core Principles</h2>
            <p className="text-slate-400">The foundation of everything we do at New Tech Advertising.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Trust Above All</h3>
              <p className="text-slate-400 leading-relaxed">We don't ask for blind faith. We ask for just enough trust to begin, and we prove our value every step of the way to earn the right to continue.</p>
            </motion.div>
            
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Education First</h3>
              <p className="text-slate-400 leading-relaxed">We believe an educated client is our best partner. We take the time to explain the 'why' behind every strategy, demystifying the complex world of digital growth.</p>
            </motion.div>
            
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.2 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Long-Term Vision</h3>
              <p className="text-slate-400 leading-relaxed">We don't chase quick hacks or fleeting trends. We build resilient, automated growth systems designed to establish true market authority over time.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Right Client vs Wrong Client */}
      <section className="py-24 px-6 relative z-10 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Who We Work With</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We are deeply invested in our clients' success, which means we are highly selective about who we partner with. A great partnership requires alignment.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* The Right Client */}
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-slate-900 rounded-3xl p-8 md:p-10 border border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <CheckCircle2 className="w-32 h-32 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Users className="text-blue-400" /> The Right Client
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-white font-medium block mb-1">Growth-Minded</span>
                    <span className="text-slate-400 text-sm">You view marketing as a long-term investment, not a short-term expense.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-white font-medium block mb-1">Open to Learning</span>
                    <span className="text-slate-400 text-sm">You are willing to understand the 'why' behind the strategies we implement.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-white font-medium block mb-1">Patient & Realistic</span>
                    <span className="text-slate-400 text-sm">You understand that true market authority takes time, effort, and consistency to build.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-white font-medium block mb-1">Partnership Oriented</span>
                    <span className="text-slate-400 text-sm">You want an expert team to collaborate with, not just a vendor to bark orders at.</span>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* The Wrong Client */}
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-slate-950 rounded-3xl p-8 md:p-10 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <XCircle className="w-32 h-32 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-300 mb-8 flex items-center gap-3">
                <XCircle className="text-slate-500" /> Not A Good Fit
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4 opacity-70">
                  <XCircle className="w-6 h-6 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-slate-300 font-medium block mb-1">Looking for Magic Pills</span>
                    <span className="text-slate-500 text-sm">You want overnight success and expect immediate, unrealistic results from Day 1.</span>
                  </div>
                </li>
                <li className="flex gap-4 opacity-70">
                  <XCircle className="w-6 h-6 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-slate-300 font-medium block mb-1">Micromanagers</span>
                    <span className="text-slate-500 text-sm">You want to dictate the exact tactics without trusting our proven systems or expertise.</span>
                  </div>
                </li>
                <li className="flex gap-4 opacity-70">
                  <XCircle className="w-6 h-6 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-slate-300 font-medium block mb-1">Unresponsive</span>
                    <span className="text-slate-500 text-sm">You don't have the time or willingness to review work or provide the necessary inputs.</span>
                  </div>
                </li>
                <li className="flex gap-4 opacity-70">
                  <XCircle className="w-6 h-6 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-slate-300 font-medium block mb-1">Race to the Bottom</span>
                    <span className="text-slate-500 text-sm">You are only shopping for the cheapest price, regardless of quality or strategy.</span>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative bg-slate-900 border border-slate-800 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <Award className="w-12 h-12 text-blue-500 mx-auto mb-8 opacity-50" />
            
            <blockquote className="text-2xl md:text-3xl text-blue-50 font-medium italic mb-10 leading-relaxed max-w-3xl mx-auto">
              "If you can offer me enough trust to begin, I will work to earn enough trust to continue."
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/c099addb0_headshot.png" 
                alt="Rick Hesse" 
                className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover"
              />
              <div className="text-left">
                <span className="block text-white font-bold text-lg">Rick Hesse</span>
                <span className="block text-slate-400 text-sm">Founder, New Tech Advertising</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative z-10 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to see if we're a good fit?</h2>
            <p className="text-xl text-slate-400 mb-10">
              Let's have an honest conversation about your goals and see how the NTA Operating System™ can help you achieve them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white w-full sm:w-auto text-lg h-14 px-8">
                <Link to="/book-call">
                  Book a Discovery Call
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-white w-full sm:w-auto text-lg h-14 px-8">
                <Link to="/about">
                  Read Our Story
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}