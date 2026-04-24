import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Radio, FileText, Calendar, Clock, CheckCircle, ArrowRight, Send, TrendingUp, Users, Megaphone } from 'lucide-react';

/**
 * DailyCommandPanel
 * Receives pre-computed data from AgencyDashboard — no extra fetches.
 */
export default function DailyCommandPanel({ spokeCampaigns, ntaAssets, socialPosts = [], deals = [], clients = [], loading }) {
  if (loading) return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="h-5 w-48 bg-slate-800 rounded" />
      <div className="h-20 bg-slate-800 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-800 rounded-xl" />)}
      </div>
    </div>
  );

  // ── Derived state ────────────────────────────────────────────────────────────
  const activeCampaign = spokeCampaigns.find(c => c.status === 'active') || spokeCampaigns[0] || null;

  // Matches Approval Center "Internal" tab filter exactly
  const draftsNeedingReview = ntaAssets.filter(a =>
    ['ready_for_review', 'pending_internal', 'draft'].includes(a.approval_status) ||
    ['draft', 'ready_for_review'].includes(a.status)
  );

  // Matches dashboard "Ready to Schedule" — approved but not yet queued into SocialPostQueue
  const approvedNeedingSchedule = ntaAssets.filter(a =>
    a.approval_status === 'approved' &&
    a.queued !== true &&
    !['published'].includes(a.status)
  );

  // "Going Out Today" — canonical source: SocialPostQueue.scheduled_time + publish_status === 'scheduled'
  const todayStr = new Date().toISOString().split('T')[0];
  const goingOutToday = socialPosts.filter(p => {
    if (p.publish_status !== 'scheduled' || !p.scheduled_time) return false;
    return p.scheduled_time.startsWith(todayStr);
  });

  // ── Next Best Action priority logic ─────────────────────────────────────────
  // Priority: Pipeline won deals → clients w/o campaigns → campaigns w/o assets → approve → schedule → social queue
  const activeDeals = deals.filter(d => !['Closed Won','Closed Lost'].includes(d.stage));
  const wonUnconverted = deals.filter(d => d.stage === 'Closed Won');
  const clientsWithoutCampaigns = clients.filter(c =>
    c.status === 'active_client' && !spokeCampaigns.some(sc => sc.client_id === c.id)
  );
  const campaignsWithoutAssets = spokeCampaigns.filter(c =>
    c.status !== 'completed' && !ntaAssets.some(a => a.campaign_id === c.id)
  );

  const nba = (() => {
    if (wonUnconverted.length > 0)
      return { label: `${wonUnconverted.length} won deal${wonUnconverted.length > 1 ? 's' : ''} ready to convert to client`, href: '/agency/pipeline', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/60', icon: TrendingUp };
    if (activeDeals.length > 0 && clients.filter(c => c.status === 'active_client').length === 0)
      return { label: `${activeDeals.length} active deal${activeDeals.length > 1 ? 's' : ''} in pipeline — move them forward`, href: '/agency/pipeline', color: 'text-blue-400', bg: 'bg-blue-950/50 border-blue-800/50', icon: TrendingUp };
    if (clientsWithoutCampaigns.length > 0)
      return { label: `${clientsWithoutCampaigns.length} client${clientsWithoutCampaigns.length > 1 ? 's' : ''} without a campaign yet — create one`, href: `/agency/spoke-campaigns?client_id=${clientsWithoutCampaigns[0].id}`, color: 'text-violet-400', bg: 'bg-violet-950/50 border-violet-800/50', icon: Megaphone };
    if (campaignsWithoutAssets.length > 0)
      return { label: `${campaignsWithoutAssets.length} campaign${campaignsWithoutAssets.length > 1 ? 's' : ''} have no content yet — generate assets`, href: `/agency/spoke-campaigns/${campaignsWithoutAssets[0].id}`, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40', icon: Radio };
    if (goingOutToday.length > 0)
      return { label: `${goingOutToday.length} post${goingOutToday.length > 1 ? 's' : ''} going out today — confirm they're ready`, href: '/agency/social-queue?date=today', color: 'text-blue-400', bg: 'bg-blue-950/60 border-blue-800/60', icon: Send };
    if (approvedNeedingSchedule.length > 0)
      return { label: `${approvedNeedingSchedule.length} approved asset${approvedNeedingSchedule.length > 1 ? 's' : ''} waiting to be scheduled`, href: '/agency/content-asset?status=approved', color: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-800/50', icon: Calendar };
    if (draftsNeedingReview.length > 0)
      return { label: `${draftsNeedingReview.length} draft asset${draftsNeedingReview.length > 1 ? 's' : ''} need review and approval`, href: '/agency/approval-center', color: 'text-violet-400', bg: 'bg-violet-950/50 border-violet-800/50', icon: CheckCircle };
    if (activeCampaign)
      return { label: `Continue building "${activeCampaign.campaign_name}"`, href: `/agency/spoke-campaigns/${activeCampaign.id}`, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40', icon: Radio };
    return { label: 'Add your first lead to get started', href: '/agency/pipeline', color: 'text-slate-400', bg: 'bg-slate-800/60 border-slate-700', icon: Zap };
  })();

  const NBAIcon = nba.icon;

  const STEPS = [
    {
      label: 'Campaign in Progress',
      value: activeCampaign?.campaign_name || 'None active',
      sub: activeCampaign ? `${activeCampaign.status}` : 'Start one →',
      href: activeCampaign ? `/agency/spoke-campaigns/${activeCampaign.id}` : '/agency/spoke-campaigns',
      btnLabel: 'Continue Campaign',
      btnColor: 'bg-violet-700 hover:bg-violet-600 text-white',
      icon: Radio,
      iconColor: 'text-violet-400',
      count: null,
    },
    {
      label: 'Drafts Needing Review',
      value: draftsNeedingReview.length,
      sub: draftsNeedingReview.length > 0 ? 'Waiting for approval' : 'All clear ✓',
      href: '/agency/approval-center',
      btnLabel: 'Approve Drafts',
      btnColor: 'bg-amber-700 hover:bg-amber-600 text-white',
      icon: FileText,
      iconColor: 'text-amber-400',
      count: draftsNeedingReview.length,
      urgent: draftsNeedingReview.length > 5,
    },
    {
      label: 'Approved — Need Scheduling',
      value: approvedNeedingSchedule.length,
      sub: approvedNeedingSchedule.length > 0 ? 'Ready to go live' : 'Nothing pending',
      href: '/agency/content-asset',
      btnLabel: 'Schedule Content',
      btnColor: 'bg-emerald-700 hover:bg-emerald-600 text-white',
      icon: Clock,
      iconColor: 'text-emerald-400',
      count: approvedNeedingSchedule.length,
    },
    {
      label: "Going Out Today",
      value: goingOutToday.length,
      sub: goingOutToday.length > 0 ? 'Scheduled for today' : 'Nothing today',
      href: '/agency/social-queue?date=today',
      btnLabel: "View Today's Posts",
      btnColor: 'bg-blue-700 hover:bg-blue-600 text-white',
      icon: Send,
      iconColor: 'text-blue-400',
      count: goingOutToday.length,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-400" />
        <h2 className="text-sm font-bold text-white">Daily Command</h2>
        <span className="ml-auto text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
      </div>

      <div className="p-5 space-y-4">
        {/* Next Best Action — highlighted */}
        <Link to={nba.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:brightness-110 ${nba.bg}`}>
          <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0">
            <NBAIcon className={`w-4 h-4 ${nba.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Next Best Action</p>
            <p className={`text-sm font-bold ${nba.color} leading-snug`}>{nba.label}</p>
          </div>
          <ArrowRight className={`w-4 h-4 flex-shrink-0 ${nba.color}`} />
        </Link>

        {/* 4-step workflow cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className={`bg-slate-800/60 rounded-xl p-4 border ${step.urgent ? 'border-red-800/60' : 'border-slate-700/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-4 h-4 ${step.iconColor}`} />
                  {step.count !== null && step.count > 0 && (
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${step.urgent ? 'bg-red-900/60 text-red-300' : 'bg-slate-700 text-slate-300'}`}>{step.count}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-0.5">{step.label}</p>
                <p className="text-sm font-bold text-white truncate mb-0.5">{typeof step.value === 'number' ? step.value : step.value}</p>
                <p className="text-xs text-slate-600 mb-3">{step.sub}</p>
                <Link to={step.href} className={`block text-center text-xs font-bold py-1.5 rounded-lg transition-colors ${step.btnColor}`}>
                  {step.btnLabel}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}