import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminRevenueEngine() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['revenue_opportunities'],
    queryFn: () => base44.asServiceRole.entities.RevenueOpportunities.list('-probability_score', 500)
  });

  const { data: sequences = [] } = useQuery({
    queryKey: ['revenue_sequences'],
    queryFn: () => base44.asServiceRole.entities.RevenueSequences.filter({ status: 'active' })
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.asServiceRole.entities.Companies.list()
  });

  // Calculate metrics
  const activeOpps = opportunities.filter(o => o.status !== 'won' && o.status !== 'lost' && o.status !== 'dismissed');
  const renewals = activeOpps.filter(o => o.opportunity_type === 'renewal').length;
  const upsells = activeOpps.filter(o => o.opportunity_type === 'upsell').length;
  const stalled = activeOpps.filter(o => o.opportunity_type === 'stalled_deal').length;
  const ownerApprovalNeeded = activeOpps.filter(o => o.owner_action_required).length;
  
  const totalPipelineValue = opportunities
    .filter(o => o.status !== 'won' && o.status !== 'lost')
    .reduce((sum, o) => sum + (o.estimated_value || 0), 0);

  const totalRenewalValue = opportunities
    .filter(o => o.opportunity_type === 'renewal')
    .reduce((sum, o) => sum + (o.estimated_value || 0), 0);

  // Filter opportunities
  let filtered = activeOpps;
  if (filter !== 'all') {
    if (filter === 'owner_approval') {
      filtered = activeOpps.filter(o => o.owner_action_required);
    } else {
      filtered = activeOpps.filter(o => o.opportunity_type === filter);
    }
  }

  if (search) {
    filtered = filtered.filter(o => o.title.toLowerCase().includes(search.toLowerCase()));
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      urgent: 'bg-orange-100 text-orange-800',
      high: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[urgency] || colors.medium;
  };

  const getCompanyName = (id) => companies.find(c => c.id === id)?.company_name || 'Unknown';

  if (isLoading) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Autonomous Revenue Engine</h1>
            <p className="text-slate-600">Automated revenue opportunity detection and execution</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Active Opps</p>
                    <p className="text-3xl font-bold text-slate-900">{activeOpps.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Renewals</p>
                    <p className="text-3xl font-bold text-purple-600">{renewals}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Upsells</p>
                    <p className="text-3xl font-bold text-green-600">{upsells}</p>
                  </div>
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Stalled</p>
                    <p className="text-3xl font-bold text-orange-600">{stalled}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Owner Approval</p>
                    <p className="text-3xl font-bold text-red-600">{ownerApprovalNeeded}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pipeline Value</p>
                    <p className="text-2xl font-bold text-slate-900">${(totalPipelineValue / 1000).toFixed(0)}k</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="renewal">Renewals</TabsTrigger>
                <TabsTrigger value="upsell">Upsells</TabsTrigger>
                <TabsTrigger value="stalled_deal">Stalled</TabsTrigger>
                <TabsTrigger value="owner_approval">Needs Approval</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Revenue Opportunities Table */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 font-semibold">Opportunity</th>
                      <th className="text-left py-3 px-4 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 font-semibold">Value</th>
                      <th className="text-left py-3 px-4 font-semibold">Probability</th>
                      <th className="text-left py-3 px-4 font-semibold">Urgency</th>
                      <th className="text-left py-3 px-4 font-semibold">Stage</th>
                      <th className="text-left py-3 px-4 font-semibold">Next Action</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 50).map(opp => (
                      <tr key={opp.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">{getCompanyName(opp.company_id)}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{opp.opportunity_type}</Badge>
                        </td>
                        <td className="py-3 px-4">{opp.title}</td>
                        <td className="py-3 px-4 font-semibold">
                          {opp.estimated_value ? `$${(opp.estimated_value / 1000).toFixed(0)}k` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-100 text-blue-800">{opp.probability_score}%</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getUrgencyColor(opp.urgency_level)}>
                            {opp.urgency_level}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{opp.stage}</td>
                        <td className="py-3 px-4 text-xs text-slate-600">{opp.next_action_date}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.location.href = createPageUrl(`AdminRevenueDetail?id=${opp.id}`)}
                          >
                            Open
                          </Button>
                        </td>
                      </tr>
                    ))}
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