import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Zap, TrendingUp, AlertCircle, CheckCircle2, Clock, Filter, Plus } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminOptimizer() {
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    search: ''
  });

  const { data: opportunities } = useQuery({
    queryKey: ['optimizations', filters],
    queryFn: async () => {
      let query = {};
      if (filters.status !== 'all') query.status = filters.status;
      if (filters.priority !== 'all') query.priority = filters.priority;
      if (filters.type !== 'all') query.optimization_type = filters.type;
      return base44.asServiceRole.entities.OptimizationOpportunities.filter(query, '-created_date', 100);
    },
    initialData: []
  });

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.asServiceRole.entities.Company.list('-updated_date', 500),
    initialData: []
  });

  // Summary metrics
  const openOpp = opportunities.filter(o => ['new', 'reviewing', 'accepted'].includes(o.status));
  const highConfidence = openOpp.filter(o => o.confidence_score >= 70);
  const urgent = openOpp.filter(o => o.priority === 'urgent');
  const repeatIssues = opportunities.filter(o => o.signals_count >= 3);

  const getCompanyName = (companyId) => {
    return companies.find(c => c.id === companyId)?.company_name || companyId;
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const impactColor = (impact) => {
    switch (impact) {
      case 'significant': return 'text-purple-600 font-bold';
      case 'high': return 'text-green-600 font-bold';
      case 'medium': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const filteredOpportunities = opportunities.filter(o => {
    if (filters.search) {
      const query = filters.search.toLowerCase();
      return o.title.toLowerCase().includes(query) ||
             getCompanyName(o.company_id).toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <AdminNav>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Zap className="w-8 h-8 text-purple-600" />
              Optimization Command Center
            </h1>
            <p className="text-gray-600 mt-1">Detect and prioritize performance improvement opportunities</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Open Opportunities</p>
              <p className="text-3xl font-bold text-gray-900">{openOpp.length}</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">High Confidence</p>
              <p className="text-3xl font-bold text-green-600">{highConfidence.length}</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Urgent</p>
              <p className="text-3xl font-bold text-red-600">{urgent.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Repeated Issues</p>
              <p className="text-3xl font-bold text-purple-600">{repeatIssues.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Search by company or title..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="max-w-md"
            />
            <div className="flex gap-3 flex-wrap">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="conversion_optimization">Conversion</option>
                <option value="content_mix_adjustment">Content Mix</option>
                <option value="video_expansion">Video Expansion</option>
                <option value="seo_expansion">SEO Expansion</option>
                <option value="approval_bottleneck_reduction">Approval Bottleneck</option>
                <option value="campaign_refresh">Campaign Refresh</option>
                <option value="creative_refresh">Creative Refresh</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOpportunities.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No opportunities match filters</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Company</th>
                      <th className="px-4 py-3 text-left font-semibold">Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Title</th>
                      <th className="px-4 py-3 text-center font-semibold">Confidence</th>
                      <th className="px-4 py-3 text-center font-semibold">Impact</th>
                      <th className="px-4 py-3 text-left font-semibold">Priority</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOpportunities.map(opp => (
                      <tr key={opp.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-blue-600">
                          {getCompanyName(opp.company_id)}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <Badge variant="outline">{opp.optimization_type.split('_').join(' ')}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`/admin/optimizer/${opp.id}`} className="text-blue-600 hover:underline">
                            {opp.title}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-purple-600">{opp.confidence_score}%</span>
                        </td>
                        <td className={`px-4 py-3 text-center ${impactColor(opp.impact_potential)}`}>
                          {opp.impact_potential}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={priorityColor(opp.priority)}>
                            {opp.priority}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{opp.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                          >
                            <a href={`/admin/optimizer/${opp.id}`}>View</a>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminNav>
  );
}