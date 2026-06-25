import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, Plus, Copy, Mail, MessageSquare, 
  CheckCircle2, Clock, User, Building, 
  CreditCard, Search, ArrowRight, ShieldAlert,
  X
} from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

export default function EnrollmentLinkManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Placeholder data
  const [links, setLinks] = useState([
    {
      id: 'LNK-001',
      clientName: 'Sarah Jenkins',
      businessName: 'Jenkins HVAC Solutions',
      plan: 'Growth Optimizer',
      monthlyPrice: '$897',
      setupFee: '$497',
      partnerSource: 'Direct',
      status: 'pending',
      date: 'Oct 12, 2024',
      url: 'https://nta.com/enroll/sarah-j'
    },
    {
      id: 'LNK-002',
      clientName: 'Michael Chang',
      businessName: 'Chang Family Restaurant',
      plan: 'Visibility Foundation',
      monthlyPrice: '$497',
      setupFee: '$0',
      partnerSource: 'Local Chamber',
      status: 'completed',
      date: 'Oct 10, 2024',
      url: 'https://nta.com/enroll/chang-rest'
    }
  ]);

  const [formData, setFormData] = useState({
    clientName: '',
    businessName: '',
    plan: 'Growth Optimizer',
    monthlyPrice: '',
    setupFee: '',
    partnerSource: 'None'
  });

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newLink = {
      id: `LNK-00${links.length + 1}`,
      ...formData,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      url: `https://nta.com/enroll/${formData.clientName.toLowerCase().replace(/\s+/g, '-')}`
    };
    setLinks([newLink, ...links]);
    setIsCreating(false);
    setFormData({
      clientName: '',
      businessName: '',
      plan: 'Growth Optimizer',
      monthlyPrice: '',
      setupFee: '',
      partnerSource: 'None'
    });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 pb-20">
      <SEOHead 
        title="Enrollment Link Manager™ | NTA Operating System"
        description="Generate and manage personalized enrollment links for new clients."
      />

      {/* Header Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden border-b border-slate-800/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-6">
                <ShieldAlert className="w-3 h-3" /> Admin & Partner Control
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Enrollment Link Manager™
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl">
                Generate secure, personalized onboarding and payment links for your closed deals.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> New Link
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Active Links</h2>
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="grid grid-cols-1 gap-4"
          >
            {links.map((link) => (
              <div key={link.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/40 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{link.clientName}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-1"><Building className="w-3 h-3" /> {link.businessName}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-700">
                        {link.plan}
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-700">
                        {link.monthlyPrice}/mo
                      </span>
                      {link.setupFee !== '$0' && (
                        <span className="bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-700">
                          {link.setupFee} setup
                        </span>
                      )}
                      <span className="bg-blue-500/10 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-md border border-blue-500/20">
                        AI Learning Center™ Included
                      </span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-col justify-center gap-2 lg:border-l lg:border-slate-800 lg:pl-6 min-w-[200px]">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Source:</span>
                      <span className="text-slate-300">{link.partnerSource}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Created:</span>
                      <span className="text-slate-300">{link.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-slate-500">Status:</span>
                      {link.status === 'pending' ? (
                        <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-xs font-medium border border-amber-400/20">
                          <Clock className="w-3 h-3" /> Awaiting Action
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium border border-emerald-400/20">
                          <CheckCircle2 className="w-3 h-3" /> Enrolled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center gap-2 lg:border-l lg:border-slate-800 lg:pl-6">
                    <button 
                      onClick={() => handleCopy(link.id, link.url)}
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors border border-slate-700"
                    >
                      {copiedId === link.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copiedId === link.id ? 'Copied!' : 'Copy Link'}
                    </button>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium py-2 px-3 rounded-lg transition-colors border border-slate-800">
                        <Mail className="w-4 h-4" /> Email
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium py-2 px-3 rounded-lg transition-colors border border-slate-800">
                        <MessageSquare className="w-4 h-4" /> Text
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsCreating(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsCreating(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <Link2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Generate Enrollment Link</h2>
                  <p className="text-slate-400 text-sm">Create a secure portal for a new client.</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Client Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Sarah Jenkins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Business Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="e.g. Jenkins HVAC"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Recommended Plan</label>
                    <select 
                      value={formData.plan}
                      onChange={(e) => setFormData({...formData, plan: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                    >
                      <option>Visibility Foundation</option>
                      <option>Growth Optimizer</option>
                      <option>Market Leader</option>
                      <option>Custom Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Monthly Price</label>
                    <input 
                      type="text" 
                      required
                      value={formData.monthlyPrice}
                      onChange={(e) => setFormData({...formData, monthlyPrice: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Setup Fee</label>
                    <input 
                      type="text" 
                      required
                      value={formData.setupFee}
                      onChange={(e) => setFormData({...formData, setupFee: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="$"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Partner Referral Source (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.partnerSource}
                    onChange={(e) => setFormData({...formData, partnerSource: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. Local Chamber"
                  />
                </div>

                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Payment Integration Ready</h4>
                    <p className="text-xs text-slate-400 mt-1">This link will securely capture payment info and route the client into the NTA Operating System™ and My Growth Workspace™.</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                  >
                    Generate Link <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}