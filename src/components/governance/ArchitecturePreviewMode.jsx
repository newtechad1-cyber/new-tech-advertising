import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, AlertCircle, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ArchitecturePreviewMode({ entities = [], relationships = [], fields = [] }) {
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [showJson, setShowJson] = useState(false);

  const architectureJson = {
    timestamp: new Date().toISOString(),
    entities: entities.map(e => ({
      key: e.entity_key,
      name: e.entity_name,
      category: e.entity_category,
      owner: e.canonical_owner_type,
      status: e.status,
      tenantScoped: e.tenant_scoped,
      contextScoped: e.context_scoped,
    })),
    relationships: relationships.map(r => ({
      from: r.parent_entity_key,
      to: r.child_entity_key,
      type: r.relationship_type,
      cardinality: r.cardinality,
      required: r.required,
    })),
    stats: {
      totalEntities: entities.length,
      activeEntities: entities.filter(e => e.active).length,
      totalFields: fields.length,
      totalRelationships: relationships.length,
      tenantScopedCount: entities.filter(e => e.tenant_scoped).length,
    },
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(architectureJson, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-snapshot-${Date.now()}.json`;
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(architectureJson, null, 2));
  };

  return (
    <div className="space-y-4">
      {/* Preview Mode Toggle */}
      <Card className="bg-slate-950 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              {isPreviewMode ? <Eye className="w-5 h-5 text-blue-400" /> : <EyeOff className="w-5 h-5 text-slate-500" />}
              Architecture Preview
            </CardTitle>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                isPreviewMode
                  ? 'bg-blue-950/50 text-blue-300 border border-blue-700'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isPreviewMode ? 'Read-Only Mode' : 'Editing Enabled'}
            </button>
          </div>
        </CardHeader>
        {isPreviewMode && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/20 border border-blue-700/50 text-xs text-blue-300">
              <Lock className="w-4 h-4" />
              <span>All edits are disabled. Review architecture before making changes.</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Architecture Overview */}
      {isPreviewMode && (
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Architecture Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Entities', value: architectureJson.stats.totalEntities, icon: '📦' },
                { label: 'Active', value: architectureJson.stats.activeEntities, icon: '✅' },
                { label: 'Fields', value: architectureJson.stats.totalFields, icon: '📋' },
                { label: 'Relationships', value: architectureJson.stats.totalRelationships, icon: '🔗' },
              ].map((stat, idx) => (
                <div key={idx} className="rounded-lg bg-slate-900/50 border border-slate-700 p-3">
                  <p className="text-2xl">{stat.icon}</p>
                  <p className="text-xs text-slate-400 mt-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Entity Distribution */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-300">Entity Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {['core', 'operational', 'publishing', 'ai_orchestration', 'onboarding', 'reporting'].map((cat) => {
                  const count = entities.filter(e => e.entity_category === cat && e.active).length;
                  return (
                    <div key={cat} className="rounded-lg bg-slate-900/50 border border-slate-700 p-2">
                      <p className="text-xs text-slate-400 capitalize">{cat.replace(/_/g, ' ')}</p>
                      <p className="text-lg font-bold text-white">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tenant Scoping */}
            <div className="rounded-lg bg-emerald-950/20 border border-emerald-700 p-3">
              <p className="text-xs font-semibold text-emerald-300 mb-2">Tenant Scoping Coverage</p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${(architectureJson.stats.tenantScopedCount / architectureJson.stats.activeEntities) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-emerald-300 mt-2">
                {architectureJson.stats.tenantScopedCount} / {architectureJson.stats.activeEntities} entities tenant-scoped
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON View Toggle */}
      {isPreviewMode && (
        <Card className="bg-slate-950 border-slate-800">
          <CardHeader className="pb-3">
            <button
              onClick={() => setShowJson(!showJson)}
              className="w-full text-left flex items-center justify-between text-white hover:text-blue-300 transition-colors"
            >
              <span className="font-semibold">Architecture JSON</span>
              {showJson ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </CardHeader>
          {showJson && (
            <CardContent className="pt-0">
              <pre className="text-xs bg-black/50 p-4 rounded border border-slate-700 overflow-x-auto text-slate-300 max-h-96">
                {JSON.stringify(architectureJson, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      )}

      {!isPreviewMode && (
        <Card className="bg-amber-950/20 border-amber-700">
          <CardContent className="pt-6 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-300">
              <p className="font-semibold">Editing Enabled</p>
              <p className="text-xs mt-1">Review all changes against the architecture snapshot above before saving.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}