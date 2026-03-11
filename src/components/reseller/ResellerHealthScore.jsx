import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResellerHealthScore({ resellerId }) {
  const { data: reseller } = useQuery({
    queryKey: ['reseller-health', resellerId],
    queryFn: () => base44.entities.ResellerAccount?.read?.(resellerId),
    enabled: !!resellerId,
  });

  const { data: onboarding } = useQuery({
    queryKey: ['reseller-onboarding', resellerId],
    queryFn: async () => {
      if (!resellerId) return null;
      const profiles = await base44.entities.ResellerOnboardingProfile?.filter?.({ reseller_id: resellerId }, null, 1);
      return profiles?.[0] || null;
    },
    enabled: !!resellerId,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['reseller-clients-health', resellerId],
    queryFn: async () => {
      if (!resellerId) return [];
      return base44.entities.ResellerClientMap?.filter?.({ reseller_id: resellerId, status: 'active' }, null, 100).catch(() => []);
    },
    enabled: !!resellerId,
  });

  const { data: domain } = useQuery({
    queryKey: ['reseller-domain', resellerId],
    queryFn: async () => {
      if (!resellerId) return null;
      const configs = await base44.entities.WhiteLabelDomainConfig?.filter?.({ reseller_id: resellerId }, null, 1);
      return configs?.[0] || null;
    },
    enabled: !!resellerId,
  });

  // Calculate health score (0-100)
  const onboardingScore = onboarding?.progress_percentage || 0;
  const clientScore = Math.min((clients.length / 5) * 25, 25); // 5 clients = full points
  const publishingScore = clients.length > 0 ? 25 : 0; // Clients exist = active
  const reportScore = 15; // Placeholder
  const domainScore = domain?.verification_status === 'verified' ? 10 : domain?.verification_status === 'verifying' ? 5 : 0;

  const totalScore = Math.round(onboardingScore * 0.3 + clientScore + publishingScore + reportScore + domainScore);

  const getHealthColor = (score) => {
    if (score >= 85) return { text: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-700', label: 'Excellent' };
    if (score >= 70) return { text: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700', label: 'Strong' };
    if (score >= 50) return { text: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-700', label: 'Good' };
    return { text: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700', label: 'Getting Started' };
  };

  const health = getHealthColor(totalScore);

  const factorBreakdown = [
    { label: 'Onboarding', score: onboardingScore, weight: '30%', icon: CheckCircle },
    { label: 'Client Count', score: clientScore, weight: '25%', icon: TrendingUp },
    { label: 'Publishing', score: publishingScore, weight: '25%', icon: CheckCircle },
    { label: 'Reports', score: reportScore, weight: '15%', icon: CheckCircle },
    { label: 'Domain', score: domainScore, weight: '5%', icon: AlertCircle },
  ];

  return (
    <div className={`${health.bg} border ${health.border} rounded-xl p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${health.text}`} />
            Partner Health Score
          </h3>
          <p className="text-sm text-slate-400">Overall platform readiness and engagement</p>
        </div>
      </div>

      <div className="flex items-end gap-6 mb-6">
        <div>
          <div className="text-4xl font-bold text-white mb-2">{totalScore}</div>
          <p className={`text-sm font-semibold ${health.text}`}>{health.label}</p>
        </div>

        <div className="flex-1">
          <div className="bg-slate-800 rounded-full h-3">
            <div
              className={`${health.text.replace('text-', 'bg-')} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${totalScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="pt-6 border-t border-slate-700 space-y-2">
        {factorBreakdown.map((factor, idx) => {
          const FactorIcon = factor.icon;
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FactorIcon className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{factor.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full"
                    style={{ width: `${Math.min(factor.score, 25)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 w-8 text-right">{Math.round(factor.score)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}