import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Activity, TrendingUp } from 'lucide-react';

export default function BusinessHealthScore() {
  const [displayScore, setDisplayScore] = useState(0);

  const { data: deals = [] } = useQuery({
    queryKey: ['health-deals'],
    queryFn: () => base44.entities.SalesDeals?.list?.('-created_date', 500).catch(() => []),
  });

  const { data: publishJobs = [] } = useQuery({
    queryKey: ['health-publish-jobs'],
    queryFn: () => base44.entities.VideoPublishJob?.list?.('-created_at', 200).catch(() => []),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['health-clients'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-updated_date', 200).catch(() => []),
  });

  // Calculate health metrics
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Revenue momentum (0-25 points)
  const thisMonthRevenue = deals
    .filter(d => d.stage === 'closed_won' && d.created_date)
    .filter(d => {
      const dateObj = new Date(d.created_date);
      return dateObj > thirtyDaysAgo;
    })
    .reduce((sum, d) => sum + (d.deal_value || 0), 0);
  const revenueScore = Math.min(25, (thisMonthRevenue / 10000) * 25);

  // Publishing activity (0-25 points)
  const publishedThisMonth = publishJobs.filter(j => {
    const jobDate = new Date(j.published_at || 0);
    return jobDate > thirtyDaysAgo;
  }).length;
  const publishScore = Math.min(25, (publishedThisMonth / 10) * 25);

  // Pipeline strength (0-25 points)
  const pipelineValue = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => sum + (d.deal_value || 0), 0);
  const pipelineScore = Math.min(25, (pipelineValue / 500000) * 25);

  // Client engagement (0-25 points)
  const activeClients = clients.filter(c => {
    const lastActivity = new Date(c.updated_date || 0);
    return lastActivity > thirtyDaysAgo;
  }).length;
  const engagementScore = Math.min(25, (activeClients / clients.length || 0) * 25);

  const totalScore = revenueScore + publishScore + pipelineScore + engagementScore;

  // Animate score counter
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayScore(prev => {
        const target = Math.round(totalScore);
        if (prev < target) return prev + 1;
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [totalScore]);

  const getHealthStatus = () => {
    if (displayScore >= 85) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-900/20' };
    if (displayScore >= 70) return { label: 'Strong', color: 'text-blue-400', bg: 'bg-blue-900/20' };
    if (displayScore >= 50) return { label: 'Healthy', color: 'text-amber-400', bg: 'bg-amber-900/20' };
    return { label: 'Needs Attention', color: 'text-red-400', bg: 'bg-red-900/20' };
  };

  const status = getHealthStatus();

  return (
    <div className={`${status.bg} border border-slate-700 rounded-xl p-6 relative overflow-hidden`}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-700/20 to-transparent rounded-full -mr-20 -mt-20" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5" />
              Business Health Score
            </h3>
            <p className="text-xs text-slate-400">Agency operational health indicator</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>

        {/* Large Score Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold ${status.color} transition-all duration-300`}>
              {displayScore}
            </span>
            <span className="text-lg text-slate-400">/100</span>
          </div>
          <p className={`text-sm font-semibold ${status.color} mt-2`}>{status.label}</p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Revenue Momentum</span>
            <span className="text-slate-300 font-semibold">{Math.round(revenueScore)}/25</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(revenueScore / 25) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400">Publishing Activity</span>
            <span className="text-slate-300 font-semibold">{Math.round(publishScore)}/25</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-violet-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(publishScore / 25) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400">Pipeline Strength</span>
            <span className="text-slate-300 font-semibold">{Math.round(pipelineScore)}/25</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(pipelineScore / 25) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400">Client Engagement</span>
            <span className="text-slate-300 font-semibold">{Math.round(engagementScore)}/25</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(engagementScore / 25) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}