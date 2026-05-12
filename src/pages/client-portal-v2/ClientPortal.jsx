import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { 
  LayoutDashboard, FileText, FileSignature, CheckSquare, 
  Search, FileCheck, Receipt, MessageSquare, Menu, X, 
  Download, ShieldCheck, ChevronRight, Clock, Building2,
  ExternalLink, LogIn, Activity
} from 'lucide-react';

export default function ClientPortal() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [setup, setSetup] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [audits, setAudits] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const c = await base44.entities.Client.get(clientId);
        setClient(c);

        const [setups, docs, agrs, props, apps, auds] = await Promise.all([
          base44.entities.ClientSetupStatus.filter({ client_id: clientId }),
          base44.entities.ClientDocument.filter({ client_id: clientId }),
          base44.entities.ClientAgreement.filter({ client_id: clientId }),
          base44.entities.Proposal.filter({ business_name: c.business_name }), // Adjust if needed
          base44.entities.ApprovalRequest.filter({ client_id: clientId }),
          base44.entities.GapAudit.filter({ client_id: clientId }),
        ]);

        if (setups.length > 0) setSetup(setups[0]);
        setDocuments(docs);
        setAgreements(agrs);
        setProposals(props);
        setApprovals(apps);
        setAudits(auds);
      } catch (e) {
        console.error("Portal error", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-slate-700 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Secure Link Expired or Invalid</h1>
        <p className="text-slate-400">Please request a new secure access link from your account manager.</p>
      </div>
    );
  }

  const TABS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
    { id: 'agreements', label: 'Agreements', icon: FileSignature, count: agreements.length },
    { id: 'proposals', label: 'Proposals', icon: FileCheck, count: proposals.length },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, count: approvals.filter(a => a.status.includes('Pending')).length },
    { id: 'audits', label: 'Audit Reports', icon: Search, count: audits.length },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">N</div>
          <span className="font-semibold text-sm">NTA Portal</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:static lg:flex-shrink-0
      `}>
        <div className="h-16 hidden lg:flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            N
          </div>
          <span className="font-bold text-white tracking-tight">NTA Client</span>
        </div>

        <div className="p-6 pb-2 border-b border-slate-800/50">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Workspace</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{client.business_name}</p>
              <p className="text-xs text-slate-400 truncate">{client.contact_name || 'Client'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600/10 text-blue-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'}`} />
                {tab.label}
              </div>
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
            <LogIn className="w-4 h-4" /> Create Login
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-2">Secure access via magic link</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-950 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto p-6 lg:p-10">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Welcome to your Portal</h1>
                <p className="text-slate-400">Track your progress, manage documents, and review approvals.</p>
              </div>

              {/* Onboarding Widget */}
              {setup && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Onboarding Progress</h2>
                      <p className="text-sm text-slate-400">Current Phase: <span className="text-blue-400 font-medium">{setup.onboarding_stage}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-3xl font-black text-white">{setup.percent_complete || 0}%</p>
                        <p className="text-xs text-slate-500">Completed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-blue-600 rounded-full relative" style={{ width: `${setup.percent_complete || 0}%` }}>
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${setup.intake_form_completed ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                      <span className="text-slate-300">Intake Form</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${setup.channels_connected ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                      <span className="text-slate-300">Channels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${setup.client_portal_ready ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                      <span className="text-slate-300">Portal Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${setup.setup_status === 'Ready for Kickoff' || setup.setup_status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                      <span className="text-slate-300">Kickoff Ready</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div onClick={() => setActiveTab('approvals')} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                      <CheckSquare className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{approvals.filter(a => a.status.includes('Pending')).length}</h3>
                  <p className="text-sm text-slate-400">Pending Approvals</p>
                </div>
                
                <div onClick={() => setActiveTab('agreements')} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                      <FileSignature className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{agreements.filter(a => a.status !== 'Signed').length}</h3>
                  <p className="text-sm text-slate-400">Unsigned Agreements</p>
                </div>

                <div onClick={() => setActiveTab('documents')} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{documents.length}</h3>
                  <p className="text-sm text-slate-400">Shared Documents</p>
                </div>
              </div>

              {/* Recent Activity / Next Steps */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Action Items</h3>
                <div className="space-y-3">
                  {approvals.filter(a => a.status.includes('Pending')).slice(0,2).map(a => (
                    <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Review requested: {a.title}</p>
                        <p className="text-xs text-slate-400">Please review and provide feedback.</p>
                      </div>
                      <button onClick={() => setActiveTab('approvals')} className="text-xs font-medium text-amber-400 hover:text-amber-300">View</button>
                    </div>
                  ))}
                  {agreements.filter(a => a.status !== 'Signed').map(a => (
                    <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Sign {a.agreement_type}: {a.title}</p>
                        <p className="text-xs text-slate-400">Awaiting your signature.</p>
                      </div>
                      <button onClick={() => setActiveTab('agreements')} className="text-xs font-medium text-emerald-400 hover:text-emerald-300">View</button>
                    </div>
                  ))}
                  {approvals.length === 0 && agreements.filter(a=>a.status!=='Signed').length === 0 && (
                    <div className="text-center py-6">
                      <CheckSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">You're all caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Documents</h2>
                <p className="text-slate-400">Secure access to all shared brand assets, intake forms, and reports.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map(d => (
                  <a key={d.id} href={d.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl group transition-all">
                    <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-blue-600/20 transition-colors">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{d.title}</p>
                      <p className="text-xs text-slate-500">{d.document_type}</p>
                    </div>
                    <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                  </a>
                ))}
                {documents.length === 0 && <p className="text-slate-500 col-span-2 py-8 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl">No documents available.</p>}
              </div>
            </div>
          )}

          {activeTab === 'agreements' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Agreements &amp; Contracts</h2>
                <p className="text-slate-400">Review and sign service agreements, SOWs, and NDAs.</p>
              </div>
              <div className="space-y-3">
                {agreements.map(a => (
                  <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${a.status === 'Signed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                        <FileSignature className={`w-5 h-5 ${a.status === 'Signed' ? 'text-emerald-500' : 'text-amber-500'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{a.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{a.agreement_type} · {a.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.status !== 'Signed' && (
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
                          Review &amp; Sign
                        </button>
                      )}
                      {a.file_url && (
                        <a href={a.file_url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                {agreements.length === 0 && <p className="text-slate-500 py-8 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl">No agreements on file.</p>}
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Proposals</h2>
                <p className="text-slate-400">Active and past service proposals.</p>
              </div>
              <div className="space-y-3">
                {proposals.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div>
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{p.service_type} · {p.status}</p>
                    </div>
                    {p.proposal_url && (
                      <a href={p.proposal_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors">
                        View Proposal
                      </a>
                    )}
                  </div>
                ))}
                {proposals.length === 0 && <p className="text-slate-500 py-8 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl">No proposals found.</p>}
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Approvals</h2>
                <p className="text-slate-400">Review content, assets, and campaigns awaiting your sign-off.</p>
              </div>
              <div className="space-y-3">
                {approvals.map(a => (
                  <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${a.status.includes('Pending') ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                        <Activity className={`w-5 h-5 ${a.status.includes('Pending') ? 'text-amber-500' : 'text-emerald-500'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{a.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{a.request_type} · <span className={a.status.includes('Pending') ? 'text-amber-400' : 'text-emerald-400'}>{a.status}</span></p>
                      </div>
                    </div>
                    {a.status.includes('Pending') && (
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
                        Review Item
                      </button>
                    )}
                  </div>
                ))}
                {approvals.length === 0 && <p className="text-slate-500 py-8 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl">No pending approvals.</p>}
              </div>
            </div>
          )}

          {activeTab === 'audits' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Audit Reports</h2>
                <p className="text-slate-400">Past gap audits and technical reviews.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {audits.map(a => (
                  <div key={a.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-500/10 rounded-xl">
                        <Search className="w-6 h-6 text-indigo-400" />
                      </div>
                      <span className="text-2xl font-black text-white">{a.overall_score || 0}/100</span>
                    </div>
                    <p className="font-semibold text-white mb-1">Gap Audit: {a.website_url}</p>
                    <p className="text-xs text-slate-400 mb-4">{new Date(a.created_date).toLocaleDateString()}</p>
                    <Link to={`/gap-audit?url=${encodeURIComponent(a.website_url)}`} className="inline-block text-sm font-medium text-blue-400 hover:text-blue-300">
                      View Full Report →
                    </Link>
                  </div>
                ))}
                {audits.length === 0 && <p className="text-slate-500 col-span-2 py-8 text-center bg-slate-900 border border-slate-800 border-dashed rounded-2xl">No audits found.</p>}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Billing &amp; Invoices</h2>
                <p className="text-slate-400">Manage payments and view billing history.</p>
              </div>
              <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                <Receipt className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Billing Coming Soon</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">This area is currently being integrated with our payment processor. Please check back later.</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Messages</h2>
                <p className="text-slate-400">Direct communication with your account team.</p>
              </div>
              <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center">
                <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Message Center Coming Soon</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">Soon you'll be able to chat directly with your team securely from the portal.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}