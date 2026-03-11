import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, Zap } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAutonomyStrategies() {
  const [search, setSearch] = useState('');

  const { data: strategies = [] } = useQuery({
    queryKey: ['autonomy-strategy-definitions'],
    queryFn: () => base44.entities.AutonomousStrategyDefinition?.list?.('strategy_key', 100).catch(() => []),
  });

  const filtered = useMemo(() => {
    return strategies.filter(s =>
      s.strategy_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.strategy_key?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [strategies, search]);

  const autonomyColor = (level) => {
    const colors = {
      fully_autonomous: 'bg-emerald-950 text-emerald-300',
      semi_autonomous: 'bg-blue-950 text-blue-300',
      approval_required: 'bg-yellow-950 text-yellow-300',
      high_risk_approval: 'bg-red-950 text-red-300',
    };
    return colors[level] || colors.approval_required;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild className="text-slate-400">
            <a href={createPageUrl('AdminAutonomy')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Strategy Registry</h1>
            <p className="text-slate-400 text-sm">Autonomous growth strategies with governance rules</p>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Search strategies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Strategies Grid */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No strategies found
              </CardContent>
            </Card>
          ) : (
            filtered.map((strategy, idx) => (
              <Card key={idx} className="bg-slate-800/30 border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white">{strategy.strategy_name}</CardTitle>
                      <p className="text-xs text-slate-500 mt-1">{strategy.strategy_key}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={autonomyColor(strategy.autonomy_level)}>
                        {strategy.autonomy_level.replace(/_/g, ' ')}
                      </Badge>
                      {strategy.active && (
                        <Badge className="bg-emerald-950 text-emerald-300">Active</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400">{strategy.description}</p>

                  {/* Category & Approval */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 mb-1">Category</p>
                      <Badge variant="outline" className="capitalize">{strategy.strategy_category}</Badge>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Approval Required</p>
                      <Badge variant="outline">
                        {strategy.approval_required ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>

                  {/* Safety Features */}
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-start gap-2 mb-3">
                      <Shield className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-400">Safety Features</p>
                        <ul className="text-xs text-slate-500 mt-2 space-y-1">
                          {strategy.tenant_safe && (
                            <li>✓ Tenant-safe execution</li>
                          )}
                          {strategy.cooldown_rules_json && (
                            <li>✓ Cooldown protection</li>
                          )}
                          {strategy.max_frequency_rules_json && (
                            <li>✓ Frequency limits enforced</li>
                          )}
                          {strategy.rollback_capable && (
                            <li>✓ Rollback capable</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Allowed Contexts */}
                  {strategy.allowed_contexts_json && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Allowed Contexts</p>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(strategy.allowed_contexts_json).map((ctx, i) => (
                          <Badge key={i} variant="outline" className="text-xs capitalize">
                            {ctx}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Version */}
                  {strategy.version && (
                    <p className="text-xs text-slate-500">v{strategy.version}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}