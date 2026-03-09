import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  trial: 'bg-blue-100 text-blue-800',
  paused: 'bg-yellow-100 text-yellow-800',
  churned: 'bg-red-100 text-red-800'
};

export default function AdminResellerClients() {
  const urlParams = new URLSearchParams(window.location.search);
  const resellerIdFilter = urlParams.get('reseller_id');
  const [search, setSearch] = useState('');

  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: () => base44.asServiceRole.entities.ResellerAccounts.list()
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['reseller_clients_admin', resellerIdFilter],
    queryFn: () => resellerIdFilter
      ? base44.asServiceRole.entities.ResellerClients.filter({ reseller_id: resellerIdFilter })
      : base44.asServiceRole.entities.ResellerClients.list()
  });

  const filtered = clients.filter(c =>
    !search || c.client_name.toLowerCase().includes(search.toLowerCase())
  );

  const currentReseller = resellerIdFilter ? resellers.find(r => r.id === resellerIdFilter) : null;

  const totalMRR = clients.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_value || 0), 0);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                {currentReseller ? `${currentReseller.reseller_name} — Clients` : 'All Reseller Clients'}
              </h1>
              <p className="text-slate-500 mt-1">{clients.length} clients • ${totalMRR.toLocaleString()}/mo MRR</p>
            </div>
            <div className="flex gap-2">
              {resellerIdFilter && (
                <Button variant="outline" onClick={() => window.location.href = createPageUrl('AdminResellers')}>
                  ← All Resellers
                </Button>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['active', 'trial', 'paused', 'churned'].map(s => {
              const count = clients.filter(c => c.status === s).length;
              return (
                <Card key={s}>
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-500 capitalize">{s}</p>
                    <p className="text-2xl font-bold text-slate-900">{count}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clients</CardTitle>
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 font-semibold">Reseller</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold">Monthly Value</th>
                      <th className="text-left py-3 px-4 font-semibold">Portal</th>
                      <th className="text-left py-3 px-4 font-semibold">Branding</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="py-10 text-center text-slate-500">No clients found.</td></tr>
                    )}
                    {filtered.map(client => {
                      const reseller = resellers.find(r => r.id === client.reseller_id);
                      return (
                        <tr key={client.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-900">{client.client_name}</p>
                            <p className="text-xs text-slate-500">{client.client_email}</p>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-sm">{reseller?.reseller_name || '—'}</td>
                          <td className="py-3 px-4 text-slate-600">{client.plan_type || '—'}</td>
                          <td className="py-3 px-4 font-semibold">${(client.monthly_value || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {client.portal_access_enabled
                              ? <Badge className="bg-green-100 text-green-800">Active</Badge>
                              : <Badge variant="outline">Off</Badge>}
                          </td>
                          <td className="py-3 px-4">
                            {client.branding_override_enabled
                              ? <Badge className="bg-purple-100 text-purple-800">White Label</Badge>
                              : <Badge variant="outline">Default</Badge>}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={statusColors[client.status] || 'bg-gray-100'}>{client.status}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminNav>
  );
}