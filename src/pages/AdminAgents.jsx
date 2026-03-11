import React, { useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Activity, Zap, Clock, AlertTriangle, Lock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AgentRegistry from '@/components/agents/AgentRegistry';
import TaskQueuePanel from '@/components/agents/TaskQueuePanel';
import EscalationCenter from '@/components/agents/EscalationCenter';
import AgentHealthScoreCard from '@/components/agents/AgentHealthScoreCard';
import NextBestOpsAction from '@/components/agents/NextBestOpsAction';
import WorkloadSplit from '@/components/agents/WorkloadSplit';
import TaskDetailDrilldown from '@/components/agents/TaskDetailDrilldown';
import OperationalWarnings from '@/components/agents/OperationalWarnings';

export default function AdminAgents() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const { data: agents = [] } = useQuery({
    queryKey: ['agent-definitions'],
    queryFn: () => base44.entities.AgentDefinition?.list?.().catch(() => []),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['agent-tasks-all'],
    queryFn: () => base44.entities.AgentTask?.list?.().catch(() => []),
  });

  const { data: escalations = [] } = useQuery({
    queryKey: ['agent-escalations-all'],
    queryFn: () => base44.entities.AgentEscalation?.list?.().catch(() => []),
  });

  const { data: runs = [] } = useQuery({
    queryKey: ['workflow-runs-today'],
    queryFn: async () => {
      const allRuns = await base44.entities.AgentWorkflowRun?.list?.().catch(() => []);
      const today = new Date().toDateString();
      return allRuns.filter(r => new Date(r.created_at).toDateString() === today);
    },
  });

  const { data: snapshots = [] } = useQuery({
    queryKey: ['agent-health-snapshots'],
    queryFn: () => base44.entities.AgentHealthSnapshot?.list?.().catch(() => []),
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['agent-task-logs'],
    queryFn: () => base44.entities.AgentTaskLog?.list?.('-created_at', 100).catch(() => []),
  });

  // KPI Calculations
  const activeAgents = agents.filter(a => a.active).length;
  const tasksRunning = tasks.filter(t => t.task_status === 'running').length;
  const tasksQueued = tasks.filter(t => t.task_status === 'queued').length;
  const tasksFailed = tasks.filter(t => t.task_status === 'failed').length;
  const tasksBlocked = tasks.filter(t => t.task_status === 'blocked').length;
  const escalationsOpen = escalations.filter(e => e.status === 'open').length;
  const workflowsCompleted = runs.filter(r => r.run_status === 'completed').length;

  const kpis = [
    { label: 'Active Agents', value: activeAgents, icon: Activity, color: 'emerald' },
    { label: 'Tasks Running', value: tasksRunning, icon: Zap, color: 'blue' },
    { label: 'Tasks Queued', value: tasksQueued, icon: Clock, color: 'amber' },
    { label: 'Failed Today', value: tasksFailed, icon: AlertTriangle, color: 'red' },
    { label: 'Blocked Tasks', value: tasksBlocked, icon: Lock, color: 'orange' },
    { label: 'Open Escalations', value: escalationsOpen, icon: AlertTriangle, color: 'red' },
    { label: 'Workflows Complete', value: workflowsCompleted, icon: TrendingUp, color: 'emerald' },
  ];

  return (
    <AdminNav currentPage="AdminAgents">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">AI Agent Workforce</h1>
            <p className="text-slate-400 mt-1">Central orchestration and task management</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            const colors = {
              emerald: 'bg-emerald-900/20 border-emerald-700 text-emerald-400',
              blue: 'bg-blue-900/20 border-blue-700 text-blue-400',
              amber: 'bg-amber-900/20 border-amber-700 text-amber-400',
              red: 'bg-red-900/20 border-red-700 text-red-400',
              orange: 'bg-orange-900/20 border-orange-700 text-orange-400',
            };

            return (
              <div key={idx} className={`border rounded-lg p-4 ${colors[kpi.color]}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold opacity-70">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  </div>
                  <Icon className="w-5 h-5 opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registry">Agent Registry</TabsTrigger>
            <TabsTrigger value="running">Running Tasks</TabsTrigger>
            <TabsTrigger value="queued">Queued Tasks</TabsTrigger>
            <TabsTrigger value="escalations">Escalations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent Health */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Agent Health Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Agents:</span>
                    <span className="font-bold text-white">{agents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active:</span>
                    <span className="font-bold text-emerald-400">{activeAgents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Inactive:</span>
                    <span className="font-bold text-slate-400">{agents.length - activeAgents}</span>
                  </div>
                </div>
              </div>

              {/* Task Summary */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Task Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Tasks:</span>
                    <span className="font-bold text-white">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completion Rate:</span>
                    <span className="font-bold text-emerald-400">
                      {Math.round((tasks.filter(t => t.task_status === 'completed').length / tasks.length) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Completion Time:</span>
                    <span className="font-bold text-white">~12 min</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="registry">
            <AgentRegistry />
          </TabsContent>

          <TabsContent value="running">
            <TaskQueuePanel statusFilter="running" />
          </TabsContent>

          <TabsContent value="queued">
            <TaskQueuePanel statusFilter="queued" />
          </TabsContent>

          <TabsContent value="escalations">
            <EscalationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </AdminNav>
  );
}