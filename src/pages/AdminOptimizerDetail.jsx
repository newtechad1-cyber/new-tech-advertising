import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, AlertCircle, CheckCircle2, TrendingUp, Lightbulb } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminOptimizerDetail() {
  const { opportunity_id } = useParams();
  const queryClient = useQueryClient();
  const [actionInProgress, setActionInProgress] = useState(null);

  const { data: opportunity } = useQuery({
    queryKey: ['optimization', opportunity_id],
    queryFn: () => base44.asServiceRole.entities.OptimizationOpportunities.filter({ id: opportunity_id }),
    initialData: []
  });

  const { data: signals } = useQuery({
    queryKey: ['signals', opportunity_id],
    queryFn: () => base44.asServiceRole.entities.OptimizationSignals.filter({ optimization_opportunity_id: opportunity_id }),
    initialData: []
  });

  const { data: actions } = useQuery({
    queryKey: ['opp-actions', opportunity_id],
    queryFn: () => base44.asServiceRole.entities.OptimizationActions.filter({ optimization_opportunity_id: opportunity_id }, 'sort_order'),
    initialData: []
  });

  const { data: company } = useQuery({
    queryKey: ['company', opportunity[0]?.company_id],
    queryFn: () => opportunity[0] ? base44.asServiceRole.entities.Company.filter({ id: opportunity[0].company_id }) : [],
    initialData: [],
    enabled: opportunity.length > 0
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => 
      base44.asServiceRole.entities.OptimizationOpportunities.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization', opportunity_id] });
    }
  });

  if (!opportunity[0]) {
    return (
      <AdminNav>
        <div className="p-6">
          <p>Loading...</p>
        </div>
      </AdminNav>
    );
  }

  const opp = opportunity[0];
  const companyData = company[0];

  const priorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const severityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Lightbulb className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <AdminNav>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href={createPageUrl('AdminOptimizer')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-purple-600" />
              <h1 className="text-2xl font-bold">{opp.title}</h1>
            </div>
            <p className="text-gray-600">{companyData?.company_name}</p>
          </div>
        </div>

        {/* Overview */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Optimization Type</p>
                <Badge variant="outline" className="mt-1">
                  {opp.optimization_type.split('_').join(' ').toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Description</p>
                <p className="text-gray-700 mt-2">{opp.description}</p>
              </div>
              {opp.root_cause_summary && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Root Cause</p>
                  <p className="text-gray-700 mt-2">{opp.root_cause_summary}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-700">Recommendation</p>
                <p className="text-gray-700 mt-2">{opp.recommendation_summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <div className="space-y-4">
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Confidence Score</p>
                <p className="text-4xl font-bold text-purple-600 mt-1">{opp.confidence_score}%</p>
                <p className="text-xs text-gray-600 mt-2">
                  {opp.confidence_score >= 80 && 'Strong pattern'}
                  {opp.confidence_score >= 60 && opp.confidence_score < 80 && 'Likely optimization'}
                  {opp.confidence_score < 60 && 'Moderate signal'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Impact Potential</p>
                <p className="text-xl font-bold text-gray-900 mt-1 capitalize">
                  {opp.impact_potential}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Priority</p>
                <Badge className={`${priorityColor(opp.priority)} mt-2`}>
                  {opp.priority.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant="outline" className="mt-2">
                  {opp.status}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Signals */}
        {signals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Supporting Signals ({signals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {signals.map(signal => (
                  <div key={signal.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{signal.signal_label}</p>
                        <p className="text-sm text-gray-600 mt-1">{signal.signal_value}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {severityIcon(signal.severity)}
                        <Badge variant="outline" className="text-xs">
                          {signal.severity}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="secondary">{signal.signal_type.split('_').join(' ')}</Badge>
                      <Badge variant="secondary">{signal.source_type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {actions.length === 0 ? (
              <p className="text-center py-6 text-gray-500">No actions defined yet</p>
            ) : (
              <div className="space-y-4">
                {actions.map((action, idx) => (
                  <div key={action.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                          <p className="font-semibold text-gray-900">{action.title}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <Badge className={`whitespace-nowrap ${
                        action.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        action.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {action.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap text-xs">
                      <Badge variant="secondary">{action.action_type.split('_').join(' ')}</Badge>
                      {action.status !== 'pending' && (
                        <Badge variant="outline">{action.status}</Badge>
                      )}
                    </div>
                    {action.due_date && (
                      <p className="text-xs text-gray-500">Due: {action.due_date}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Controls */}
        <Card className="border-l-4 border-l-gray-300">
          <CardHeader>
            <CardTitle>Status & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {['new', 'reviewing', 'accepted', 'in_progress', 'completed', 'dismissed'].map(status => (
                  <Button
                    key={status}
                    size="sm"
                    variant={opp.status === status ? 'default' : 'outline'}
                    onClick={() => updateStatusMutation.mutate({ id: opp.id, status })}
                    disabled={updateStatusMutation.isPending}
                  >
                    {status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t space-y-2">
              <p className="text-sm font-semibold">Create Related Item</p>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline">Create Task</Button>
                <Button size="sm" variant="outline">Create Proposal</Button>
                <Button size="sm" variant="outline">Create Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminNav>
  );
}