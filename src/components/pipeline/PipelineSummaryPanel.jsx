import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { DollarSign, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PipelineSummaryPanel() {
  const { data: proposals = [] } = useQuery({
    queryKey: ['pipeline-summary'],
    queryFn: () => base44.entities.Proposal.list('-updated_date', 200),
    refetchInterval: 120000,
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks-summary'],
    queryFn: () => base44.entities.SalesTasks.filter({ status: 'pending' }, '-created_date', 200),
    refetchInterval: 120000,
  });

  const now = new Date();
  const activeProposals = proposals.filter(p => !['won', 'lost'].includes(p.pipeline_stage || 'lead'));
  const pipelineValue = activeProposals.reduce((s, p) => s + (p.estimated_value || 0), 0);
  const closingThisMonth = proposals.filter(p => {
    if (!p.next_follow_up_date) return false;
    const d = new Date(p.next_follow_up_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && !['won', 'lost'].includes(p.pipeline_stage);
  }).length;
  const tasksDueToday = tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === now.toDateString()).length;
  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < now).length;

  const metrics = [
    { label: 'Active Proposals', value: activeProposals.length, icon: FileText, color: 'text-violet-400' },
    { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400' },
    { label: 'Closing This Month', value: closingThisMonth, icon: CheckCircle, color: 'text-blue-400' },
    { label: 'Tasks Due Today', value: tasksDueToday, icon: Clock, color: 'text-amber-400' },
    { label: 'Overdue Tasks', value: overdueTasks, icon: AlertCircle, color: overdueTasks > 0 ? 'text-red-400' : 'text-slate-500' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Sales Pipeline</h3>
        <Link to={createPageUrl('ProposalPipeline')} className="text-xs text-violet-400 hover:text-violet-300">
          View →
        </Link>
      </div>
      <div className="space-y-2.5">
        {metrics.map(m => (
          <div key={m.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
              <span className="text-xs text-slate-400">{m.label}</span>
            </div>
            <span className={`text-xs font-bold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <Link to={createPageUrl('AdminTasks')} className="flex-1">
          <button className="w-full text-xs text-center py-1.5 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
            📋 Tasks
          </button>
        </Link>
        <Link to={createPageUrl('ProposalPipeline')} className="flex-1">
          <button className="w-full text-xs text-center py-1.5 rounded-md bg-violet-700 text-white hover:bg-violet-600 transition-colors">
            🎯 Pipeline
          </button>
        </Link>
      </div>
    </div>
  );
}