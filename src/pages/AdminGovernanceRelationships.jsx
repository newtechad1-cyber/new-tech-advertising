import React, { useState, useMemo } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, ArrowRight, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminGovernanceRelationships() {
  const [search, setSearch] = useState('');

  const { data: relationships = [] } = useQuery({
    queryKey: ['entity-relationships'],
    queryFn: () => base44.entities.EntityRelationshipDefinition?.list?.().catch(() => []),
  });

  const filtered = useMemo(() => {
    return relationships.filter(r => {
      const matchesSearch = 
        r.parent_entity_key.toLowerCase().includes(search.toLowerCase()) ||
        r.child_entity_key.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [relationships, search]);

  const stats = {
    total: relationships.length,
    required: relationships.filter(r => r.required).length,
    optional: relationships.filter(r => !r.required).length,
    inactive: relationships.filter(r => !r.active).length,
  };

  return (
    <AdminNav currentPage="AdminGovernanceRelationships">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Relationship Governance</h1>
          <p className="text-slate-400 mt-1">Entity relationships, cardinality, and cascade rules</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-3">
            <p className="text-xs text-emerald-300">Required</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.required}</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300">Optional</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.optional}</p>
          </div>
          <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-3">
            <p className="text-xs text-orange-300">Inactive</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">{stats.inactive}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search entities or relationships..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700"
          />
        </div>

        {/* Relationships */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((rel, idx) => {
              const cascadeRules = rel.cascade_rules_json ? JSON.parse(rel.cascade_rules_json) : {};
              
              return (
                <Card key={idx} className="bg-slate-950 border-slate-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 font-semibold text-sm">
                          {rel.parent_entity_key}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 font-semibold text-sm">
                          {rel.child_entity_key}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {rel.required && (
                          <span className="px-2 py-1 rounded bg-emerald-900/30 text-emerald-400 text-xs">
                            Required
                          </span>
                        )}
                        {!rel.active && (
                          <AlertTriangle className="w-4 h-4 text-orange-400" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white font-mono">{rel.relationship_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cardinality:</span>
                        <span className="text-white font-mono">{rel.cardinality}</span>
                      </div>
                      {rel.description && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Description:</span>
                          <span className="text-slate-300">{rel.description}</span>
                        </div>
                      )}
                      {Object.keys(cascadeRules).length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cascade:</span>
                          <span className="text-blue-400 font-mono">{Object.keys(cascadeRules).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-slate-950 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-slate-400">No relationships match search.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminNav>
  );
}