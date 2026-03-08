import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Filter } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminOperations() {
  const [filterType, setFilterType] = useState('all');
  const [timePeriod, setTimePeriod] = useState('this_week');

  // Fetch SLA events
  const { data: slaEvents = [] } = useQuery({
    queryKey: ['sla-events', filterType, timePeriod],
    queryFn: async () => {
      const events = await base44.asServiceRole.entities.SLAEvents.filter({
        status: filterType === 'all' ? undefined : filterType
      });
      return events.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
  });

  // Fetch accountability scores
  const { data: scores = [] } = useQuery({
    queryKey: ['accountability-scores'],
    queryFn: async () => {
      const scoresData = await base44.asServiceRole.entities.AccountabilityScores.list();
      return scoresData.sort((a, b) => b.score_value - a.score_value);
    }
  });

  const criticalBreaches = slaEvents.filter(e => e.severity === 'critical' && e.status === 'breached');
  const activeBreaches = slaEvents.filter(e => (e.status === 'active' || e.status === 'breached'));
  const highRiskAccounts = slaEvents.filter(e => e.status === 'breached').length > 2;

  // Group by entity type
  const breachesByType = {};
  slaEvents.forEach(event => {
    if (!breachesByType[event.related_entity_type]) {
      breachesByType[event.related_entity_type] = [];
    }
    breachesByType[event.related_entity_type].push(event);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage="operations" />
      
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Operations SLA Command Center</h1>
            <p className="text-gray-600 mt-2">Track delivery discipline, approvals, and operational accountability</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Critical Breaches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600">{criticalBreaches.length}</div>
                <p className="text-xs text-gray-500 mt-2">Requiring immediate action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active SLA Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600">{activeBreaches.length}</div>
                <p className="text-xs text-gray-500 mt-2">All statuses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Team Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  {scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s.score_value, 0) / scores.length) : 0}
                </div>
                <p className="text-xs text-gray-500 mt-2">Accountability (0-100)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">At-Risk Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600">
                  {new Set(slaEvents.filter(e => e.status === 'breached').map(e => e.company_id)).size}
                </div>
                <p className="text-xs text-gray-500 mt-2">Multiple breaches</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('active')}
              >
                Active
              </Button>
              <Button
                variant={filterType === 'breached' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('breached')}
              >
                Breached
              </Button>
              <Button
                variant={filterType === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('critical')}
              >
                Critical Only
              </Button>
            </div>
          </div>

          {/* Breaches by Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {Object.entries(breachesByType).map(([entityType, events]) => (
              <Card key={entityType}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{entityType}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Issues</span>
                      <span className="font-semibold">{events.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Breached</span>
                      <span className="font-semibold text-red-600">
                        {events.filter(e => e.status === 'breached').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active/Warning</span>
                      <span className="font-semibold text-yellow-600">
                        {events.filter(e => e.status === 'active').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* SLA Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent SLA Events</CardTitle>
            </CardHeader>
            <CardContent>
              {slaEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No SLA events - operations on track!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 font-semibold">Entity</th>
                        <th className="text-left py-2 font-semibold">Rule</th>
                        <th className="text-left py-2 font-semibold">Status</th>
                        <th className="text-left py-2 font-semibold">Severity</th>
                        <th className="text-left py-2 font-semibold">Started</th>
                        <th className="text-left py-2 font-semibold">Duration</th>
                        <th className="text-right py-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slaEvents.slice(0, 50).map(event => (
                        <tr key={event.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {event.related_entity_type}
                            </span>
                          </td>
                          <td className="py-3 text-gray-700">{event.event_type}</td>
                          <td className="py-3">
                            <Badge
                              className={
                                event.status === 'breached' ? 'bg-red-100 text-red-800' :
                                event.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }
                            >
                              {event.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Badge
                              className={
                                event.severity === 'critical' ? 'bg-red-600' :
                                event.severity === 'high' ? 'bg-orange-600' :
                                event.severity === 'medium' ? 'bg-yellow-600' :
                                'bg-blue-600'
                              }
                            >
                              {event.severity}
                            </Badge>
                          </td>
                          <td className="py-3 text-xs text-gray-500">
                            {new Date(event.started_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-xs">
                            {event.duration_hours ? `${event.duration_hours}h` : '—'}
                          </td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm" className="text-xs">
                              View
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

          {/* Accountability Scores */}
          {scores.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Team Accountability Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scores.slice(0, 10).map(score => (
                    <div key={score.id} className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{score.score_label}</p>
                        <p className="text-xs text-gray-500">{score.factors_summary}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{score.score_value}</div>
                          <div className="text-xs text-gray-500">{score.score_period_label}</div>
                        </div>
                        <ScoreBadge score={score.score_value} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }) {
  if (score >= 85) {
    return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
  }
  if (score >= 70) {
    return <Badge className="bg-blue-100 text-blue-800">Stable</Badge>;
  }
  if (score >= 50) {
    return <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>;
  }
  return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
}