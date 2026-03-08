import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, AlertCircle, Calendar, Users } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminBilling() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => base44.asServiceRole.entities.Contracts.list('-renewal_date', 500)
  });

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.asServiceRole.entities.Subscriptions.list()
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.asServiceRole.entities.Companies.list()
  });

  // Metrics
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const expiringContracts = contracts.filter(c => c.status === 'expiring').length;
  const activeSubscriptions = subscriptions.filter(s => s.subscription_status === 'active').length;
  const pastDueSubscriptions = subscriptions.filter(s => s.billing_status === 'overdue').length;
  const mrrTotal = subscriptions
    .filter(s => s.subscription_status === 'active')
    .reduce((sum, s) => sum + (s.recurring_amount || 0), 0);

  // Filter contracts
  let filtered = contracts;
  if (filter !== 'all') {
    if (filter === 'expiring') {
      filtered = contracts.filter(c => c.status === 'expiring');
    } else if (filter === 'overdue') {
      filtered = contracts.filter(c => {
        const sub = subscriptions.find(s => s.contract_id === c.id);
        return sub?.billing_status === 'overdue';
      });
    } else {
      filtered = contracts.filter(c => c.status === filter);
    }
  }

  if (search) {
    filtered = filtered.filter(c => {
      const company = companies.find(co => co.id === c.company_id);
      return company?.company_name.toLowerCase().includes(search.toLowerCase()) ||
             c.contract_name.toLowerCase().includes(search.toLowerCase());
    });
  }

  const getCompanyName = (id) => companies.find(c => c.id === id)?.company_name || 'Unknown';

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      expiring: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      draft: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.draft;
  };

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Billing & Contracts</h1>
            <p className="text-slate-600">Multi-tenant commercial intelligence and contract management</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Active Contracts</p>
                    <p className="text-3xl font-bold text-slate-900">{activeContracts}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Expiring Soon</p>
                    <p className="text-3xl font-bold text-orange-600">{expiringContracts}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Monthly Recurring Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${(mrrTotal / 1000).toFixed(0)}k</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Past Due</p>
                    <p className="text-3xl font-bold text-red-600">{pastDueSubscriptions}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-slate-900">{activeSubscriptions}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expiring">Expiring</TabsTrigger>
                <TabsTrigger value="overdue">Past Due</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Contracts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 font-semibold">Contract</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Monthly Value</th>
                      <th className="text-left py-3 px-4 font-semibold">Renewal Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Auto Renew</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 50).map(contract => {
                      const subscription = subscriptions.find(s => s.contract_id === contract.id);
                      return (
                        <tr key={contract.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4">{getCompanyName(contract.company_id)}</td>
                          <td className="py-3 px-4 font-semibold">{contract.contract_name}</td>
                          <td className="py-3 px-4 text-xs">{contract.contract_type}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold">${(contract.monthly_value || 0).toFixed(0)}</td>
                          <td className="py-3 px-4 text-xs">{contract.renewal_date || contract.end_date}</td>
                          <td className="py-3 px-4 text-xs">{contract.auto_renew ? 'Yes' : 'No'}</td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.location.href = createPageUrl(`AdminBillingContract?id=${contract.id}`)}
                            >
                              Open
                            </Button>
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