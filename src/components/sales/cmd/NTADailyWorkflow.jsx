import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Target } from 'lucide-react';

export default function NTADailyWorkflow() {
  const [completedTasks, setCompletedTasks] = useState({});

  const workflow = [
    {
      period: 'Morning (9 AM - 11 AM)',
      icon: Clock,
      color: 'text-blue-600',
      tasks: [
        { id: 'm1', task: 'Follow up deal room prospects (no page views in 48h)', priority: 'high' },
        { id: 'm2', task: 'Confirm demo bookings for today', priority: 'high' },
        { id: 'm3', task: 'Review new opportunities from forms/referrals', priority: 'medium' }
      ]
    },
    {
      period: 'Midday (11 AM - 2 PM)',
      icon: Target,
      color: 'text-purple-600',
      tasks: [
        { id: 'd1', task: 'Run demos (follow demo storyline)', priority: 'high' },
        { id: 'd2', task: 'Qualify new leads (business type, pain, decision-maker)', priority: 'high' },
        { id: 'd3', task: 'Schedule strategy conversations', priority: 'medium' }
      ]
    },
    {
      period: 'Afternoon (2 PM - 4 PM)',
      icon: AlertCircle,
      color: 'text-orange-600',
      tasks: [
        { id: 'a1', task: 'Send strategy insights to prospects', priority: 'medium' },
        { id: 'a2', task: 'Push deal room activation (send custom links)', priority: 'high' },
        { id: 'a3', task: 'Answer objections from committed prospects', priority: 'high' }
      ]
    },
    {
      period: 'End of Day (4 PM - 5 PM)',
      icon: CheckCircle,
      color: 'text-green-600',
      tasks: [
        { id: 'e1', task: 'Update pipeline stages for all interactions', priority: 'high' },
        { id: 'e2', task: 'Flag at-risk deals (no progress in 2+ weeks)', priority: 'high' },
        { id: 'e3', task: 'Prep tomorrow\'s demo schedules', priority: 'medium' }
      ]
    }
  ];

  const toggleTask = (id) => {
    setCompletedTasks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Daily Sales Workflow</h2>
      <p className="text-slate-600 mb-6">Structured rhythm for consistent revenue generation.</p>

      <div className="space-y-6">
        {workflow.map((period, idx) => {
          const Icon = period.icon;
          return (
            <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 flex items-center gap-3">
                <Icon className={`${period.color} w-6 h-6`} />
                <h3 className="font-semibold text-slate-900">{period.period}</h3>
              </div>
              
              <div className="p-4 space-y-3">
                {period.tasks.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleTask(item.id)}
                    className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-colors ${
                      completedTasks[item.id]
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-white border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      completedTasks[item.id]
                        ? 'bg-green-600 border-green-600'
                        : 'border-slate-300'
                    }`}>
                      {completedTasks[item.id] && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        completedTasks[item.id] ? 'text-green-900 line-through' : 'text-slate-900'
                      }`}>
                        {item.task}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Priority: <span className={
                          item.priority === 'high'
                            ? 'text-red-600 font-semibold'
                            : 'text-orange-600 font-semibold'
                        }>{item.priority.toUpperCase()}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Rep Discipline:</strong> This workflow ensures intentional prospect movement every single day. No scattered conversations.
        </p>
      </div>
    </div>
  );
}