import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Share2 } from 'lucide-react';

export default function FounderResellers() {
  const { data: resellers = [] } = useQuery({ queryKey: ['founder-resellers'], queryFn: () => base44.entities.ResellerAccounts.list() });
  const { data: resellerClients = [] } = useQuery({ queryKey: ['founder-reseller-clients'], queryFn: () => base44.entities.ResellerClients.list('-created_date', 200) });
  const { data: resellerRevenue = [] } = useQuery({ queryKey: ['founder-reseller-revenue-detail'], queryFn: () => base44.entities.ResellerRevenue.list('-created_date', 200) });
  const { data: subs = [] } = useQuery({ queryKey: ['founder-reseller-subs'], queryFn: () => base44.entities.ClientSubscriptions.filter({ status: 'active' }) });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const activeResellers = resellers.filter(r => r.status === 'active' || !r.status);
  const newClientsThisMonth = resellerClients.filter(rc => new Date(rc.created_date) >= startOfMonth).length;
  const resellerMRR = subs.filter(s => s.reseller_id).reduce((sum, s) => sum + (s.monthly_amount || 0), 0);
  const commissionOwed = resellerRevenue.filter(r => r.status === 'pending' || r.status === 'unpaid').reduce((sum, r) => sum + (r.commission_amount || 0), 0);

  const resellerStats = activeResellers.map(r => ({
    ...r,
    clientCount: resellerClients.filter(rc => rc.reseller_id === r.id).length,
    monthRevenue: resellerRevenue.filter(rv => rv.reseller_id === r.id && new Date(rv.created_date) >= startOfMonth).reduce((s, rv) => s + (rv.amount || 0), 0),
  })).sort((a, b) => b.monthRevenue - a.monthRevenue);

  const months = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (3 - i), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return { label: d.toLocaleDateString('en-US', { month: 'short' }), count: resellerClients.filter(rc => { const cd = new Date(rc.created_date); return cd >= d && cd <= end; }).length };
  });

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-violet-400" />
        <h2 className="text-sm font-bold text-white">Reseller Growth</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center"><div className="text-xl font-bold text-violet-400">{activeResellers.length}</div><div className="text-xs text-gray-500 mt-0.5">Active Resellers</div></div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center"><div className="text-xl font-bold text-blue-400">{newClientsThisMonth}</div><div className="text-xs text-gray-500 mt-0.5">New Clients MTD</div></div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center"><div className="text-xl font-bold text-green-400">${resellerMRR.toLocaleString()}</div><div className="text-xs text-gray-500 mt-0.5">Reseller MRR</div></div>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center"><div className={`text-xl font-bold ${commissionOwed > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>${commissionOwed.toLocaleString()}</div><div className="text-xs text-gray-500 mt-0.5">Commission Owed</div></div>
      </div>
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Reseller client growth — last 4 months</p>
        <div className="flex items-end gap-2 h-16">
          {months.map((m, i) => {
            const max = Math.max(...months.map(x => x.count), 1);
            const h = Math.max((m.count / max) * 100, 6);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-violet-600/70" style={{ height: `${h}%` }} />
                <span className="text-xs text-gray-600">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-2">Top resellers by revenue (MTD)</p>
        {resellerStats.length === 0 ? (
          <div className="text-center text-gray-600 text-sm py-6">No reseller data</div>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            <div className="grid grid-cols-3 text-xs text-gray-600 px-2 pb-1 border-b border-gray-800"><span>Reseller</span><span className="text-center">Clients</span><span className="text-right">MTD Rev</span></div>
            {resellerStats.map((r, i) => (
              <div key={r.id} className="grid grid-cols-3 text-xs px-2 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                <span className="text-gray-300 truncate flex items-center gap-1"><span className="text-gray-600 w-4">{i + 1}.</span>{r.company_name || r.name || 'Unknown'}</span>
                <span className="text-center text-gray-400">{r.clientCount}</span>
                <span className={`text-right font-medium ${r.monthRevenue > 0 ? 'text-green-400' : 'text-gray-600'}`}>${r.monthRevenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}