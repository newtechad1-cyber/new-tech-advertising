import React, { useState, useEffect } from 'react';
import AgencyLayout from '../components/agency/AgencyLayout';
import { base44 } from '@/api/base44Client';
import CampaignOverviewTab from '../components/campaigns/CampaignOverviewTab';
import CampaignListTab from '../components/campaigns/CampaignListTab';
import CampaignCalendarTab from '../components/campaigns/CampaignCalendarTab';
import CampaignPostsTab from '../components/campaigns/CampaignPostsTab';
import CampaignApprovalsTab from '../components/campaigns/CampaignApprovalsTab';
import CampaignChannelsTab from '../components/campaigns/CampaignChannelsTab';
import CampaignHistoryTab from '../components/campaigns/CampaignHistoryTab';
import CreateCampaignModal from '../components/campaigns/CreateCampaignModal';
import CreatePostModal from '../components/campaigns/CreatePostModal';
import {
  LayoutDashboard, Calendar, List, Clock, CheckSquare, Wifi,
  History, Plus, Megaphone, RefreshCw
} from 'lucide-react';

const TABS = [
  { id: 'overview',   label: 'Overview',        icon: LayoutDashboard },
  { id: 'campaigns',  label: 'Campaigns',        icon: Megaphone },
  { id: 'calendar',   label: 'Calendar',         icon: Calendar },
  { id: 'posts',      label: 'Scheduled Posts',  icon: Clock },
  { id: 'approvals',  label: 'Approvals',        icon: CheckSquare },
  { id: 'channels',   label: 'Channels',         icon: Wifi },
  { id: 'history',    label: 'History',          icon: History },
];

export default function AgencyCampaigns() {
  const [tab, setTab] = useState('overview');
  const [campaigns, setCampaigns] = useState([]);
  const [posts, setPosts] = useState([]);
  const [clients, setClients] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const load = async () => {
    setLoading(true);
    const [camp, p, c, conn] = await Promise.all([
      base44.entities.Campaign.list('-created_date', 200),
      base44.entities.CampaignPost.list('-created_date', 500),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ChannelConnection.list('-updated_date', 300),
    ]);
    setCampaigns(camp);
    setPosts(p);
    setClients(c);
    setConnections(conn);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Summary stats
  const now = new Date();
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const scheduledThisWeek = posts.filter(p => {
    if (!p.scheduled_date) return false;
    const d = new Date(p.scheduled_date);
    return d >= now && d <= weekEnd;
  }).length;
  const awaitingApproval = posts.filter(p => p.approval_status === 'Pending').length;
  const failedPosts = posts.filter(p => p.publishing_status === 'Failed').length;
  const connectedChannels = connections.filter(c => c.status === 'connected').length;

  const sharedProps = { campaigns, posts, clients, connections, onRefresh: load };

  return (
    <AgencyLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 pt-6 pb-0 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <h1 className="text-xl font-bold text-white">Campaign Management</h1>
              <p className="text-slate-500 text-sm mt-0.5">Plan, schedule, and track social campaigns across all clients</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={() => setShowCreatePost(true)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" /> New Post
              </button>
              <button onClick={() => setShowCreateCampaign(true)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" /> New Campaign
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
            {[
              { label: 'Total Campaigns', value: totalCampaigns, color: 'text-blue-400' },
              { label: 'Active', value: activeCampaigns, color: 'text-emerald-400' },
              { label: 'This Week', value: scheduledThisWeek, color: 'text-violet-400' },
              { label: 'Awaiting Approval', value: awaitingApproval, color: 'text-amber-400', onClick: () => setTab('approvals') },
              { label: 'Failed Posts', value: failedPosts, color: failedPosts > 0 ? 'text-red-400' : 'text-slate-500', onClick: () => setTab('history') },
              { label: 'Connected Channels', value: connectedChannels, color: 'text-teal-400', onClick: () => setTab('channels') },
            ].map(s => (
              <button key={s.label} onClick={s.onClick} className={`bg-slate-900 border border-slate-800 rounded-xl p-3 text-left transition-all ${s.onClick ? 'hover:border-slate-600 cursor-pointer' : 'cursor-default'}`}>
                <p className={`text-2xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 border-b border-slate-800">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    tab === t.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {t.id === 'approvals' && awaitingApproval > 0 && (
                    <span className="bg-amber-500 text-black text-xs font-black px-1.5 py-0.5 rounded-full leading-none">{awaitingApproval}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {tab === 'overview'  && <CampaignOverviewTab  {...sharedProps} onNewCampaign={() => setShowCreateCampaign(true)} onNewPost={() => setShowCreatePost(true)} onTabChange={setTab} />}
              {tab === 'campaigns' && <CampaignListTab      {...sharedProps} onNewCampaign={() => setShowCreateCampaign(true)} />}
              {tab === 'calendar'  && <CampaignCalendarTab  {...sharedProps} />}
              {tab === 'posts'     && <CampaignPostsTab     {...sharedProps} onNewPost={() => setShowCreatePost(true)} />}
              {tab === 'approvals' && <CampaignApprovalsTab {...sharedProps} />}
              {tab === 'channels'  && <CampaignChannelsTab  {...sharedProps} />}
              {tab === 'history'   && <CampaignHistoryTab   {...sharedProps} />}
            </>
          )}
        </div>
      </div>

      {showCreateCampaign && (
        <CreateCampaignModal clients={clients} onClose={() => setShowCreateCampaign(false)} onSaved={() => { setShowCreateCampaign(false); load(); }} />
      )}
      {showCreatePost && (
        <CreatePostModal campaigns={campaigns} clients={clients} onClose={() => setShowCreatePost(false)} onSaved={() => { setShowCreatePost(false); load(); }} />
      )}
    </AgencyLayout>
  );
}