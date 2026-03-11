import React, { useState } from 'react';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Building2, Users, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminResellers() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: resellers = [] } = useQuery({
    queryKey: ['admin-resellers'],
    queryFn: () => base44.entities.ResellerAccount?.list?.('-created_at', 100).catch(() => []),
  });

  const activeResellers = resellers.filter(r => r.status === 'active').length;
  const onboardingResellers = resellers.filter(r => r.status === 'onboarding').length;
  const totalMRR = resellers.reduce((sum, r) => sum + (r.active_client_count * 500), 0);
  const totalClients = resellers.reduce((sum, r) => sum + (r.active_client_count || 0), 0);

  const getStatusColor = (status) => {
    if (status === 'active') return 'text-emerald-400 bg-emerald-900/20';
    if (status === 'onboarding') return 'text-blue-400 bg-blue-900/20';
    if (status === 'suspended') return 'text-red-400 bg-red-900/20';
    return 'text-slate-400 bg-slate-800/20';
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-6 sticky top-0 z-10">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-900/50 border border-purple-700 rounded-lg">
                    <Building2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Reseller Management</h1>
                    <p className="text-slate-400 text-sm mt-0.5">Manage white-label SaaS partners</p>
                  </div>
                </div>
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-1.5">
                <Plus className="w-4 h-4" /> New Reseller
              </Button>
            </div>
          </div>

          <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <Building2 className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-xs text-slate-400 mb-1">Active Resellers</p>
                <p className="text-2xl font-bold text-white">{activeResellers}</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-xs text-slate-400 mb-1">Total MRR</p>
                <p className="text-2xl font-bold text-white">${(totalMRR / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <Users className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-xs text-slate-400 mb-1">End Clients</p>
                <p className="text-2xl font-bold text-white">{totalClients}</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <AlertTriangle className="w-5 h-5 text-amber-400 mb-2" />
                <p className="text-xs text-slate-400 mb-1">Onboarding</p>
                <p className="text-2xl font-bold text-white">{onboardingResellers}</p>
              </div>
            </div>

            {/* Reseller Table */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-700 bg-slate-800/50">
                    <tr>
                      <th className="text-left px-6 py-4 font-bold text-slate-300">Reseller</th>
                      <th className="text-left px-6 py-4 font-bold text-slate-300">Status</th>
                      <th className="text-left px-6 py-4 font-bold text-slate-300">Clients</th>
                      <th className="text-left px-6 py-4 font-bold text-slate-300">Users</th>
                      <th className="text-left px-6 py-4 font-bold text-slate-300">Plan</th>
                      <th className="text-left px-6 py-4 font-bold text-slate-300">Domain</th>
                      <th className="text-right px-6 py-4 font-bold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resellers.map((reseller) => (
                      <tr key={reseller.id} className="border-b border-slate-700 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-white">{reseller.reseller_name}</p>
                            <p className="text-xs text-slate-400">{reseller.primary_contact_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(reseller.status)}`}>
                            {reseller.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{reseller.active_client_count || 0}</td>
                        <td className="px-6 py-4 text-slate-300">{reseller.active_user_count || 0}</td>
                        <td className="px-6 py-4 text-slate-300 capitalize">{reseller.billing_plan}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs truncate">{reseller.subdomain || reseller.custom_domain || '—'}</td>
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
      </AdminNav>
    </AdminGuard>
  );
}