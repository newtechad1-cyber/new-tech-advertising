import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminNav from '@/components/nav/AdminNav';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Plus, ArrowLeft, Calendar, DollarSign, Clock, CheckCircle, Circle, FileText, AlertCircle } from 'lucide-react';
import AddTaskModal from '@/components/pipeline/AddTaskModal';
import AddNoteModal from '@/components/pipeline/AddNoteModal';

const STAGE_OPTIONS = ['lead', 'proposal_sent', 'proposal_viewed', 'negotiation', 'decision_pending', 'won', 'lost'];
const STAGE_COLORS = {
  lead: 'bg-slate-100 text-slate-600',
  proposal_sent: 'bg-blue-100 text-blue-700',
  proposal_viewed: 'bg-indigo-100 text-indigo-700',
  negotiation: 'bg-amber-100 text-amber-700',
  decision_pending: 'bg-orange-100 text-orange-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};
const SERVICE_LABELS = {
  diy_saas: 'DIY SaaS', dfy_managed: 'DFY Managed', ada_rebuild: 'ADA Rebuild',
  streaming_tv: 'Streaming TV', video_production: 'Video', other: 'Other',
};
const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-600', medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700', urgent: 'bg-red-100 text-red-700',
};
const NOTE_ICONS = {
  call_note: '📞', meeting_note: '🤝', email_summary: '✉️', strategy_note: '🎯', general: '📝',
};

