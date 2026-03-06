import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Eye, Zap, Clock, DollarSign, AlertTriangle } from 'lucide-react';

const CATEGORY_COLORS = {
  lead_pipeline: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  onboarding: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  content_strategy: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  content_production: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  scheduling_publishing: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  reporting_insights: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  billing_retention: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const CATEGORY_LABELS = {
  lead_pipeline: 'Lead Pipeline',
  onboarding: 'Onboarding',
  content_strategy: 'Content Strategy',
  content_production: 'Content Production',
  scheduling_publishing: 'Scheduling & Publishing',
  reporting_insights: 'Reporting & Insights',
  billing_retention: 'Billing & Retention',
};

export default function AgentCard({ agent, onToggle, onEdit }) {
  const categoryColor = CATEGORY_COLORS[agent.category] || 'bg-slate-700 text-slate-300 border-slate-600';

  return (
    <div className={`bg-slate-900 border rounded-xl p-4 transition-all ${agent.is_enabled ? 'border-slate-700 hover:border-slate-500' : 'border-slate-800 opacity-60'}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColor}`}>
              {CATEGORY_LABELS[agent.category] || agent.category}
            </span>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
              Phase {agent.phase}
            </span>
            {agent.requires_human_review && (
              <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Eye className="w-3 h-3" /> Human Review
              </span>
            )}
          </div>
          <h4 className="text-white font-semibold text-sm truncate">{agent.name}</h4>
          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{agent.description}</p>
        </div>
        <Switch
          checked={!!agent.is_enabled}
          onCheckedChange={(val) => onToggle(agent, val)}
          className="flex-shrink-0 mt-0.5"
        />
      </div>

      {agent.trigger_event && (
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3 h-3 text-yellow-400 flex-shrink-0" />
          <span className="text-xs text-slate-400 font-mono truncate">{agent.trigger_event}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        {agent.input_entities?.length > 0 && (
          <div>
            <p className="text-slate-500 mb-1">Reads</p>
            <div className="flex flex-wrap gap-1">
              {agent.input_entities.map(e => (
                <span key={e} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">{e}</span>
              ))}
            </div>
          </div>
        )}
        {agent.output_entities?.length > 0 && (
          <div>
            <p className="text-slate-500 mb-1">Writes</p>
            <div className="flex flex-wrap gap-1">
              {agent.output_entities.map(e => (
                <span key={e} className="bg-slate-800 text-violet-300 px-1.5 py-0.5 rounded text-[10px]">{e}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {agent.total_runs > 0 && (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />{agent.total_runs} runs
            </span>
          )}
          {agent.total_failures > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="w-3 h-3" />{agent.total_failures} failed
            </span>
          )}
          {agent.estimated_cost_usd && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />~${agent.estimated_cost_usd}/run
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(agent)}
          className="text-slate-400 hover:text-white text-xs h-7 px-2"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}