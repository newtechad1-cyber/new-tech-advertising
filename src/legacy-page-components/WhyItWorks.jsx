import React from 'react';
import { motion } from 'framer-motion';
import { 
  MonitorSmartphone, Heart, Building2, BookOpen, 
  Search, Compass, Handshake, Rocket, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';

export default function WhyItWorks() {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  const philosophies = [
    {
      id: 'tech',
      title: 'Technology Changes',
      desc: 'The tools, algorithms, and platforms shift every single day. Chasing the latest digital trend is exhausting and rarely produces sustainable results.',
      icon: MonitorSmartphone,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 'people',
      title: "People Don't",
      desc: 'Human psychology remains constant. People still buy based on trust, reputation, visibility, and connection. Our system is built on these timeless principles.',
      icon: Heart,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    },
    {
      id: 'community',
      title: 'Strong Businesses Build Strong Communities',
      desc: 'Local businesses are the backbone of a thriving community. When they grow, they hire locally, sponsor youth sports, and reinvest in the local economy.',
      icon: Building2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      id: 'education',
      title: 'Education Before Selling',
      desc: 'We never pitch a service without first ensuring the business owner understands why they need it. An educated client is a successful partner.',
      icon: BookOpen,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      id: 'discovery',
      title: 'Discovery Before Recommendations',
      desc: 'Prescription without diagnosis is malpractice. We rely on the objective Business Score™ to determine exactly what the business actually needs.',
      icon: Search,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      id: 'guidance',
      title: 'Guidance Before Marketing',
      desc: 'Throwing money at ads won\'t fix a broken foundation. We guide businesses to fix their core operations and digital presence before amplifying it.',
      icon: Compass,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      id: 'relationships',
      title: 'Relationships Before Transactions',
      desc: 'We are not vendors; we are growth partners. Every interaction is designed to strengthen the bond between the business, the advisor, and the NTA system.',
      icon: Handshake,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 'journey',
      title: 'Business Growth Is A Journey',
      desc: 'Success is not a one-time campaign. It requires a sustained, systematic approach. We build roadmaps that evolve as the business scales.',
      icon: Rocket,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden pb-20">
      <SEOHead 
        title="Why It Works™ | NTA"
        description="Discover the core philosophy and timeless principles behind the NTA Operating System™."
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-indigo-500/5">
              <Sparkles className="w-4 h-4" /> Core Philosophy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Why It Works™
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The NTA Operating System™ isn't just a collection of tools. It's a fundamental shift in how we approach local business growth, built on principles that never expire.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {philosophies.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.id}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 hover:bg-slate-900/60 transition-colors group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${item.bg} ${item.border} group-hover:scale-105 transition-transform duration-500`}>
                      <Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Closing Statement */}
      <section className="py-32 px-6 relative z-10 border-t border-slate-800/50 bg-slate-900/20">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-t-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
              <span className="block text-slate-500 mb-2">We're not building</span>
              <span className="block text-slate-500 mb-6">marketing campaigns.</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                We're building better businesses.
              </span>
            </h2>
            
            <div className="mt-16">
              <button 
                onClick={() => navigate('/growth-conversation')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 text-lg"
              >
                Start Your Journey
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}