import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Users, Link2, BrainCircuit, Search, 
  CheckCircle2, DollarSign, Handshake, ChevronRight,
  ShieldCheck, HelpCircle
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import { useNavigate } from 'react-router-dom';

export default function PartnerQuickStart() {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Meet a business owner.',
      desc: 'Identify a local business that could benefit from better digital visibility, stronger reputation, or streamlined marketing.',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 2,
      title: 'Share your link.',
      desc: 'Send them your personalized Digital Growth Guide™ link. Tell them it\'s a free tool to assess their digital health.',
      icon: Link2,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      id: 3,
      title: 'The OS™ guides discovery.',
      desc: 'The Operating System™ walks them through a painless, educational discovery process to pinpoint their needs.',
      icon: Search,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 4,
      title: 'Rick reviews the roadmap.',
      desc: 'Our team analyzes the Business Score™ and customizes an actionable Growth Roadmap™ for their specific situation.',
      icon: BrainCircuit,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    {
      id: 5,
      title: 'Business enrolls.',
      desc: 'The business owner sees the clear value and enrolls securely through the NTA Operating System™.',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      id: 6,
      title: 'You earn recurring revenue.',
      desc: 'You receive your recurring commission for the life of the client, simply for making the introduction.',
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    }
  ];

  const faqs = [
    {
      q: 'How much do I need to know?',
      a: 'Very little. Your primary job is to recognize a business in need and make the introduction. The NTA Operating System™ and our team handle the education, assessment, and fulfillment.'
    },
    {
      q: 'What if I don\'t know marketing?',
      a: 'You don\'t need to be a marketing expert. In fact, it\'s often better if you aren\'t. You act as a trusted connector, bringing them a powerful tool (the Digital Growth Guide™) rather than pitching a complex service.'
    },
    {
      q: 'What if they ask technical questions?',
      a: 'You can simply say: "That\'s a great question. The discovery process will actually cover that, and Rick\'s team handles all the technical heavy lifting so you don\'t have to worry about it."'
    },
    {
      q: 'What happens after enrollment?',
      a: 'NTA takes over the day-to-day fulfillment, onboarding, and reporting. You maintain your relationship with the business owner as a hero who brought them a solution, while earning passive income.'
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 pb-20">
      <SEOHead 
        title="Partner Quick Start™ | NTA"
        description="Learn exactly how to begin your journey as a Community Growth Advisor."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-indigo-500/5">
              <Rocket className="w-3 h-3" /> Growth Advisor Protocol
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Partner Quick Start™
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              You are the bridge to better business. Here is the exact blueprint to start helping your community and earning recurring revenue today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The 6 Steps */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The NTA Handoff</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A seamless, professional process designed to protect your relationship and deliver massive value to the business owner.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.id} 
                  variants={fadeIn}
                  className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative hover:bg-slate-900/60 transition-colors group"
                >
                  <div className="absolute top-6 right-6 text-6xl font-bold text-slate-800/30 select-none pointer-events-none transition-colors group-hover:text-slate-800/50">
                    {step.id}
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${step.bg} ${step.border}`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed relative z-10">{step.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trust / Alleviation Section */}
      <section className="py-16 px-6 bg-slate-900/20 border-y border-slate-800/50 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center gap-8 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8"
          >
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Build Confidence, Not Complexity</h3>
              <p className="text-slate-400 leading-relaxed">
                Your role is to care about the business owner's success and provide a gateway to clarity. The NTA Operating System™ removes the friction of selling, allowing you to focus purely on relationships.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to feel confident starting today.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeIn}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6"
              >
                <div className="flex gap-4">
                  <div className="mt-1">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{faq.q}</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Footer */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mt-16 text-center"
          >
            <button 
              onClick={() => navigate('/partner-portal')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 text-lg flex items-center justify-center gap-2 mx-auto"
            >
              Access Your Partner Portal <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}