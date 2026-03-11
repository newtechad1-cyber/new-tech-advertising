import React, { useState, useMemo } from 'react';
import AdminNav from '@/components/nav/AdminNav';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminGovernanceFields() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { data: fields = [] } = useQuery({
    queryKey: ['master-fields'],
    queryFn: () => base44.entities.MasterFieldDefinition?.list?.().catch(() => []),
  });

  const filtered = useMemo(() => {
    return fields.filter(f => {
      const matchesSearch = 
        f.field_key.toLowerCase().includes(search.toLowerCase()) ||
        f.field_label.toLowerCase().includes(search.toLowerCase()) ||
        f.entity_key.toLowerCase().includes(search.toLowerCase());
      
      const matchesType = filterType === 'all' || f.data_type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [fields, search, filterType]);

  const stats = {
    total: fields.length,
    deprecated: fields.filter(f => f.deprecated).length,
    required: fields.filter(f => f.required).length,
    indexed: fields.filter(f => f.indexed).length,
    clientEditable: fields.filter(f => f.client_editable).length,
  };

  const dataTypes = [...new Set(fields.map(f => f.data_type))];

  return (
    <AdminNav currentPage="AdminGovernanceFields">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Field Governance</h1>
          <p className="text-slate-400 mt-1">Field definitions, validation rules, and edit boundaries</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Total Fields</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-3">
            <p className="text-xs text-orange-300">Deprecated</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">{stats.deprecated}</p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-3">
            <p className="text-xs text-emerald-300">Required</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.required}</p>
          </div>
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300">Indexed</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.indexed}</p>
          </div>
          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-3">
            <p className="text-xs text-purple-300">Client Editable</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{stats.clientEditable}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search fields, entities..."
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
            <option value="all">All Types</option>
            {dataTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Fields Table */}
        <Card className="bg-slate-950 border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-800 bg-slate-900/50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-300">Entity</th>
                    <th className="text-left p-3 font-semibold text-slate-300">Field</th>
                    <th className="text-left p-3 font-semibold text-slate-300">Type</th>
                    <th className="text-left p-3 font-semibold text-slate-300">Required</th>
                    <th className="text-left p-3 font-semibold text-slate-300">Editable</th>
                    <th className="text-left p-3 font-semibold text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((field, idx) => (
                      <tr key={idx} className="border-b border-slate-800 hover:bg-slate-900/30">
                        <td className="p-3 text-slate-400">{field.entity_key}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{field.field_label}</div>
                          <div className="text-xs text-slate-500 font-mono">{field.field_key}</div>
                        </td>
                        <td className="p-3 text-slate-400 text-xs">{field.data_type}</td>
                        <td className="p-3">
                          {field.required ? (
                            <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">
                              Required
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">Optional</span>
                          )}
                        </td>
                        <td className="p-3 text-xs">
                          {field.admin_only && <span className="text-red-400">Admin Only</span>}
                          {field.client_editable && <span className="text-blue-400">Client</span>}
                          {field.reseller_editable && <span className="text-purple-400">Reseller</span>}
                          {!field.admin_only && !field.client_editable && !field.reseller_editable && (
                            <span className="text-slate-600">View</span>
                          )}
                        </td>
                        <td className="p-3">
                          {field.deprecated && (
                            <span className="flex items-center gap-1 text-orange-400">
                              <AlertTriangle className="w-3 h-3" />
                              Deprecated
                            </span>
                          )}
                          {field.indexed && (
                            <span className="text-blue-400 text-xs">Indexed</span>
                          )}
                          {!field.deprecated && !field.indexed && (
                            <span className="text-slate-600">Active</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-400">
                        No fields match filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminNav>
  );
}