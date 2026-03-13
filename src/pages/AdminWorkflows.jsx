import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2, Activity, TrendingUp, Layers, Clock } from 'lucide-react';

export default function AdminWorkflows() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedWorkflow, setExpandedWorkflow] = useState(null);

  // Fetch workflows
  const { data: workflows, isLoading } = useQuery({
    queryKey: ['all-workflows'],
    queryFn: async () => {
      return await base44.entities.WorkflowDefinition.list('-workflowName', 100);
    }
  });

  if (isLoading) return <AdminLayout><div className="p-6 animate-pulse">Loading...</div></AdminLayout>;

  const activeWorkflows = workflows?.filter(w => w.activeStatus) || [];
  const workflowsByCategory = {};

  workflows?.forEach(workflow => {
    const category = workflow.workflowCategory || 'other';
    if (!workflowsByCategory[category]) workflowsByCategory[category] = [];
    workflowsByCategory[category].push(workflow);
  });

  const categories = Object.keys(workflowsByCategory).sort();

  const filteredWorkflows = selectedCategory === 'all'
    ? activeWorkflows
    : workflowsByCategory[selectedCategory]?.filter(w => w.activeStatus) || [];

  const getCategoryColor = (category) => {
    const colors = {
      onboarding: 'bg-blue-100 text-blue-800',
      marketing_execution: 'bg-purple-100 text-purple-800',
      lead_management: 'bg-green-100 text-green-800',
      sales_pipeline: 'bg-orange-100 text-orange-800',
      retention: 'bg-red-100 text-red-800',
      upgrade_conversion: 'bg-amber-100 text-amber-800',
      content_production: 'bg-pink-100 text-pink-800',
      team_operations: 'bg-slate-100 text-slate-800'
    };
    return colors[category] || 'bg-slate-100 text-slate-800';
  };

  const getTriggerIcon = (trigger) => {
    const icons = {
      'subscription_created': '🎯',
      'campaign_launched': '🚀',
      'lead_qualified': '✅',
      'retention_signal': '⚠️',
      'engagement_milestone': '⭐',
      'manual_trigger': '👤',
      'scheduled_weekly': '📅',
      'scheduled_daily': '⏰',
      'api_webhook': '🔗'
    };
    return icons[trigger] || '•';
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Global Workflows</h1>
          <p className="text-slate-600 mt-2">
            Master operational workflows and process orchestration
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Workflows</p>
                <p className="text-3xl font-bold mt-2">{workflows?.length || 0}</p>
              </div>
              <Layers className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active</p>
                <p className="text-3xl font-bold mt-2">{activeWorkflows.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Executions</p>
                <p className="text-3xl font-bold mt-2">
                  {workflows?.reduce((sum, w) => sum + (w.executionCount || 0), 0) || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Completion</p>
                <p className="text-3xl font-bold mt-2">
                  {Math.round(
                    workflows?.reduce((sum, w) => sum + (w.completionRate || 0), 0) / (workflows?.length || 1)
                  )}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="all">All Workflows</TabsTrigger>
            <TabsTrigger value="execution">Execution Stats</TabsTrigger>
            <TabsTrigger value="stages">Stage Details</TabsTrigger>
          </TabsList>

          {/* All Workflows */}
          <TabsContent value="all">
            <Card className="p-6 mb-6">
              <div className="flex gap-4 mb-6">
                <label className="text-sm font-medium">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredWorkflows.map(workflow => {
                  const stages = workflow.stages ? JSON.parse(workflow.stages) : [];
                  const isExpanded = expandedWorkflow === workflow.id;

                  return (
                    <div key={workflow.id} className="border rounded-lg">
                      <div
                        className="p-4 cursor-pointer hover:bg-slate-50"
                        onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{workflow.workflowName}</h3>
                              <Badge className={getCategoryColor(workflow.workflowCategory)}>
                                {workflow.workflowCategory.replace(/_/g, ' ')}
                              </Badge>
                              <span className="text-sm text-slate-600">
                                {getTriggerIcon(workflow.startTrigger)} {workflow.startTrigger.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{workflow.description}</p>
                            <div className="flex gap-4 text-xs text-slate-500">
                              <span>📊 {stages.length} stages</span>
                              <span>⏱️ {workflow.avgDurationDays || 0} days avg</span>
                              <span>🔄 {workflow.executionCount || 0} executions</span>
                              <span>✓ {workflow.completionRate || 0}% completion</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={workflow.activeStatus}
                              onCheckedChange={async () => {
                                await base44.entities.WorkflowDefinition.update(workflow.id, {
                                  activeStatus: !workflow.activeStatus
                                });
                              }}
                            />
                            <span className="text-sm font-medium">{workflow.activeStatus ? 'Active' : 'Inactive'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Stage Details */}
                      {isExpanded && (
                        <div className="bg-slate-50 border-t p-4">
                          <h4 className="font-semibold mb-3">Workflow Stages</h4>
                          <div className="space-y-3">
                            {stages.map((stage, idx) => (
                              <div key={stage.stageId} className="bg-white p-3 rounded border">
                                <div className="flex items-start gap-3">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex-shrink-0">
                                    {stage.order}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium">{stage.stageName}</p>
                                    <p className="text-xs text-slate-600 mt-0.5">{stage.description}</p>
                                    <div className="flex gap-2 mt-2">
                                      {stage.automationHook && (
                                        <Badge variant="outline" className="text-xs">
                                          🔗 {stage.automationHook}
                                        </Badge>
                                      )}
                                      {stage.expectedDurationDays > 0 && (
                                        <Badge variant="outline" className="text-xs">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {stage.expectedDurationDays}d
                                        </Badge>
                                      )}
                                      {stage.isParallel && (
                                        <Badge variant="outline" className="text-xs bg-purple-50">
                                          Parallel
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Related Entities & Agents */}
                          <div className="mt-4 pt-4 border-t">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium mb-1">Related Entities</p>
                                <div className="flex flex-wrap gap-1">
                                  {workflow.relatedEntities?.map((entity, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {entity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium mb-1">Related Agents</p>
                                <div className="flex flex-wrap gap-1">
                                  {workflow.relatedAgents?.map((agent, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-green-50">
                                      {agent}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Execution Stats */}
          <TabsContent value="execution">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Workflow</th>
                      <th className="px-4 py-3 text-right">Executions</th>
                      <th className="px-4 py-3 text-right">Completion Rate</th>
                      <th className="px-4 py-3 text-right">Avg Duration</th>
                      <th className="px-4 py-3 text-left">Last Executed</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows?.map(workflow => (
                      <tr key={workflow.id} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{workflow.workflowName}</td>
                        <td className="px-4 py-3 text-right">{workflow.executionCount || 0}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant="outline">{workflow.completionRate || 0}%</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">{workflow.avgDurationDays || 0} days</td>
                        <td className="px-4 py-3 text-xs">
                          {workflow.lastExecutedAt
                            ? new Date(workflow.lastExecutedAt).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="px-4 py-3">
                          {workflow.activeStatus ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Stage Details */}
          <TabsContent value="stages">
            <div className="space-y-4">
              {workflows?.map(workflow => {
                const stages = workflow.stages ? JSON.parse(workflow.stages) : [];
                return (
                  <Card key={workflow.id} className="p-6">
                    <h3 className="font-semibold mb-3">{workflow.workflowName}</h3>
                    <div className="relative pl-4">
                      {stages.map((stage, idx) => (
                        <div key={stage.stageId} className="pb-6 relative">
                          {idx < stages.length - 1 && (
                            <div className="absolute left-0 top-6 w-0.5 h-full bg-slate-200" />
                          )}
                          <div className="absolute -left-2 top-1 w-3 h-3 rounded-full bg-blue-500" />
                          <div className="ml-4">
                            <p className="font-medium">{stage.stageName}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{stage.description}</p>
                            {stage.automationHook && (
                              <p className="text-xs text-slate-500 mt-1">
                                🔗 Automation: {stage.automationHook}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}