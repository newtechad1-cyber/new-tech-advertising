import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Target, Map, TrendingUp, GraduationCap, 
  FileText, CreditCard, HelpCircle, Calendar, ArrowRight,
  ShieldAlert, Settings, Download
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import NextStepEngine from '@/components/recommendations/NextStepEngine';

export default function MyGrowthWorkspace() {
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

  return (
    <div className="bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <SEOHead 
        title="My Growth Workspace™ | NTA Operating System"
        description="Your private command center for business growth, education, and digital strategy."
      />
{/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
                <ShieldAlert className="w-3 h-3" /> Private Client Area
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                My Growth Workspace™
              </h1>
              <p className="text-xl text-slate-400">
                Welcome back, Alex. Here is your current business pulse.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors text-slate-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* Business Profile */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/40 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">My Business Profile</h3>
              <p className="text-sm text-slate-400 mb-6 flex-grow">Manage your core business information, locations, and integrated systems.</p>
              <Link to="/business-profile" className="inline-flex items-center gap-2 text-sm text-blue-400 font-medium hover:text-blue-300 transition-colors">
                View Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Business Score */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/40 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">NTA Business Score™</h3>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded-md">68/100</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 flex-grow">Your overall digital health and visibility metrics across 6 key areas.</p>
              <Link to="/business-score" className="inline-flex items-center gap-2 text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                Update Score <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Growth Roadmap */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/40 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <Map className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">My Growth Roadmap™</h3>
              <p className="text-sm text-slate-400 mb-6 flex-grow">Your personalized plan of action based on your latest business score and goals.</p>
              <Link to="/growth-roadmap-generator" className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                View Roadmap <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Progress */}
            <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/40 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">My Progress</h3>
              <p className="text-sm text-slate-400 mb-6 flex-grow">Track your momentum, completed modules, and active growth systems.</p>
              <Link to="/progress" className="inline-flex items-center gap-2 text-sm text-amber-400 font-medium hover:text-amber-300 transition-colors">
                View Analytics <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* AI Learning Center */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <GraduationCap className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Learning Center™</h3>
                    <p className="text-slate-400">Your educational curriculum</p>
                  </div>
                </div>
                <Link to="/learning-center" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  Browse All Courses
                </Link>
              </div>
              
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-slate-400">Continue Learning</span>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">In Progress</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">The Role of AI in Local Marketing</h4>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">45% Complete</span>
                  <Link to="/role-of-ai-in-local-marketing" className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1">
                    Resume <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Meetings & Schedule */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-6 h-6 text-slate-400" />
                <h3 className="text-xl font-bold text-white">Meetings & Schedule</h3>
              </div>
              
              <div className="flex-grow space-y-4">
                <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                  <div className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-wider">Upcoming</div>
                  <h4 className="text-white font-medium mb-1">Q3 Strategy Review</h4>
                  <p className="text-sm text-slate-400">Oct 12, 2024 at 2:00 PM CST</p>
                </div>
                
                <div className="p-4 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-center opacity-70">
                  <p className="text-sm text-slate-500 mb-3">Need to discuss your roadmap?</p>
                  <button className="text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
                    Book a Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Documents */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Documents</h3>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="group-hover:text-blue-400 transition-colors">Service Agreement 2024</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
                <li className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="group-hover:text-blue-400 transition-colors">NTA Gap Audit Report</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              </ul>
              <button className="text-sm text-slate-500 hover:text-slate-300 font-medium transition-colors">
                View All Documents
              </button>
            </motion.div>

            {/* Billing Placeholder */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/60 transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Billing & Payments</h3>
              </div>
              <div className="flex-grow flex flex-col items-center justify-center py-4 text-center">
                <p className="text-slate-400 text-sm mb-4">Your account is in good standing.</p>
                <div className="flex gap-4">
                  <button className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Manage Plan
                  </button>
                  <button className="text-sm border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-2 rounded-lg transition-colors">
                    Invoices
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Support Placeholder */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:bg-slate-800/60 transition-colors flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Support & Help</h3>
              </div>
              <div className="flex-grow flex flex-col items-center justify-center py-4 text-center">
                <p className="text-slate-400 text-sm mb-4">Need assistance with your growth systems?</p>
                <button className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                  Open Support Ticket
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Recommended Next Steps */}
      <NextStepEngine />
</div>
  );
}