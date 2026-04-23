import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Users, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight, Plus, Radio, Video, Send, Shield, Calendar, BarChart } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';
import TodaysCommand from '../components/agency/TodaysCommand.jsx';
import DailyCommandPanel from '../components/agency/DailyCommandPanel.jsx';

export default function AgencyDashboard() {
  const [clients, setClients] = useState([]);
  const [topics, setTopics] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [spokeCampaigns, setSpokeCampaigns] = useState([]);
  const [ntaAssets, setNtaAssets] = useState([]);
  const [videoAssets, setVideoAssets] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [approvalItems, setApprovalItems] = useState([]);
  const [perfMetrics, setPerfMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ContentTopics.list('-created_date', 50),
      base44.entities.AIJobs.list('-created_date', 100),
      base44.entities.ContentAssets.list('-updated_date', 20),
      base44.entities.SalesLead.list('-created_date', 500),
      base44.entities.SalesDeal.filter({ archived: false }),
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.NTAContentAsset.list('-created_date', 200),
      base44.entities.NTAVideoAsset.list('-created_date', 100),
      base44.entities.SocialPostQueue.list('-created_date', 200),
      base44.entities.ApprovalItem.list('-created_date', 100),
      base44.entities.PerformanceMetric.list('-date_logged', 200),
    ]).then(([c, t, j, a, l, d, sc, na, va, sp, ai, pm]) => {
      setClients(c); setTopics(t); setJobs(j); setAssets(a);
      setLeads(l); setDeals(d);
      setSpokeCampaigns(sc); setNtaAssets(na); setVideoAssets(va);
      setSocialPosts(sp); setApprovalItems(ai); setPerfMetrics(pm);
      setLoading(false);
    });
  }, []);

  // Build lookup maps for TodaysCommand
  const dealsMap = {};
  deals.forEach(deal => { if (deal.lead_id) dealsMap[deal.lead_id] = deal; });
  const leadsMap = {};
  leads.forEach(lead => { leadsMap[lead.id] = lead; });

  const handleLeadUpdated = (updatedDeal, updatedLead) => {
    if (updatedDeal?.id) {
      setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    }
    if (updatedLead?.id) {
      setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    }
  };

  const activeClients = clients.filter(c => c.status === 'active_client');

  // New ops metrics
  const activeCampaigns = spokeCampaigns.filter(c => c.status === 'active').length;
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const campaignsGeneratingLeads = spokeCampaigns.filter(c =>
    perfMetrics.some(m => m.campaign_id === c.id && m.leads > 0 && new Date(m.date_logged) >= weekAgo)
  ).length;
  const ntaDrafts = ntaAssets.filter(a => a.status === 'draft').length;
  const ntaAwaitingApproval = ntaAssets.filter(a => a.status === 'ready_for_review').length;
  const ntaReadyToSchedule = ntaAssets.filter(a => a.approval_status === 'approved' && !['scheduled','published'].includes(a.status)).length;
  const scheduledThisWeek = ntaAssets.filter(a => {
    if (a.status !== 'scheduled' || !a.scheduled_date) return false;
    const d = new Date(a.scheduled_date); const now = new Date(); const w = new Date(); w.setDate(now.getDate() + 7);
    return d >= now && d <= w;
  }).length;
  const scriptsReady = videoAssets.filter(v => v.render_status === 'script_ready').length;
  const inProd = videoAssets.filter(v => v.render_status === 'in_production').length;
  const videosCompleted = videoAssets.filter(v => v.render_status === 'completed').length;
  const scheduledPosts = socialPosts.filter(p => p.publish_status === 'scheduled').length;
  const publishedPosts = socialPosts.filter(p => p.publish_status === 'published').length;
  const pendingApprovals = approvalItems.filter(i => i.status === 'pending').length + ntaAssets.filter(a => a.status === 'ready_for_review' && a.approval_status === 'draft').length;
  const clientApprovals = approvalItems.filter(i => i.status === 'pending' && i.client_id).length;
  const rejectedItems = approvalItems.filter(i => i.status === 'rejected').length;
  const totalLeadsWeek = perfMetrics.filter(m => m.date_logged && new Date(m.date_logged) >= weekAgo).reduce((s,m) => s + (m.leads||0), 0);
  const totalCallsWeek = perfMetrics.filter(m => m.date_logged && new Date(m.date_logged) >= weekAgo).reduce((s,m) => s + (m.booked_calls||0), 0);
  const inProgress = topics.filter(t => ['queued', 'processing'].includes(t.status));
  const forReview = assets.filter(a => a.status === 'ready_for_review');
  const failedJobs = jobs.filter(j => j.status === 'failed');
  const recentAssets = assets.slice(0, 8);

  const WORKFLOW = [
    { step: '1', label: 'Add Client', href: '/agency/clients', action: 'Go to Clients →' },
    { step: '2', label: 'Create Topic', href: '/agency/content?tab=intake', action: 'Open Intake →' },
    { step: '3', label: 'Generate Content', href: '/agency/content?tab=jobs', action: 'View Jobs →' },
    { step: '4', label: 'Review Output', href: '/agency/content?tab=review', action: 'Review →' },
    { step: '5', label: 'Publish', href: '/agency/content?tab=published', action: 'Published →' },
  ];

  return (
    <AgencyLayout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-white">Operations Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* DAILY COMMAND PANEL — Spoke campaign workflow driver */}
        <DailyCommandPanel
          spokeCampaigns={spokeCampaigns}
          ntaAssets={ntaAssets}
          loading={loading}
        />

        {/* TODAY'S COMMAND — CRM daily operator layer */}
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-40 bg-slate-800 rounded animate-pulse" />
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}
            </div>
          </div>
        ) : (
          <TodaysCommand
            leads={leads}
            deals={deals}
            dealsMap={dealsMap}
            leadsMap={leadsMap}
            onLeadUpdated={handleLeadUpdated}
          />
        )}

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Content KPI strip */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Content Operations</h2>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard icon={Users} label="Active Clients" value={activeClients.length} color="text-blue-400" href="/agency/clients" />
              <StatCard icon={Clock} label="Content In Progress" value={inProgress.length} color="text-amber-400" href="/agency/content?tab=topics" />
              <StatCard icon={CheckCircle} label="Ready for Review" value={forReview.length} color="text-violet-400" href="/agency/content?tab=review" />
              <StatCard icon={AlertTriangle} label="Failed Jobs" value={failedJobs.length} color={failedJobs.length > 0 ? "text-red-400" : "text-slate-500"} href="/agency/content?tab=errors" />
            </div>
          )}
        </div>

        {/* Workflow guide */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Content Workflow</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {WORKFLOW.map(w => (
              <Link key={w.step} to={w.href} className="bg-slate-900 border border-slate-800 hover:border-blue-700 rounded-xl p-4 group transition-all">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-3">{w.step}</div>
                <p className="text-sm font-semibold text-white mb-1">{w.label}</p>
                <p className="text-xs text-blue-500 group-hover:text-blue-300 transition-colors">{w.action}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active clients */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Clients</h2>
              <Link to="/agency/clients" className="text-xs text-blue-500 hover:text-blue-300 flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {loading && <p className="p-4 text-slate-600 text-sm">Loading...</p>}
              {!loading && activeClients.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-slate-600 text-sm mb-3">No active clients yet.</p>
                  <Link to="/agency/clients" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /> Add First Client</Link>
                </div>
              )}
              {activeClients.slice(0, 6).map(c => (
                <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">{c.business_name}</p>
                    <p className="text-xs text-slate-500">{c.city ? `${c.city}, ${c.state}` : c.core_services || '—'}</p>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-medium">Active</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent content */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Recent Content</h2>
              <Link to="/agency/content" className="text-xs text-blue-500 hover:text-blue-300 flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {loading && <p className="p-4 text-slate-600 text-sm">Loading...</p>}
              {!loading && recentAssets.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-slate-600 text-sm mb-3">No content generated yet.</p>
                  <Link to="/agency/content?tab=intake" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /> Create First Topic</Link>
                </div>
              )}
              {recentAssets.map(a => (
                <div key={a.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{a.title || a.asset_type}</p>
                    <p className="text-xs text-slate-500">{a.client} · {a.asset_type?.replace('_', ' ')}</p>
                  </div>
                  <StatusDot status={a.status} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Ops sections grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <OpsCard icon={Radio} color="text-violet-400" title="Spoke Campaigns" href="/agency/spoke-campaigns"
            rows={[['Total', spokeCampaigns.length], ['Active', activeCampaigns], ['Generating Leads', campaignsGeneratingLeads]]} />
          <OpsCard icon={FileText} color="text-blue-400" title="Content Queue" href="/agency/content-asset"
            rows={[['Drafts', ntaDrafts], ['Awaiting Approval', ntaAwaitingApproval], ['Ready to Schedule', ntaReadyToSchedule], ['Scheduled This Week', scheduledThisWeek]]} />
          <OpsCard icon={Video} color="text-amber-400" title="Video Queue" href="/agency/video-queue"
            rows={[['Scripts Ready', scriptsReady], ['In Production', inProd], ['Completed', videosCompleted]]} />
          <OpsCard icon={Send} color="text-emerald-400" title="Social Queue" href="/agency/social-queue"
            rows={[['Scheduled Posts', scheduledPosts], ['Published Posts', publishedPosts]]} />
          <OpsCard icon={Shield} color="text-red-400" title="Approval Center" href="/agency/approval-center"
            rows={[['Pending Approvals', pendingApprovals], ['Client Approvals', clientApprovals], ['Rejected Items', rejectedItems]]} />
          <OpsCard icon={BarChart} color="text-teal-400" title="Campaign Performance" href="/agency/campaign-performance"
            rows={[['Leads This Week', totalLeadsWeek], ['Booked Calls', totalCallsWeek]]} />
        </div>

        {/* Failed jobs alert */}
        {!loading && failedJobs.length > 0 && (
          <section>
            <div className="bg-red-950/50 border border-red-900/60 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">{failedJobs.length} Failed AI Job{failedJobs.length > 1 ? 's' : ''}</p>
                  <p className="text-xs text-red-300 mt-0.5">Some content generation jobs failed and need attention.</p>
                </div>
              </div>
              <Link to="/agency/content?tab=errors" className="text-xs font-semibold text-red-400 hover:text-red-300 flex-shrink-0">View Errors →</Link>
            </div>
          </section>
        )}
      </div>
    </AgencyLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, href }) {
  return (
    <Link to={href} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-center gap-3 transition-all group">
      <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
      <div>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <p className="text-slate-500 text-xs">{label}</p>
      </div>
    </Link>
  );
}

function OpsCard({ icon: Icon, color, title, href, rows }) {
  return (
    <Link to={href} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 block transition-all group">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <p className="text-sm font-bold text-white">{title}</p>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
      </div>
      <div className="space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{label}</span>
            <span className={`text-sm font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}

function StatusDot({ status }) {
  const map = {
    draft: 'bg-slate-600 text-slate-300',
    ready_for_review: 'bg-violet-600 text-violet-200',
    approved: 'bg-teal-600 text-teal-200',
    published: 'bg-emerald-600 text-emerald-200',
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${map[status] || 'bg-slate-700 text-slate-400'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}