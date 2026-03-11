import React, { useMemo } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AdminGovernanceLifecycles() {
  const { data: lifecycles = [] } = useQuery({
    queryKey: ['entity-lifecycles'],
    queryFn: () => base44.entities.EntityLifecycleDefinition?.list?.().catch(() => []),
  });

  return (
    <AdminNav currentPage="AdminGovernanceLifecycles">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Lifecycle Governance</h1>
          <p className="text-slate-400 mt-1">Status definitions, allowed transitions, and state machines</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Lifecycles</p>
            <p className="text-2xl font-bold text-white mt-1">{lifecycles.length}</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300">Entities with Lifecycle</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {new Set(lifecycles.map(l => l.entity_key)).size}
            </p>
          </div>
        </div>

        {/* Lifecycle Cards */}
        <div className="space-y-4">
          {lifecycles.length > 0 ? (
            lifecycles.map((lc, idx) => {
              const statuses = lc.allowed_statuses_json ? JSON.parse(lc.allowed_statuses_json) : [];
              const transitions = lc.allowed_transitions_json ? JSON.parse(lc.allowed_transitions_json) : [];
              const terminal = lc.terminal_statuses_json ? JSON.parse(lc.terminal_statuses_json) : [];

              return (
                <Card key={idx} className="bg-slate-950 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {lc.lifecycle_name}
                      <span className="text-xs font-normal text-slate-400 ml-2">({lc.entity_key})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Statuses */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Allowed Statuses</h4>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-lg text-xs font-mono ${
                              terminal.includes(status)
                                ? 'bg-red-900/30 text-red-400'
                                : 'bg-slate-900 text-slate-300'
                            }`}
                          >
                            {status}
                            {terminal.includes(status) && ' ⊢'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Transitions */}
                    {transitions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">State Transitions</h4>
                        <div className="space-y-2">
                          {transitions.slice(0, 5).map((tr, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <span className="px-2 py-1 rounded bg-slate-900 text-slate-300 font-mono">
                                {tr.from}
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-600" />
                              <div className="flex gap-1">
                                {tr.to.slice(0, 3).map((t, j) => (
                                  <span key={j} className="px-2 py-1 rounded bg-slate-900 text-slate-300 font-mono">
                                    {t}
                                  </span>
                                ))}
                                {tr.to.length > 3 && (
                                  <span className="px-2 py-1 text-slate-500">
                                    +{tr.to.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {transitions.length > 5 && (
                            <p className="text-xs text-slate-500">+{transitions.length - 5} more transitions</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Terminal States */}
                    {terminal.length > 0 && (
                      <div className="border-t border-slate-800 pt-3">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-red-400" />
                          Terminal States
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {terminal.map((state, i) => (
                            <span key={i} className="px-3 py-1 rounded bg-red-900/30 text-red-400 text-xs font-mono">
                              {state}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-slate-950 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-slate-400">No lifecycles defined yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminNav>
  );
}