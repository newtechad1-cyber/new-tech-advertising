import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, X } from 'lucide-react';

export default function CoreTopicForm({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', primary_topic: '', industry: '', target_audience: '',
    local_market_focus: '', content_angle: '', funnel_stage: 'Awareness',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const record = await base44.entities.AuthorityContentCore.create({ ...form, status: 'draft' });
    onCreated?.(record);
    onClose?.();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">New Authority Topic</h2>
            <p className="text-slate-400 text-sm mt-0.5">Fill in the brief — AI handles the rest</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input required placeholder="Campaign title (e.g. AI Social Media for HVAC Companies)" value={form.title} onChange={e => set('title', e.target.value)} className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
          <Input required placeholder="Primary topic / keyword cluster" value={form.primary_topic} onChange={e => set('primary_topic', e.target.value)} className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Industry" value={form.industry} onChange={e => set('industry', e.target.value)} className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
            <Input placeholder="Local market focus" value={form.local_market_focus} onChange={e => set('local_market_focus', e.target.value)} className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <Input placeholder="Target audience" value={form.target_audience} onChange={e => set('target_audience', e.target.value)} className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
          <Textarea placeholder="Content angle / unique hook" value={form.content_angle} onChange={e => set('content_angle', e.target.value)} className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 h-20 resize-none" />
          <Select value={form.funnel_stage} onValueChange={v => set('funnel_stage', v)}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {['Awareness','Consideration','Conversion','Authority'].map(s => (
                <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold">
            <Zap className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Topic Brief'}
          </Button>
        </form>
      </div>
    </div>
  );
}