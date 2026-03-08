import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function AddNoteModal({ proposalId, companyName, leadId, onClose, onSaved }) {
  const [form, setForm] = useState({ note_type: 'general', note_content: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.note_content.trim()) { toast.error('Note content is required'); return; }
    setSaving(true);
    const user = await base44.auth.me();
    await base44.entities.SalesNotes.create({
      ...form,
      proposal_id: proposalId || '',
      lead_id: leadId || '',
      company_name: companyName || '',
      admin_user_id: user?.id || '',
      admin_user_name: user?.full_name || user?.email || '',
    });
    toast.success('Note saved');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-lg text-slate-900">Add Note</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Note Type</label>
            <Select value={form.note_type} onValueChange={v => setForm(f => ({ ...f, note_type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="call_note">📞 Call Note</SelectItem>
                <SelectItem value="meeting_note">🤝 Meeting Note</SelectItem>
                <SelectItem value="email_summary">✉️ Email Summary</SelectItem>
                <SelectItem value="strategy_note">🎯 Strategy Note</SelectItem>
                <SelectItem value="general">📝 General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Note *</label>
            <Textarea
              placeholder="Write your note here..."
              value={form.note_content}
              onChange={e => setForm(f => ({ ...f, note_content: e.target.value }))}
              rows={6}
              autoFocus
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
            {saving ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>
    </div>
  );
}