import React, { useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import EscalationCenter from '@/components/agents/EscalationCenter';
import TaskQueuePanel from '@/components/agents/TaskQueuePanel';

export default function AdminAgentsRecovery() {
  const { data: failedTasks = [] } = useQuery({
    queryKey: ['failed-tasks'],
    queryFn: () => base44.entities.AgentTask?.filter?.({ task_status: 'failed' }, '-created_at', 50).catch(() => []),
  });

  const { data: blockedTasks = [] } = useQuery({
    queryKey: ['blocked-tasks'],
    queryFn: () => base44.entities.AgentTask?.filter?.({ task_status: 'blocked' }, '-created_at', 50).catch(() => []),
  });

  const recoveryStats = {
    failed: failedTasks.length,
    blocked: blockedTasks.length,
  };

  return (
    <AdminNav currentPage="AdminAgentsRecovery">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Task Recovery Center</h1>
            <p className="text-slate-400 mt-1">Manage failed, blocked, and escalated work</p>
          </div>
        </div>

        {/* Recovery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-red-300">Failed Tasks</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{recoveryStats.failed}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-400 opacity-50" />
            </div>
          </div>

          <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-300">Blocked Tasks</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">{recoveryStats.blocked}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-orange-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Recovery Tabs */}
        <Tabs defaultValue="escalations" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="escalations">Escalations ({recoveryStats.failed + recoveryStats.blocked})</TabsTrigger>
            <TabsTrigger value="failed">Failed Tasks</TabsTrigger>
            <TabsTrigger value="blocked">Blocked Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="escalations">
            <EscalationCenter />
          </TabsContent>

          <TabsContent value="failed">
            <TaskQueuePanel statusFilter="failed" />
          </TabsContent>

          <TabsContent value="blocked">
            <TaskQueuePanel statusFilter="blocked" />
          </TabsContent>
        </Tabs>
      </div>
    </AdminNav>
  );
}