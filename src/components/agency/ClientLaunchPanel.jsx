import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Circle, ChevronRight, Rocket, Settings2,
  Wifi, Megaphone, Radio, FileText, Shield, Calendar, AlertTriangle
} from 'lucide-react';

function deriveStatus({ setup, connections, campaigns, spokeCampaigns, contentAssets, approvalItems, socialPosts }) {
  const setupDone = setup?.onboarding_stage === 'Complete' || (setup?.percent_complete ?? 0) >= 100;
  const hasChannels = connections.filter(c => c.status === 'connected').length > 0;
  const hasCampaign = campaigns.length > 0;
  const hasSpoke = spokeCampaigns.length > 0;
  const hasContent = contentAssets.length > 0;
  const pendingApprovals = approvalItems.filter(a => a.status === 'pending').length;
  const hasScheduled = socialPosts.filter(p => p.publish_status === 'scheduled').length > 0;

  if (!setup) return 'not_started';
  if (!setupDone) return 'in_setup';
  if (!hasChannels || !hasCampaign || !hasSpoke) return 'ready_for_content';
  if (!hasContent) return 'ready_for_content';
  if (pendingApprovals > 0) return 'ready_for_approval';
  if (!hasScheduled) return 'ready_to_publish';
  return 'active';
}

const STATUS_META = {
  not_started:       { label: 'Not Started',         color: 'text-slate-400',   bar: 'bg-slate-700',    pct: 0 },
  in_setup:          { label: 'In Setup',             color: 'text-blue-400',    bar: 'bg-blue-500',     pct: 15 },
  ready_for_content: { label: 'Ready for Content',    color: 'text-violet-400',  bar: 'bg-violet-500',   pct: 45 },
  ready_for_approval:{ label: 'Ready for Approval',   color: 'text-amber-400',   bar: 'bg-amber-500',    pct: 70 },
  ready_to_publish:  { label: 'Ready to Publish',     color: 'text-sky-400',     bar: 'bg-sky-500',      pct: 85 },
  active:            { label: 'Active',               color: 'text-emerald-400', bar: 'bg-emerald-500',  pct: 100 },
};

const STEPS = [
  { key: 'setup',     icon: Settings2, label: 'Setup',     check: d => !!d.setup && (d.setup.onboarding_stage === 'Complete' || (d.setup.percent_complete ?? 0) >= 100) },
  { key: 'channels',  icon: Wifi,      label: 'Channels',  check: d => d.connections.filter(c => c.status === 'connected').length > 0 },
  { key: 'campaign',  icon: Megaphone, label: 'Campaign',  check: d => d.campaigns.length > 0 },
  { key: 'spoke',     icon: Radio,     label: 'Spoke',     check: d => d.spokeCampaigns.length > 0 },
  { key: 'content',   icon: FileText,  label: 'Content',   check: d => d.contentAssets.length > 0 },
  { key: 'approval',  icon: Shield,    label: 'Approvals', check: d => d.approvalItems.filter(a => a.status === 'pending').length === 0 },
  { key: 'publish',   icon: Calendar,  label: 'Publishing', check: d => d.socialPosts.filter(p => p.publish_status === 'scheduled').length > 0 },
];

function nextCTA(status, clientId, data, callbacks) {
  const { setup, connections, campaigns, spokeCampaigns, contentAssets, approvalItems } = data;
  switch (status) {
    case 'not_started':
      return { label: 'Initialize Onboarding', onClick: callbacks.onInitSetup, href: null };
    case 'in_setup':
      return { label: 'Finish Setup', href: `/agency/clients/${clientId}/setup` };
    case 'ready_for_content':
      if (!connections.filter(c => c.status === 'connected').length)
        return { label: 'Connect Channels', href: '/agency/channel-connections' };
      if (!campaigns.length)
        return { label: 'Create First Campaign', onClick: callbacks.onCreateCampaign };
      if (!spokeCampaigns.length)
        return { label: 'Create First Spoke Campaign', onClick: callbacks.onCreateSpoke };
      return { label: 'Create First Content Asset', href: `/agency/content-asset?client=${clientId}` };
    case 'ready_for_approval':
      return { label: 'Review Approvals', href: `/agency/approval-center?client=${clientId}` };
    case 'ready_to_publish':
      return { label: 'Schedule First Post', href: `/agency/publishing-calendar?client=${clientId}` };
    case 'active':
      return null;
    default:
      return null;
  }
}

export default function ClientLaunchPanel({
  clientId, setup, connections, campaigns, spokeCampaigns,
  contentAssets, approvalItems, socialPosts,
  onInitSetup, onCreateCampaign, onCreateSpoke,
}) {
  const data = { setup, connections, campaigns, spokeCampaigns, contentAssets, approvalItems, socialPosts };
  const status = deriveStatus(data);
  const meta = STATUS_META[status];
  const cta = nextCTA(status, clientId, data, { onInitSetup, onCreateCampaign, onCreateSpoke });
  const isActive = status === 'active';

  return (
    <div className={`rounded-2xl border overflow-hidden ${isActive ? 'border-emerald-700/50 bg-emerald-950/20' : 'border-slate-800 bg-slate-900'}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Rocket className={`w-4 h-4 ${meta.color}`} />
          <span className="text-sm font-bold text-white">Client Launch</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        {cta && (
          cta.href
            ? <Link to={cta.href} className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                {cta.label} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            : <button onClick={cta.onClick} className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                {cta.label} <ChevronRight className="w-3.5 h-3.5" />
              </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <div className={`h-1 ${meta.bar} transition-all duration-500`} style={{ width: `${meta.pct}%` }} />
      </div>

      {/* Step checklist */}
      <div className="flex items-center gap-0 px-5 py-3 overflow-x-auto">
        {STEPS.map((step, idx) => {
          const done = step.check(data);
          const Icon = step.icon;
          const isLast = idx === STEPS.length - 1;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full border ${
                  done ? 'bg-emerald-900/40 border-emerald-600/60' : 'bg-slate-800 border-slate-700'
                }`}>
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <Icon className="w-3.5 h-3.5 text-slate-500" />
                  }
                </div>
                <span className={`text-[10px] font-medium ${done ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`h-px w-6 mx-1 flex-shrink-0 mb-3 ${done ? 'bg-emerald-700/60' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* CTA row — full button when not active */}
      {isActive ? (
        <div className="px-5 pb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <p className="text-sm font-bold text-emerald-300">Client Launch Complete — Content operations running</p>
        </div>
      ) : cta ? (
        <div className="px-5 pb-4">
          {cta.href
            ? <Link to={cta.href} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors">
                {cta.label} <ChevronRight className="w-4 h-4" />
              </Link>
            : <button onClick={cta.onClick} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors">
                {cta.label} <ChevronRight className="w-4 h-4" />
              </button>
          }
        </div>
      ) : null}
    </div>
  );
}