import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function AdminAutonomyGovernance() {
  const [search, setSearch] = useState('');

  const { data: governance = [] } = useQuery({
    queryKey: ['autonomy-governance-logs'],
    queryFn: () => base44.entities.AutonomousGovernanceLog?.list?.('-created_at', 200).catch(() => []),
  });

  const stats = useMemo(() => {
    return {
      approved: governance.filter(g => g.governance_decision === 'approved').length,
      blocked: governance.filter(g => g.governance_decision === 'blocked').length,
      autoExecuted: governance.filter(g => g.governance_decision === 'auto_executed').length,
      requiresApproval: governance.filter(g => g.governance_decision === 'requires_approval').length,
      escalated: governance.filter(g => g.governance_decision === 'escalated').length,
      overrides: governance.filter(g => g.governance_decision === 'override').length,
    };
  }, [governance]);

  const filtered = useMemo(() => {
    return governance.filter(g =>
      g.action_id?.toLowerCase().includes(search.toLowerCase()) ||
      g.governance_decision?.toLowerCase().includes(search.toLowerCase()) ||
      g.blocked_reason?.toLowerCase().includes(search.toLowerCase())
    );
  }, [governance, search]);

  const decisionColor = (decision) => {
    const colors = {
      approved: 'bg-emerald-950/20 border-emerald-700/50 text-emerald-300',
      blocked: 'bg-red-950/20 border-red-700/50 text-red-300',
      auto_executed: 'bg-blue-950/20 border-blue-700/50 text-blue-300',
      requires_approval: 'bg-yellow-950/20 border-yellow-700/50 text-yellow-300',
      escalated: 'bg-orange-950/20 border-orange-700/50 text-orange-300',
      override: 'bg-purple-950/20 border-purple-700/50 text-purple-300',
    };
    return colors[decision] || colors.approved;
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
            <h1 className="text-3xl font-bold text-white">Governance Log</h1>
            <p className="text-slate-400 text-sm">Autonomous action governance decisions and safeguards</p>
          </div>
        </div>

        {/* Governance Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <Card className="bg-emerald-950/20 border-emerald-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-emerald-400 mb-1">Approved</p>
              <p className="text-xl font-bold text-emerald-300">{stats.approved}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-950/20 border-red-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-red-400 mb-1">Blocked</p>
              <p className="text-xl font-bold text-red-300">{stats.blocked}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-950/20 border-blue-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-400 mb-1">Auto-Executed</p>
              <p className="text-xl font-bold text-blue-300">{stats.autoExecuted}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-950/20 border-yellow-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-yellow-400 mb-1">Needs Approval</p>
              <p className="text-xl font-bold text-yellow-300">{stats.requiresApproval}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-950/20 border-orange-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-orange-400 mb-1">Escalated</p>
              <p className="text-xl font-bold text-orange-300">{stats.escalated}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-950/20 border-purple-700/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-purple-400 mb-1">Overrides</p>
              <p className="text-xl font-bold text-purple-300">{stats.overrides}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Input
          placeholder="Search governance decisions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 border-slate-700"
        />

        {/* Governance Log */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-6 text-center text-slate-400">
                No governance decisions
              </CardContent>
            </Card>
          ) : (
            filtered.map((entry, idx) => (
              <Card key={idx} className={`${decisionColor(entry.governance_decision)} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {entry.governance_decision === 'blocked' ? (
                        <Lock className="w-5 h-5 text-red-400" />
                      ) : entry.governance_decision === 'approved' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Shield className="w-5 h-5 text-blue-400" />
                      )}
                      <div>
                        <p className="font-semibold text-white capitalize">{entry.governance_decision}</p>
                        <p className="text-xs text-slate-400 mt-1">{entry.action_id}</p>
                      </div>
                    </div>
                    <Badge className="text-xs">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </Badge>
                  </div>

                  {/* Governance Details */}
                  <div className="space-y-2 mb-3 p-3 bg-slate-900/50 rounded border border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Decision Reason</p>
                      <p className="text-sm text-slate-300">{entry.decision_reason}</p>
                    </div>

                    {entry.blocked_reason && (
                      <div>
                        <p className="text-xs text-red-400 mb-1">Block Reason</p>
                        <p className="text-sm text-slate-300">{entry.blocked_reason}</p>
                      </div>
                    )}

                    {entry.blocked_by_rule && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Triggered By</p>
                        <p className="text-sm font-mono text-slate-400">{entry.blocked_by_rule}</p>
                      </div>
                    )}
                  </div>

                  {/* Verification Checks */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className={`flex items-center gap-1 ${entry.tenant_isolation_verified ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <span>✓</span> Tenant verified
                    </div>
                    <div className={`flex items-center gap-1 ${entry.cooldown_checked ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <span>✓</span> Cooldown checked
                    </div>
                    <div className={`flex items-center gap-1 ${entry.frequency_checked ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <span>✓</span> Frequency checked
                    </div>
                  </div>

                  {/* Override Info */}
                  {entry.override_role && (
                    <div className="p-2 bg-purple-950/30 border border-purple-700/30 rounded text-xs">
                      <p className="text-purple-400 mb-1">Override by {entry.override_role}</p>
                      {entry.override_note && (
                        <p className="text-slate-400">{entry.override_note}</p>
                      )}
                    </div>
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