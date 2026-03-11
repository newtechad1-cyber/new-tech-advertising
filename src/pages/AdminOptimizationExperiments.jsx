import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, TestTube, Pause, Play } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminOptimizationExperiments() {
  const [search, setSearch] = useState('');

  const { data: experiments = [] } = useQuery({
    queryKey: ['optimization-experiments-registry'],
    queryFn: () => base44.entities.OptimizationExperiment?.list?.('-created_at', 100).catch(() => []),
  });

  const filtered = useMemo(() => {
    return experiments.filter(e =>
      e.experiment_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.experiment_key?.toLowerCase().includes(search.toLowerCase())
    );
  }, [experiments, search]);

  const byStatus = useMemo(() => {
    return {
      planned: filtered.filter(e => e.status === 'planned').length,
      running: filtered.filter(e => e.status === 'running').length,
      completed: filtered.filter(e => e.status === 'completed').length,
      failed: filtered.filter(e => e.status === 'failed' || e.status === 'rolled_back').length,
    };
  }, [filtered]);

  const statusColor = (status) => {
    const colors = {
      planned: 'bg-slate-800/30 border-slate-700',
      running: 'bg-blue-950/20 border-blue-700/50',
      completed: 'bg-emerald-950/20 border-emerald-700/50',
      paused: 'bg-yellow-950/20 border-yellow-700/50',
      rolled_back: 'bg-red-950/20 border-red-700/50',
      failed: 'bg-red-950/20 border-red-700/50',
    };
    return colors[status] || colors.planned;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <a href={createPageUrl('AdminOptimization')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Experiment Registry</h1>
            <p className="text-slate-400 text-sm">A/B tests and optimization experiments</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Planned</p>
              <p className="text-2xl font-bold text-slate-300">{byStatus.planned}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/20 border-blue-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-400 mb-1">Running</p>
              <p className="text-2xl font-bold text-blue-300">{byStatus.running}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-300">{byStatus.completed}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/20 border-red-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-red-400 mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-300">{byStatus.failed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Search experiments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Experiments List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No experiments found
              </CardContent>
            </Card>
          ) : (
            filtered.map((exp, idx) => (
              <Card key={idx} className={statusColor(exp.status)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white">{exp.experiment_name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-1">{exp.experiment_key}</p>
                    </div>
                    <Badge className={exp.status === 'running' ? 'bg-blue-950 text-blue-300' : exp.status === 'completed' ? 'bg-emerald-950 text-emerald-300' : exp.status === 'planned' ? 'bg-slate-700 text-slate-300' : 'bg-red-950 text-red-300'}>
                      {exp.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Category & Strategy */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 mb-1">Category</p>
                      <Badge variant="outline" className="capitalize">{exp.optimization_category.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Strategy</p>
                      <Badge variant="outline" className="capitalize">{exp.strategy_type.replace(/_/g, ' ')}</Badge>
                    </div>
                  </div>

                  {/* Timeline */}
                  {exp.start_date && exp.end_date && (
                    <div className="p-2 bg-slate-900/50 rounded border border-slate-700 text-xs">
                      <p className="text-slate-500 mb-1">Duration</p>
                      <p className="text-slate-400">
                        {new Date(exp.start_date).toLocaleDateString()} - {new Date(exp.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {exp.status === 'running' ? (
                      <Button size="xs" variant="outline" className="text-yellow-400">
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </Button>
                    ) : exp.status === 'planned' ? (
                      <Button size="xs" variant="outline" className="text-blue-400">
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}