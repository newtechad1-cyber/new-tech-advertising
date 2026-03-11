import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, AlertCircle } from 'lucide-react';

export default function ClientHealthPanel() {
  const { data: clients = [] } = useQuery({
    queryKey: ['client-health'],
    queryFn: () => base44.entities.ClientCompanies?.list?.('-updated_date', 200).catch(() => []),
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const activeClients = clients.filter(c => {
    const lastActivity = new Date(c.updated_date || 0);
    return lastActivity > thirtyDaysAgo;
  }).length;

  const needsAttention = clients.filter(c => {
    const lastActivity = new Date(c.updated_date || 0);
    return lastActivity <= thirtyDaysAgo && lastActivity > new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }).length;

  const atRisk = clients.filter(c => {
    const lastActivity = new Date(c.updated_date || 0);
    return lastActivity <= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }).length;

  const categories = [
    { label: 'Highly Active', value: activeClients, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
    { label: 'Needs Attention', value: needsAttention, color: 'text-orange-400', bg: 'bg-orange-900/20' },
    { label: 'At Risk', value: atRisk, color: 'text-red-400', bg: 'bg-red-900/20' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-400" />
        Client Health
      </h3>

      <div className="space-y-3">
        {categories.map((cat, idx) => (
          <div key={idx} className={`${cat.bg} border border-slate-700 rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{cat.label}</p>
              <p className={`text-2xl font-bold ${cat.color}`}>{cat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {atRisk > 0 && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mt-4 flex gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-400 mb-1">Action Required</p>
            <p className="text-xs text-red-300">{atRisk} clients need outreach</p>
          </div>
        </div>
      )}
    </div>
  );
}