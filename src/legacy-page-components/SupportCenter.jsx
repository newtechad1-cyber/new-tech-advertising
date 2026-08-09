import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, MessageSquare, Send, Clock, CheckCircle2, FileQuestion, BookOpen, AlertCircle } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function SupportCenter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Technical Help',
    priority: 'Normal',
    module: 'General',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Placeholder submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({...formData, message: ''});
      alert('Support request submitted successfully.');
    }, 1000);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      <SEOHead 
        title="Support Center™ | NTA Operating System"
        description="Get help, submit requests, and access resources from the NTA operations team."
      />
{/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-rose-400 text-xs font-semibold tracking-wide uppercase mb-6">
              <LifeBuoy className="w-3 h-3" /> Client Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Support Center™
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl">
              Get help from the NTA operations team, submit requests, and track their status.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Form */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Submit a Request</h2>
                    <p className="text-sm text-slate-400">We typically respond within 1 business day.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Request Type</label>
                      <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors appearance-none"
                      >
                        <option>Technical Help</option>
                        <option>Content & Strategy</option>
                        <option>Billing Question</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
                      <select 
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors appearance-none"
                      >
                        <option>Low - No rush</option>
                        <option>Normal - Standard</option>
                        <option>High - Important</option>
                        <option>Urgent - Blocking work</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Related Module</label>
                    <select 
                      value={formData.module}
                      onChange={(e) => setFormData({...formData, module: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors appearance-none"
                    >
                      <option>General / Not Sure</option>
                      <option>My Growth Roadmap™</option>
                      <option>AI Learning Center™</option>
                      <option>Billing Center™</option>
                      <option>Client Portal / Accounts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">How can we help?</label>
                    <textarea 
                      required
                      rows="6"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
                      placeholder="Please describe your issue or question in detail..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2"
                    >
                      {isSubmitting ? 'Sending...' : 'Submit Request'} <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Open Requests */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Recent Requests</h3>
                
                <div className="space-y-4">
                  {[
                    { title: 'Update to my Growth Roadmap™ targets', status: 'Open', date: '2 days ago', id: 'REQ-8421' },
                    { title: 'Help connecting Facebook account', status: 'Closed', date: '1 week ago', id: 'REQ-8302' },
                  ].map((req, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-950/50 border border-slate-800 rounded-xl">
                      <div>
                        <div className="text-white font-medium mb-1">{req.title}</div>
                        <div className="text-xs text-slate-500">ID: {req.id} • Submitted {req.date}</div>
                      </div>
                      <div>
                        {req.status === 'Open' ? (
                          <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-md text-xs font-medium border border-amber-400/20">
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-md text-xs font-medium border border-emerald-400/20">
                            <CheckCircle2 className="w-3 h-3" /> Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Resources */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Help Resources</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors group">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">AI Learning Center™</div>
                      <div className="text-xs text-slate-500">Video tutorials & guides</div>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors group">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileQuestion className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">Frequently Asked Questions</div>
                      <div className="text-xs text-slate-500">Quick answers to common issues</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30 mb-4">
                    <img src="/rick.jpeg" alt="Rick A. Hesse" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none'}} />
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">RH</div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Need direct help?</h3>
                  <p className="text-sm text-slate-400 mb-6">If you need immediate strategic assistance, contact Rick directly.</p>
                  
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors border border-slate-700">
                      Email Rick
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors">
                      Text Operations
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
</div>
  );
}