import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, Loader2, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_STYLES = {
  pending: 'bg-gray-800 text-gray-400 border-gray-700',
  generating: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  complete: 'bg-green-900/40 text-green-400 border-green-800',
  failed: 'bg-red-900/40 text-red-400 border-red-800',
};
const STATUS_ICONS = { pending: Clock, generating: Loader2, complete: CheckCircle, failed: AlertCircle };

const TYPE_COLORS = {
  blog: 'bg-blue-900/30 text-blue-400', landing_page: 'bg-purple-900/30 text-purple-400',
  video_script: 'bg-orange-900/30 text-orange-400', social_series: 'bg-pink-900/30 text-pink-400',
  email_sequence: 'bg-cyan-900/30 text-cyan-400',
};
const PRIORITY_COLORS = { high: 'text-red-400', medium: 'text-yellow-400', low: 'text-gray-500' };

function Field({ label, children }) {
  return <div><label className="text-xs text-gray-400 font-medium block mb-1">{label}</label>{children}</div>;
}

export default function TopicsQueue() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState({});

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics-queue'],
    queryFn: () => base44.entities.ContentTopics.list('-created_date', 100),
    refetchInterval: 10000,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveTopic = async () => {
    if (!form.title || !form.content_type) return toast.error('Fill in title and content type');
    setSaving(true);
    await base44.entities.ContentTopics.create({ ...form, status: 'pending' });
    qc.invalidateQueries({ queryKey: ['topics-queue'] });
    toast.success('Topic added to queue');
    setSaving(false);
    setModal(false);
    setForm({});
  };

  const generateNow = async (topic) => {
    setGenerating(g => ({ ...g, [topic.id]: true }));
    try {
      const res = await base44.functions.invoke('generateContentFromTopic', { topic_id: topic.id });
      if (res.data?.success) {
        toast.success(`Generated ${res.data.generated?.length || 0} content pieces`);
        qc.invalidateQueries({ queryKey: ['topics-queue'] });
        qc.invalidateQueries({ queryKey: ['generated-content'] });
        qc.invalidateQueries({ queryKey: ['video-scripts'] });
      } else {
        toast.error(res.data?.error || 'Generation failed');
      }
    } catch (e) {
      toast.error('Error: ' + e.message);
    }
    setGenerating(g => ({ ...g, [topic.id]: false }));
  };

  const stats = {
    total: topics.length,
    pending: topics.filter(t => t.status === 'pending').length,
    complete: topics.filter(t => t.status === 'complete').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-xs text-gray-500">
          <span>{stats.total} topics</span>
          <span className="text-yellow-400">{stats.pending} pending</span>
          <span className="text-green-400">{stats.complete} complete</span>
        </div>
        <Button size="sm" className="bg-violet-700 hover:bg-violet-600 text-white" onClick={() => setModal(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Topic
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-600"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
      ) : topics.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl text-gray-600">
          <p className="font-medium text-gray-500">No topics yet</p>
          <p className="text-sm mt-1">Add a content topic to start generating</p>
        </div>
      ) : (
        <div className="space-y-2">
          {topics.map(t => {
            const StatusIcon = STATUS_ICONS[t.status] || Clock;
            const isGen = generating[t.id];
            return (
              <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-700 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[t.status] || STATUS_STYLES.pending}`}>
                      <StatusIcon className={`w-3 h-3 inline mr-1 ${t.status === 'generating' ? 'animate-spin' : ''}`} />
                      {t.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[t.content_type] || 'bg-gray-800 text-gray-400'}`}>{t.content_type?.replace('_', ' ')}</span>
                    <span className={`text-xs font-bold ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{t.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{[t.industry, t.city, t.keyword].filter(Boolean).join(' · ')}</p>
                </div>
                {(t.status === 'pending' || t.status === 'failed') && (
                  <Button size="sm" variant="outline" className="border-violet-700 text-violet-400 hover:bg-violet-900/30 flex-shrink-0" onClick={() => generateNow(t)} disabled={isGen}>
                    {isGen ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Zap className="w-3.5 h-3.5 mr-1" /> Generate</>}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader><DialogTitle>Add Content Topic</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Field label="Title *"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="e.g. HVAC Marketing in Dallas" value={form.title || ''} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Content Type *">
              <Select onValueChange={v => set('content_type', v)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['blog', 'landing_page', 'video_script', 'social_series', 'email_sequence'].map(t => (
                    <SelectItem key={t} value={t} className="text-white">{t.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Industry"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="HVAC" value={form.industry || ''} onChange={e => set('industry', e.target.value)} /></Field>
              <Field label="City"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="Dallas" value={form.city || ''} onChange={e => set('city', e.target.value)} /></Field>
            </div>
            <Field label="Target Keyword"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="hvac marketing agency dallas" value={form.keyword || ''} onChange={e => set('keyword', e.target.value)} /></Field>
            <Field label="Priority">
              <Select onValueChange={v => set('priority', v)} defaultValue="medium">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['high', 'medium', 'low'].map(p => <SelectItem key={p} value={p} className="text-white">{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Button className="w-full bg-violet-700 hover:bg-violet-600" onClick={saveTopic} disabled={saving}>{saving ? 'Saving...' : 'Add Topic'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}