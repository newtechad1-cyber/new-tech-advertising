import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Link2, CheckCircle2, Pause, X } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminRevenueDetail() {
  const [searchParams] = useSearchParams();
  const oppId = searchParams.get('id');
  const queryClient = useQueryClient();

  const { data: opp = null, isLoading } = useQuery({
    queryKey: ['revenue_opportunity', oppId],
    queryFn: () => base44.asServiceRole.entities.RevenueOpportunities.filter({ id: oppId }).then(r => r[0]),
    enabled: !!oppId
  });

  const { data: sequence = null } = useQuery({
    queryKey: ['revenue_sequence', opp?.id],
    queryFn: () => base44.asServiceRole.entities.RevenueSequences.filter({ revenue_opportunity_id: opp?.id }).then(r => r[0]),
    enabled: !!opp?.id
  });

  const { data: steps = [] } = useQuery({
    queryKey: ['revenue_steps', sequence?.id],
    queryFn: () => base44.asServiceRole.entities.RevenueSequenceSteps.filter({ revenue_sequence_id: sequence?.id }),
    enabled: !!sequence?.id
  });

  const { data: company = null } = useQuery({
    queryKey: ['company', opp?.company_id],
    queryFn: () => base44.asServiceRole.entities.Companies.filter({ id: opp?.company_id }).then(c => c[0]),
    enabled: !!opp?.company_id
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) =>
      base44.asServiceRole.entities.RevenueOpportunities.update(oppId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenue_opportunity', oppId] });
    }
  });

  if (isLoading || !opp) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{opp.title}</h1>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{opp.opportunity_type}</Badge>
                  <Badge className={getUrgencyColor(opp.urgency_level)}>
                    {opp.urgency_level}
                  </Badge>
                  {opp.owner_action_required && (
                    <Badge className="bg-red-100 text-red-800">Owner Approval Needed</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => window.history.back()}>
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
                    <p className="text-slate-900">{opp.summary}</p>
                  </div>
                  {opp.recommended_offer && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Recommended Offer</p>
                      <p className="text-slate-900 font-semibold">{opp.recommended_offer}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Probability Score</p>
                      <p className="text-2xl font-bold text-slate-900">{opp.probability_score}%</p>
                    </div>
                    {opp.estimated_value && (
                      <div>
                        <p className="text-sm text-slate-600">Est. Value</p>
                        <p className="text-2xl font-bold text-green-600">${(opp.estimated_value / 1000).toFixed(0)}k</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sequence Tracker */}
              {sequence && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sequence Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-slate-600">
                        Step {sequence.current_step_index + 1} of {sequence.step_count}
                      </p>
                      <Badge variant={sequence.status === 'active' ? 'default' : 'outline'}>
                        {sequence.status}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {steps.map((step, idx) => (
                        <div key={step.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-start gap-3 flex-1">
                              {idx < sequence.current_step_index && (
                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                              )}
                              {idx === sequence.current_step_index && (
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                              )}
                              {idx > sequence.current_step_index && (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900">{step.title}</p>
                                <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {step.action_status}
                            </Badge>
                          </div>
                          {step.requires_human_approval && (
                            <p className="text-xs text-orange-600 mt-2">⚠ Requires human approval</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Context */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Company</p>
                    <p className="font-semibold text-slate-900">{company?.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Motion Type</p>
                    <p className="text-slate-900">{opp.revenue_motion_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Stage</p>
                    <p className="text-slate-900">{opp.stage}</p>
                  </div>
                  {opp.next_action_date && (
                    <div>
                      <p className="text-sm text-slate-600">Next Action</p>
                      <p className="text-slate-900">{opp.next_action_date}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={() => updateStatusMutation.mutate('proposal_created')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Proposal Created
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => updateStatusMutation.mutate('paused')}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Motion
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => updateStatusMutation.mutate('won')}>
                    Mark Won
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
                  <Badge className="w-full text-center py-2">{opp.status}</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminNav>
  );
}