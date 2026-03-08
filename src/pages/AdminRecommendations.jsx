import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, TrendingUp, Users, Zap, CheckCircle2, Clock } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminRecommendations() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table'); // table or detail

  const { data: recommendations = [], isLoading: recsLoading } = useQuery({
    queryKey: ['unified_recommendations'],
    queryFn: () => base44.asServiceRole.entities.UnifiedRecommendations.list('-priority_score', 500)
  });

  const { data: bundles = [] } = useQuery({
    queryKey: ['recommendation_bundles'],
    queryFn: () => base44.asServiceRole.entities.RecommendationBundles.filter({ status: 'active' })
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies_summary'],
    queryFn: () => base44.asServiceRole.entities.Companies.list()
  });

  // Calculate summary metrics
  const critical = recommendations.filter(r => r.urgency_level === 'critical' && r.status !== 'completed').length;
  const newRecs = recommendations.filter(r => r.status === 'new').length;
  const ownerTargeted = recommendations.filter(r => r.role_target === 'owner' && r.status !== 'completed').length;

  // Filter recommendations
  let filtered = recommendations;
  if (filter !== 'all') {
    if (filter === 'critical') filtered = recommendations.filter(r => r.urgency_level === 'critical');
    else if (filter.includes('_')) filtered = recommendations.filter(r => r.role_target === filter.split('_')[0]);
    else filtered = recommendations.filter(r => r.recommendation_type === filter);
  }

  if (search) {
    filtered = filtered.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
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

  if (recsLoading) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Unified Recommendations</h1>
            <p className="text-slate-600">Centralized AI recommendation engine across all systems</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Critical</p>
                    <p className="text-3xl font-bold text-red-600">{critical}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">New</p>
                    <p className="text-3xl font-bold text-blue-600">{newRecs}</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Owner Targeted</p>
                    <p className="text-3xl font-bold text-purple-600">{ownerTargeted}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total</p>
                    <p className="text-3xl font-bold text-slate-600">{recommendations.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Role Bundles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {bundles.slice(0, 4).map(bundle => (
              <Card key={bundle.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold text-slate-600 mb-2">{bundle.role_target.toUpperCase()}</p>
                  <p className="text-2xl font-bold text-slate-900">{bundle.summary.split(' ')[0]}</p>
                  <p className="text-xs text-slate-500 mt-2">Priority: {Math.round(bundle.priority_score)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search recommendations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="renewal">Renewals</TabsTrigger>
                <TabsTrigger value="upsell">Upsells</TabsTrigger>
                <TabsTrigger value="optimization">Optimizations</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Recommendations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 font-semibold">Urgency</th>
                      <th className="text-left py-3 px-4 font-semibold">Priority</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 50).map(rec => (
                      <tr key={rec.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <a href={createPageUrl(`AdminRecommendationDetail?id=${rec.id}`)} className="text-blue-600 hover:underline">
                            {rec.title}
                          </a>
                        </td>
                        <td className="py-3 px-4">{rec.company_id ? getCompanyName(rec.company_id) : '—'}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{rec.recommendation_type}</Badge>
                        </td>
                        <td className="py-3 px-4">{rec.role_target}</td>
                        <td className="py-3 px-4">
                          <Badge className={getUrgencyColor(rec.urgency_level)}>
                            {rec.urgency_level}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{rec.priority_score}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{rec.status}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.location.href = createPageUrl(`AdminRecommendationDetail?id=${rec.id}`)}
                          >
                            View
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