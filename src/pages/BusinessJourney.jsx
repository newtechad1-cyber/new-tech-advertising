import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Bot, MessageSquare, Target, Map, 
  ClipboardCheck, CheckCircle2, LayoutDashboard, 
  LineChart, Rocket, ArrowRight, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';

export default function BusinessJourney() {
  const navigate = useNavigate();

  const journeySteps = [
    {
      id: 1,
      title: 'Homepage',
      desc: 'The journey begins. Business owners discover clear, jargon-free explanations of how modern digital visibility actually works.',
      icon: Home,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 2,
      title: 'Your Digital Growth Guide™',
      desc: 'Our intelligent assistant engages the visitor, asking the right questions to understand their unique challenges and goals.',
      icon: Bot,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      id: 3,
      title: 'Business Growth Conversation™',
      desc: 'An immersive, Apple-style presentation that educates the owner on digital frameworks rather than pitching them a service.',
      icon: MessageSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 4,
      title: 'Business Score™',
      desc: 'A comprehensive, multi-category assessment that objectively measures the current digital health and readiness of the business.',
      icon: Target,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    {
      id: 5,
      title: 'Growth Roadmap™',
      desc: 'The system generates a personalized, step-by-step roadmap to bridge the gap between their current score and market leadership.',
      icon: Map,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      id: 6,
      title: 'Recommended Growth Plan™',
      desc: 'A transparent, flat-rate pricing plan is suggested based purely on the data from their roadmap—no high-pressure sales tactics.',
      icon: ClipboardCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      id: 7,
      title: 'Enrollment',
      desc: 'A seamless, secure checkout experience that immediately transitions the owner from prospect to supported partner.',
      icon: CheckCircle2,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      id: 8,
      title: 'Client Workspace™',
      desc: 'They gain access to their private command center to track progress, access the AI Learning Center™, and view real-time data.',
      icon: LayoutDashboard,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      id: 9,
      title: 'Monthly Growth Reviews™',
      desc: 'Ongoing strategic touchpoints ensure the roadmap is being executed, results are compounding, and the next milestones are set.',
      icon: LineChart,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 10,
      title: 'Business Growth',
      desc: 'The ultimate destination. Increased visibility, stronger reputation, efficient operations, and a thriving local business.',
      icon: Rocket,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      glow: true
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <SEOHead 
        title="The Business Journey™ | NTA"
        description="Explore the complete customer experience from first visit to long-term client growth."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-indigo-500/5">
              <Compass className="w-4 h-4" /> End-to-End Experience
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              The Business Journey™
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Every touchpoint is intentionally designed to educate, empower, and elevate local businesses from their first visit to sustained market leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto relative">
          
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-slate-800/0 md:-translate-x-1/2 rounded-full hidden sm:block"></div>

          <div className="space-y-12 md:space-y-24">
            {journeySteps.map((step, index) => {
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
                          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 sm:hidden">Step {step.id}</div>
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
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 tracking-tight">
              Every business deserves a guide.
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button 
                onClick={() => navigate('/growth-conversation')}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 text-lg flex items-center justify-center gap-2"
              >
                Start My Journey <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => navigate('/community-growth-advisor')}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all border border-slate-700 text-lg"
              >
                Become A Community Growth Advisor
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}