import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function AddTaskModal({ proposalId, companyName, leadId, onClose, onSaved }) {
  const [form, setForm] = useState({
    task_title: '',
    task_type: 'call_client',
    priority: 'medium',
    due_date: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.task_title.trim()) { toast.error('Task title is required'); return; }
    setSaving(true);
    await base44.entities.SalesTasks.create({
      ...form,
      proposal_id: proposalId || '',
      lead_id: leadId || '',
      company_name: companyName || '',
      status: 'pending',
    });
    toast.success('Task created');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg text-slate-900">New Follow-Up Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Task Title *</label>
            <Input
              placeholder="e.g. Call client about proposal"
              value={form.task_title}
              onChange={e => set('task_title', e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Task Type</label>
              <Select value={form.task_type} onValueChange={v => set('task_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="call_client">📞 Call Client</SelectItem>
                  <SelectItem value="send_followup_email">✉️ Send Follow-Up Email</SelectItem>
                  <SelectItem value="schedule_demo">🖥️ Schedule Demo</SelectItem>
                  <SelectItem value="review_proposal">📄 Review Proposal</SelectItem>
                  <SelectItem value="prepare_revised_proposal">✏️ Revise Proposal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Priority</label>
              <Select value={form.priority} onValueChange={v => set('priority', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🔵 Medium</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Due Date</label>
            <Input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Notes (optional)</label>
            <Textarea
              placeholder="Additional context..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={2}
            />
          </div>
          {companyName && (
            <p className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded">
              🏢 Company: {companyName}
            </p>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-violet-600 hover:bg-violet-700" onClick={save} disabled={saving}>
            {saving ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}