import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ClientOnboardingWidget() {
  const [workroom, setWorkroom] = useState(null);
  const [nextTask, setNextTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const user = await base44.auth.me();
      if (user?.company_id) {
        const workrooms = await base44.entities.OnboardingWorkrooms.filter({
          company_id: user.company_id,
          status: { $nin: ['launched', 'paused'] },
        });

        if (workrooms.length > 0) {
          setWorkroom(workrooms[0]);

          // Find next pending visible task
          const tasks = await base44.entities.OnboardingTasks.filter({
            workroom_id: workrooms[0].id,
            visible_to_client: true,
            status: 'pending',
          });
          if (tasks.length > 0) {
            setNextTask(tasks[0]);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !workroom) return null;

  return (
    <Card className="p-6 bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200 border-2">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-slate-900">Onboarding in Progress</h3>
        <span className="text-2xl font-bold text-violet-600">{workroom.progress_percent || 0}%</span>
      </div>

      <div className="w-full bg-white rounded-full h-2 mb-4 border border-violet-200">
        <div
          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${workroom.progress_percent || 0}%` }}
        />
      </div>

      {nextTask && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-violet-100">
          <p className="text-sm text-slate-600 mb-1">Next Step:</p>
          <h4 className="font-semibold text-slate-900">{nextTask.task_title}</h4>
        </div>
      )}

      <Link to={createPageUrl('ClientOnboarding')}>
        <Button className="w-full bg-violet-600 hover:bg-violet-700">
          Go to Onboarding
        </Button>
      </Link>
    </Card>
  );
}