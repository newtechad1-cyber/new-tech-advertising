import React, { useMemo, useState } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminGovernanceDependencies() {
  const [search, setSearch] = useState('');

  const { data: dependencies = [] } = useQuery({
    queryKey: ['entity-dependencies'],
    queryFn: () => base44.entities.EntityDependencyMap?.list?.().catch(() => []),
  });

  const filtered = useMemo(() => {
    return dependencies.filter(d => {
      const matchesSearch = 
        d.entity_key.toLowerCase().includes(search.toLowerCase()) ||
        d.dependency_name.toLowerCase().includes(search.toLowerCase()) ||
        d.dependency_target.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [dependencies, search]);

  const dependencyTypeIcons = {
    used_by_page: '📄',
    used_by_dashboard: '📊',
    used_by_agent: '🤖',
    used_by_workflow: '⚙️',
    used_by_report: '📈',
    used_by_integration: '🔗',
  };

  const dependencyTypeColors = {
    used_by_page: 'blue',
    used_by_dashboard: 'purple',
    used_by_agent: 'pink',
    used_by_workflow: 'amber',
    used_by_report: 'cyan',
    used_by_integration: 'green',
  };

  const groupedByEntity = useMemo(() => {
    const grouped = {};
    filtered.forEach(dep => {
      if (!grouped[dep.entity_key]) {
        grouped[dep.entity_key] = [];
      }
      grouped[dep.entity_key].push(dep);
    });
    return grouped;
  }, [filtered]);

  const stats = {
    total: dependencies.length,
    entities: new Set(dependencies.map(d => d.entity_key)).size,
    pages: dependencies.filter(d => d.dependency_type === 'used_by_page').length,
    agents: dependencies.filter(d => d.dependency_type === 'used_by_agent').length,
    workflows: dependencies.filter(d => d.dependency_type === 'used_by_workflow').length,
  };

  return (
    <AdminNav currentPage="AdminGovernanceDependencies">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Dependency Map</h1>
          <p className="text-slate-400 mt-1">Entity dependencies across pages, agents, workflows, and integrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Dependencies</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300">Entities</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.entities}</p>
          </div>
          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-3">
            <p className="text-xs text-purple-300">Pages</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{stats.pages}</p>
          </div>
          <div className="bg-pink-900/20 border border-pink-700 rounded-lg p-3">
            <p className="text-xs text-pink-300">Agents</p>
            <p className="text-2xl font-bold text-pink-400 mt-1">{stats.agents}</p>
          </div>
          <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-3">
            <p className="text-xs text-amber-300">Workflows</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.workflows}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search entities or dependencies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700"
          />
        </div>

        {/* Dependencies by Entity */}
        <div className="space-y-4">
          {Object.entries(groupedByEntity).length > 0 ? (
            Object.entries(groupedByEntity).map(([entity, deps], idx) => (
              <Card key={idx} className="bg-slate-950 border-slate-800">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-white mb-4 text-lg">{entity}</h3>
                  <div className="space-y-3">
                    {deps.map((dep, i) => {
                      const color = dependencyTypeColors[dep.dependency_type];
                      const icon = dependencyTypeIcons[dep.dependency_type];
                      
                      return (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-800 last:border-b-0">
                          <span className="text-xl flex-shrink-0">{icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{dep.dependency_name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-1">{dep.dependency_target}</p>
                            {dep.notes && (
                              <p className="text-xs text-slate-400 mt-2">{dep.notes}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs bg-${color}-900/30 text-${color}-400 flex-shrink-0`}>
                            {dep.dependency_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-slate-950 border-slate-800">
              <CardContent className="pt-6">
                <p className="text-slate-400">No dependencies found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminNav>
  );
}