import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, ExternalLink, Plus, FileText, Zap, Eye } from 'lucide-react';
import CRMLayout from '../components/crm-dashboard/CRMLayout';

const STATUS_COLORS = {
  idea: 'bg-slate-700 text-slate-300', queued: 'bg-blue-900 text-blue-300',
  processing: 'bg-amber-900 text-amber-300', ready_for_review: 'bg-violet-900 text-violet-300',
  published: 'bg-emerald-900 text-emerald-300', error: 'bg-red-900 text-red-300',
  pending: 'bg-slate-700 text-slate-300', completed: 'bg-emerald-900 text-emerald-300',
  failed: 'bg-red-900 text-red-300', draft: 'bg-slate-700 text-slate-300',
  approved: 'bg-teal-900 text-teal-300', ready_for_review2: 'bg-violet-900 text-violet-300',
  active_client: 'bg-emerald-900 text-emerald-300', lead: 'bg-blue-900 text-blue-300',
  paused: 'bg-amber-900 text-amber-300', former_client: 'bg-slate-700 text-slate-400',
};

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [topics, setTopics] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('topics');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      base44.entities.Clients.get(id),
      base44.entities.ContentTopics.filter({ client_id: id }),
      base44.entities.AIJobs.filter({ client_id: id }),
      base44.entities.ContentAssets.filter({ client_id: id }),
    ]).then(([c, t, j, a]) => {
      setClient(c);
      setTopics(t);
      setJobs(j);
      setAssets(a);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <CRMLayout><div className="p-6 text-slate-500 text-sm">Loading...</div></CRMLayout>;
  if (!client) return <CRMLayout><div className="p-6 text-slate-500 text-sm">Client not found.</div></CRMLayout>;

  const statusColor = STATUS_COLORS[client.status] || 'bg-slate-700 text-slate-400';

  return (
    <CRMLayout>
      <div className="p-6 space-y-6">
        {/* Back + header */}
        <div>
          <Link to="/clients" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Clients
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{client.business_name}</h1>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{client.status?.replace('_', ' ')}</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {[client.city, client.state].filter(Boolean).join(', ')}
                {client.website && (
                  <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                    target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> Website
                  </a>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/agency/content?client=${id}`}
                className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Zap className="w-4 h-4" /> Open Content Center
              </Link>
              <Link to={`/agency/content?client=${id}&tab=intake`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> New Topic
              </Link>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {client.primary_contact && <InfoCard label="Primary Contact" value={client.primary_contact} />}
          {client.email && <InfoCard label="Email" value={client.email} />}
          {client.phone && <InfoCard label="Phone" value={client.phone} />}
          {client.core_services && <InfoCard label="Core Services" value={client.core_services} />}
          {client.posting_channels?.length > 0 && <InfoCard label="Posting Channels" value={client.posting_channels.join(', ')} />}
        </div>

        {client.brand_voice && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Brand Voice</p>
            <p className="text-sm text-slate-300">{client.brand_voice}</p>
          </div>
        )}
        {client.target_keywords && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Keywords</p>
            <p className="text-sm text-slate-400">{client.target_keywords}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Topics', value: topics.length, color: 'text-blue-400' },
            { label: 'AI Jobs', value: jobs.length, color: 'text-amber-400' },
            { label: 'Assets', value: assets.length, color: 'text-violet-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-1 mb-4">
            {[['topics', 'Topics'], ['jobs', 'AI Jobs'], ['assets', 'Assets']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === key ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'topics' && (
            <SimpleTable
              rows={topics}
              cols={[
                { h: 'Title', r: t => <span className="font-medium text-white text-sm">{t.title}</span> },
                { h: 'Status', r: t => <Badge status={t.status} /> },
                { h: 'Priority', r: t => <span className="text-xs text-slate-400 capitalize">{t.priority}</span> },
                { h: 'Assets', r: t => <span className="text-xs text-slate-500">{(t.requested_assets || []).join(', ')}</span> },
                { h: 'Created', r: t => <span className="text-xs text-slate-500">{fmt(t.created_date)}</span> },
              ]}
              empty="No topics yet."
            />
          )}
          {activeTab === 'jobs' && (
            <SimpleTable
              rows={jobs}
              cols={[
                { h: 'Topic', r: j => <span className="text-sm text-white">{j.topic_title}</span> },
                { h: 'Type', r: j => <span className="text-xs text-slate-300 capitalize">{j.job_type?.replace('_', ' ')}</span> },
                { h: 'Status', r: j => <Badge status={j.status} /> },
                { h: 'Created', r: j => <span className="text-xs text-slate-500">{fmt(j.created_date)}</span> },
                { h: 'Completed', r: j => <span className="text-xs text-slate-500">{j.completed_at ? fmt(j.completed_at) : '—'}</span> },
              ]}
              empty="No AI jobs yet."
            />
          )}
          {activeTab === 'assets' && (
            <SimpleTable
              rows={assets}
              cols={[
                { h: 'Title', r: a => <span className="font-medium text-white text-sm">{a.title || a.asset_type}</span> },
                { h: 'Type', r: a => <span className="text-xs text-slate-300 capitalize">{a.asset_type?.replace('_', ' ')}</span> },
                { h: 'Status', r: a => <Badge status={a.status} /> },
                { h: 'Created', r: a => <span className="text-xs text-slate-500">{fmt(a.created_date)}</span> },
              ]}
              empty="No content assets yet."
            />
          )}
        </div>
      </div>
    </CRMLayout>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-slate-200">{value}</p>
    </div>
  );
}

function Badge({ status }) {
  const c = {
    idea: 'bg-slate-700 text-slate-300', queued: 'bg-blue-900 text-blue-300',
    processing: 'bg-amber-900 text-amber-300', ready_for_review: 'bg-violet-900 text-violet-300',
    published: 'bg-emerald-900 text-emerald-300', error: 'bg-red-900 text-red-300',
    pending: 'bg-slate-700 text-slate-300', completed: 'bg-emerald-900 text-emerald-300',
    failed: 'bg-red-900 text-red-300', draft: 'bg-slate-700 text-slate-300',
    approved: 'bg-teal-900 text-teal-300',
  }[status] || 'bg-slate-700 text-slate-300';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c}`}>{status}</span>;
}

function SimpleTable({ rows, cols, empty }) {
  if (!rows.length) return <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">{empty}</div>;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-800">{cols.map(c => <th key={c.h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{c.h}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-800">{rows.map((row, i) => <tr key={row.id || i} className="hover:bg-slate-800/40"><td></td>{cols.map(c => <td key={c.h} className="px-4 py-3">{c.r(row)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}