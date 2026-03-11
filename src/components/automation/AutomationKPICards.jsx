import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Zap, TrendingUp, Eye, AlertTriangle, Clock } from 'lucide-react';

export default function AutomationKPICards({ rules = [], triggers = [], executions = [], health = [] }) {
  const activeRules = rules.filter(r => r.active).length;
  const failedExecutions = executions.filter(e => e.execution_status === 'failed').length;
  const duplicateRisks = health.filter(h => h.duplicate_fire_risk_score > 70).length;
  const escalations = executions.filter(e => e.escalated).length;

  const metrics = [
    { label: 'Active Rules', value: activeRules, icon: Zap, color: 'emerald' },
    { label: 'Triggers', value: triggers.filter(t => t.active).length, icon: TrendingUp, color: 'blue' },
    { label: 'Failed Executions', value: failedExecutions, icon: AlertCircle, color: 'red' },
    { label: 'Duplicate Risks', value: duplicateRisks, icon: AlertTriangle, color: 'orange' },
    { label: 'Escalations', value: escalations, icon: Clock, color: 'amber' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        const colorMap = {
          emerald: 'bg-emerald-950/50 border-emerald-700 text-emerald-400',
          blue: 'bg-blue-950/50 border-blue-700 text-blue-400',
          red: 'bg-red-950/50 border-red-700 text-red-400',
          orange: 'bg-orange-950/50 border-orange-700 text-orange-400',
          amber: 'bg-amber-950/50 border-amber-700 text-amber-400',
        };
        
        return (
          <Card key={idx} className={`border ${colorMap[metric.color]}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
                </div>
                <Icon className="w-8 h-8 opacity-50" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}