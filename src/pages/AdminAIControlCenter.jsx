import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/admin/AdminLayout';
import AIOverviewCards from '@/components/admin-ai/AIOverviewCards';
import ManualRunCenter from '@/components/admin-ai/ManualRunCenter';
import AIJobQueue from '@/components/admin-ai/AIJobQueue';
import FailedJobs from '@/components/admin-ai/FailedJobs';
import AutomationsList from '@/components/admin-ai/AutomationsList';
import OutputsAwaitingReview from '@/components/admin-ai/OutputsAwaitingReview';
import { Activity, Play, Zap, AlertTriangle, Cog, CheckCircle } from 'lucide-react';

export default function AdminAIControlCenter() {
  const [activeTab, setActiveTab] = useState('overview');

  const content = (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Control Center</h1>
        <p className="text-gray-600 mt-2">Monitor, launch, and manage all AI functions and automations across NTA.</p>
      </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border shadow-sm rounded-lg p-1">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <Play className="w-4 h-4" />
              Manual Run
            </TabsTrigger>
            <TabsTrigger value="queue" className="gap-2">
              <Zap className="w-4 h-4" />
              Job Queue
            </TabsTrigger>
            <TabsTrigger value="failed" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Failed
            </TabsTrigger>
            <TabsTrigger value="automations" className="gap-2">
              <Cog className="w-4 h-4" />
              Automations
            </TabsTrigger>
            <TabsTrigger value="outputs" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Outputs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <AIOverviewCards />
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  All systems operational
                </p>
                <p className="text-gray-600">Last health check: 2 minutes ago</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Run Tab */}
          <TabsContent value="manual">
            <ManualRunCenter />
          </TabsContent>

          {/* Job Queue Tab */}
          <TabsContent value="queue">
            <AIJobQueue />
          </TabsContent>

          {/* Failed Jobs Tab */}
          <TabsContent value="failed">
            <FailedJobs />
          </TabsContent>

          {/* Automations Tab */}
          <TabsContent value="automations">
            <AutomationsList />
          </TabsContent>

          {/* Outputs Tab */}
          <TabsContent value="outputs">
            <OutputsAwaitingReview />
          </TabsContent>
        </Tabs>
    </div>
  );

  return <AdminLayout currentPageName="AdminAIControlCenter">{content}</AdminLayout>;
}