import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Info, Code } from 'lucide-react';

export default function ArchitecturePreviewMode({ entity, changes = {} }) {
  const [showPreview, setShowPreview] = useState(false);

  if (!entity) {
    return null;
  }

  const renderValue = (key, value) => {
    if (!value) return <span className="text-slate-500 italic">—</span>;
    if (typeof value === 'object') {
      try {
        return <code className="text-xs font-mono bg-slate-900/50 px-2 py-1 rounded">{JSON.stringify(value, null, 2)}</code>;
      } catch {
        return <span className="text-slate-400">[Object]</span>;
      }
    }
    return <span>{String(value)}</span>;
  };

  const changedFields = Object.keys(changes).filter(k => changes[k] !== entity[k]);
  const hasChanges = changedFields.length > 0;

  return (
    <div className="space-y-3">
      {/* Preview Toggle */}
      <div className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-700">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-300">
            {showPreview ? 'Showing preview of changes' : 'Preview mode disabled'}
          </span>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-950/50 hover:bg-blue-950 border border-blue-700 text-blue-300 text-xs font-semibold transition-colors"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-3 h-3" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              Show Preview
            </>
          )}
        </button>
      </div>

      {/* Current State */}
      <Card className="bg-slate-950 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Code className="w-4 h-4" />
            Current Architecture State
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {Object.entries(entity)
            .filter(([k]) => !k.startsWith('id') && k !== 'created_date' && k !== 'updated_date')
            .map(([key, value]) => (
              <div
                key={key}
                className="p-2 rounded bg-slate-900/50 text-xs"
              >
                <p className="text-slate-400 font-semibold mb-1">{key}</p>
                <p className="text-slate-300 break-words">
                  {renderValue(key, value)}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Preview Changes */}
      {showPreview && hasChanges && (
        <Card className="bg-blue-950/30 border-blue-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-300 text-sm flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview: After Changes ({changedFields.length} fields)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {changedFields.map((key) => (
              <div
                key={key}
                className="p-2 rounded bg-blue-900/30 border border-blue-700/50 text-xs"
              >
                <p className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                  {key}
                  <Badge className="bg-blue-950 text-blue-300 text-xs">CHANGED</Badge>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {/* Old Value */}
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Current</p>
                    <div className="p-1.5 rounded bg-slate-900/50 border border-slate-700/50 text-slate-400">
                      {renderValue(key, entity[key])}
                    </div>
                  </div>
                  {/* New Value */}
                  <div>
                    <p className="text-blue-400 text-xs mb-1">New</p>
                    <div className="p-1.5 rounded bg-blue-950/50 border border-blue-700 text-blue-300">
                      {renderValue(key, changes[key])}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!hasChanges && showPreview && (
        <Card className="bg-emerald-950/30 border-emerald-700/50">
          <CardContent className="pt-6">
            <p className="text-xs text-emerald-300">No changes to preview.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}