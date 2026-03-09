import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminNav from '@/components/nav/AdminNav';
import AdminGuard from '@/components/auth/AdminGuard';
import { Button } from '@/components/ui/button';
import { Bell, Loader2, CheckCircle, Clock, XCircle, Mail } from 'lucide-react';

const STATUS_STYLES = {
  pending: 'bg-yellow-900/40 text-yellow-400', sent: 'bg-green-900/40 text-green-400',
  opened: 'bg-blue-900/40 text-blue-400', clicked: 'bg-violet-900/40 text-violet-400',
  replied: 'bg-emerald-900/40 text-emerald-400', failed: 'bg-red-900/40 text-red-400',
  canceled: 'bg-slate-700 text-slate-400',
};
const TYPE_ICONS = { email: Mail, sms: Bell, internal_alert: Bell };

export default function AdminSalesFollowups() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: followups = [], isLoading } = useQuery({
    queryKey: ['sales-followups', filter],
    queryFn: () => filter === 'all'
      ? base44.entities.SalesFollowups.list('-created_date', 200)
      : base44.entities.SalesFollowups.filter({ status: filter }, '-created_date', 200),
    refetchInterval: 30000,
  });

  const markSent = async (id) => {
    await base44.entities.SalesFollowups.update(id, { status: 'sent', sent_at: new Date().toISOString() });
    qc.invalidateQueries({ queryKey: ['sales-followups'] });
  };

  const markCanceled = async (id) => {
    await base44.entities.SalesFollowups.update(id, { status: 'canceled' });
    qc.invalidateQueries({ queryKey: ['sales-followups'] });
  };

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><Bell className="w-5 h-5 text-cyan-400" /><h1 className="text-base font-bold">Sales Follow-ups</h1></div>
          </div>

          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {['all', 'pending', 'sent', 'opened', 'clicked', 'replied', 'failed'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === s ? 'bg-violet-700 border-violet-600 text-white' : 'border-slate-700 text-slate-500 hover:text-slate-300'}`}>
                  {s}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
            ) : followups.length === 0 ? (
              <div className="text-center py-12 text-slate-600">No follow-ups in this view.</div>
            ) : (
              <div className="space-y-2">
                {followups.map(f => {
                  const TypeIcon = TYPE_ICONS[f.followup_type] || Bell;
                  return (
                    <div key={f.id} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 flex items-start gap-3">
                      <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TypeIcon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[f.status] || 'bg-slate-700 text-slate-400'}`}>{f.status}</span>
                          <span className="text-xs text-slate-500 capitalize">{f.followup_type?.replace('_', ' ')}</span>
                          {f.sequence_step && <span className="text-xs text-slate-600">Step {f.sequence_step}</span>}
                        </div>
                        <p className="text-sm font-semibold text-white">{f.subject_line || 'No subject'}</p>
                        {f.message_body && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{f.message_body}</p>}
                        {f.scheduled_for && <p className="text-xs text-slate-600 mt-0.5">Scheduled: {new Date(f.scheduled_for).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
                      </div>
                      {f.status === 'pending' && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300 h-7 text-xs" onClick={() => markSent(f.id)}>
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Sent
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 h-7 text-xs" onClick={() => markCanceled(f.id)}>
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}