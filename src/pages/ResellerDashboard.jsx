import React, { useState } from 'react';
import ResellerNav from '@/components/nav/ResellerNav';
import { ResellerProvider, useResellerContext } from '@/components/context/useResellerContext';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, FileText, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

import ResellerHealthScore from '@/components/reseller/ResellerHealthScore';
import ResellerNextBestAction from '@/components/reseller/ResellerNextBestAction';
import OnboardingProgressExperience from '@/components/reseller/OnboardingProgressExperience';
import ResellerAuditLog from '@/components/reseller/ResellerAuditLog';

function ResellerDashboardContent() {
  const { reseller } = useResellerContext();

  const { data: clients = [] } = useQuery({
    queryKey: ['reseller-clients', reseller?.id],
    queryFn: async () => {
      if (!reseller?.id) return [];
      const maps = await base44.entities.ResellerClientMap?.filter?.({ reseller_id: reseller.id }, null, 100).catch(() => []);
      return maps;
    },
    enabled: !!reseller?.id,
  });

  const { data: onboarding } = useQuery({
    queryKey: ['reseller-onboarding', reseller?.id],
    queryFn: async () => {
      if (!reseller?.id) return null;
      const profiles = await base44.entities.ResellerOnboardingProfile?.filter?.({ reseller_id: reseller.id }, null, 1);
      return profiles?.[0] || null;
    },
    enabled: !!reseller?.id,
  });

  const { data: branding } = useQuery({
    queryKey: ['reseller-branding', reseller?.id],
    queryFn: async () => {
      if (!reseller?.id) return null;
      const profiles = await base44.entities.ResellerBrandProfile?.filter?.({ reseller_id: reseller.id }, null, 1);
      return profiles?.[0] || null;
    },
    enabled: !!reseller?.id,
  });

  const { data: domain } = useQuery({
    queryKey: ['reseller-domain', reseller?.id],
    queryFn: async () => {
      if (!reseller?.id) return null;
      const configs = await base44.entities.WhiteLabelDomainConfig?.filter?.({ reseller_id: reseller.id }, null, 1);
      return configs?.[0] || null;
    },
    enabled: !!reseller?.id,
  });

  const activeClients = clients.filter(c => c.status === 'active').length;
  const onboardingClients = clients.filter(c => c.status === 'onboarding').length;
  const totalMRR = clients.reduce((sum, c) => sum + (c.monthly_value || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ResellerNav />

      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <Users className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-xs text-slate-400 mb-1">Active Clients</p>
            <p className="text-2xl font-bold text-white">{activeClients}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <FileText className="w-5 h-5 text-amber-400 mb-2" />
            <p className="text-xs text-slate-400 mb-1">Awaiting Approval</p>
            <p className="text-2xl font-bold text-white">7</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <Clock className="w-5 h-5 text-violet-400 mb-2" />
            <p className="text-xs text-slate-400 mb-1">Scheduled This Week</p>
            <p className="text-2xl font-bold text-white">23</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-xs text-slate-400 mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-white">${(totalMRR / 1000).toFixed(0)}k</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Onboarding & Next Actions */}
          <div className="space-y-6">
            <ResellerHealthScore resellerId={reseller?.id} />
            <ResellerNextBestAction reseller={reseller} onboarding={onboarding} domain={domain} branding={branding} />
          </div>

          {/* Right Column: Client Health & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <OnboardingProgressExperience onboarding={onboarding} />
            <ResellerAuditLog resellerId={reseller?.id} limit={8} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResellerDashboard() {
  return (
    <ResellerProvider resellerId={localStorage.getItem('activeResellerId')}>
      <ResellerDashboardContent />
    </ResellerProvider>
  );
}