import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function AutomationPreviewMode({ rule, changes = {}, onApply, onCancel }) {
  const [showPreview, setShowPreview] = useState(false);

  const changeFields = Object.entries(changes).filter(([_, v]) => v !== undefined);

  if (changeFields.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-4 text-center text-slate-400">
          No pending changes
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-700/50 bg-blue-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {showPreview ? 'Preview Mode - Read Only' : 'Pending Changes'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-blue-400"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Hide' : 'Preview'}
          </Button>
        </div>
      </CardHeader>

      {showPreview && (
        <CardContent className="space-y-4">
          <div className="bg-blue-950/40 border border-blue-700/30 rounded-lg p-4 space-y-3">
            {changeFields.map(([field, newValue]) => (
              <div key={field} className="space-y-1">
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide">{field}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded p-3">
                    <p className="text-xs text-slate-500 mb-1">Current</p>
                    <p className="text-sm text-slate-300 font-mono break-words">
                      {String(rule[field] || 'not set')}
                    </p>
                  </div>
                  <div className="bg-emerald-950/30 rounded p-3">
                    <p className="text-xs text-emerald-400 mb-1">New Value</p>
                    <p className="text-sm text-emerald-300 font-mono break-words">
                      {String(newValue)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              This is a preview. Changes will not be applied until confirmed.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              size="sm"
              className="flex-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50"
              onClick={onApply}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Changes
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      )}

      {!showPreview && (
        <CardContent>
          <div className="space-y-2">
            {changeFields.slice(0, 3).map(([field, newValue]) => (
              <div key={field} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{field}</span>
                <Badge variant="secondary" className="text-xs">
                  {typeof newValue === 'object' ? 'modified' : String(newValue).substring(0, 30)}
                </Badge>
              </div>
            ))}
            {changeFields.length > 3 && (
              <p className="text-xs text-slate-500 pt-2">
                + {changeFields.length - 3} more changes
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}