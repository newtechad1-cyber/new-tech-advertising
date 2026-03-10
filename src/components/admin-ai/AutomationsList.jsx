import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const AUTOMATIONS = [
  {
    name: 'Auto-Generate Content on New Topic',
    function: 'onContentTopicCreated',
    triggerType: 'Entity: ContentTopics.create',
    status: 'active',
    lastRun: null,
  },
  {
    name: 'School Story Content Auto-Generation',
    function: 'generateSchoolStoryContent',
    triggerType: 'Manual / Submission Review',
    status: 'active',
    lastRun: null,
  },
  {
    name: 'AI Moderation on Submission',
    function: 'moderateSchoolSubmission',
    triggerType: 'Entity: SchoolSubmissions.create',
    status: 'active',
    lastRun: null,
  },
  {
    name: 'QA: Auto-Create Issue on Test Failure',
    function: 'qaAutomations',
    triggerType: 'Entity: QATestRuns.create/update',
    status: 'active',
    lastRun: null,
  },
  {
    name: 'Hourly System Health Check',
    function: 'runSystemHealthCheck',
    triggerType: 'Scheduled: Every 1 hour',
    status: 'active',
    lastRun: 'Mar 10, 2:45 PM',
  },
  {
    name: 'Daily Executive Copilot Brief',
    function: 'generateExecutiveCopilotBrief',
    triggerType: 'Scheduled: Daily @7am CT',
    status: 'active',
    lastRun: 'Mar 10, 7:00 AM',
  },
  {
    name: 'Weekly Authority Planner',
    function: 'authorityPlanner',
    triggerType: 'Scheduled: Weekly (testing)',
    status: 'active',
    lastRun: null,
  },
  {
    name: 'Monthly Report Generator',
    function: 'monthlyReportGenerator',
    triggerType: 'Scheduled: 1st of month @6am CT',
    status: 'active',
    lastRun: null,
  },
  {
    name: 'Fulfillment Workroom Monitor',
    function: 'fulfillmentMonitor',
    triggerType: 'Scheduled: Every 4 hours',
    status: 'active',
    lastRun: 'Mar 10, 2:32 PM',
  },
];

export default function AutomationsList() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-3">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-blue-800 font-semibold">{AUTOMATIONS.length} Active Automations</p>
          <p className="text-blue-600 text-sm mt-1">
            These automations run on schedule or when triggered by entity changes.
          </p>
        </CardContent>
      </Card>

      {AUTOMATIONS.map((auto, idx) => (
        <Card key={idx}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{auto.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Function: {auto.function}</p>
                <p className="text-xs text-gray-500 mt-1">Trigger: {auto.triggerType}</p>
              </div>
              <Badge className="bg-green-100 text-green-800">{auto.status}</Badge>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
              {auto.lastRun ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Last run: {auto.lastRun}
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-gray-400" />
                  No recent runs
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}