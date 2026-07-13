import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, Circle, Upload, Link2, Calendar, Target, BookOpen, PlayCircle, ShieldAlert } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function ClientOnboardingCenter() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const steps = [
    { id: 1, title: 'Schedule Kickoff Meeting', desc: 'Book your 45-minute strategy session with Rick.', icon: Calendar, status: 'current', action: 'Book Session' },
    { id: 2, title: 'Complete Business Profile', desc: 'Fill out your core business details for the NTA system.', icon: Target, status: 'completed', action: 'Edit Profile' },
    { id: 3, title: 'Upload Foundation Documents', desc: 'Provide logos, branding, and existing marketing assets.', icon: Upload, status: 'pending', action: 'Upload Files' },
    { id: 4, title: 'Connect Social Accounts', desc: 'Link Meta, Google Business, and other platforms securely.', icon: Link2, status: 'pending', action: 'Connect Hub' },
    { id: 5, title: 'Review Growth Roadmap™', desc: 'Approve your first 90-day execution strategy.', icon: Rocket, status: 'pending', action: 'View Roadmap' },
    { id: 6, title: 'Start AI Learning Center™', desc: 'Begin your educational journey while we build the foundation.', icon: BookOpen, status: 'pending', action: 'Start Learning' }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      <SEOHead 
        title="Client Onboarding™ | NTA Operating System"
        description="Welcome to NTA. Your journey to digital dominance starts here."
      />
      <MarketingNav />

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6">
              <Rocket className="w-3 h-3" /> Step 1: Foundation
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Welcome to the NTA Operating System™
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Your journey to digital dominance starts here. Follow the checklist below to establish your foundation and activate your growth engines.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column - Checklist */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Onboarding Checklist</h2>
                    <p className="text-slate-400 text-sm mt-1">Complete these items to launch your system.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-400">1/6</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Completed</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div 
                        key={step.id} 
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                          step.status === 'completed' ? 'bg-slate-950/50 border-slate-800 opacity-60' :
                          step.status === 'current' ? 'bg-slate-900 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]' :
                          'bg-slate-900/20 border-slate-800/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : step.status === 'current' ? (
                              <div className="relative flex h-6 w-6">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
                                <Circle className="relative inline-flex rounded-full w-6 h-6 text-indigo-500 fill-indigo-500/20" />
                              </div>
                            ) : (
                              <Circle className="w-6 h-6 text-slate-700" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-bold ${step.status === 'completed' ? 'text-slate-300' : 'text-white'}`}>
                              {step.title}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">{step.desc}</p>
                          </div>
                        </div>
                        <div className="sm:pl-10">
                          <button 
                            className={`whitespace-nowrap px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
                              step.status === 'completed' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' :
                              step.status === 'current' ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20' :
                              'bg-slate-800/50 text-slate-400 cursor-not-allowed'
                            }`}
                            disabled={step.status === 'pending'}
                          >
                            {step.action}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Context & Timeline */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-8"
            >
              
              {/* Video Placeholder */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden group cursor-pointer relative">
                <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 z-10"></div>
                  <PlayCircle className="w-16 h-16 text-white/50 group-hover:text-white/80 transition-colors z-20 group-hover:scale-110 duration-300" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <div className="text-white font-bold">Watch: How the Onboarding Works</div>
                    <div className="text-xs text-slate-400 mt-1">3:45 mins</div>
                  </div>
                </div>
              </div>

              {/* Next 30 Days Timeline */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">The First 30 Days</h3>
                
                <div className="border-l-2 border-slate-800 ml-3 pl-6 py-2 space-y-8 relative">
                  
                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[31px] top-1.5 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <h4 className="text-sm font-bold text-white">Week 1: Foundation & Setup</h4>
                    <p className="text-xs text-slate-400 mt-1">We collect your assets, analyze your baseline, and configure your tracking environments.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-slate-700 rounded-full -left-[31px] top-1.5"></div>
                    <h4 className="text-sm font-bold text-slate-300">Week 2: Strategy & Roadmap</h4>
                    <p className="text-xs text-slate-500 mt-1">We finalize your Growth Roadmap™ and prepare the first batch of optimization updates.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-slate-700 rounded-full -left-[31px] top-1.5"></div>
                    <h4 className="text-sm font-bold text-slate-300">Week 3: Campaign Launch</h4>
                    <p className="text-xs text-slate-500 mt-1">Initial visibility protocols deployed. Social media automation engaged. SEO tracking begins.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute w-3 h-3 bg-slate-700 rounded-full -left-[31px] top-1.5"></div>
                    <h4 className="text-sm font-bold text-slate-300">Week 4: Review & Scale</h4>
                    <p className="text-xs text-slate-500 mt-1">First performance review meeting. We analyze early data and approve next month's content.</p>
                  </div>

                </div>
              </div>

              {/* Help Box */}
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Stuck on a step?</h4>
                  <p className="text-xs text-slate-400 mt-1 mb-3">If you don't have access to certain accounts or need help, let us know.</p>
                  <button className="text-xs font-medium text-slate-300 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                    Contact Support
                  </button>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>
    <SiteFooter />
    </div>
  );
}