import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, LayoutDashboard, Brain, MessageSquare, Briefcase, 
  Workflow, CheckCircle, ArrowRight, Activity, Globe, 
  Users, FolderKanban, Shield, Megaphone, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function DigitalGrowthOfficePreview() {
  const [savedRoadmap, setSavedRoadmap] = useState(null);
  const [businessScore, setBusinessScore] = useState(null);
  const [activeWorkTab, setActiveWorkTab] = useState('leads');
  const [activeViewTab, setActiveViewTab] = useState('owner');

  useEffect(() => {
    // Check local storage for roadmap and score
    const memory = getJourneyMemory();
    if (memory.businessScore && memory.businessScore.overall !== null) {
      setBusinessScore(memory.businessScore);
    }
    
    const storedRoadmap = localStorage.getItem('nta_growth_roadmap');
    if (storedRoadmap) {
      try {
        setSavedRoadmap(JSON.parse(storedRoadmap));
      } catch (e) {}
    }
  }, []);

  const workTabs = [
    { id: 'leads', label: 'Leads & Customers', icon: Users },
    { id: 'marketing', label: 'Marketing & Content', icon: Megaphone },
    { id: 'operations', label: 'Operations', icon: FolderKanban },
    { id: 'knowledge', label: 'Business Knowledge', icon: Brain },
    { id: 'ai', label: 'AI Assistance', icon: Monitor },
  ];

  const viewTabs = [
    { id: 'owner', label: 'Owner View' },
    { id: 'team', label: 'Team View' },
    { id: 'nta', label: 'NTA View' },
    { id: 'ai', label: 'AI Assistance View' },
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <SEOHead 
        title="Inside the NTA Digital Growth Office™ | Interactive Business System Preview"
        description="See how the NTA Digital Growth Office can organize priorities, leads, customers, marketing, business knowledge, operations, and practical AI assistance in one connected system."
      />
      <MarketingNav />

      {/* 1. Preview Hero */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Inside the NTA Digital Growth Office™
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            See How the Pieces of Your Business Come Together
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            The Digital Growth Office gives the business owner, team, NTA, and practical AI assistance one shared direction. It organizes priorities, customers, marketing, knowledge, operations, and progress without requiring the owner to manage everything from memory.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-sm font-medium mb-10">
            <Shield className="w-4 h-4" /> Interactive Example — No Real Business Data
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#dashboard-preview"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Explore the Office
            </a>
            <Link 
              to="/growth-roadmap-generator" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
            >
              Build Your Growth Roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Optional Local Journey Detection */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {savedRoadmap || businessScore ? (
            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl">
              <h3 className="text-blue-400 font-bold mb-2">Your Saved Planning Data</h3>
              <p className="text-slate-300 text-sm mb-4">
                Your saved roadmap can become the starting point for a Digital Growth Office workspace. We've used your local data to personalize parts of this preview.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {savedRoadmap && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Your Next 30 Days</p>
                    <p className="text-slate-200 font-medium text-sm">{savedRoadmap.now.title}</p>
                  </div>
                )}
                {businessScore && (
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Identified Bottleneck</p>
                    <p className="text-slate-200 font-medium text-sm">{businessScore.lowest || 'Needs Measurement'}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center">
              <h3 className="text-slate-400 font-bold mb-2">Example Workspace Data</h3>
              <p className="text-slate-500 text-sm">
                This preview uses generic demonstration data. <Link to="/growth-roadmap-generator" className="text-blue-400 hover:underline">Build your roadmap</Link> to see how your own priorities would look.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Business-Owner Dashboard Preview */}
      <section id="dashboard-preview" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Mock Browser/App Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" /> client.newtechadvertising.com
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Welcome Back, Business Owner</h2>
              
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Column 1 & 2: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Current Priority */}
                  <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6">
                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Current Priority</p>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {savedRoadmap ? savedRoadmap.now.title : 'Create a reliable lead follow-up process'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {savedRoadmap ? savedRoadmap.now.reason : 'Ensures no incoming inquiries are dropped, increasing baseline revenue.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 bg-slate-900/50 rounded-xl p-4 border border-slate-800/50">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div> In Progress</div>
                      <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
                      <div>Target: This Month</div>
                      <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
                      <div className="text-blue-400 font-medium">Next: Review Draft Sequence</div>
                    </div>
                  </div>

                  {/* Today / Action Items */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Today</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Example Task', text: 'Approve new plumbing service page content', type: 'content' },
                        { label: 'Example Task', text: 'Follow up with Example Customer A regarding estimate', type: 'lead' },
                        { label: 'Example Task', text: 'Review proposed CRM intake form changes', type: 'system' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded border border-slate-600 flex-shrink-0"></div>
                            <div>
                              <p className="text-slate-200 text-sm font-medium">{item.text}</p>
                              <p className="text-slate-500 text-xs">{item.label}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth Roadmap Preview */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">Growth Roadmap</h3>
                      <Link to="/growth-roadmap-generator" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        Build or Update Your Roadmap
                      </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <p className="text-rose-400 text-xs font-bold uppercase mb-1">Now</p>
                        <p className="text-slate-300 text-sm line-clamp-2">{savedRoadmap ? savedRoadmap.now.title : 'Lead Follow-Up System'}</p>
                      </div>
                      <div className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl opacity-75">
                        <p className="text-amber-400 text-xs font-bold uppercase mb-1">Next</p>
                        <p className="text-slate-400 text-sm line-clamp-2">{savedRoadmap ? savedRoadmap.next.title : 'Automated Review Requests'}</p>
                      </div>
                      <div className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl opacity-50">
                        <p className="text-blue-400 text-xs font-bold uppercase mb-1">Later</p>
                        <p className="text-slate-500 text-sm line-clamp-2">{savedRoadmap ? savedRoadmap.later.title : 'Back-Office Automation'}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Column 3: Sidebar */}
                <div className="space-y-6">
                  {/* Business Health */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white">Business Health</h3>
                      <p className="text-xs text-slate-500">Example Business Health View</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: 'Visibility', status: 'Strong', color: 'text-emerald-400' },
                        { name: 'Digital Foundation', status: 'Needs Attention', color: 'text-rose-400' },
                        { name: 'Customer Relationships', status: 'Stable', color: 'text-amber-400' },
                        { name: 'AI Readiness', status: 'Not Yet Measured', color: 'text-slate-500' },
                        { name: 'Community Presence', status: 'Strong', color: 'text-emerald-400' },
                        { name: 'Growth Systems', status: 'Stable', color: 'text-amber-400' }
                      ].map((cat, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">{cat.name}</span>
                          <span className={`text-xs font-medium ${cat.color}`}>{cat.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Activity */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4 border-l-2 border-slate-800 ml-2 pl-4">
                      <div className="relative">
                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[21px] top-1.5"></div>
                        <p className="text-sm text-slate-300">New lead captured</p>
                        <p className="text-xs text-slate-500">2 hours ago</p>
                      </div>
                      <div className="relative">
                        <div className="absolute w-2 h-2 bg-slate-700 rounded-full -left-[21px] top-1.5"></div>
                        <p className="text-sm text-slate-300">Article published</p>
                        <p className="text-xs text-slate-500">Yesterday</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Connected Work Areas */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connected Work Areas</h2>
            <p className="text-slate-400">Different parts of the business organized in one place.</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {workTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveWorkTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeWorkTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 min-h-[300px]">
            {activeWorkTab === 'leads' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Leads & Customers</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-emerald-400 font-bold mb-1">New Inquiry</div>
                    <p className="text-slate-200 text-sm mb-2">Example Customer A requested a quote.</p>
                    <button className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-300">Respond</button>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-amber-400 font-bold mb-1">Follow-up Due</div>
                    <p className="text-slate-200 text-sm mb-2">Check in with Example Customer B.</p>
                    <button className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-300">View Conversation</button>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="text-xs text-blue-400 font-bold mb-1">Review Request</div>
                    <p className="text-slate-200 text-sm mb-2">Automated request sent to Example Customer C.</p>
                    <span className="text-xs text-slate-500">Sent 2 hours ago</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeWorkTab === 'marketing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Marketing & Content</h3>
                <p className="text-slate-400 text-sm mb-6">See how one business idea can be reused across channels.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">Article Draft: "Winter Maintenance Tips"</p>
                      <p className="text-xs text-amber-400 mt-1">Awaiting your approval</p>
                    </div>
                    <button className="text-xs bg-blue-600 px-3 py-1.5 rounded text-white font-medium">Review</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl opacity-75">
                    <div>
                      <p className="text-sm font-medium text-white">Social Campaign (Derived from article)</p>
                      <p className="text-xs text-slate-500 mt-1">Scheduled for next week</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeWorkTab === 'operations' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Operations</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-xl">Organize the repetitive work that depends on the owner.</p>
                  </div>
                  <Link to="/back-office-solutions" className="hidden sm:flex text-sm text-blue-400 hover:underline items-center gap-1">
                    Explore Back-Office Solutions <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-slate-200 text-sm mb-1 font-medium">Document Scheduling Workflow</p>
                    <p className="text-slate-500 text-xs">Remove duplicate data-entry between calendar and CRM.</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-slate-200 text-sm mb-1 font-medium">Back-Office Improvement</p>
                    <p className="text-slate-500 text-xs">Integrate invoicing to auto-update project status.</p>
                  </div>
                </div>
                <Link to="/back-office-solutions" className="sm:hidden text-sm text-blue-400 hover:underline flex items-center gap-1 mt-4">
                  Explore Back-Office Solutions <ArrowRight className="w-4 h-4"/>
                </Link>
              </motion.div>
            )}

            {activeWorkTab === 'knowledge' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Business Knowledge</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-xl">Business knowledge becomes reusable content, training, and AI context.</p>
                  </div>
                  <Link to="/knowledge" className="hidden sm:flex text-sm text-blue-400 hover:underline items-center gap-1">
                    Knowledge Library <ArrowRight className="w-4 h-4"/>
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="text-xs text-blue-400 font-bold mb-1">Captured Owner Process</p>
                    <p className="text-sm text-white">How we handle emergency service calls</p>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <p className="text-xs text-emerald-400 font-bold mb-1">Frequently Asked Question</p>
                    <p className="text-sm text-white">"Do you offer financing?" → Saved to Sales Knowledge Base</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeWorkTab === 'ai' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">AI Assistance</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-2xl bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg text-blue-200">
                  <strong className="text-blue-400">Note:</strong> AI assists under human direction. It does not replace business judgment, personal relationships, or final approval.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300">Summarize a long customer email thread</div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300">Prepare a follow-up draft based on notes</div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300">Identify a missed task or stagnant lead</div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300">Repurpose an approved article into a social post</div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300">Organize unstructured business knowledge</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 5. One System, Different Views */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">One System, Different Views</h2>
            <p className="text-slate-400">The information automatically adapts to who is looking at it.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {viewTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveViewTab(tab.id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  activeViewTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800/80'
                }`}
              >
                <div className="font-bold text-sm">{tab.label}</div>
              </button>
            ))}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 min-h-[200px] flex items-center justify-center text-center">
            {activeViewTab === 'owner' && (
              <div className="max-w-lg animate-in fade-in zoom-in duration-300">
                <Briefcase className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Owner View</h3>
                <p className="text-slate-400">Sees top-level priorities, pending approvals, critical lead alerts, revenue risks, and exactly what needs their attention today.</p>
              </div>
            )}
            {activeViewTab === 'team' && (
              <div className="max-w-lg animate-in fade-in zoom-in duration-300">
                <Users className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Team View</h3>
                <p className="text-slate-400">Sees their assigned work, customer context required to do the job, documented processes, and upcoming deadlines without the noise.</p>
              </div>
            )}
            {activeViewTab === 'nta' && (
              <div className="max-w-lg animate-in fade-in zoom-in duration-300">
                <Activity className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">NTA View</h3>
                <p className="text-slate-400">Manages overarching strategy, implementation progress, active marketing campaigns, system health, measurement, and continuous improvement.</p>
              </div>
            )}
            {activeViewTab === 'ai' && (
              <div className="max-w-lg animate-in fade-in zoom-in duration-300">
                <Brain className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">AI Assistance View</h3>
                <p className="text-slate-400">Accesses business knowledge to help organize data, draft content, monitor metrics, and offer recommendations under strict human control.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. From roadmap to daily work */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">A Roadmap Becomes a Working System</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              NTA does not hand you a plan and leave you alone with it. The roadmap becomes active work inside the Digital Growth Office.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
            <div className="grid lg:grid-cols-6 gap-4 relative z-10">
              {[
                { label: 'Priority', desc: 'The roadmap identifies it.' },
                { label: 'Project', desc: 'It becomes defined work.' },
                { label: 'Tasks', desc: 'It is divided into steps.' },
                { label: 'Approvals', desc: 'The owner approves key decisions.' },
                { label: 'Measurement', desc: 'Progress is tracked.' },
                { label: 'Next Improvement', desc: 'Selected when ready.' }
              ].map((step, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-sm font-bold mx-auto mb-3">
                    {i + 1}
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">{step.label}</h4>
                  <p className="text-xs text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Example weekly rhythm */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What a Simple Week Could Look Like</h2>
            <p className="text-slate-400">An example rhythm, not a rigid requirement.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { day: 'Monday', focus: 'Priorities', desc: 'Review what matters most this week.' },
              { day: 'Tuesday', focus: 'Customers', desc: 'Follow up with leads, reviews, and referrals.' },
              { day: 'Wednesday', focus: 'Content', desc: 'Approve or publish useful business knowledge.' },
              { day: 'Thursday', focus: 'Systems', desc: 'Improve one process, workflow, or automation.' },
              { day: 'Friday', focus: 'Progress', desc: 'Review what was completed and what happens next.' }
            ].map((day, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <p className="text-blue-400 font-bold mb-1">{day.day}</p>
                <h4 className="text-white font-bold text-lg mb-3">{day.focus}</h4>
                <p className="text-sm text-slate-400">{day.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Reassurance */}
      <section className="py-20 px-6 border-t border-slate-800/50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">You Do Not Have to Manage Every Screen</h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            The goal is not to give the owner more software to manage. The goal is to give the business a clearer way to operate and grow.
          </p>
          <ul className="text-left space-y-4 max-w-xl mx-auto text-slate-400">
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> The owner sees only the level of detail they need.</li>
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> NTA helps organize and implement the system.</li>
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> The system can start small and grow when useful.</li>
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> It is shaped around how the business actually works.</li>
          </ul>
        </div>
      </section>

      {/* 9. Clear boundaries */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">What This Preview Is—and What It Is Not</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-emerald-400 mb-6">This Preview Shows</h3>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li className="flex items-start gap-2"><span>•</span> How information can be organized.</li>
                <li className="flex items-start gap-2"><span>•</span> How priorities become work.</li>
                <li className="flex items-start gap-2"><span>•</span> How business areas connect.</li>
                <li className="flex items-start gap-2"><span>•</span> How the owner, team, NTA, and AI can collaborate.</li>
                <li className="flex items-start gap-2"><span>•</span> What a future Digital Growth Office workspace may include.</li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-rose-400 mb-6">This Preview Does Not Show</h3>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li className="flex items-start gap-2"><span>•</span> A finished package every business automatically receives.</li>
                <li className="flex items-start gap-2"><span>•</span> Live customer or financial records.</li>
                <li className="flex items-start gap-2"><span>•</span> A replacement for every tool the business already uses.</li>
                <li className="flex items-start gap-2"><span>•</span> Autonomous AI controlling the business.</li>
                <li className="flex items-start gap-2"><span>•</span> A promise that every feature is activated immediately.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Calls to Action */}
      <section className="py-20 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Build the Office Around the Business</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/growth-conversation" className="bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl p-6 group transition-colors flex flex-col">
              <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Start With the Growth Conversation</h3>
              <p className="text-sm text-slate-400 mb-4 flex-1">Understand what is happening in the business today.</p>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
            </Link>
            <Link to="/business-score" className="bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-2xl p-6 group transition-colors flex flex-col">
              <h3 className="font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">Take the Business Score</h3>
              <p className="text-sm text-slate-400 mb-4 flex-1">Measure strengths and vulnerabilities to see what needs attention.</p>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
            </Link>
            <Link to="/growth-roadmap-generator" className="bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-2xl p-6 group transition-colors flex flex-col">
              <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Build Your Growth Roadmap</h3>
              <p className="text-sm text-slate-400 mb-4 flex-1">Turn your score into a sequence of practical priorities.</p>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400" />
            </Link>
            <Link to="/book-call" className="bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl p-6 group transition-colors flex flex-col">
              <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Talk About Implementation</h3>
              <p className="text-sm text-slate-400 mb-4 flex-1">Speak with an advisor about building this system for you.</p>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Final Call to Action */}
      <section className="py-24 px-6 text-center bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">The Digital Growth Office Starts With One Clear Priority</h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            You do not need to install everything or rebuild the entire business. Start by understanding what matters most, organize the next step, and connect additional systems when they create real value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/growth-roadmap-generator"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Build Your Growth Roadmap
            </Link>
            <Link 
              to="/book-call" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl transition-all text-lg font-medium"
            >
              Book a Conversation
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}