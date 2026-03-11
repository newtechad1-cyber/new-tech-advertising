import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Activity, Pause, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AGENT_CATEGORIES = [
  'Content Creation',
  'Video Processing',
  'Publishing',
  'Reporting',
  'Sales',
  'Onboarding',
  'Client Success',
  'Reseller Operations',
  'School Media',
  'System Maintenance',
];

export default function AgentRegistry({ onSelectAgent }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: agents = [] } = useQuery({
    queryKey: ['agent-definitions'],
    queryFn: () => base44.entities.AgentDefinition?.list?.().catch(() => []),
  });

  const { data: healthSnapshots = {} } = useQuery({
    queryKey: ['agent-health-snapshots'],
    queryFn: async () => {
      const snapshots = await base44.entities.AgentHealthSnapshot?.list?.().catch(() => []);
      const map = {};
      snapshots.forEach(s => {
        if (!map[s.agent_key] || new Date(s.snapshot_time) > new Date(map[s.agent_key].snapshot_time)) {
          map[s.agent_key] = s;
        }
      });
      return map;
    },
  });

  const filteredAgents = selectedCategory
    ? agents.filter(a => a.agent_category === selectedCategory)
    : agents;

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={!selectedCategory ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(null)}
          className="text-xs"
        >
          All Agents
        </Button>
        {AGENT_CATEGORIES.map(cat => (
          <Button
            key={cat}
            size="sm"
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
            className="text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map(agent => {
          const health = healthSnapshots[agent.agent_key];
          const healthColor =
            health?.health_status === 'healthy' ? 'text-emerald-400' :
            health?.health_status === 'degraded' ? 'text-amber-400' :
            'text-red-400';

          return (
            <div
              key={agent.id}
              className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-slate-600 cursor-pointer transition-all"
              onClick={() => onSelectAgent?.(agent)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{agent.agent_name}</p>
                  <p className="text-xs text-slate-400">{agent.agent_category}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${agent.active ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              </div>

              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{agent.description}</p>

              {health && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Queued:</span>
                    <span className="text-white font-bold">{health.queued_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Running:</span>
                    <span className="text-white font-bold">{health.running_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Health:</span>
                    <span className={`font-bold ${healthColor}`}>{health.health_status}</span>
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-700 flex gap-2">
                <Button size="sm" variant="ghost" className="flex-1 text-xs">
                  {agent.active ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                  {agent.active ? 'Pause' : 'Resume'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}