import React from 'react';
import ResellerNav from '@/components/nav/ResellerNav';
import { ResellerProvider, useResellerContext } from '@/components/context/useResellerContext';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ResellerClientsContent() {
  const { reseller } = useResellerContext();

  const { data: clientMaps = [] } = useQuery({
    queryKey: ['reseller-client-maps', reseller?.id],
    queryFn: async () => {
      if (!reseller?.id) return [];
      return base44.entities.ResellerClientMap?.filter?.({ reseller_id: reseller.id }, '-assigned_on', 100).catch(() => []);
    },
    enabled: !!reseller?.id,
  });

  const getStatusColor = (status) => {
    if (status === 'active') return 'text-emerald-400 bg-emerald-900/20';
    if (status === 'onboarding') return 'text-blue-400 bg-blue-900/20';
    if (status === 'churned') return 'text-slate-400 bg-slate-800/20';
    return 'text-amber-400 bg-amber-900/20';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ResellerNav />

      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Clients</h2>
            <p className="text-slate-400 text-sm mt-1">{clientMaps.length} clients under management</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5">
            <Plus className="w-4 h-4" /> Add Client
          </Button>
        </div>

        {/* Clients Table */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700 bg-slate-800/50">
                <tr>
                  <th className="text-left px-6 py-4 font-bold text-slate-300">Client</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-300">Status</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-300">Package</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-300">Stage</th>
                  <th className="text-right px-6 py-4 font-bold text-slate-300">Monthly Value</th>
                  <th className="text-right px-6 py-4 font-bold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientMaps.map((map) => (
                  <tr key={map.id} className="border-b border-slate-700 hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">Client {map.client_id?.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(map.status)}`}>
                        {map.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 capitalize">{map.package_name}</td>
                    <td className="px-6 py-4 text-slate-300 capitalize">{map.onboarding_stage}</td>
                    <td className="px-6 py-4 text-right text-slate-300">${map.monthly_value || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">Open</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ResellerClients() {
  return (
    <ResellerProvider resellerId={localStorage.getItem('activeResellerId')}>
      <ResellerClientsContent />
    </ResellerProvider>
  );
}