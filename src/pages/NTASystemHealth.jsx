import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Heart, RefreshCw, Loader2, XCircle, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { triggerTwinAgent } from '@/api/twinClient';

export default function NTASystemHealth() {
  const [data, setData] = useState({ submissions: [], tasks: [], activities: [] });
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrrying] = useState({});

  const load = async () => {
    setLoading(true);
    const [submissions, tasks, activities] = await Promise.all([
      base44.entities.Submission.list('-created_date', 200),
      base44.entities.NTATask.filter({ task_type: 'webhook_retry' }, '-created_date', 50),
      base44.entities.NTAActivity.filter({ activity_type: 'webhook_failed' }, '-created_date', 50),
    ]);
    setData({ submissions, tasks, activities });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const retryWebhook = async (sub) => {
    setRetrrying(r => ({ ...r, [sub.id]: true }));
    const WEBHOOK = 'https://build.twin.so/triggers/66e7b5d6-5948-4eae-90e7-5b040999c124/webhook';
    await triggerTwinAgent(WEBHOOK, { submission_id: sub.id, ...sub });
    await base44.entities.Submission.update(sub.id, { webhook_status: 'sent' });
    await base44.entities.NTAActivity.create({
      submission_id: sub.id,
      activity_type: 'webhook_sent',
      title: `Webhook retried for: ${sub.business_name || sub.name}`,
      source_system: 'nta_system_health',
    });
    toast.success('Webhook retried');
    setRetrrying(r => ({ ...r, [sub.id]: false }));
    load();
  };

  const failedWebhooks = data.submissions.filter(s => s.webhook_status === 'failed');
  const unmatchedNew = data.submissions.filter(s => s.processing_status === 'new' && !s.matched_company_id);
  const today = new Date().toISOString().slice(0, 10);
  const overdueTasks = data.tasks; // already filtered by webhook_retry type

  const healthScore = (() => {
    let issues = failedWebhooks.length + unmatchedNew.length + overdueTasks.length;
    if (issues === 0) return { label: 'Healthy', color: 'text-green-400', icon: CheckCircle2 };
    if (issues <= 3) return { label: 'Warning', color: 'text-yellow-400', icon: AlertTriangle };
    return { label: 'Needs Attention', color: 'text-red-400', icon: XCircle };
  })();

  const StatusIcon = healthScore.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/nta/command-center" className="text-slate-400 hover:text-white text-sm">← Command Center</Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-red-400" />System Health</h1>
              <p className={`text-sm flex items-center gap-1.5 ${healthScore.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />{healthScore.label}
              </p>
            </div>
          </div>
          <Button onClick={load} variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Webhook Failures', value: failedWebhooks.length, color: failedWebhooks.length > 0 ? 'text-red-400' : 'text-green-400', icon: XCircle },
            { label: 'Unmatched Submissions', value: unmatchedNew.length, color: unmatchedNew.length > 0 ? 'text-yellow-400' : 'text-green-400', icon: AlertTriangle },
            { label: 'Webhook Retry Tasks', value: overdueTasks.length, color: overdueTasks.length > 0 ? 'text-orange-400' : 'text-green-400', icon: Zap },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
              <Icon className={`w-6 h-6 ${color} opacity-50`} />
            </div>
          ))}
        </div>

        {/* Webhook Failures */}
        <div>
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />Webhook Failures
          </h2>
          {loading ? <div className="h-20 bg-slate-800 rounded-xl animate-pulse" />
          : failedWebhooks.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-green-300 text-sm">No webhook failures — all clear</p>
            </div>
          ) : (
            <div className="space-y-2">
              {failedWebhooks.map(s => (
                <div key={s.id} className="bg-slate-800 border border-red-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-white">{s.business_name || s.name || 'Unknown'}</p>
                      <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                        <span>{s.submission_type}</span>
                        <span>{s.source_system}</span>
                        <span>{new Date(s.created_date).toLocaleDateString()}</span>
                      </div>
                      {s.webhook_response && (
                        <p className="text-red-400 text-xs mt-1 font-mono truncate max-w-md">{s.webhook_response}</p>
                      )}
                    </div>
                    <Button size="sm" onClick={() => retryWebhook(s)} disabled={retrying[s.id]}
                      className="bg-blue-800 hover:bg-blue-700 h-7 text-xs shrink-0">
                      {retrying[s.id] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                      Retry
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unmatched Submissions */}
        <div>
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />Unmatched Submissions
          </h2>
          {loading ? <div className="h-20 bg-slate-800 rounded-xl animate-pulse" />
          : unmatchedNew.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-green-300 text-sm">All submissions matched</p>
            </div>
          ) : (
            <div className="space-y-2">
              {unmatchedNew.slice(0, 10).map(s => (
                <div key={s.id} className="bg-slate-800 border border-yellow-800/40 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white text-sm font-medium">{s.business_name || s.name || 'Unknown'}</p>
                    <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                      <span>{s.source_system}</span>
                      <span>{s.email || '—'}</span>
                      <span>{new Date(s.created_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link to="/nta/submissions">
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 h-7 text-xs shrink-0">Review</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Failures */}
        <div>
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />Webhook Failure Log
          </h2>
          {data.activities.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <p className="text-green-300 text-sm">No webhook failures in activity log</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.activities.slice(0, 10).map(a => (
                <div key={a.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm">{a.title}</p>
                    <span className="text-slate-600 text-xs">{new Date(a.created_date).toLocaleString()}</span>
                  </div>
                  {a.details && <p className="text-slate-400 text-xs mt-1">{a.details}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}