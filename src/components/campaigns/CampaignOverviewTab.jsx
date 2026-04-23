import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertTriangle, Clock, CheckSquare, Wifi, Calendar } from 'lucide-react';
import { CampaignStatusBadge, PostStatusBadge, ApprovalBadge, PLATFORM_ICON } from './CampaignUtils';

export default function CampaignOverviewTab({ campaigns, posts, clients, connections, onNewCampaign, onNewPost, onTabChange }) {
  const now = new Date();
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);

  const recentCampaigns = campaigns.slice(0, 5);
  const upcomingPosts = posts
    .filter(p => p.scheduled_date && new Date(p.scheduled_date) >= now && p.publishing_status !== 'Published')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 8);
  const pendingApprovals = posts.filter(p => p.approval_status === 'Pending').slice(0, 5);
  const failedPosts = posts.filter(p => p.publishing_status === 'Failed').slice(0, 5);

  const clientMap = {};
  clients.forEach(c => clientMap[c.id] = c.business_name);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Plus, label: 'New Campaign', action: onNewCampaign, color: 'bg-blue-600 hover:bg-blue-500' },
          { icon: Plus, label: 'New Post', action: onNewPost, color: 'bg-slate-700 hover:bg-slate-600 border border-slate-600' },
          { icon: Calendar, label: 'View Calendar', action: () => onTabChange('calendar'), color: 'bg-slate-700 hover:bg-slate-600 border border-slate-600' },
          { icon: CheckSquare, label: 'Approval Queue', action: () => onTabChange('approvals'), color: 'bg-amber-900/40 hover:bg-amber-900/60 border border-amber-800 text-amber-300' },
        ].map(q => (
          <button key={q.label} onClick={q.action} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all ${q.color}`}>
            <q.icon className="w-4 h-4 flex-shrink-0" />
            {q.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Section title="Recent Campaigns" action={{ label: 'View All', onClick: () => onTabChange('campaigns') }}>
          {recentCampaigns.length === 0 ? (
            <EmptyState message="No campaigns yet" action={{ label: 'Create Campaign', onClick: onNewCampaign }} />
          ) : recentCampaigns.map(c => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{c.campaign_name}</p>
                <p className="text-xs text-slate-500">{c.business_name || 'NTA Internal'} · {c.campaign_type}</p>
              </div>
              <CampaignStatusBadge status={c.status} />
            </div>
          ))}
        </Section>

        {/* Upcoming Posts */}
        <Section title="Upcoming Posts" action={{ label: 'View All', onClick: () => onTabChange('posts') }}>
          {upcomingPosts.length === 0 ? (
            <EmptyState message="No upcoming posts" action={{ label: 'Create Post', onClick: onNewPost }} />
          ) : upcomingPosts.map(p => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base flex-shrink-0">{PLATFORM_ICON[p.platform] || '📱'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.business_name || 'NTA'} · {p.scheduled_date}</p>
                </div>
              </div>
              <PostStatusBadge status={p.publishing_status} />
            </div>
          ))}
        </Section>

        {/* Pending Approvals */}
        <Section title="Approval Queue" action={{ label: 'Review All', onClick: () => onTabChange('approvals') }}>
          {pendingApprovals.length === 0 ? (
            <EmptyState message="No pending approvals" />
          ) : pendingApprovals.map(p => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{p.title}</p>
                <p className="text-xs text-slate-500">{p.platform} · {p.scheduled_date || 'No date'}</p>
              </div>
              <ApprovalBadge status={p.approval_status} />
            </div>
          ))}
        </Section>

        {/* Failed Posts */}
        <Section title="Failed Posts" highlight={failedPosts.length > 0} action={{ label: 'View History', onClick: () => onTabChange('history') }}>
          {failedPosts.length === 0 ? (
            <EmptyState message="No failed posts — all clear" icon="✅" />
          ) : failedPosts.map(p => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.platform} · {p.business_name || 'NTA'}</p>
                </div>
              </div>
              <PostStatusBadge status={p.publishing_status} />
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, action, highlight }) {
  return (
    <div className={`bg-slate-900 border rounded-xl overflow-hidden ${highlight ? 'border-red-900/60' : 'border-slate-800'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h3>
        {action && (
          <button onClick={action.onClick} className="text-xs text-blue-500 hover:text-blue-300">{action.label} →</button>
        )}
      </div>
      <div className="divide-y divide-slate-800/60">{children}</div>
    </div>
  );
}

function EmptyState({ message, action, icon }) {
  return (
    <div className="px-4 py-8 text-center">
      {icon && <p className="text-2xl mb-2">{icon}</p>}
      <p className="text-slate-600 text-sm mb-2">{message}</p>
      {action && (
        <button onClick={action.onClick} className="text-xs text-blue-500 hover:text-blue-300 font-semibold">{action.label} →</button>
      )}
    </div>
  );
}