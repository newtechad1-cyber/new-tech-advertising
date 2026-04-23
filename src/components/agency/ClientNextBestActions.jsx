import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Circle, ArrowRight, Settings2, Wifi, Megaphone,
  Radio, FileText, Shield, Calendar, AlertTriangle
} from 'lucide-react';

/**
 * Derives next best actions from actual record state and renders a
 * compact checklist card. Pass all the loaded data from AgencyClientDetail.
 */
export default function ClientNextBestActions({
  clientId,
  setup,
  connections,
  campaigns,
  spokeCampaigns,
  contentAssets,
  approvalItems,
  socialPosts,
  onCreateCampaign,
  onCreateSpoke,
}) {
  const connectedChannels = connections.filter(c => c.status === 'connected');
  const pendingApprovals = approvalItems.filter(a => a.status === 'pending').length;
  const scheduledPosts = socialPosts.filter(p => p.publish_status === 'scheduled').length;
  const setupComplete = setup?.onboarding_stage === 'Complete' || (setup?.percent_complete ?? 0) >= 100;

  // Build ordered action list — each item is { done, label, sublabel, href, onClick, urgent }
  const actions = [
    {
      key: 'setup',
      done: !!setup && setupComplete,
      label: setup ? (setupComplete ? 'Setup Complete' : 'Finish Client Setup') : 'Initialize Onboarding',
      sublabel: setup ? `${setup.onboarding_stage} · ${setup.percent_complete ?? 0}%` : 'No setup started',
      href: setup ? `/agency/clients/${clientId}/setup` : null,
      icon: Settings2,
      category: 'Setup',
    },
    {
      key: 'channels',
      done: connectedChannels.length > 0,
      label: connectedChannels.length > 0 ? `${connectedChannels.length} Channel${connectedChannels.length > 1 ? 's' : ''} Connected` : 'Connect Channels',
      sublabel: connectedChannels.length > 0 ? connectedChannels.map(c => c.provider?.replace(/_/g, ' ')).join(', ') : 'No channels connected yet',
      href: '/agency/channel-connections',
      icon: Wifi,
      category: 'Setup',
    },
    {
      key: 'campaign',
      done: campaigns.length > 0,
      label: campaigns.length > 0 ? `${campaigns.length} Campaign${campaigns.length > 1 ? 's' : ''} Created` : 'Create First Campaign',
      sublabel: campaigns.length > 0 ? `${campaigns.filter(c => c.status === 'Active').length} active` : 'No campaigns yet',
      href: campaigns.length > 0 ? `/agency/campaigns?client=${clientId}` : null,
      onClick: campaigns.length === 0 ? onCreateCampaign : null,
      icon: Megaphone,
      category: 'Content',
    },
    {
      key: 'spoke',
      done: spokeCampaigns.length > 0,
      label: spokeCampaigns.length > 0 ? `${spokeCampaigns.length} Spoke Campaign${spokeCampaigns.length > 1 ? 's' : ''}` : 'Create Spoke Campaign',
      sublabel: spokeCampaigns.length > 0 ? spokeCampaigns[0]?.campaign_name : 'No spoke campaigns yet',
      href: spokeCampaigns.length > 0 ? '/agency/spoke-campaigns' : null,
      onClick: spokeCampaigns.length === 0 ? onCreateSpoke : null,
      icon: Radio,
      category: 'Content',
    },
    {
      key: 'content',
      done: contentAssets.length > 0,
      label: contentAssets.length > 0 ? `${contentAssets.length} Content Asset${contentAssets.length > 1 ? 's' : ''}` : 'Create First Content',
      sublabel: contentAssets.length > 0
        ? `${contentAssets.filter(a => a.approval_status === 'approved').length} approved`
        : 'No content assets yet',
      href: `/agency/content-asset?client=${clientId}`,
      icon: FileText,
      category: 'Content',
    },
    {
      key: 'approvals',
      done: pendingApprovals === 0,
      urgent: pendingApprovals > 0,
      label: pendingApprovals > 0 ? `${pendingApprovals} Approval${pendingApprovals > 1 ? 's' : ''} Pending` : 'No Pending Approvals',
      sublabel: pendingApprovals > 0 ? 'Review and approve content' : 'All caught up',
      href: `/agency/approval-center?client=${clientId}`,
      icon: Shield,
      category: 'Approval',
    },
    {
      key: 'publishing',
      done: scheduledPosts > 0,
      label: scheduledPosts > 0 ? `${scheduledPosts} Post${scheduledPosts > 1 ? 's' : ''} Scheduled` : 'Schedule Publishing',
      sublabel: scheduledPosts > 0 ? 'Publishing calendar active' : 'No posts scheduled yet',
      href: `/agency/publishing-calendar?client=${clientId}`,
      icon: Calendar,
      category: 'Publishing',
    },
  ];

  const totalDone = actions.filter(a => a.done && !a.urgent).length;
  const total = actions.length;
  const pct = Math.round((totalDone / total) * 100);

  // Group by category for the progress strip
  const categories = ['Setup', 'Content', 'Approval', 'Publishing'];
  const categoryStatus = categories.map(cat => {
    const catActions = actions.filter(a => a.category === cat);
    const allDone = catActions.every(a => a.done && !a.urgent);
    const hasUrgent = catActions.some(a => a.urgent);
    return { cat, allDone, hasUrgent };
  });

  // Only show incomplete actions (+ urgent ones even if technically "done" by value)
  const openActions = actions.filter(a => !a.done || a.urgent);

  // If everything is done and nothing urgent, show a compact "all good" state
  if (openActions.length === 0) {
    return (
      <div className="bg-slate-900 border border-emerald-800/40 rounded-2xl px-5 py-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-emerald-300">All systems go — {total}/{total} steps complete</p>
          <p className="text-xs text-slate-500 mt-0.5">This client is fully set up and operational.</p>
        </div>
        <CategoryStrip categoryStatus={categoryStatus} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-white">Next Best Actions</p>
          <span className="text-xs text-slate-500">{totalDone}/{total} complete</span>
        </div>
        <CategoryStrip categoryStatus={categoryStatus} />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <div
          className="h-1 bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Action rows */}
      <div className="divide-y divide-slate-800/60">
        {openActions.map(action => {
          const Icon = action.icon;
          const inner = (
            <div className={`flex items-center gap-3 px-5 py-3 group transition-colors ${
              action.href || action.onClick
                ? 'hover:bg-slate-800/50 cursor-pointer'
                : ''
            } ${action.urgent ? 'bg-amber-950/20' : ''}`}>
              <div className="flex-shrink-0">
                {action.urgent
                  ? <AlertTriangle className="w-4 h-4 text-amber-400" />
                  : <Circle className="w-4 h-4 text-slate-600" />
                }
              </div>
              <Icon className={`w-4 h-4 flex-shrink-0 ${action.urgent ? 'text-amber-400' : 'text-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${action.urgent ? 'text-amber-300' : 'text-white'}`}>
                  {action.label}
                </p>
                <p className="text-xs text-slate-500 truncate">{action.sublabel}</p>
              </div>
              {(action.href || action.onClick) && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
              )}
            </div>
          );

          if (action.href) {
            return <Link key={action.key} to={action.href}>{inner}</Link>;
          }
          if (action.onClick) {
            return (
              <button key={action.key} onClick={action.onClick} className="w-full text-left">
                {inner}
              </button>
            );
          }
          return <div key={action.key}>{inner}</div>;
        })}
      </div>
    </div>
  );
}

function CategoryStrip({ categoryStatus }) {
  const colors = {
    done: 'bg-emerald-500',
    urgent: 'bg-amber-500',
    pending: 'bg-slate-700',
  };
  return (
    <div className="flex items-center gap-1.5">
      {categoryStatus.map(({ cat, allDone, hasUrgent }) => (
        <div key={cat} className="flex flex-col items-center gap-0.5">
          <div className={`w-8 h-1.5 rounded-full ${hasUrgent ? colors.urgent : allDone ? colors.done : colors.pending}`} />
          <span className="text-[9px] text-slate-600 leading-none">{cat}</span>
        </div>
      ))}
    </div>
  );
}