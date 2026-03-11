import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminOptimizationCandidates() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: candidates = [] } = useQuery({
    queryKey: ['optimization-candidates-explorer'],
    queryFn: () => base44.entities.OptimizationCandidate?.list?.('-detected_at', 200).catch(() => []),
  });

  const categories = [
    'publishing_performance',
    'client_engagement',
    'sales_conversion',
    'onboarding_efficiency',
    'automation_reliability',
    'reseller_growth',
    'reporting_effectiveness',
    'workflow_throughput',
  ];

  const filtered = useMemo(() => {
    return candidates.filter(c => {
      const matchesCategory = selectedCategory === 'all' || c.optimization_category === selectedCategory;
      const matchesSearch = c.reason_detected?.toLowerCase().includes(search.toLowerCase()) ||
        c.candidate_key?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0));
  }, [candidates, search, selectedCategory]);

  const byStatus = useMemo(() => {
    return {
      detected: filtered.filter(c => c.status === 'detected').length,
      approved: filtered.filter(c => c.status === 'approved').length,
      running: filtered.filter(c => c.status === 'experiment_running').length,
      adopted: filtered.filter(c => c.status === 'adopted').length,
    };
  }, [filtered]);

  const riskColor = (level) => {
    const colors = {
      low: 'bg-emerald-950/20 border-emerald-700/50',
      medium: 'bg-yellow-950/20 border-yellow-700/50',
      high: 'bg-orange-950/20 border-orange-700/50',
      critical: 'bg-red-950/20 border-red-700/50',
    };
    return colors[level] || colors.low;
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
            <h1 className="text-3xl font-bold text-white">Candidate Explorer</h1>
            <p className="text-slate-400 text-sm">Optimization candidates awaiting evaluation</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-purple-950/20 border-purple-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-purple-400 mb-1">Detected</p>
              <p className="text-2xl font-bold text-purple-300">{byStatus.detected}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/20 border-blue-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-400 mb-1">Approved</p>
              <p className="text-2xl font-bold text-blue-300">{byStatus.approved}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-950/20 border-orange-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-orange-400 mb-1">Running</p>
              <p className="text-2xl font-bold text-orange-300">{byStatus.running}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Adopted</p>
              <p className="text-2xl font-bold text-emerald-300">{byStatus.adopted}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize text-xs"
              >
                {cat.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Candidates List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No candidates found
              </CardContent>
            </Card>
          ) : (
            filtered.map((cand, idx) => (
              <Card key={idx} className={`${riskColor(cand.risk_level)} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        <p className="font-semibold text-white capitalize">{cand.optimization_category.replace(/_/g, ' ')}</p>
                        <Badge className={cand.risk_level === 'low' ? 'bg-emerald-950 text-emerald-300' : cand.risk_level === 'medium' ? 'bg-yellow-950 text-yellow-300' : cand.risk_level === 'high' ? 'bg-orange-950 text-orange-300' : 'bg-red-950 text-red-300'}>
                          {cand.risk_level} risk
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{cand.reason_detected}</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-300 ml-4">{cand.confidence_score}%</p>
                  </div>

                  <div className="mb-3 p-2 bg-slate-900/50 rounded text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current:</span>
                      <span className="text-slate-300 font-mono">{cand.current_value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Proposed:</span>
                      <span className="text-emerald-400 font-mono">{cand.proposed_value}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">{cand.status}</Badge>
                    <Button size="xs" variant="outline">Run Experiment</Button>
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