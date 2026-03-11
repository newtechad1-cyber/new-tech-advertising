import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Check, X } from 'lucide-react';

export default function RouteTableRow({ route, check, onQuickAction }) {
  const status = check?.status || 'untested';

  const getStatusColor = () => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'broken':
        return 'bg-red-50 border-red-200';
      case 'untested':
        return 'bg-slate-50 border-slate-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusBadgeStyle = () => {
    const styles = {
      pass: 'bg-green-100 text-green-800',
      broken: 'bg-red-100 text-red-800',
      redirect_issue: 'bg-yellow-100 text-yellow-800',
      wrong_layout: 'bg-orange-100 text-orange-800',
      untested: 'bg-slate-100 text-slate-800',
      timeout: 'bg-purple-100 text-purple-800',
      wrong_data_context: 'bg-pink-100 text-pink-800',
    };
    return styles[status] || styles.untested;
  };

  return (
    <div className={`border rounded p-4 ${getStatusColor()} hover:shadow-sm transition`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-current/10">
              {route.route}
            </code>
            <Badge variant="outline" className="text-xs">
              {route.page_key}
            </Badge>
            <Badge className={`text-xs ${getStatusBadgeStyle()}`}>
              {status}
            </Badge>
          </div>
          <p className="text-xs text-slate-600">
            Layout: <span className="font-mono bg-white/50 px-1">{route.layout_expected}</span> •
            Nav: <span className="font-mono bg-white/50 px-1">{route.nav_menu_source}</span>
          </p>
          {check?.notes && (
            <p className="text-xs text-slate-700 italic bg-white/40 px-2 py-1 rounded">
              📝 {check.notes}
            </p>
          )}
          {check?.load_time_ms && (
            <p className="text-xs text-slate-500">
              ⏱ Load time: {check.load_time_ms}ms
            </p>
          )}
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(route.route, '_blank')}
            title="Open in new tab"
            className="gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </Button>
          <Button
            variant={status === 'pass' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onQuickAction(route.route, 'mark_pass')}
            title="Mark as passing"
            className="gap-1"
          >
            <Check className="w-3 h-3" />
            Pass
          </Button>
          <Button
            variant={status === 'broken' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => onQuickAction(route.route, 'mark_broken')}
            title="Mark as broken"
            className="gap-1"
          >
            <X className="w-3 h-3" />
            Fail
          </Button>
        </div>
      </div>
    </div>
  );
}