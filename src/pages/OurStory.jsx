import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building, AlertTriangle, RefreshCw, Compass, 
  Target, Map, LayoutDashboard, CheckCircle2, 
  Users, Rocket, ArrowRight, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function OurStory() {
  const navigate = useNavigate();

  const storySteps = [
    {
      id: 1,
      title: 'Where New Tech Advertising Began',
      desc: 'NTA started like many agencies—providing standard digital marketing services to local businesses. We delivered websites, SEO, and social media, but quickly realized that random acts of marketing weren\'t enough to drive predictable, long-term growth.',
      icon: Building,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 2,
      title: 'What Was Missing',
      desc: 'There was a disconnect between marketing metrics and actual business health. Owners were overwhelmed by fragmented tools, technical jargon, and vague reporting. They needed a holistic system, not just disconnected campaigns.',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    {
      id: 3,
      title: 'The Shift From Marketing Agency To Business Growth Platform',
      desc: 'We made a hard pivot. Instead of selling services, we focused on solving business problems. The goal shifted to creating an end-to-end environment that educated, assessed, and guided owners toward market leadership.',
      icon: RefreshCw,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      id: 4,
      title: 'Building The Discovery System™',
      desc: 'Before prescribing solutions, we needed a way to truly understand a business. We built an intelligent, conversational discovery flow to map out goals, pain points, and current digital footprints without aggressive sales pitches.',
      icon: Compass,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      id: 5,
      title: 'Building The Business Score™',
      desc: 'To remove subjectivity, we developed a proprietary scoring algorithm. It objectively measures a company\'s maturity across crucial digital pillars—giving owners a clear, undeniable baseline of where they stand.',
      icon: Target,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      id: 6,
      title: 'Building The Growth Roadmap™',
      desc: 'A score means nothing without a plan. We engineered the system to automatically generate a step-by-step roadmap, prioritizing actions that bridge the gap between their current reality and their revenue goals.',
      icon: Map,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 7,
      title: 'Building The Operating System™',
      desc: 'We tied it all together into a central, unified dashboard. A private workspace where clients can track progress, approve content, review analytics, and access educational resources in one place.',
      icon: LayoutDashboard,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      id: 8,
      title: 'Testing Every Process Personally',
      desc: 'We didn\'t just launch it; we lived it. Rick Hesse became the very first client, running NTA itself entirely through the Operating System™ to identify friction, fix bugs, and refine the user experience.',
      icon: CheckCircle2,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      id: 9,
      title: 'Why Clients Benefit',
      desc: 'Because we built this to solve our own operational headaches first, our clients inherit a battle-tested, proven infrastructure. They skip the growing pains and tap directly into a mature growth engine.',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      glow: true
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      <SEOHead 
        title="Our Story | Building My Own Business First™ | NTA"
        description="Discover how Rick Hesse became the first client of the NTA Operating System™ and how we shifted from an agency to a business growth platform."
      />
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-blue-500/5">
              <BookOpen className="w-4 h-4" /> Origin Story
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Building My Own Business First™
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              How New Tech Advertising evolved from a traditional marketing agency into a comprehensive Business Growth Platform by solving our own operational challenges.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-900/50 border-l-4 border-indigo-500 p-8 md:p-12 rounded-r-3xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 text-9xl text-indigo-500/10 font-serif leading-none select-none pointer-events-none">"</div>
            <p className="text-2xl md:text-3xl font-medium text-white italic leading-relaxed relative z-10">
              I made a commitment that I would never ask another business owner to use a system that I wasn't willing to build, test, and improve inside my own business first.
            </p>
            <div className="mt-6 flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-lg">RH</span>
              </div>
              <div>
                <div className="text-white font-bold">Rick Hesse</div>
                <div className="text-slate-400 text-sm">Founder, New Tech Advertising</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto relative">
          
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-indigo-500/20 to-slate-800/0 md:-translate-x-1/2 rounded-full hidden sm:block"></div>

          <div className="space-y-12 md:space-y-20">
            {storySteps.map((step, index) => {
              const isEven = index % 2 === 0;
              const Icon = step.icon;

              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className={`relative flex flex-col sm:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Timeline Dot (Mobile: left, Desktop: center) */}
                  <div className={`hidden sm:flex absolute left-8 md:left-1/2 w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-900 items-center justify-center -translate-x-1/2 md:translate-y-0 translate-y-4 z-20 ${step.border} shadow-xl`}>
                    <span className={`text-sm font-bold ${step.color}`}>{step.id}</span>
                  </div>

                  {/* Empty space for desktop alternating layout */}
                  <div className="hidden md:block w-1/2"></div>

                  {/* Card */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'} relative`}>
                    <div className={`bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 sm:p-8 hover:bg-slate-900/60 transition-colors group relative overflow-hidden ${step.glow ? 'shadow-[0_0_40px_rgba(99,102,241,0.15)] border-indigo-500/30' : ''}`}>
                      
                      {step.glow && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative z-10">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${step.bg} ${step.border} group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className={`w-7 h-7 ${step.color}`} />
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 sm:hidden">Phase {step.id}</div>
                          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{step.title}</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-24 px-6 relative z-10 border-t border-slate-800/50 bg-slate-900/20">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-t-full blur-[100px] pointer-events-none"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              The NTA Operating System™ is still growing—just like the businesses it serves.
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Join us inside the platform and experience what a true digital growth engine feels like.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button 
                onClick={() => navigate('/growth-conversation')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 text-lg flex items-center justify-center gap-2"
              >
                Start My Journey <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}