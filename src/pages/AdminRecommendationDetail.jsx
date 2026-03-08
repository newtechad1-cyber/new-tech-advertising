import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Link2, MessageSquare, FileText, CheckCircle2, X } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminRecommendationDetail() {
  const [searchParams] = useSearchParams();
  const recId = searchParams.get('id');
  const queryClient = useQueryClient();

  const { data: rec = null, isLoading } = useQuery({
    queryKey: ['recommendation', recId],
    queryFn: () => base44.asServiceRole.entities.UnifiedRecommendations.filter({ id: recId }).then(r => r[0]),
    enabled: !!recId
  });

  const { data: signals = [] } = useQuery({
    queryKey: ['recommendation_signals', recId],
    queryFn: () => base44.asServiceRole.entities.RecommendationSignals.filter({ unified_recommendation_id: recId }),
    enabled: !!recId
  });

  const { data: company = null } = useQuery({
    queryKey: ['company', rec?.company_id],
    queryFn: () => base44.asServiceRole.entities.Companies.filter({ id: rec?.company_id }).then(c => c[0]),
    enabled: !!rec?.company_id
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) =>
      base44.asServiceRole.entities.UnifiedRecommendations.update(recId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendation', recId] });
    }
  });

  if (isLoading || !rec) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

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

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{rec.title}</h1>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getUrgencyColor(rec.urgency_level)}>
                    {rec.urgency_level}
                  </Badge>
                  <Badge variant="outline">{rec.recommendation_type}</Badge>
                  <Badge variant="outline">Priority: {rec.priority_score}</Badge>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Summary</p>
                    <p className="text-slate-900">{rec.summary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Recommended Action</p>
                    <p className="text-slate-900 font-semibold">{rec.recommended_action}</p>
                  </div>
                  {rec.detailed_reasoning && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Reasoning</p>
                      <p className="text-slate-900">{rec.detailed_reasoning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scoring Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Scoring Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">Confidence Score</p>
                      <p className="text-2xl font-bold text-slate-900">{rec.confidence_score}%</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">Priority Score</p>
                      <p className="text-2xl font-bold text-slate-900">{rec.priority_score}/100</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">Impact Level</p>
                      <p className="text-lg font-bold text-slate-900">{rec.impact_level}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">Target Role</p>
                      <p className="text-lg font-bold text-slate-900">{rec.role_target}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supporting Signals */}
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Signals ({signals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {signals.length === 0 ? (
                    <p className="text-slate-600">No signals attached</p>
                  ) : (
                    <div className="space-y-3">
                      {signals.map(signal => (
                        <div key={signal.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-slate-900">{signal.signal_label}</p>
                            <Badge variant="outline">{signal.signal_source}</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{signal.signal_value}</p>
                          <p className="text-xs text-slate-500 mt-1">Weight: {signal.weight_value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Source Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Source Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Source System</p>
                    <p className="font-semibold text-slate-900">{rec.recommendation_source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Source Entity</p>
                    <p className="text-sm text-slate-900">{rec.source_entity_type}</p>
                  </div>
                  {rec.company_id && company && (
                    <div>
                      <p className="text-sm text-slate-600">Company</p>
                      <p className="font-semibold text-slate-900">{company.company_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={() => updateStatusMutation.mutate('in_progress')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark In Progress
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => updateStatusMutation.mutate('acknowledged')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Acknowledge
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => updateStatusMutation.mutate('dismissed')}>
                    <X className="w-4 h-4 mr-2" />
                    Dismiss
                  </Button>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="w-full text-center py-2">{rec.status}</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminNav>
  );
}