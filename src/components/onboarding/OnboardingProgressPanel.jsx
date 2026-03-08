import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OnboardingProgressPanel({ workroom, tasks, assets, forms }) {
  const requiredTasks = tasks.filter(t => t.required_for_launch);
  const completedRequired = requiredTasks.filter(t => t.status === 'completed' || t.status === 'approved');
  const blockedTasks = requiredTasks.filter(t => t.status === 'blocked');
  const missingAssets = assets.filter(a => a.status === 'missing');

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 mb-3">Progress: {workroom.progress_percent || 0}%</h3>
          <div className="w-full bg-white rounded-full h-3 border border-blue-200">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${workroom.progress_percent || 0}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-slate-700">{completedRequired.length} / {requiredTasks.length} tasks</span>
          </div>
          {blockedTasks.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-slate-700">{blockedTasks.length} blocked</span>
            </div>
          )}
          {missingAssets.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-slate-700">{missingAssets.length} missing assets</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}