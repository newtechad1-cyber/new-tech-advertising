import React, { useState } from 'react';
import ResellerNav from '@/components/nav/ResellerNav';
import { ResellerProvider, useResellerContext } from '@/components/context/useResellerContext';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, FileText, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Client Health */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Client Health</h3>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="text-sm font-semibold text-white">Client {idx + 1}</p>
                    <p className="text-xs text-slate-400">{client.package_name} plan</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300 capitalize">{client.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Alerts
            </h3>
            {onboardingClients > 0 && (
              <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg mb-3">
                <p className="text-xs font-semibold text-blue-200">{onboardingClients} clients onboarding</p>
              </div>
            )}
            <p className="text-sm text-slate-300">All systems operational</p>
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