export default function ProposalDetail() {
  const proposalId = new URLSearchParams(window.location.search).get('id');
  const [proposal, setProposal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (proposalId) load(); }, [proposalId]);

  const load = async () => {
    setLoading(true);
    const [pList, tList, nList] = await Promise.all([
      base44.entities.Proposal.filter({ id: proposalId }),
      base44.entities.SalesTasks.filter({ proposal_id: proposalId }, '-created_date', 50),
      base44.entities.SalesNotes.filter({ proposal_id: proposalId }, '-created_date', 50),
    ]);
    setProposal(pList[0] || null);
    setTasks(tList);
    setNotes(nList);
    setLoading(false);
  };

  const updateField = async (fields) => {
    setSaving(true);
    await base44.entities.Proposal.update(proposalId, fields);
    setProposal(p => ({ ...p, ...fields }));
    setSaving(false);
    toast.success('Saved');
  };

  const completeTask = async (task) => {
    await base44.entities.SalesTasks.update(task.id, { status: 'completed' });
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
    toast.success('Task completed ✓');
  };

  if (!proposalId) return <AdminGuard><AdminNav><div className="p-8 text-slate-500">No proposal ID.</div></AdminNav></AdminGuard>;
  if (loading) return <AdminGuard><AdminNav><div className="flex items-center justify-center h-64 text-slate-400">Loading...</div></AdminNav></AdminGuard>;
  if (!proposal) return <AdminGuard><AdminNav><div className="p-8 text-slate-500">Proposal not found.</div></AdminNav></AdminGuard>;

  const now = new Date();
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const overdueTasks = pendingTasks.filter(t => t.due_date && new Date(t.due_date) < now);

  return (
    <AdminGuard>
      <AdminNav>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
            <Link to={createPageUrl('ProposalPipeline')}>
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Pipeline</Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-slate-900 truncate">{proposal.business_name || proposal.title}</h1>
              <p className="text-sm text-slate-500">{SERVICE_LABELS[proposal.service_type]} · {proposal.title}</p>
            </div>
            <Badge className={STAGE_COLORS[proposal.pipeline_stage || 'lead']}>
              {(proposal.pipeline_stage || 'lead').replace(/_/g, ' ')}
            </Badge>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Proposal Info */}
              <Card>
                <CardHeader><CardTitle className="text-base">Proposal Details</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Service</p>
                      <p className="font-medium">{SERVICE_LABELS[proposal.service_type]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Estimated Value</p>
                      <p className="font-semibold text-green-700 text-base">${(proposal.estimated_value || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">One-Time Fee</p>
                      <p className="font-medium">{proposal.one_time_fee ? `$${proposal.one_time_fee.toLocaleString()}` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Monthly Fee</p>
                      <p className="font-medium">{proposal.monthly_fee ? `$${proposal.monthly_fee}/mo` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Views</p>
                      <p className="font-medium">{proposal.views || 0}x {proposal.views >= 2 && <span className="text-indigo-600 text-xs">(high interest!)</span>}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Sent Date</p>
                      <p className="font-medium">{proposal.sent_at ? format(new Date(proposal.sent_at), 'MMM d, yyyy') : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Viewed</p>
                      <p className="font-medium">{proposal.last_viewed_date ? format(new Date(proposal.last_viewed_date), 'MMM d, yyyy') : 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Contact</p>
                      <p className="font-medium">{proposal.last_contact_date ? format(new Date(proposal.last_contact_date), 'MMM d, yyyy') : '—'}</p>
                    </div>
                  </div>
                  {proposal.scope_summary && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Scope Summary</p>
                      <p className="text-slate-700 bg-slate-50 rounded-lg p-3 border">{proposal.scope_summary}</p>
                    </div>
                  )}
                  {proposal.proposal_url && (
                    <a href={proposal.proposal_url} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <FileText className="w-4 h-4" />Open Proposal Document ↗
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      Follow-Up Tasks
                      {overdueTasks.length > 0 && (
                        <Badge className="bg-red-100 text-red-700 text-xs">{overdueTasks.length} overdue</Badge>
                      )}
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => setShowTaskModal(true)}>
                      <Plus className="w-3.5 h-3.5 mr-1" />Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tasks.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-400">No tasks yet</p>
                      <Button size="sm" variant="ghost" className="mt-2 text-violet-600" onClick={() => setShowTaskModal(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1" />Create first task
                      </Button>
                    </div>
                  )}
                  {pendingTasks.map(task => {
                    const isOverdue = task.due_date && new Date(task.due_date) < now;
                    return (
                      <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${isOverdue ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}>
                        <button onClick={() => completeTask(task)} className="mt-0.5 shrink-0 hover:scale-110 transition-transform">
                          <Circle className="w-4 h-4 text-slate-300 hover:text-green-500" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{task.task_title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>
                            {task.due_date && (
                              <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                                {isOverdue && <AlertCircle className="w-3 h-3" />}
                                <Calendar className="w-3 h-3" />
                                {format(new Date(task.due_date), 'MMM d, yyyy')}
                              </span>
                            )}
                          </div>
                          {task.notes && <p className="text-xs text-slate-500 mt-1">{task.notes}</p>}
                        </div>
                      </div>
                    );
                  })}
                  {completedTasks.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                        {completedTasks.length} completed tasks
                      </summary>
                      <div className="space-y-1 mt-2">
                        {completedTasks.map(task => (
                          <div key={task.id} className="flex items-center gap-2 p-2 rounded bg-slate-50 text-sm text-slate-400">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="line-through">{task.task_title}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Notes & Activity</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => setShowNoteModal(true)}>
                      <Plus className="w-3.5 h-3.5 mr-1" />Add Note
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notes.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-400">No notes yet</p>
                      <Button size="sm" variant="ghost" className="mt-2 text-violet-600" onClick={() => setShowNoteModal(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1" />Add first note
                      </Button>
                    </div>
                  )}
                  {notes.map(note => (
                    <div key={note.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          {NOTE_ICONS[note.note_type] || '📝'} {(note.note_type || 'general').replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-slate-400">{format(new Date(note.created_date), 'MMM d, yyyy · h:mm a')}</span>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.note_content}</p>
                      {note.admin_user_name && <p className="text-xs text-slate-400 mt-2">— {note.admin_user_name}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Pipeline Stage */}
              <Card>
                <CardHeader><CardTitle className="text-sm">Pipeline Stage</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Select value={proposal.pipeline_stage || 'lead'} onValueChange={v => updateField({ pipeline_stage: v })} disabled={saving}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STAGE_OPTIONS.map(s => (
                        <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-xs" onClick={() => updateField({ pipeline_stage: 'won', status: 'accepted' })}>
                      Mark Won ✓
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-200 hover:bg-red-50 text-xs" onClick={() => updateField({ pipeline_stage: 'lost', status: 'rejected' })}>
                      Mark Lost
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Action */}
              <Card>
                <CardHeader><CardTitle className="text-sm">Next Action</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Follow-Up Date</p>
                    <Input
                      type="date"
                      value={proposal.next_follow_up_date || ''}
                      onChange={e => updateField({ next_follow_up_date: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  {proposal.next_follow_up_date && (
                    <p className={`text-sm font-medium flex items-center gap-1.5 ${new Date(proposal.next_follow_up_date) < now ? 'text-red-600' : 'text-green-600'}`}>
                      <Calendar className="w-4 h-4" />
                      {new Date(proposal.next_follow_up_date) < now
                        ? '⚠️ Overdue!'
                        : `In ${Math.ceil((new Date(proposal.next_follow_up_date) - now) / 86400000)} days`}
                    </p>
                  )}
                  <Button size="sm" className="w-full" variant="outline" onClick={() => setShowTaskModal(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" />Schedule Task
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader><CardTitle className="text-sm">Deal Stats</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2.5">
                  {[
                    { label: 'Open Tasks', val: pendingTasks.length, color: pendingTasks.length > 0 ? 'text-amber-600 font-semibold' : '' },
                    { label: 'Overdue Tasks', val: overdueTasks.length, color: overdueTasks.length > 0 ? 'text-red-600 font-semibold' : 'text-slate-700' },
                    { label: 'Completed Tasks', val: completedTasks.length, color: 'text-green-600' },
                    { label: 'Notes', val: notes.length },
                    { label: 'Proposal Views', val: proposal.views || 0, color: (proposal.views || 0) >= 2 ? 'text-indigo-600 font-semibold' : '' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-slate-500">{row.label}</span>
                      <span className={row.color || 'text-slate-700'}>{row.val}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div className="space-y-2">
                {proposal.lead_id && (
                  <Link to={createPageUrl(`LeadsDashboard?lead_id=${proposal.lead_id}`)}>
                    <Button variant="outline" size="sm" className="w-full">View Lead →</Button>
                  </Link>
                )}
                <Link to={createPageUrl('ProposalPipeline')}>
                  <Button variant="outline" size="sm" className="w-full">← Back to Pipeline</Button>
                </Link>
                <Link to={createPageUrl('AdminAlerts')}>
                  <Button variant="outline" size="sm" className="w-full">Alert Center →</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {showTaskModal && (
          <AddTaskModal
            proposalId={proposalId}
            companyName={proposal.business_name || proposal.title}
            onClose={() => setShowTaskModal(false)}
            onSaved={() => { setShowTaskModal(false); load(); }}
          />
        )}
        {showNoteModal && (
          <AddNoteModal
            proposalId={proposalId}
            companyName={proposal.business_name || proposal.title}
            onClose={() => setShowNoteModal(false)}
            onSaved={() => { setShowNoteModal(false); load(); }}
          />
        )}
      </AdminNav>
    </AdminGuard>
  );
}