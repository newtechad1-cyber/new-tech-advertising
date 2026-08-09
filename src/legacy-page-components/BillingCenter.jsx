import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, FileText, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function BillingCenter() {
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
    <div className="bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      <SEOHead 
        title="Billing Center™ | NTA Operating System"
        description="Manage your investment, invoices, and payment methods."
      />
{/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
              <CreditCard className="w-3 h-3" /> Secure Billing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Billing Center™
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Manage your investment, review invoices, and update payment methods securely.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column - Current Plan */}
            <div className="lg:col-span-2 space-y-8">
              
              <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none"></div>
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Current Plan</h2>
                    <h3 className="text-3xl font-bold text-white mb-2">Growth Optimizer</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-400/20">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                      <span className="text-sm text-slate-500">Billing Cycle: Monthly</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">$897</div>
                    <div className="text-sm text-slate-400">/ month</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-1">Setup Fee</div>
                    <div className="text-white font-medium flex items-center gap-2">
                      $497 <span className="text-emerald-400 text-xs">(Paid)</span>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-1">Next Billing Date</div>
                    <div className="text-white font-medium">Nov 1, 2024</div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 relative z-10 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Learning Center™ Included</h4>
                    <p className="text-xs text-slate-400 mt-1">Your plan includes full access to the AI Learning Center™ ($297/mo value) at no additional cost.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-slate-400" /> Payment History
                </h3>
                
                <div className="space-y-4">
                  {[
                    { date: 'Oct 1, 2024', desc: 'Growth Optimizer - Monthly', amount: '$897.00', status: 'Paid', invoice: 'INV-1024' },
                    { date: 'Sep 1, 2024', desc: 'Growth Optimizer - Monthly', amount: '$897.00', status: 'Paid', invoice: 'INV-0924' },
                    { date: 'Aug 1, 2024', desc: 'Growth Optimizer - Monthly', amount: '$897.00', status: 'Paid', invoice: 'INV-0824' },
                    { date: 'Aug 1, 2024', desc: 'One-Time Setup Fee', amount: '$497.00', status: 'Paid', invoice: 'INV-0824-S' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                      <div className="flex-1 min-w-[200px]">
                        <div className="text-white font-medium mb-1">{item.desc}</div>
                        <div className="text-xs text-slate-500">{item.date} • {item.invoice}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{item.amount}</div>
                        <div className="text-xs text-emerald-400 flex items-center justify-end gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> {item.status}
                        </div>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Right Column - Actions */}
            <div className="space-y-8">
              
              <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-6 flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-800 rounded border border-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">VISA</span>
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">•••• •••• •••• 4242</div>
                    <div className="text-xs text-slate-500">Expires 12/26</div>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-colors border border-slate-700">
                  <RefreshCw className="w-4 h-4" /> Update Payment Method
                </button>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Open Invoices</h3>
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-sm font-medium text-white">You're all caught up!</div>
                  <div className="text-xs text-slate-500 mt-1">No pending invoices.</div>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Billing Questions?</h3>
                    <p className="text-xs text-slate-400">We're here to help.</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-between bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium py-3 px-4 rounded-xl transition-colors">
                  Contact Support <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>
</div>
  );
}