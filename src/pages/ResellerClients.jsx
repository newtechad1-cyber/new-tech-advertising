import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ResellerClientTable from '@/components/reseller/ResellerClientTable';
import AddClientModal from '@/components/reseller/AddClientModal';
import { createPageUrl } from '@/utils';

export default function ResellerClients() {
  const [user, setUser] = useState(null);
  const [reseller, setReseller] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      const u = await base44.auth.me();
      setUser(u);
      const accounts = await base44.entities.ResellerAccounts.filter({ contact_email: u.email });
      if (accounts.length > 0) setReseller(accounts[0]);
    };
    load();
  }, []);

  const { data: clients = [] } = useQuery({
    queryKey: ['reseller_clients', reseller?.id],
    queryFn: () => base44.entities.ResellerClients.filter({ reseller_id: reseller.id }),
    enabled: !!reseller?.id
  });

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.client_name.toLowerCase().includes(search.toLowerCase()) || c.client_email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['all', 'active', 'trial', 'paused', 'churned'];

  if (!reseller) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Your Clients</h1>
          <p className="text-xs text-slate-500">{reseller.reseller_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => window.location.href = createPageUrl('ResellerDashboard')}>
            ← Dashboard
          </Button>
          <AddClientModal resellerId={reseller.id} />
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-2">
            {statuses.map(s => (
              <Button
                key={s}
                size="sm"
                variant={statusFilter === s ? 'default' : 'outline'}
                onClick={() => setStatusFilter(s)}
                className="capitalize"
              >
                {s === 'all' ? 'All' : s}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['active', 'trial', 'paused', 'churned'].map(s => {
            const count = clients.filter(c => c.status === s).length;
            const colors = { active: 'text-green-600', trial: 'text-blue-600', paused: 'text-yellow-600', churned: 'text-red-600' };
            return (
              <Card key={s}>
                <CardContent className="p-4">
                  <p className="text-xs text-slate-500 capitalize">{s}</p>
                  <p className={`text-2xl font-bold ${colors[s]}`}>{count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <ResellerClientTable clients={filtered} />
      </div>
    </div>
  );
}