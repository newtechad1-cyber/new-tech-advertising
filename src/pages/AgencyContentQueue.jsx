import React, { useState, useEffect } from 'react';
import AgencyLayout from '../components/agency/AgencyLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Search } from 'lucide-react';
import CQOverviewTab from '../components/content-queue/CQOverviewTab';
import CQQueueTab from '../components/content-queue/CQQueueTab';
import CQReviewTab from '../components/content-queue/CQReviewTab';
import CQAssetsTab from '../components/content-queue/CQAssetsTab';
import CQAssignTab from '../components/content-queue/CQAssignTab';
import CQScheduledTab from '../components/content-queue/CQScheduledTab';
import CQArchiveTab from '../components/content-queue/CQArchiveTab';
import AddContentModal from '../components/content-queue/AddContentModal';
import AssignToCampaignModal from '../components/campaigns/AssignToCampaignModal';
import {
  LayoutDashboard, List, Eye, Image, Send, Calendar, Archive, Plus as PlusIcon
} from 'lucide-react';

const TABS = [
  { id: 'overview',  label: 'Overview',           icon: LayoutDashboard },
  { id: 'queue',     label: 'Queue',               icon: List },
  { id: 'review',    label: 'Review',              icon: Eye },
  { id: 'assets',    label: 'Assets',              icon: Image },
  { id: 'assign',    label: 'Campaign Assignment', icon: Send },
  { id: 'scheduled', label: 'Scheduled / Published', icon: Calendar },
  { id: 'archive',   label: 'Archive',             icon: Archive },
];

export default function AgencyContentQueue() {
  const [tab, setTab] = useState('overview');
  const [items, setItems] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [assignItems, setAssignItems] = useState(null); // array when open

  const load = async () => {
    setLoading(true);
    const [qi, camp, c, p] = await Promise.all([
      base44.entities.ContentQueueItem.list('-created_date', 500),
      base44.entities.Campaign.list('-created_date', 200),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.CampaignPost.list('-created_date', 200),
    ]);
    setItems(qi);
    setCampaigns(camp);
    setClients(c);
    setPosts(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const active = items.filter(i => i.queue_status !== 'Archived');

  const stats = {
    total:      active.length,
    toReview:   active.filter(i => i.approval_status === 'Pending' || i.review_status === 'Unreviewed').length,
    ready:      active.filter(i => i.queue_status === 'Ready to Schedule').length,
    assigned:   active.filter(i => i.queue_status === 'Assigned to Campaign').length,
    scheduled:  active.filter(i => i.queue_status === 'Scheduled').length,
    published:  items.filter(i => i.queue_status === 'Published').length,
    revision:   active.filter(i => i.approval_status === 'Revision Needed').length,
  };

  const sharedProps = { items, campaigns, clients, posts, onRefresh: load, onAssign: setAssignItems };

  return (
    <AgencyLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 pt-6 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <h1 className="text-xl font-bold text-white">Content Queue</h1>
              <p className="text-slate-500 text-sm mt-0.5">Review, approve, and move content into campaigns for scheduling</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setAssignItems(active.filter(i => i.approval_status === 'Approved' && i.queue_status === 'Ready to Schedule'))} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg">
                <Send className="w-3.5 h-3.5" /> Assign to Campaign
              </button>
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                <Plus className="w-3.5 h-3.5" /> Add Content
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
            {[
              { label: 'Total',       value: stats.total,     color: 'text-slate-300' },
              { label: 'To Review',   value: stats.toReview,  color: 'text-amber-400',   onClick: () => setTab('review') },
              { label: 'Ready',       value: stats.ready,     color: 'text-blue-400',    onClick: () => setTab('assign') },
              { label: 'Assigned',    value: stats.assigned,  color: 'text-violet-400',  onClick: () => setTab('assign') },
              { label: 'Scheduled',   value: stats.scheduled, color: 'text-teal-400',    onClick: () => setTab('scheduled') },
              { label: 'Published',   value: stats.published, color: 'text-emerald-400', onClick: () => setTab('scheduled') },
              { label: 'Revision',    value: stats.revision,  color: stats.revision > 0 ? 'text-orange-400' : 'text-slate-500', onClick: () => setTab('review') },
            ].map(s => (
              <button key={s.label} onClick={s.onClick} className={`bg-slate-900 border border-slate-800 rounded-xl p-3 text-left transition-all ${s.onClick ? 'hover:border-slate-600' : 'cursor-default'}`}>
                <p className={`text-xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 border-b border-slate-800 overflow-x-auto">
            {TABS.map(t => {
              const Icon = t.icon;
              const badge = t.id === 'review' ? stats.toReview : t.id === 'assign' ? stats.ready : 0;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    tab === t.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {badge > 0 && <span className="bg-amber-500 text-black text-xs font-black px-1.5 py-0.5 rounded-full leading-none">{badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
          ) : (
            <>
              {tab === 'overview'  && <CQOverviewTab  {...sharedProps} onNewContent={() => setShowAdd(true)} onTabChange={setTab} />}
              {tab === 'queue'     && <CQQueueTab     {...sharedProps} onNewContent={() => setShowAdd(true)} />}
              {tab === 'review'    && <CQReviewTab    {...sharedProps} />}
              {tab === 'assets'    && <CQAssetsTab    {...sharedProps} />}
              {tab === 'assign'    && <CQAssignTab    {...sharedProps} />}
              {tab === 'scheduled' && <CQScheduledTab {...sharedProps} />}
              {tab === 'archive'   && <CQArchiveTab   {...sharedProps} />}
            </>
          )}
        </div>
      </div>

      {showAdd && (
        <AddContentModal clients={clients} campaigns={campaigns} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />
      )}

      {assignItems && (
        <AssignToCampaignModal
          items={assignItems}
          campaigns={campaigns}
          clients={clients}
          onClose={() => setAssignItems(null)}
          onSaved={() => { setAssignItems(null); load(); }}
        />
      )}
    </AgencyLayout>
  );
}