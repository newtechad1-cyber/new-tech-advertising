import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminOptimizationPolicies() {
  const [search, setSearch] = useState('');

  const { data: policies = [] } = useQuery({
    queryKey: ['optimization-policies'],
    queryFn: () => base44.entities.OptimizationPolicy?.list?.('policy_key', 100).catch(() => []),
  });

  const filtered = useMemo(() => {
    return policies.filter(p =>
      p.policy_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.policy_key?.toLowerCase().includes(search.toLowerCase())
    );
  }, [policies, search]);

  const autonomyColor = (level) => {
    const colors = {
      recommend_only: 'bg-slate-950 text-slate-300',
      low_risk_auto_apply: 'bg-emerald-950 text-emerald-300',
      approval_required: 'bg-yellow-950 text-yellow-300',
      protected_never_auto: 'bg-red-950 text-red-300',
    };
    return colors[level] || colors.recommend_only;
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
            <h1 className="text-3xl font-bold text-white">Optimization Policies</h1>
            <p className="text-slate-400 text-sm">Governance rules for self-optimization system</p>
          </div>
        </div>

        {/* Policy Summary */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Total Policies</p>
              <p className="text-2xl font-bold text-slate-300">{policies.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/30 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Active</p>
              <p className="text-2xl font-bold text-slate-300">{policies.filter(p => p.active).length}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Auto-Apply</p>
              <p className="text-2xl font-bold text-emerald-300">{policies.filter(p => p.allowed_auto_apply === 'low_risk_auto_apply').length}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/20 border-red-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-red-400 mb-1">Protected</p>
              <p className="text-2xl font-bold text-red-300">{policies.filter(p => p.allowed_auto_apply === 'protected_never_auto').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Search policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Policies Grid */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No policies found
              </CardContent>
            </Card>
          ) : (
            filtered.map((policy, idx) => (
              <Card key={idx} className="bg-slate-800/30 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{policy.policy_name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-1">{policy.policy_key}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={autonomyColor(policy.allowed_auto_apply)}>
                        {policy.allowed_auto_apply.replace(/_/g, ' ')}
                      </Badge>
                      {policy.active && (
                        <Badge className="bg-emerald-950 text-emerald-300">Active</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Category */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 mb-1">Category</p>
                      <Badge variant="outline" className="capitalize">{policy.optimization_category.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Change Frequency</p>
                      <Badge variant="outline">{policy.max_change_frequency || 'Unrestricted'}</Badge>
                    </div>
                  </div>

                  {/* Thresholds */}
                  {policy.approval_threshold && (
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 mb-2">Approval Threshold</p>
                      <p className="text-sm font-mono text-slate-300">{policy.approval_threshold}% confidence</p>
                    </div>
                  )}

                  {/* Rollback Rules */}
                  {policy.rollback_rules_json && (
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 mb-1">Rollback Rules</p>
                          <p className="text-xs text-slate-500">{policy.rollback_rules_json}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Protected Targets */}
                  {policy.protected_targets_json && (
                    <div className="p-3 bg-red-950/20 rounded-lg border border-red-700/30">
                      <div className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-red-400 mb-1">Protected Targets</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {JSON.parse(policy.protected_targets_json).map((target, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-red-950 text-red-300 border-red-700/50">
                                {target}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Policy Levels Explanation */}
        <Card className="bg-blue-950/10 border-blue-700/20">
          <CardHeader>
            <CardTitle className="text-blue-300">Policy Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-300">
            <div><span className="text-blue-400">recommend_only</span> - Only recommendations, no auto-apply</div>
            <div><span className="text-emerald-400">low_risk_auto_apply</span> - Can auto-apply low-risk optimizations</div>
            <div><span className="text-yellow-400">approval_required</span> - Requires approval before applying</div>
            <div><span className="text-red-400">protected_never_auto</span> - Critical targets, manual only</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}