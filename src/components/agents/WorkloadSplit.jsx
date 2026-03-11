import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkloadSplit({ tasks = [] }) {
  const workloadData = useMemo(() => {
    const categories = {
      'Publishing': 0,
      'Onboarding': 0,
      'Reporting': 0,
      'Content': 0,
      'Reseller Ops': 0,
      'Other': 0
    };

    tasks.forEach(task => {
      const type = task.task_type || '';
      if (type.includes('publish')) categories['Publishing']++;
      else if (type.includes('onboard')) categories['Onboarding']++;
      else if (type.includes('report')) categories['Reporting']++;
      else if (type.includes('content') || type.includes('transcript') || type.includes('caption') || type.includes('branding') || type.includes('render')) categories['Content']++;
      else if (type.includes('reseller')) categories['Reseller Ops']++;
      else categories['Other']++;
    });

    return Object.entries(categories)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name,
        value,
        percentage: tasks.length > 0 ? Math.round((value / tasks.length) * 100) : 0
      }));
  }, [tasks]);

  const colors = {
    'Publishing': '#3b82f6',
    'Onboarding': '#10b981',
    'Reporting': '#f59e0b',
    'Content': '#8b5cf6',
    'Reseller Ops': '#ec4899',
    'Other': '#6b7280'
  };

  const total = tasks.length;

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-200">Workload Distribution</CardTitle>
        <p className="text-xs text-slate-400 mt-1">{total} total tasks</p>
      </CardHeader>
      <CardContent>
        {workloadData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-500">
            <p>No tasks in queue</p>
          </div>
        ) : (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={workloadData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {workloadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[entry.name] || colors['Other']} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px'
                  }}
                  formatter={(value) => `${value} tasks`}
                  labelStyle={{ color: '#cbd5e1' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2">
              {workloadData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 rounded-lg p-2 border border-slate-800"
                  style={{ borderLeftColor: colors[item.name], borderLeftWidth: '3px' }}
                >
                  <p className="text-slate-400 text-xs">{item.name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-slate-100 font-bold text-sm">{item.value}</p>
                    <p className="text-slate-500 text-xs">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}