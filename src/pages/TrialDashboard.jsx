import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertCircle, Loader, Check } from 'lucide-react';

import DashboardWelcome from '@/components/trial-dashboard/DashboardWelcome';
import DashboardSetupStatus from '@/components/trial-dashboard/DashboardSetupStatus';
import DashboardWeeklyPlanPreview from '@/components/trial-dashboard/DashboardWeeklyPlanPreview';
import DashboardTopOpportunities from '@/components/trial-dashboard/DashboardTopOpportunities';
import DashboardFirstActions from '@/components/trial-dashboard/DashboardFirstActions';
import DashboardQuickTools from '@/components/trial-dashboard/DashboardQuickTools';
import DashboardBusinessProfile from '@/components/trial-dashboard/DashboardBusinessProfile';
import DashboardHelp from '@/components/trial-dashboard/DashboardHelp';

export default function TrialDashboard() {
  const [trial, setTrial] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [intelProfile, setIntelProfile] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          setError('Not authenticated');
          return;
        }

        // Get trial account for this user
        const trials = await base44.entities.TrialAccount.filter({ created_by: user.email }, '-created_date', 1);
        if (trials.length === 0) {
          setError('No active trial found');
          return;
        }

        const trialData = trials[0];
        setTrial(trialData);

        // Fetch linked entities
        if (trialData.business_profile_id) {
          const bp = await base44.entities.BusinessProfile.get(trialData.business_profile_id);
          setBusinessProfile(bp);
        }

        if (trialData.intel_profile_id) {
          const ip = await base44.entities.BusinessIntelProfile.get(trialData.intel_profile_id);
          setIntelProfile(ip);
        }

        if (trialData.weekly_plan_id) {
          const wp = await base44.entities.WeeklyMarketingPlan.get(trialData.weekly_plan_id);
          setWeeklyPlan(wp);
        }

        // Fetch opportunities for this business profile
        if (trialData.business_profile_id) {
          const opps = await base44.entities.OpportunitySignal.filter(
            { business_profile_id: trialData.business_profile_id, status: 'active' },
            '-priority',
            3
          );
          setOpportunities(opps);
        }
      } catch (err) {
        console.error('[TrialDashboard] Error loading data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Determine readiness state
  const getReadinessState = () => {
    if (!trial) return 'unknown';
    if (trial.provisioning_status === 'pending' || trial.provisioning_status === 'queued') return 'provisioning_queued';
    if (businessProfile && !intelProfile) return 'profile_ready';
    if (intelProfile && !weeklyPlan) return 'intelligence_ready';
    if (weeklyPlan) return 'plan_ready';
    return 'profile_ready';
  };

  const readinessState = getReadinessState();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Setting up your marketing system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-rose-950/40 border border-rose-500/20 rounded-xl p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold">Setup Issue</p>
              <p className="text-slate-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">
              Trial Active • {readinessState === 'plan_ready' ? '✓ Ready' : 'Setup in Progress'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-300">{businessProfile?.business_name || 'Your Business'}</p>
            <p className="text-xs text-slate-500">Trial Day {trial ? Math.ceil((Date.now() - new Date(trial.trial_start_at).getTime()) / (1000 * 60 * 60 * 24)) : '—'}</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome section */}
        <DashboardWelcome trial={trial} businessProfile={businessProfile} readinessState={readinessState} />

        {/* Setup status */}
        <DashboardSetupStatus trial={trial} businessProfile={businessProfile} intelProfile={intelProfile} weeklyPlan={weeklyPlan} readinessState={readinessState} />

        {/* Weekly plan preview */}
        {readinessState !== 'provisioning_queued' && (
          <DashboardWeeklyPlanPreview weeklyPlan={weeklyPlan} readinessState={readinessState} />
        )}

        {/* Top opportunities */}
        {readinessState !== 'provisioning_queued' && readinessState !== 'profile_ready' && (
          <DashboardTopOpportunities opportunities={opportunities} readinessState={readinessState} />
        )}

        {/* First actions */}
        <DashboardFirstActions readinessState={readinessState} businessProfile={businessProfile} weeklyPlan={weeklyPlan} />

        {/* Quick tools */}
        <DashboardQuickTools />

        {/* Business profile summary */}
        {businessProfile && (
          <DashboardBusinessProfile businessProfile={businessProfile} />
        )}

        {/* Help section */}
        <DashboardHelp readinessState={readinessState} />
      </main>
    </div>
  );
}