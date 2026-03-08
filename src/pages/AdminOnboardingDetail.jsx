import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminGuard from '@/components/auth/AdminGuard';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const PRIORITY_COLORS = {
  low: 'text-slate-500',
  medium: 'text-amber-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

const STATUS_COLORS = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-700',
  submitted: 'bg-indigo-100 text-indigo-700',
  approved: 'bg-green-100 text-green-700',
  completed: 'bg-emerald-100 text-emerald-700',
  blocked: 'bg-red-100 text-red-700',
};

export default function AdminOnboardingDetail() {
  const [params] = useSearchParams();
  const workroomId = params.get('id');
  const [workroom, setWorkroom] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => { load(); }, [workroomId]);

  const load = async () => {
    if (!workroomId) return;
    const [w, t, a, f] = await Promise.all([
      base44.entities.OnboardingWorkrooms.filter({ id: workroomId }),
      base44.entities.OnboardingTasks.filter({ workroom_id: workroomId }),
      base44.entities.OnboardingAssets.filter({ workroom_id: workroomId }),
      base44.entities.OnboardingForms.filter({ workroom_id: workroomId }),
    ]);
    setWorkroom(w[0]);
    setTasks(t || []);
    setAssets(a || []);
    setForms(f || []);
    setNotes(w[0]?.notes || '');
    setLoading(false);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    await base44.entities.OnboardingTasks.update(taskId, { status: newStatus });
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success('Task updated');
  };

  const saveNotes = async () => {
    await base44.entities.OnboardingWorkrooms.update(workroom.id, { notes });
    toast.success('Notes saved');
  };

  if (loading) return (
    <AdminGuard>
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    </AdminGuard>
  );

  if (!workroom) return null;

  const clientTasks = tasks.filter(t => t.visible_to_client);
  const internalTasks = tasks.filter(t => !t.visible_to_client);
  const missingAssets = assets.filter(a => a.status === 'missing');
  const blockersExist = missingAssets.length > 0 || tasks.some(t => t.status === 'blocked' && t.required_for_launch);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b px-6 py-3 sticky top-0 z-40 shadow-sm">
          <a href="javascript:window.history.back()" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-3">
            <ArrowLeft className="w-4 h-4" />← Back
          </a>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900">{workroom.title}</h1>
            <Badge className="bg-violet-100 text-violet-700">{workroom.status.replace(/_/g, ' ')}</Badge>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Overview */}
            <Card className="p-6">
              <h2 className="font-bold text-slate-900 mb-4">Workroom Overview</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Onboarding Type</p>
                  <p className="font-medium text-slate-900">{workroom.onboarding_type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-slate-500">Progress</p>
                  <p className="font-medium text-slate-900">{workroom.progress_percent || 0}%</p>
                </div>
                <div>
                  <p className="text-slate-500">Kickoff Date</p>
                  <p className="font-medium text-slate-900">
                    {workroom.kickoff_call_date ? format(new Date(workroom.kickoff_call_date), 'PPP') : 'Not scheduled'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Launch Target</p>
                  <p className="font-medium text-slate-900">
                    {workroom.launch_target_date ? format(new Date(workroom.launch_target_date), 'PPP') : 'Not set'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Client Tasks */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Client Tasks ({clientTasks.length})</h3>
              <div className="space-y-3">
                {clientTasks.map(t => (
                  <div key={t.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{t.task_title}</p>
                      {t.due_date && <p className="text-xs text-slate-500 mt-1">Due: {format(new Date(t.due_date), 'MMM d')}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_COLORS[t.status]}>{t.status}</Badge>
                      {t.required_for_launch && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Internal Tasks */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Internal Tasks ({internalTasks.length})</h3>
              <div className="space-y-3">
                {internalTasks.map(t => (
                  <div key={t.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{t.task_title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={t.status}
                        onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                        className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Assets */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Assets ({assets.length})</h3>
              <div className="space-y-2">
                {assets.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{a.asset_name}</p>
                    </div>
                    <Badge className={a.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Forms */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Forms ({forms.length})</h3>
              <div className="space-y-2">
                {forms.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{f.form_title}</p>
                    </div>
                    <Badge className={f.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}>
                      {f.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Internal Notes</h3>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="resize-none" />
              <Button onClick={saveNotes} className="mt-3">Save Notes</Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blockers */}
            {blockersExist && (
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-900 text-sm">Launch Blockers</h4>
                    <ul className="text-xs text-red-800 mt-2 space-y-1">
                      {missingAssets.length > 0 && <li>• {missingAssets.length} missing critical assets</li>}
                      {tasks.some(t => t.status === 'blocked' && t.required_for_launch) && <li>• Blocked required tasks</li>}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Next Actions */}
            <Card className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200">
              <h4 className="font-bold text-slate-900 mb-3">Next Actions</h4>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700">
                  <span className="font-medium">Admin:</span> {tasks.filter(t => !t.visible_to_client && t.status === 'pending').length} internal tasks pending
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Client:</span> {clientTasks.filter(t => t.status === 'pending').length} tasks to complete
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h4 className="font-bold text-slate-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full text-sm">Schedule Kickoff</Button>
                <Button variant="outline" className="w-full text-sm">Message Client</Button>
                <Button variant="outline" className="w-full text-sm">Request Asset</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}