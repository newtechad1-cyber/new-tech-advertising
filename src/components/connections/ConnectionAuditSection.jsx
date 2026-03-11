import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Settings, Wifi, Clock, Loader2 } from "lucide-react";

const EVENT_ICONS = {
  connection_verified:    CheckCircle2,
  connection_failed:      XCircle,
  token_refreshed:        RefreshCw,
  token_expired:          AlertTriangle,
  page_mapping_updated:   Settings,
  publishing_enabled:     CheckCircle2,
  publishing_disabled:    XCircle,
  test_publish_succeeded: Wifi,
  test_publish_failed:    XCircle,
  reconnect_requested:    RefreshCw,
  settings_updated:       Settings,
  connection_created:     CheckCircle2,
  connection_disabled:    XCircle,
};

const EVENT_COLORS = {
  connection_verified:    "text-green-400",
  connection_failed:      "text-red-400",
  test_publish_succeeded: "text-green-400",
  test_publish_failed:    "text-red-400",
  token_expired:          "text-amber-400",
  publishing_enabled:     "text-blue-400",
  publishing_disabled:    "text-slate-500",
  settings_updated:       "text-violet-400",
};

const PLATFORMS = ['all', 'website', 'google', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'gbp'];

export default function ConnectionAuditSection() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    base44.entities.PlatformConnectionAuditLog.list('-logged_at', 100).then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const filtered = filterPlatform === 'all' ? logs : logs.filter(l => l.platform_type === filterPlatform);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            Connection Audit Log
          </CardTitle>
          <div className="flex gap-1 flex-wrap">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => setFilterPlatform(p)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border transition-all capitalize ${
                  filterPlatform === p
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-600">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No audit logs yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2 px-3 text-[10px] text-slate-600 uppercase tracking-wide font-semibold">Time</th>
                  <th className="text-left py-2 px-3 text-[10px] text-slate-600 uppercase tracking-wide font-semibold">Platform</th>
                  <th className="text-left py-2 px-3 text-[10px] text-slate-600 uppercase tracking-wide font-semibold">Event</th>
                  <th className="text-left py-2 px-3 text-[10px] text-slate-600 uppercase tracking-wide font-semibold">Status</th>
                  <th className="text-left py-2 px-3 text-[10px] text-slate-600 uppercase tracking-wide font-semibold">Details</th>
                  <th className="text-left py-2 px-3 text-[10px] text-slate-600 uppercase tracking-wide font-semibold">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.slice(0, 50).map((log, i) => {
                  const Icon = EVENT_ICONS[log.event_type] || Clock;
                  const iconColor = EVENT_COLORS[log.event_type] || 'text-slate-500';
                  return (
                    <tr key={log.id || i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {log.logged_at ? new Date(log.logged_at).toLocaleString() : '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="capitalize text-slate-400 font-medium">{log.platform_type}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3 h-3 ${iconColor} flex-shrink-0`} />
                          <span className="text-slate-300">{log.event_label || log.event_type}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        {log.status_after && (
                          <span className="text-[10px] text-slate-500 capitalize">{log.status_after}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 max-w-[220px]">
                        <p className="text-slate-600 truncate text-[10px]">{log.event_details || '—'}</p>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[10px]">{log.actor_name || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}