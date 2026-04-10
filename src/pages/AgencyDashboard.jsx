import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Users, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight, Plus } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';

export default function AgencyDashboard() {
  const [clients, setClients] = useState([]);
  const [topics, setTopics] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ContentTopics.list('-created_date', 50),
      base44.entities.AIJobs.list('-created_date', 100),
      base44.entities.ContentAssets.list('-updated_date', 20),
    ]).then(([c, t, j, a]) => {
      setClients(c);
      setTopics(t);
      setJobs(j);
      setAssets(a);
      setLoading(false);
    });
  }, []);

  const activeClients = clients.filter(c => c.status === 'active_client');
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

        {/* KPI strip */}
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

        {/* Workflow guide */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Daily Workflow</h2>
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

        {/* Failed jobs alert */}
        {failedJobs.length > 0 && (
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