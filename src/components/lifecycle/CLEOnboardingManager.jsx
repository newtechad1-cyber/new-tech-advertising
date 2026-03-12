import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, Zap, ChevronDown, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = [
  { key: 'brand_assets', label: 'Brand Asset Collection', color: 'text-violet-300', icon: '🎨' },
  { key: 'login_integrations', label: 'Login Integrations', color: 'text-blue-300', icon: '🔗' },
  { key: 'content_voice', label: 'Content Voice Setup', color: 'text-cyan-300', icon: '✍️' },
  { key: 'video_style', label: 'Video Style Selection', color: 'text-emerald-300', icon: '🎬' },
  { key: 'market_targeting', label: 'Market Targeting Config', color: 'text-amber-300', icon: '🎯' },
];

const STATUS_CONFIG = {
  completed: { badge: 'bg-emerald-950 text-emerald-300', icon: CheckCircle2, iconColor: 'text-emerald-400' },
  in_progress: { badge: 'bg-blue-950 text-blue-300', icon: Clock, iconColor: 'text-blue-400' },
  pending: { badge: 'bg-slate-700 text-slate-400', icon: Clock, iconColor: 'text-slate-500' },
  overdue: { badge: 'bg-red-950 text-red-300', icon: AlertCircle, iconColor: 'text-red-400' },
};

const ProgressBar = ({ value, color = 'bg-emerald-500' }) => (
  <div className="h-1.5 bg-slate-700 rounded-full">
    <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
  </div>
);

export default function CLEOnboardingManager({ tasks = [], clients = [], onRefresh }) {
  const [expanded, setExpanded] = useState({});
  const [generating, setGenerating] = useState(false);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = tasks.filter(t => t.category === cat.key);
    return acc;
  }, {});

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const avgDays = clients.length > 0
    ? Math.round(clients.reduce((s, c) => s + (c.days_in_stage || 0), 0) / clients.length)
    : 14;

  const handleAutoGenerate = async () => {
    setGenerating(true);
    const onboardingClients = clients.filter(c => c.stage === 'onboarding_initiated').slice(0, 3);
    const defaultTasks = [
      { category: 'brand_assets', task_name: 'Upload logo & brand colors', status: 'pending' },
      { category: 'brand_assets', task_name: 'Submit hero photo assets', status: 'pending' },
      { category: 'login_integrations', task_name: 'Connect Google Business Profile', status: 'pending' },
      { category: 'login_integrations', task_name: 'Authorize Meta ad account', status: 'pending' },
      { category: 'content_voice', task_name: 'Complete brand voice questionnaire', status: 'pending' },
      { category: 'video_style', task_name: 'Select video template style', status: 'pending' },
      { category: 'market_targeting', task_name: 'Define target zip codes', status: 'pending' },
      { category: 'market_targeting', task_name: 'Confirm primary service areas', status: 'pending' },
    ];
    for (const client of onboardingClients) {
      for (const task of defaultTasks) {
        await base44.entities.OnboardingTask.create({ ...task, client_name: client.company_name, auto_triggered: true }).catch(() => {});
      }
    }
    setGenerating(false);
    onRefresh?.();
  };

  const tasksByClient = tasks.reduce((acc, t) => {
    if (!acc[t.client_name]) acc[t.client_name] = [];
    acc[t.client_name].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Onboarding Automation Manager</h2>
        <Button size="sm" className="bg-emerald-700 hover:bg-emerald-600 text-xs gap-1" onClick={handleAutoGenerate} disabled={generating}>
          <Zap className="w-3 h-3" /> {generating ? 'Generating...' : 'Auto-Generate Task Plan'}
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Tasks', value: totalTasks || 48, color: 'text-white' },
          { label: 'Completed', value: completedTasks || 31, color: 'text-emerald-300' },
          { label: 'Overdue', value: overdueTasks || 5, color: 'text-red-300' },
          { label: 'Avg Duration', value: `${avgDays}d`, color: 'text-amber-300' },
        ].map(s => (
          <Card key={s.label} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall progress */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-300">Overall Onboarding Completion</p>
            <span className="text-sm font-bold text-emerald-300">{overallPct}%</span>
          </div>
          <ProgressBar value={overallPct} />
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const catTasks = grouped[cat.key] || [];
          const done = catTasks.filter(t => t.status === 'completed').length;
          const pct = catTasks.length > 0 ? Math.round((done / catTasks.length) * 100) : 0;
          const hasOverdue = catTasks.some(t => t.status === 'overdue');
          return (
            <Card key={cat.key} className={`bg-slate-800/50 border-slate-700 ${hasOverdue ? 'border-red-700/40' : ''}`}>
              <CardContent className="p-3">
                <div className="text-xl mb-1">{cat.icon}</div>
                <p className={`text-xs font-semibold ${cat.color} leading-tight mb-1`}>{cat.label}</p>
                <p className="text-[10px] text-slate-500">{done}/{catTasks.length || '—'} complete</p>
                {hasOverdue && <Badge className="text-[9px] px-1 mt-1 bg-red-950 text-red-300">Overdue</Badge>}
                <ProgressBar value={pct} color={hasOverdue ? 'bg-red-500' : 'bg-emerald-500'} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Client task lists */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-xs text-slate-400 uppercase tracking-wider">Client Task Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {Object.entries(tasksByClient).length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-6">No tasks yet — use Auto-Generate above to create task plans</p>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {Object.entries(tasksByClient).slice(0, 8).map(([clientName, clientTasks]) => {
                const isOpen = expanded[clientName];
                const done = clientTasks.filter(t => t.status === 'completed').length;
                const pct = Math.round((done / clientTasks.length) * 100);
                return (
                  <div key={clientName}>
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/30 transition-colors text-left"
                      onClick={() => setExpanded(e => ({ ...e, [clientName]: !e[clientName] }))}>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-white">{clientName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 h-1 bg-slate-700 rounded-full">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-500">{done}/{clientTasks.length}</span>
                        </div>
                      </div>
                      {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-3 space-y-1.5">
                        {clientTasks.map((task, i) => {
                          const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                          const StatusIcon = cfg.icon;
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <StatusIcon className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.iconColor}`} />
                              <span className="text-xs text-slate-300 flex-1">{task.task_name}</span>
                              <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{task.status}</Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}