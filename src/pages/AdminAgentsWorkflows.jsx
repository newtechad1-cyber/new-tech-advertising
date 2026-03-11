import React from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkflowRegistry from '@/components/agents/WorkflowRegistry';

export default function AdminAgentsWorkflows() {
  return (
    <AdminNav currentPage="AdminAgentsWorkflows">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Workflow Registry</h1>
            <p className="text-slate-400 mt-1">Registered automation workflows across all operations</p>
          </div>
        </div>

        {/* Workflow Categories */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="all">All Workflows</TabsTrigger>
            <TabsTrigger value="content">Content Creation</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <WorkflowRegistry />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <WorkflowRegistry />
          </TabsContent>

          <TabsContent value="publishing" className="space-y-4">
            <WorkflowRegistry />
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-4">
            <WorkflowRegistry />
          </TabsContent>

          <TabsContent value="reporting" className="space-y-4">
            <WorkflowRegistry />
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <WorkflowRegistry />
          </TabsContent>
        </Tabs>
      </div>
    </AdminNav>
  );
}