import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ClientGuard from '@/components/auth/ClientGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, FileText, Upload, Calendar, MessageCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function ClientOnboarding() {
  const [user, setUser] = useState(null);
  const [workroom, setWorkroom] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Find workroom for this user's company
      const workrooms = await base44.entities.OnboardingWorkrooms.filter({
        company_id: currentUser.company_id,
        status: { $nin: ['launched', 'paused'] },
      });

      if (workrooms.length > 0) {
        const w = workrooms[0];
        setWorkroom(w);

        // Load workroom content
        const [t, a, f] = await Promise.all([
          base44.entities.OnboardingTasks.filter({ workroom_id: w.id, visible_to_client: true }),
          base44.entities.OnboardingAssets.filter({ workroom_id: w.id, visible_to_client: true }),
          base44.entities.OnboardingForms.filter({ workroom_id: w.id, visible_to_client: true }),
        ]);
        setTasks(t || []);
        setAssets(a || []);
        setForms(f || []);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <ClientGuard>
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    </ClientGuard>
  );

  if (!workroom) return (
    <ClientGuard>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <p className="text-slate-500 font-medium">No active onboarding workroom yet.</p>
          <p className="text-sm text-slate-400 mt-2">Once your proposal is accepted, your onboarding will appear here.</p>
        </Card>
      </div>
    </ClientGuard>
  );

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const nextStep = pendingTasks[0];

  return (
    <ClientGuard>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome to Onboarding! 🚀</h1>
            <p className="text-indigo-100">Here's what we need to get your project moving</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {/* Progress */}
          <Card className="p-6 bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Your Progress</h2>
              <span className="text-2xl font-bold text-violet-600">{workroom.progress_percent || 0}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-3">
              <div
                className="bg-gradient-to-r from-violet-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${workroom.progress_percent || 0}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-3">
              {completedTasks.length} of {tasks.length} tasks complete
            </p>
          </Card>

          {/* Next Step */}
          {nextStep && (
            <Card className="p-6 border-2 border-violet-200 bg-violet-50">
              <h3 className="font-bold text-slate-900 mb-3">Your Next Step</h3>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-lg">{nextStep.task_title}</h4>
                  {nextStep.due_date && (
                    <p className="text-sm text-slate-600 mt-2">
                      Due {formatDistanceToNow(new Date(nextStep.due_date), { addSuffix: true })}
                    </p>
                  )}
                  {nextStep.description && (
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{nextStep.description}</p>
                  )}
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700 px-6">Start</Button>
              </div>
            </Card>
          )}

          {/* Tasks */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Your Tasks ({tasks.length})</h3>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-shrink-0 mt-1">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.task_title}
                    </h4>
                    {task.due_date && (
                      <p className="text-xs text-slate-500 mt-1">Due {format(new Date(task.due_date), 'PPP')}</p>
                    )}
                  </div>
                  <Badge className={task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Assets */}
          {assets.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Files & Assets ({assets.length})
              </h3>
              <p className="text-sm text-slate-600 mb-4">Upload or provide the following:</p>
              <div className="grid gap-3">
                {assets.map(asset => (
                  <div key={asset.id} className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-violet-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{asset.asset_name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {asset.status === 'missing' ? '✓ Upload required' : '✓ Approved'}
                        </p>
                      </div>
                      {asset.status === 'missing' && (
                        <Button variant="outline" size="sm">Upload</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Forms */}
          {forms.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Forms to Complete ({forms.length})
              </h3>
              <div className="space-y-3">
                {forms.map(form => (
                  <div key={form.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-900">{form.form_title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{form.status}</p>
                    </div>
                    {form.status === 'submitted' || form.status === 'approved' ? (
                      <Badge className="bg-green-100 text-green-700">✓ Complete</Badge>
                    ) : (
                      <Button>Start Form</Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Kickoff Section */}
          {workroom.kickoff_call_date && (
            <Card className="p-6 border-l-4 border-l-indigo-600">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Kickoff Call Scheduled
              </h3>
              <p className="text-lg font-semibold text-indigo-600">
                {format(new Date(workroom.kickoff_call_date), 'PPPP p')}
              </p>
            </Card>
          )}

          {/* Support */}
          <Card className="p-6 bg-slate-50">
            <h3 className="font-bold text-slate-900 mb-4">Questions?</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Message Us
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Request Call
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ClientGuard>
  );
}