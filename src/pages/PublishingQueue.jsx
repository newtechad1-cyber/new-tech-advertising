import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import QueueItemRow from '../components/publishing/QueueItemRow';
import AddToQueueModal from '../components/publishing/AddToQueueModal';
import { RefreshCw, Plus, X } from 'lucide-react';

const PROVIDER_LABELS = {
  google_business_profile: '📍 GBP',
  facebook: '👥 Facebook',
  instagram: '📸 Instagram',
  youtube: '▶️ YouTube',
};

const APPROVAL_FILTERS = ['all', 'draft', 'needs_review', 'approved', 'rejected'];
const PUBLISH_FILTERS  = ['all', 'not_started', 'queued', 'scheduled', 'publishing', 'posted', 'failed', 'cancelled'];

export default function PublishingQueuePage() {
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [publishFilter, setPublishFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [q, c, cx] = await Promise.all([
      base44.entities.PublishingQueue.list('-created_date', 200),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ChannelConnection.list('-updated_date', 200),
    ]);
    setItems(q);
    setClients(c);
    setConnections(cx);
    setLoading(false);
  };

  const filtered = items.filter(item => {
    if (approvalFilter !== 'all' && item.approval_status !== approvalFilter) return false;
    if (publishFilter  !== 'all' && item.publish_status  !== publishFilter)  return false;
    if (providerFilter !== 'all' && item.provider !== providerFilter) return false;
    if (clientFilter   !== 'all' && item.client_id !== clientFilter) return false;
    return true;
  });

  const now = new Date();
  const stats = {
    total:       items.length,
    queued:      items.filter(i => ['queued', 'scheduled', 'not_started'].includes(i.publish_status) && i.approval_status === 'approved').length,
    due_now:     items.filter(i => ['queued', 'scheduled', 'not_started'].includes(i.publish_status) && i.approval_status === 'approved' && i.connection_id && i.scheduled_for && new Date(i.scheduled_for) <= now).length,
    posted:      items.filter(i => i.publish_status === 'posted').length,
    failed:      items.filter(i => i.publish_status === 'failed').length,
  };

  const providerOptions = [...new Set(items.map(i => i.provider))];

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Publishing Queue</h1>
            <p className="text-slate-500 text-sm mt-0.5">Approve → Schedule → Publish to all platforms</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> Add to Queue
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Items', value: stats.total,    color: 'text-slate-300' },
            { label: 'Queued',      value: stats.queued,   color: stats.queued > 0 ? 'text-blue-400' : 'text-slate-500' },
            { label: 'Due Now',     value: stats.due_now,  color: stats.due_now > 0 ? 'text-amber-400' : 'text-slate-500' },
            { label: 'Posted',      value: stats.posted,   color: stats.posted > 0 ? 'text-emerald-400' : 'text-slate-500' },
            { label: 'Failed',      value: stats.failed,   color: stats.failed > 0 ? 'text-red-400' : 'text-slate-500' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <FilterPills label="Approval" options={APPROVAL_FILTERS} active={approvalFilter} onChange={setApprovalFilter} />
          <FilterPills label="Status"   options={PUBLISH_FILTERS}  active={publishFilter}   onChange={setPublishFilter} />
          <select value={providerFilter} onChange={e => setProviderFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
            <option value="all">All Platforms</option>
            {providerOptions.map(p => <option key={p} value={p}>{PROVIDER_LABELS[p] || p}</option>)}
          </select>
          <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
            <option value="all">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400 font-medium">No items match your filters.</p>
            <p className="text-slate-600 text-sm mt-1">Add content to the queue using the button above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <QueueItemRow key={item.id} item={item} onRefresh={loadAll} onDetail={setDetailItem} connections={connections} />
            ))}
          </div>
        )}
      </div>

      {/* Add to queue modal */}
      {showAddModal && (
        <AddToQueueModal
          clientId={clients[0]?.id || ''}
          clientName={clients[0]?.business_name || ''}
          onClose={() => setShowAddModal(false)}
          onAdded={loadAll}
        />
      )}

      {/* Detail drawer */}
      {detailItem && (
        <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{detailItem.title || 'Queue Item'}</p>
              <p className="text-xs text-slate-500">{PROVIDER_LABELS[detailItem.provider]} · {detailItem.client_name}</p>
            </div>
            <button onClick={() => setDetailItem(null)} className="p-2 text-slate-500 hover:text-white rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <MetaRow label="Approval" value={detailItem.approval_status} />
            <MetaRow label="Publish Status" value={detailItem.publish_status} />
            <MetaRow label="Scheduled For" value={detailItem.scheduled_for ? new Date(detailItem.scheduled_for).toLocaleString() : '—'} />
            <MetaRow label="Retries" value={`${detailItem.retry_count || 0} / ${detailItem.max_retries || 3}`} />
            {detailItem.platform_post_url && <MetaRow label="Post URL" value={<a href={detailItem.platform_post_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{detailItem.platform_post_url}</a>} />}
            {detailItem.error_message && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-400 mb-1">Error</p>
                <p className="text-xs text-red-300">{detailItem.error_message}</p>
              </div>
            )}
            {detailItem.body_text && (
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Content</p>
                <pre className="bg-slate-800 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap">{detailItem.body_text}</pre>
              </div>
            )}
            {detailItem.provider_response && (
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Provider Response</p>
                <pre className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400 whitespace-pre-wrap overflow-auto max-h-40">
                  {JSON.stringify(JSON.parse(detailItem.provider_response || '{}'), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

function FilterPills({ label, options, active, onChange }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors capitalize ${
            active === o ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}>{o.replace(/_/g, ' ')}</button>
      ))}
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500 text-xs flex-shrink-0 w-28">{label}</span>
      <span className="text-white text-xs text-right capitalize">{value}</span>
    </div>
  );
}