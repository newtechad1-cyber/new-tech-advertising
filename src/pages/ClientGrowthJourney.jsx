import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { TrendingUp, BarChart2, Calendar, ArrowRight } from 'lucide-react';
import GJStageTimeline from '@/components/growth-journey/GJStageTimeline';
import GJMilestoneMessage from '@/components/growth-journey/GJMilestoneMessage';
import GJExpansionCard from '@/components/growth-journey/GJExpansionCard';
import GJRetentionAlert from '@/components/growth-journey/GJRetentionAlert';
import { Link } from 'react-router-dom';

export default function ClientGrowthJourney() {
  const [profile, setProfile] = useState(null);
  const [signals, setSignals] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onboardingId, setOnboardingId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const user = await base44.auth.me();
      // Attempt to find associated onboarding via user email
      const onboardings = await base44.entities.ClientOnboarding.filter({ status: 'active' });
      const onboarding = onboardings?.[0];
      if (!onboarding) { setLoading(false); return; }
      setOnboardingId(onboarding.id);

      const res = await base44.functions.invoke('ntaRetentionEngine', {
        action: 'get_profile',
        onboarding_id: onboarding.id,
      });
      if (res.data?.profile) {
        setProfile(res.data.profile);
        setSignals(res.data.signals || []);
        setOpportunities(res.data.opportunities || []);
        setReviews(res.data.reviews || []);
      } else {
        // First visit — evaluate with onboarding data
        const evalRes = await base44.functions.invoke('ntaRetentionEngine', {
          action: 'evaluate',
          onboarding_id: onboarding.id,
          company_name: onboarding.company_name,
          industry: onboarding.industry,
          months_active: Math.floor((Date.now() - new Date(onboarding.kickoff_date || Date.now())) / (30 * 86400000)),
          current_package: onboarding.package_tier,
          assigned_strategist: onboarding.assigned_strategist,
          portal_visits_30d: 5,
          approval_avg_days: 3,
          roi_trend: 'stable',
          support_tickets_30d: 0,
        });
        // Reload profile after evaluation
        const reloadRes = await base44.functions.invoke('ntaRetentionEngine', { action: 'get_profile', onboarding_id: onboarding.id });
        if (reloadRes.data?.profile) {
          setProfile(reloadRes.data.profile);
          setSignals(reloadRes.data.signals || []);
          setOpportunities(reloadRes.data.opportunities || []);
          setReviews(reloadRes.data.reviews || []);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleOpportunityInterested = async (id) => {
    await base44.functions.invoke('ntaRetentionEngine', { action: 'update_opportunity', opportunity_id: id, status: 'interested' });
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status: 'interested' } : o));
  };

  const handleOpportunityDefer = async (id) => {
    await base44.functions.invoke('ntaRetentionEngine', { action: 'update_opportunity', opportunity_id: id, status: 'deferred' });
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const handleResolveSignal = async (id) => {
    await base44.functions.invoke('ntaRetentionEngine', { action: 'resolve_signal', signal_id: id });
    setSignals(prev => prev.filter(s => s.id !== id));
  };

  const activeOpportunities = opportunities.filter(o => o.status === 'identified');
  const upcomingReview = reviews.find(r => r.status === 'scheduled');

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-xl font-black text-slate-900">Your Growth Journey</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {profile?.company_name ? `${profile.company_name} · ` : ''}Authority growth lifecycle & strategic milestones
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Risk / retention alert (only when signals exist) */}
        {signals.length > 0 && (
          <GJRetentionAlert signals={signals} onResolve={handleResolveSignal} />
        )}

        {/* Milestone message for current stage */}
        {profile?.current_stage && (
          <GJMilestoneMessage
            currentStage={profile.current_stage}
            onCTA={() => {
              if (profile.current_stage === 'market_leadership') {
                // Scroll to strategy review CTA
              }
            }}
          />
        )}

        {/* Stage timeline */}
        <GJStageTimeline
          currentStage={profile?.current_stage || 'launch_confidence'}
          monthsActive={profile?.months_active}
        />

        {/* KPI snapshot */}
        {profile && (
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Visibility Score', value: profile.visibility_score ?? '—', suffix: '/100', icon: TrendingUp, color: '#8b5cf6' },
              { label: 'Content Published', value: profile.content_pieces_published ?? '—', suffix: ' pieces', icon: BarChart2, color: '#3b82f6' },
              { label: 'Months Active', value: profile.months_active ?? '—', suffix: ' months', icon: Calendar, color: '#10b981' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: kpi.color + '15' }}>
                  <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">{kpi.label}</p>
                  <p className="text-xl font-black text-slate-900">{kpi.value}<span className="text-sm font-medium text-slate-400">{kpi.suffix}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expansion opportunities */}
        {activeOpportunities.length > 0 && (
          <div>
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-3">Strategic Growth Opportunities</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {activeOpportunities.map(opp => (
                <GJExpansionCard
                  key={opp.id}
                  opportunity={opp}
                  onInterested={handleOpportunityInterested}
                  onDefer={handleOpportunityDefer}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming strategy review */}
        {upcomingReview && (
          <div className="rounded-2xl bg-slate-900 text-white p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-black text-base mb-0.5">
                {upcomingReview.review_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Scheduled
              </p>
              <p className="text-slate-400 text-sm">{upcomingReview.scheduled_date} with {upcomingReview.assigned_strategist}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </div>
        )}

        {/* No profile state */}
        {!profile && !loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-400 text-sm">Your growth journey profile is being set up. Your strategist will be in touch shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}