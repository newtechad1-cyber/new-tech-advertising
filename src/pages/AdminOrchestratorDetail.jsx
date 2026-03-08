import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Zap, ChevronLeft, Play, AlertCircle, CheckCircle2, 
  Clock, Settings, History
} from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

export default function AdminOrchestratorDetail() {
  const [searchParams] = useSearchParams();
  const orchestrationId = searchParams.get('id');
  const [testCompanyId, setTestCompanyId] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Fetch orchestration
  const { data: orchestration, isLoading: orchLoading } = useQuery({
    queryKey: ['orchestration', orchestrationId],
    queryFn: () => base44.asServiceRole.entities.WorkflowOrchestrations.filter({ id: orchestrationId }),
    enabled: !!orchestrationId,
    select: (data) => data[0]
  });

  // Fetch rules
  const { data: rules } = useQuery({
    queryKey: ['workflowRules', orchestrationId],
    queryFn: () => base44.asServiceRole.entities.WorkflowRules.filter({
      workflow_orchestration_id: orchestrationId
    }),
    enabled: !!orchestrationId,
    initialData: []
  });

  // Fetch runs
  const { data: runs } = useQuery({
    queryKey: ['workflowRuns', orchestrationId],
    queryFn: () => base44.asServiceRole.entities.WorkflowRuns.filter({
      workflow_orchestration_id: orchestrationId
    }, '-started_at', 15),
    enabled: !!orchestrationId,
    initialData: []
  });

  // Fetch recent actions
  const { data: actions } = useQuery({
    queryKey: ['workflowActions', orchestrationId],
    queryFn: async () => {
      if (!runs || runs.length === 0) return [];
      const runIds = runs.slice(0, 5).map(r => r.id);
      const allActions = [];
      for (const runId of runIds) {
        const runActions = await base44.asServiceRole.entities.WorkflowActions.filter({
          workflow_run_id: runId
        });
        allActions.push(...runActions);
      }
      return allActions;
    },
    enabled: !!orchestrationId && runs && runs.length > 0,
    initialData: []
  });

  const handleManualRun = async () => {
    if (!testCompanyId) {
      alert('Please enter a company ID');
      return;
    }

    setIsRunning(true);
    try {
      const response = await base44.functions.invoke('runWorkflowOrchestrator', {
        trigger_source: 'manual_test',
        trigger_event: 'manual_trigger',
        related_entity_type: 'Company',
        related_entity_id: testCompanyId,
        company_id: testCompanyId
      });

      if (response.data.success) {
        alert(`Workflow executed successfully. Created ${response.data.results?.[0]?.actions_created?.tasks || 0} tasks.`);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (orchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav currentPage="orchestrator" />
        <div className="p-8"><p>Loading...</p></div>
      </div>
    );
  }

  if (!orchestration) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav currentPage="orchestrator" />
        <div className="p-8"><p>Orchestration not found</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage="orchestrator" />
      
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href={createPageUrl('AdminOrchestrator')}>
                <ChevronLeft className="w-4 h-4" />
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{orchestration.orchestration_name}</h1>
              <p className="text-gray-600 mt-1">{orchestration.description}</p>
            </div>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Type</p>
                <Badge className="mt-2">{orchestration.orchestration_type}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Trigger</p>
                <p className="font-semibold text-gray-900 mt-2">{orchestration.trigger_event}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={`mt-2 ${orchestration.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {orchestration.status}
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Priority</p>
                <Badge className="mt-2">{orchestration.priority}</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Rules */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Rules ({rules.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {rules.length === 0 ? (
                    <p className="text-gray-500">No rules configured</p>
                  ) : (
                    <div className="space-y-4">
                      {rules.map(rule => (
                        <div key={rule.id} className="p-4 border rounded bg-gray-50">
                          <h4 className="font-semibold text-gray-900 mb-2">{rule.rule_name}</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-xs text-gray-600 font-semibold">When:</p>
                              <p className="text-gray-900">{rule.condition_logic}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 font-semibold">Then:</p>
                              <p className="text-gray-900">{rule.action_logic}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{rule.rule_category}</Badge>
                              <Badge variant="outline" className="text-xs">{rule.applies_to_entity}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Manual Test */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manual Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Company ID</label>
                    <Input 
                      placeholder="Enter company ID"
                      value={testCompanyId}
                      onChange={(e) => setTestCompanyId(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button 
                    onClick={handleManualRun}
                    disabled={isRunning || !testCompanyId}
                    className="w-full"
                  >
                    {isRunning ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Workflow
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-600">Test this orchestration with a specific company to debug and validate behavior.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Run History */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Run History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {runs.length === 0 ? (
                <p className="text-gray-500">No runs yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Trigger</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Actions</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map(run => (
                        <tr key={run.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">{run.trigger_event}</td>
                          <td className="py-3 px-3">
                            <Badge className={
                              run.run_status === 'completed' ? 'bg-green-100 text-green-800' :
                              run.run_status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {run.run_status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-600">{run.actions_created_count} created</td>
                          <td className="py-3 px-3 text-xs text-gray-600">
                            {new Date(run.started_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-600">{run.result_summary?.substring(0, 40)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Actions Created</CardTitle>
            </CardHeader>
            <CardContent>
              {actions.length === 0 ? (
                <p className="text-gray-500">No actions created yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Action Type</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Target</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-3 font-semibold text-gray-700">Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actions.map(action => (
                        <tr key={action.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium text-gray-900">{action.action_type}</td>
                          <td className="py-3 px-3 text-xs text-gray-600">{action.action_target_type}</td>
                          <td className="py-3 px-3">
                            <Badge className={
                              action.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {action.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs text-gray-600">{action.summary?.substring(0, 50)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}