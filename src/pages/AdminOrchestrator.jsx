import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, AlertCircle, CheckCircle2, Clock, Play, Pause, RotateCw, Eye,
  TrendingUp, Activity, Brain, Loader2
} from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminOrchestrator() {
  const [selectedOrchestration, setSelectedOrchestration] = useState(null);

  // Fetch orchestrations
  const { data: orchestrations, isLoading: orchLoading } = useQuery({
    queryKey: ['orchestrations'],
    queryFn: () => base44.asServiceRole.entities.WorkflowOrchestrations.list('-priority'),
    initialData: []
  });

  // Fetch recent runs
  const { data: recentRuns } = useQuery({
    queryKey: ['workflowRuns', 'recent'],
    queryFn: () => base44.asServiceRole.entities.WorkflowRuns.list('-started_at', 20),
    initialData: []
  });

  // Summary stats
  const activeOrchestrations = orchestrations.filter(o => o.status === 'active' && o.enabled).length;
  const todayRuns = recentRuns.filter(r => {
    const runDate = new Date(r.started_at);
    const today = new Date();
    return runDate.toDateString() === today.toDateString();
  }).length;
  const failedRuns = recentRuns.filter(r => r.run_status === 'failed').length;
  const totalActionsCreated = recentRuns.reduce((sum, r) => sum + (r.actions_created_count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage="orchestrator" />
      
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-10 h-10 text-blue-600" />
              Workflow Orchestrator
            </h1>
            <p className="text-gray-600 mt-1">Central automation brain—triggers workflows based on platform signals</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Orchestrations</p>
                    <p className="text-3xl font-bold text-gray-900">{activeOrchestrations}</p>
                  </div>
                  <Zap className="w-8 h-8 text-blue-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Runs</p>
                    <p className="text-3xl font-bold text-gray-900">{todayRuns}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Failed Runs</p>
                    <p className="text-3xl font-bold text-red-600">{failedRuns}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Actions Created</p>
                    <p className="text-3xl font-bold text-gray-900">{totalActionsCreated}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Orchestrations List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Active Orchestrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {orchLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : orchestrations.length === 0 ? (
                    <p className="text-gray-500 py-8">No orchestrations configured</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">Type</th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">Trigger</th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">Status</th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">Last Run</th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orchestrations.map(orch => (
                            <tr key={orch.id} className="border-b hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedOrchestration(orch)}>
                              <td className="py-3 px-3 font-medium text-gray-900">{orch.orchestration_name}</td>
                              <td className="py-3 px-3">
                                <Badge variant="outline" className="text-xs">{orch.orchestration_type}</Badge>
                              </td>
                              <td className="py-3 px-3 text-xs text-gray-600">{orch.trigger_event}</td>
                              <td className="py-3 px-3">
                                <Badge className={orch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                  {orch.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-3 text-xs text-gray-600">
                                {orch.last_run_date ? new Date(orch.last_run_date).toLocaleDateString() : 'Never'}
                              </td>
                              <td className="py-3 px-3">
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={createPageUrl(`AdminOrchestratorDetail?id=${orch.id}`)}>
                                    <Eye className="w-4 h-4" />
                                  </a>
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

            {/* Recent Activity */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Runs</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentRuns.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent runs</p>
                  ) : (
                    <div className="space-y-3">
                      {recentRuns.slice(0, 8).map(run => (
                        <div key={run.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-xs font-semibold text-gray-900">{run.trigger_event}</p>
                            <Badge className={
                              run.run_status === 'completed' ? 'bg-green-100 text-green-800' :
                              run.run_status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            } style={{fontSize: '10px'}}>
                              {run.run_status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{run.result_summary?.substring(0, 60)}...</p>
                          <div className="flex gap-2 text-xs">
                            {run.actions_created_count > 0 && (
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {run.actions_created_count} actions
                              </span>
                            )}
                            {run.tasks_created_count > 0 && (
                              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                {run.tasks_created_count} tasks
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Selected Orchestration Detail */}
          {selectedOrchestration && (
            <Card className="mt-8 border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedOrchestration.orchestration_name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">{selectedOrchestration.description}</p>
                  </div>
                  <Button size="sm" asChild>
                    <a href={createPageUrl(`AdminOrchestratorDetail?id=${selectedOrchestration.id}`)}>
                      View Full Details
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}