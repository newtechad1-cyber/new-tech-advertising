import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdminNav from '@/components/nav/AdminNav';
import AdminGuard from '@/components/auth/AdminGuard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Star, MessageSquare, Video, Bell, FileText, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProspectActivityTimeline from '@/components/sales/ProspectActivityTimeline';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['new', 'watching_demo', 'engaged', 'pricing_viewed', 'proposal_viewed', 'trial_started', 'booked_call', 'closed', 'lost'];
const STATUS_STYLES = {
  new: 'bg-slate-700 text-slate-300', watching_demo: 'bg-blue-900/40 text-blue-400',
  engaged: 'bg-violet-900/40 text-violet-400', pricing_viewed: 'bg-yellow-900/40 text-yellow-400',
  proposal_viewed: 'bg-orange-900/40 text-orange-400', trial_started: 'bg-green-900/40 text-green-400',
  booked_call: 'bg-cyan-900/40 text-cyan-400', closed: 'bg-emerald-900/40 text-emerald-400', lost: 'bg-red-900/40 text-red-400',
};

export default function AdminSalesProspect() {
  const params = new URLSearchParams(window.location.search);
  const prospectId = params.get('id');
  const qc = useQueryClient();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: prospect, isLoading } = useQuery({
    queryKey: ['prospect', prospectId],
    queryFn: async () => {
      const res = await base44.entities.SalesProspects.filter({ id: prospectId });
      const p = res[0];
      if (p) setNotes(p.notes || '');
      return p;
    },
    enabled: !!prospectId,
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['prospect-questions', prospectId],
    queryFn: () => base44.entities.SalesQuestions.filter({ prospect_id: prospectId }, '-created_at', 20),
    enabled: !!prospectId,
  });

  const { data: followups = [] } = useQuery({
    queryKey: ['prospect-followups', prospectId],
    queryFn: () => base44.entities.SalesFollowups.filter({ prospect_id: prospectId }, '-created_date', 20),
    enabled: !!prospectId,
  });

  const { data: videoViews = [] } = useQuery({
    queryKey: ['prospect-videos', prospectId],
    queryFn: () => base44.entities.SalesVideoViews.filter({ prospect_id: prospectId }, '-viewed_at', 20),
    enabled: !!prospectId,
  });

  const saveNotes = async () => {
    setSaving(true);
    await base44.entities.SalesProspects.update(prospectId, { notes });
    qc.invalidateQueries({ queryKey: ['prospect', prospectId] });
    toast.success('Notes saved');
    setSaving(false);
  };

  const updateStatus = async (status) => {
    await base44.entities.SalesProspects.update(prospectId, { status });
    qc.invalidateQueries({ queryKey: ['prospect', prospectId] });
    qc.invalidateQueries({ queryKey: ['sales-prospects'] });
    toast.success('Status updated');
  };

  if (!prospectId) return <AdminGuard><AdminNav><div className="text-center p-12 text-slate-500">No prospect selected.</div></AdminNav></AdminGuard>;
  if (isLoading) return <AdminGuard><AdminNav><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div></AdminNav></AdminGuard>;
  if (!prospect) return <AdminGuard><AdminNav><div className="text-center p-12 text-slate-500">Prospect not found.</div></AdminNav></AdminGuard>;

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-950 text-white">
          <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 sticky top-0 z-20 flex items-center gap-3">
            <Link to={createPageUrl('AdminSalesDashboard')}><Button variant="ghost" size="sm" className="text-slate-400 hover:text-white"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button></Link>
            <div className="flex-1">
              <h1 className="text-sm font-bold text-white">{prospect.full_name || prospect.email}</h1>
              <p className="text-xs text-slate-500">{prospect.company_name} · {prospect.industry}</p>
            </div>
            <div className="flex items-center gap-2">
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => updateStatus(s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${prospect.status === s ? STATUS_STYLES[s] + ' border-current' : 'border-slate-700 text-slate-600 hover:text-slate-400'}`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-screen-xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col — summary */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h2 className="text-white font-bold mb-4">Prospect Summary</h2>
                <dl className="space-y-3 text-sm">
                  {[
                    { label: 'Email', val: prospect.email },
                    { label: 'Phone', val: prospect.phone || '—' },
                    { label: 'Industry', val: prospect.industry || '—' },
                    { label: 'Company', val: prospect.company_name || '—' },
                    { label: 'Source', val: prospect.source || '—' },
                    { label: 'First Seen', val: prospect.first_seen_at ? new Date(prospect.first_seen_at).toLocaleDateString() : '—' },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="text-slate-300 font-medium text-right">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Lead score */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 text-center">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-4xl font-extrabold text-yellow-400">{prospect.lead_score || 0}</p>
                <p className="text-slate-500 text-xs mt-1">Lead Score</p>
                {prospect.recommended_plan && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500">Recommended Plan</p>
                    <p className="text-violet-400 font-bold capitalize text-lg mt-0.5">{prospect.recommended_plan}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3">Notes</h3>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-violet-600"
                  placeholder="Add notes about this prospect…" />
                <Button size="sm" className="mt-2 bg-violet-700 hover:bg-violet-600 text-xs" onClick={saveNotes} disabled={saving}>
                  <Save className="w-3.5 h-3.5 mr-1" />{saving ? 'Saving…' : 'Save Notes'}
                </Button>
              </div>
            </div>

            {/* Center col — activity */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h2 className="text-white font-bold mb-4">Activity Timeline</h2>
                <ProspectActivityTimeline prospectId={prospectId} />
              </div>
            </div>

            {/* Right col — questions, videos, followups */}
            <div className="space-y-4">
              {/* Questions */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-pink-400" /> Questions Asked ({questions.length})</h3>
                {questions.length === 0 ? (
                  <p className="text-slate-600 text-sm">No questions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {questions.map(q => (
                      <div key={q.id} className="bg-slate-800 rounded-lg p-3">
                        <p className="text-sm text-slate-300 font-medium">{q.question_text}</p>
                        {q.ai_response && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{q.ai_response.slice(0, 150)}…</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Views */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-blue-400" /> Video Views ({videoViews.length})</h3>
                {videoViews.length === 0 ? (
                  <p className="text-slate-600 text-sm">No videos watched yet.</p>
                ) : (
                  <div className="space-y-2">
                    {videoViews.map(v => (
                      <div key={v.id} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
                        <p className="text-sm text-slate-300">{v.video_name}</p>
                        <span className={`text-xs font-bold ${v.completed ? 'text-green-400' : 'text-yellow-400'}`}>{v.completed ? '✓ Complete' : `${v.watch_percentage || 0}%`}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-ups */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-cyan-400" /> Follow-ups ({followups.length})</h3>
                {followups.length === 0 ? (
                  <p className="text-slate-600 text-sm">No follow-ups scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {followups.map(f => (
                      <div key={f.id} className="bg-slate-800 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 capitalize">{f.followup_type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${f.status === 'sent' ? 'bg-green-900/40 text-green-400' : f.status === 'pending' ? 'bg-yellow-900/40 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>{f.status}</span>
                        </div>
                        <p className="text-sm text-slate-300 font-medium">{f.subject_line}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminNav>
    </AdminGuard>
  );
}