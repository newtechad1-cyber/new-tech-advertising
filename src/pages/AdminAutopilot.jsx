import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '@/components/auth/AdminGuard';
import AutopilotOverview from '@/components/autopilot/AutopilotOverview';
import JobsTable from '@/components/autopilot/JobsTable';
import RecentOutputs from '@/components/autopilot/RecentOutputs';
import FailuresPanel from '@/components/autopilot/FailuresPanel';
import ManualRunControls from '@/components/autopilot/ManualRunControls';
import { Zap } from 'lucide-react';

export default function AdminAutopilot() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Marketing Autopilot</h1>
              <p className="text-sm text-gray-500">Autonomous content generation & growth engine</p>
            </div>
          </div>

          <AutopilotOverview />

          <Tabs defaultValue="jobs" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="jobs">Scheduled Jobs</TabsTrigger>
              <TabsTrigger value="outputs">Recent Outputs</TabsTrigger>
              <TabsTrigger value="failures">Failures</TabsTrigger>
              <TabsTrigger value="manual">Manual Run</TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
              <JobsTable />
            </TabsContent>
            <TabsContent value="outputs">
              <RecentOutputs />
            </TabsContent>
            <TabsContent value="failures">
              <FailuresPanel />
            </TabsContent>
            <TabsContent value="manual">
              <ManualRunControls />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}