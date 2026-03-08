import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Lock, CheckCircle2, Clock, Shield } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminGovernance() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: policies = [] } = useQuery({
    queryKey: ['governance_policies'],
    queryFn: () => base44.asServiceRole.entities.GovernancePolicies.list('-priority')
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['approval_requests'],
    queryFn: () => base44.asServiceRole.entities.ApprovalRequests.filter({ status: 'pending' })
  });

  const { data: auditLog = [] } = useQuery({
    queryKey: ['governance_audit'],
    queryFn: () => base44.asServiceRole.entities.GovernanceAuditLog.list('-created_date', 100)
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: () => base44.asServiceRole.entities.Companies.list()
  });

  // Calculate metrics
  const activePolicies = policies.filter(p => p.active).length;
  const blockedActionsToday = auditLog.filter(a => a.decision_result === 'blocked' && isToday(a.created_date)).length;
  const pendingApprovals = approvals.length;
  const criticalPolicies = policies.filter(p => p.priority === 'critical' && p.active).length;

  const getCompanyName = (id) => companies.find(c => c.id === id)?.company_name || 'Unknown';

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.medium;
  };

  const getDecisionColor = (decision) => {
    const colors = {
      allowed: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800',
      approval_requested: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      logged: 'bg-blue-100 text-blue-800'
    };
    return colors[decision] || colors.logged;
  };

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">System Governance & Safety</h1>
            <p className="text-slate-600">Control AI automation, require approvals, audit decisions, manage rollbacks</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Active Policies</p>
                    <p className="text-3xl font-bold text-slate-900">{activePolicies}</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Critical Policies</p>
                    <p className="text-3xl font-bold text-red-600">{criticalPolicies}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pending Approvals</p>
                    <p className="text-3xl font-bold text-orange-600">{pendingApprovals}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Blocked Today</p>
                    <p className="text-3xl font-bold text-slate-900">{blockedActionsToday}</p>
                  </div>
                  <Lock className="w-8 h-8 text-slate-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">{activePolicies} Active Governance Policies</p>
                        <p className="text-xs text-green-700">Controlling AI behavior across all systems</p>
                      </div>
                    </div>
                  </div>

                  {pendingApprovals > 0 && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-semibold text-orange-900">{pendingApprovals} Actions Pending Approval</p>
                          <p className="text-xs text-orange-700">Review and approve sensitive automation actions</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-900">{blockedActionsToday} Actions Blocked Today</p>
                        <p className="text-xs text-blue-700">Prevented by governance policies</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Governance Policies</CardTitle>
                    <Button size="sm" onClick={() => window.location.href = createPageUrl('AdminGovernancePolicy')}>
                      Create Policy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Policy Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Type</th>
                          <th className="text-left py-3 px-4 font-semibold">Scope</th>
                          <th className="text-left py-3 px-4 font-semibold">Mode</th>
                          <th className="text-left py-3 px-4 font-semibold">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {policies.map(p => (
                          <tr key={p.id} className="border-b hover:bg-slate-50">
                            <td className="py-3 px-4 font-semibold">{p.policy_name}</td>
                            <td className="py-3 px-4">{p.policy_type}</td>
                            <td className="py-3 px-4">{p.scope_type}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{p.enforcement_mode}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getPriorityColor(p.priority)}>
                                {p.priority}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {p.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.location.href = createPageUrl(`AdminGovernancePolicy?id=${p.id}`)}
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
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  {approvals.length === 0 ? (
                    <p className="text-slate-600 text-center py-8">No pending approvals</p>
                  ) : (
                    <div className="space-y-3">
                      {approvals.map(a => (
                        <div key={a.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{a.title}</p>
                              <p className="text-sm text-slate-600 mt-1">{a.summary}</p>
                            </div>
                            <Badge className={getPriorityColor(a.priority)}>
                              {a.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                            <span className="text-xs text-slate-500">
                              {a.created_date ? new Date(a.created_date).toLocaleDateString() : 'N/A'}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => window.location.href = createPageUrl(`AdminApproval?id=${a.id}`)}
                            >
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Log Tab */}
            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>Governance Audit Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditLog.slice(0, 50).map(log => (
                      <div key={log.id} className="p-3 border border-slate-200 rounded-lg text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{log.action_type}</p>
                            <p className="text-xs text-slate-600 mt-1">{log.decision_reason}</p>
                          </div>
                          <Badge className={getDecisionColor(log.decision_result)}>
                            {log.decision_result}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminNav>
  );
}