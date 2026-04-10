import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Users, FileText, AlertTriangle, CheckCircle, Clock,
  ArrowRight, Plus, Target, TrendingUp, Zap
} from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';

const STAGE_ORDER = ['New Lead', 'Contacted', 'Demo Sent', 'Proposal', 'Closed'];
const STAGE_COLORS = {
  'New Lead': 'bg-slate-700 text-slate-300',
  'Contacted': 'bg-blue-900 text-blue-300',
  'Demo Sent': 'bg-violet-900 text-violet-300',
  'Proposal': 'bg-amber-900 text-amber-300',
  'Closed': 'bg-emerald-900 text-emerald-300',
};

function mapLeadStage(status) {
  const m = {
    'Lead Identified': 'New Lead', 'Demo In Progress': 'Contacted', 'Demo Built': 'Contacted',
    'Demo Sent': 'Demo Sent', 'Responded': 'Contacted', 'Call Booked': 'Proposal',
    'Proposal Sent': 'Proposal', 'Closed Won': 'Closed', 'Closed Lost': 'Closed',
  };
  return m[status] || status || 'New Lead';
}

export default function NTACommandDashboard() {
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [topics, setTopics] = useState([]);
  const [assets, setAssets] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.DemoPipelineLead.filter({ archived: false }),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ContentTopics.list('-created_date', 50),
      base44.entities.ContentAssets.list('-updated_date', 30),
      base44.entities.AIJobs.filter({ status: 'failed' }),
    ]).then(([l, c, t, a, j]) => {
      setLeads(l);
      setClients(c);
      setTopics(t);
      setAssets(a);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  // Derived
  const activeLeads = leads.filter(l => mapLeadStage(l.status) !== 'Closed');
  const newLeads = leads.filter(l => mapLeadStage(l.status) === 'New Lead');
  const hotLeads = leads.filter(l => ['Proposal', 'Demo Sent'].includes(mapLeadStage(l.status)));
  const activeClients = clients.filter(c => c.status === 'active_client');
  const inProgress = topics.filter(t => ['queued', 'processing'].includes(t.status));
  const forReview = assets.filter(a => a.status === 'ready_for_review');
  const failedJobs = jobs;

  const WORKFLOW = [
    { step: '1', label: 'Add Lead', sub: 'Start prospecting', href: '/agency/pipeline', color: 'border-slate-700' },
    { step: '2', label: 'Work Pipeline', sub: 'Move through stages', href: '/agency/pipeline', color: 'border-blue-800' },
    { step: '3', label: 'Close & Onboard', sub: 'Convert to client', href: '/agency/clients', color: 'border-violet-800' },
    { step: '4', label: 'Produce Content', sub: 'Create topics & generate', href: '/agency/content?tab=intake', color: 'border-amber-800' },
    { step: '5', label: 'Review & Publish', sub: 'Approve output', href: '/agency/content?tab=review', color: 'border-emerald-800' },
    { step: '6', label: 'Show Results', sub: 'Performance & upsell', href: '/agency/clients', color: 'border-teal-800' },
  ];

  return (
    <AgencyLayout>
      <div className="p-6 space-y-7 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">NTA Command Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link to="/agency/content?tab=intake"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> New Topic
          </Link>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {loading ? [...Array(6)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />) : (
            <>
              <KPI label="Active Leads" value={activeLeads.length} color="text-blue-400" icon={Target} href="/agency/pipeline" />
              <KPI label="New / Uncontacted" value={newLeads.length} color="text-slate-300" icon={Target} href="/agency/pipeline" />
              <KPI label="Hot (Proposal+)" value={hotLeads.length} color="text-amber-400" icon={TrendingUp} href="/agency/pipeline" />
              <KPI label="Active Clients" value={activeClients.length} color="text-emerald-400" icon={Users} href="/agency/clients" />
              <KPI label="Content In Progress" value={inProgress.length} color="text-violet-400" icon={Clock} href="/agency/content?tab=topics" />
              <KPI label="Ready for Review" value={forReview.length} color={forReview.length > 0 ? "text-orange-400" : "text-slate-500"} icon={CheckCircle} href="/agency/content?tab=review" />
            </>
          )}
        </div>

        {/* Workflow guide */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Business Workflow</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {WORKFLOW.map((w, i) => (
              <Link key={w.step} to={w.href}
                className={`bg-slate-900 border ${w.color} hover:border-blue-600 rounded-xl p-3.5 group transition-all`}>
                <div className="w-6 h-6 bg-slate-700 group-hover:bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs mb-2.5 transition-colors">{w.step}</div>
                <p className="text-sm font-semibold text-white leading-tight">{w.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{w.sub}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Alerts */}
        {!loading && failedJobs.length > 0 && (
          <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-white font-semibold">{failedJobs.length} failed AI job{failedJobs.length > 1 ? 's' : ''} need attention</p>
            </div>
            <Link to="/agency/content?tab=errors" className="text-xs font-semibold text-red-400 hover:text-red-300 flex-shrink-0">View Errors →</Link>
          </div>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Pipeline */}
          <section className="lg:col-span-1">
            <SectionHeader title="Pipeline" count={activeLeads.length} href="/agency/pipeline" />
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {loading && <Skeleton />}
              {!loading && activeLeads.length === 0 && (
                <Empty>
                  <Link to="/agency/pipeline" className="text-xs text-blue-500 hover:text-blue-300">+ Add First Lead</Link>
                </Empty>
              )}
              {/* Stage summary */}
              {!loading && STAGE_ORDER.filter(s => s !== 'Closed').map(stage => {
                const count = leads.filter(l => mapLeadStage(l.status) === stage).length;
                if (count === 0) return null;
                return (
                  <div key={stage} className="flex items-center justify-between px-4 py-2.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STAGE_COLORS[stage]}`}>{stage}</span>
                    <span className="text-sm font-bold text-white">{count}</span>
                  </div>
                );
              })}
              {!loading && activeLeads.slice(0, 4).map(l => (
                <div key={l.id} className="px-4 py-2.5 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{l.business_name}</p>
                    <p className="text-xs text-slate-500">{l.city || l.industry || '—'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${STAGE_COLORS[mapLeadStage(l.status)] || 'bg-slate-700 text-slate-300'}`}>
                    {mapLeadStage(l.status)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Active clients */}
          <section className="lg:col-span-1">
            <SectionHeader title="Active Clients" count={activeClients.length} href="/agency/clients" />
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {loading && <Skeleton />}
              {!loading && activeClients.length === 0 && (
                <Empty>
                  <Link to="/agency/clients" className="text-xs text-blue-500 hover:text-blue-300">+ Add Client</Link>
                </Empty>
              )}
              {activeClients.slice(0, 6).map(c => (
                <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/40 transition-colors group">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors truncate">{c.business_name}</p>
                    <p className="text-xs text-slate-500">{c.city ? `${c.city}, ${c.state}` : c.core_services || '—'}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 flex-shrink-0 ml-2 transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          {/* Content */}
          <section className="lg:col-span-1">
            <SectionHeader title="Content" count={forReview.length > 0 ? `${forReview.length} for review` : inProgress.length + ' active'} href="/agency/content" />
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {loading && <Skeleton />}
              {/* Review items first */}
              {!loading && forReview.slice(0, 3).map(a => (
                <Link key={a.id} to="/agency/content?tab=review" className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/40 group transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{a.title || a.asset_type}</p>
                    <p className="text-xs text-slate-500">{a.client} · {a.asset_type?.replace('_', ' ')}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-900 text-violet-300 flex-shrink-0 ml-2">Review</span>
                </Link>
              ))}
              {/* In progress */}
              {!loading && inProgress.slice(0, 4 - Math.min(forReview.length, 3)).map(t => (
                <div key={t.id} className="flex items-center justify-between px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.client}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-900 text-amber-300 flex-shrink-0 ml-2 capitalize">{t.status}</span>
                </div>
              ))}
              {!loading && forReview.length === 0 && inProgress.length === 0 && (
                <Empty>
                  <Link to="/agency/content?tab=intake" className="text-xs text-blue-500 hover:text-blue-300">+ Create Topic</Link>
                </Empty>
              )}
            </div>
          </section>
        </div>

      </div>
    </AgencyLayout>
  );
}

function KPI({ label, value, color, icon: Icon, href }) {
  return (
    <Link to={href} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col gap-1 transition-all group">
      <div className="flex items-center justify-between">
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <Icon className={`w-4 h-4 ${color} opacity-60`} />
      </div>
      <p className="text-slate-500 text-xs leading-tight">{label}</p>
    </Link>
  );
}

function SectionHeader({ title, count, href }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h2>
      <Link to={href} className="text-xs text-blue-500 hover:text-blue-300 flex items-center gap-1">
        {typeof count === 'string' ? count : `${count} total`} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

function Skeleton() {
  return <div className="p-4 space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-slate-800 rounded-lg animate-pulse" />)}</div>;
}

function Empty({ children }) {
  return <div className="px-4 py-6 text-center"><p className="text-slate-600 text-xs mb-2">Nothing here yet.</p>{children}</div>;
}