import React, { useState, useMemo } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminGovernanceAudit() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { data: audits = [] } = useQuery({
    queryKey: ['governance-audits'],
    queryFn: () => base44.entities.EntityGovernanceAuditLog?.list?.('-created_at').catch(() => []),
  });

  const changeTypes = [...new Set(audits.map(a => a.change_type))];

  const filtered = useMemo(() => {
    return audits.filter(a => {
      const matchesSearch = 
        a.entity_key.toLowerCase().includes(search.toLowerCase()) ||
        a.field_key?.toLowerCase().includes(search.toLowerCase()) ||
        a.changed_by.toLowerCase().includes(search.toLowerCase()) ||
        a.reason?.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = filterType === 'all' || a.change_type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [audits, search, filterType]);

  const changeTypeColors = {
    field_added: 'emerald',
    field_renamed: 'blue',
    field_deprecated: 'orange',
    field_modified: 'blue',
    lifecycle_updated: 'purple',
    relationship_added: 'cyan',
    relationship_modified: 'blue',
    visibility_changed: 'purple',
    edit_rules_changed: 'purple',
  };

  const stats = {
    total: audits.length,
    fieldsAdded: audits.filter(a => a.change_type === 'field_added').length,
    fieldsDeprecated: audits.filter(a => a.change_type === 'field_deprecated').length,
    relationshipsModified: audits.filter(a => a.change_type === 'relationship_modified').length,
  };

  return (
    <AdminNav currentPage="AdminGovernanceAudit">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Governance Audit Log</h1>
          <p className="text-slate-400 mt-1">Complete change history: field modifications, lifecycle updates, relationships</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Changes</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-3">
            <p className="text-xs text-emerald-300">Fields Added</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.fieldsAdded}</p>
          </div>
          <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-3">
            <p className="text-xs text-orange-300">Deprecated</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">{stats.fieldsDeprecated}</p>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-3">
            <p className="text-xs text-cyan-300">Relationships</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{stats.relationshipsModified}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search by entity, field, user, or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-300 text-sm"
          >
            <option value="all">All Changes</option>
            {changeTypes.map(t => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Audit Entries */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((entry, idx) => {
              const color = changeTypeColors[entry.change_type] || 'slate';

              return (
                <Card key={idx} className="bg-slate-950 border-slate-800 hover:border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-2 rounded text-xs font-semibold bg-${color}-900/30 text-${color}-400 flex-shrink-0`}>
                        {entry.change_type.replace(/_/g, ' ')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-white">
                            {entry.entity_key}
                            {entry.field_key && ` → ${entry.field_key}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(entry.created_at).toLocaleString()}
                          </p>
                        </div>

                        <p className="text-sm text-slate-400 mb-2">
                          Changed by <span className="text-blue-400 font-mono">{entry.changed_by}</span>
                          {entry.changed_by_role && ` (${entry.changed_by_role})`}
                        </p>

                        {entry.reason && (
                          <p className="text-sm text-slate-300 mb-3 italic">
                            "{entry.reason}"
                          </p>
                        )}

                        {(entry.old_value_json || entry.new_value_json) && (
                          <div className="bg-slate-900/30 rounded p-3 text-xs space-y-2 mb-3">
                            {entry.old_value_json && (
                              <div>
                                <p className="text-slate-500">Before:</p>
                                <p className="font-mono text-slate-400 truncate">{entry.old_value_json}</p>
                              </div>
                            )}
                            {entry.new_value_json && (
                              <div>
                                <p className="text-slate-500">After:</p>
                                <p className="font-mono text-slate-300 truncate">{entry.new_value_json}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-slate-950 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-slate-400">No audit entries match filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminNav>
  );
}