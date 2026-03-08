import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

export default function AdminGovernancePolicy() {
  const [searchParams] = useSearchParams();
  const policyId = searchParams.get('id');

  const { data: policy = null, isLoading } = useQuery({
    queryKey: ['governance_policy', policyId],
    queryFn: () => policyId ? base44.asServiceRole.entities.GovernancePolicies.filter({ id: policyId }).then(r => r[0]) : null,
    enabled: !!policyId
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['governance_rules', policy?.id],
    queryFn: () => base44.asServiceRole.entities.GovernanceRules.filter({ governance_policy_id: policy?.id }),
    enabled: !!policy?.id
  });

  const { data: auditLog = [] } = useQuery({
    queryKey: ['policy_audit', policy?.id],
    queryFn: () => base44.asServiceRole.entities.GovernanceAuditLog.filter({ policy_applied: policy?.policy_name }),
    enabled: !!policy?.policy_name
  });

  if (isLoading || !policy) return <AdminNav><div className="p-8">Loading...</div></AdminNav>;

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900">{policy.policy_name}</h1>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{policy.policy_type}</Badge>
              <Badge className={getPriorityColor(policy.priority)}>
                {policy.priority}
              </Badge>
              <Badge className={policy.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {policy.active ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">{policy.enforcement_mode}</Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rules">Rules ({rules.length})</TabsTrigger>
              <TabsTrigger value="decisions">Recent Decisions ({auditLog.length})</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Description</p>
                    <p className="text-slate-900 leading-relaxed">{policy.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Scope Type</p>
                      <p className="font-semibold text-slate-900">{policy.scope_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Enforcement Mode</p>
                      <p className="font-semibold text-slate-900">{policy.enforcement_mode}</p>
                    </div>
                  </div>

                  {policy.scope_target_id && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Scope Target</p>
                      <p className="font-semibold text-slate-900">{policy.scope_target_id}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Created</p>
                      <p className="text-slate-900">{policy.created_date ? new Date(policy.created_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Updated</p>
                      <p className="text-slate-900">{policy.updated_date ? new Date(policy.updated_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules" className="space-y-4">
              {rules.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-600 mb-4">No rules defined for this policy</p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Rule
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                rules.map(rule => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{rule.rule_name}</CardTitle>
                          <p className="text-sm text-slate-600 mt-1">{rule.rule_category}</p>
                        </div>
                        <Badge className={rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Trigger Condition</p>
                        <p className="font-mono text-sm bg-slate-100 p-2 rounded text-slate-800">{rule.trigger_condition}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Effect</p>
                          <Badge variant="outline">{rule.rule_effect}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Approval Required</p>
                          <p className="text-slate-900">{rule.human_approval_required ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      {rule.allowed_roles && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Allowed Roles</p>
                          <p className="text-slate-900">{rule.allowed_roles}</p>
                        </div>
                      )}

                      {rule.blocked_roles && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Blocked Roles</p>
                          <p className="text-slate-900">{rule.blocked_roles}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Decisions Tab */}
            <TabsContent value="decisions">
              {auditLog.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-slate-600">
                    No decisions recorded yet
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {auditLog.slice(0, 50).map(log => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{log.action_type}</p>
                            <p className="text-xs text-slate-600 mt-1">{log.decision_reason}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {log.decision_result}
                            </Badge>
                            <p className="text-xs text-slate-600">
                              {log.created_date ? new Date(log.created_date).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}