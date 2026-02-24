import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function ChatbotForm({ chatbot, open, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: chatbot?.name || '',
    type: chatbot?.type || 'general',
    status: chatbot?.status || 'draft',
    website_url: chatbot?.website_url || '',
    greeting_message: chatbot?.greeting_message || 'Hi! How can I help you today?',
    system_prompt: chatbot?.system_prompt || '',
    escalation_email: chatbot?.escalation_email || '',
    color_theme: chatbot?.color_theme || '#2563eb',
    client_id: chatbot?.client_id || '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    let saved;
    if (chatbot?.id) {
      saved = await base44.entities.Chatbot.update(chatbot.id, form);
    } else {
      saved = await base44.entities.Chatbot.create(form);
    }
    setSaving(false);
    onSaved(saved);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{chatbot?.id ? 'Edit Chatbot' : 'Create Chatbot'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} className="mt-1" placeholder="My Support Bot" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brand Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={form.color_theme} onChange={e => set('color_theme', e.target.value)} className="h-9 w-12 rounded border cursor-pointer" />
                <Input value={form.color_theme} onChange={e => set('color_theme', e.target.value)} className="flex-1" />
              </div>
            </div>
          </div>

          <div>
            <Label>Website URL</Label>
            <Input value={form.website_url} onChange={e => set('website_url', e.target.value)} className="mt-1" placeholder="https://yoursite.com" />
          </div>

          <div>
            <Label>Greeting Message</Label>
            <Input value={form.greeting_message} onChange={e => set('greeting_message', e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>System Prompt <span className="text-slate-400 text-xs">(AI personality & instructions)</span></Label>
            <Textarea
              value={form.system_prompt}
              onChange={e => set('system_prompt', e.target.value)}
              className="mt-1 h-28"
              placeholder="You are a friendly assistant for [Business Name]. You help visitors learn about our services and book consultations..."
            />
          </div>

          <div>
            <Label>Lead Notification Email</Label>
            <Input value={form.escalation_email} onChange={e => set('escalation_email', e.target.value)} className="mt-1" placeholder="you@yourbusiness.com" />
          </div>

          <div>
            <Label>Client ID <span className="text-slate-400 text-xs">(optional, for multi-client)</span></Label>
            <Input value={form.client_id} onChange={e => set('client_id', e.target.value)} className="mt-1" placeholder="Leave blank for your own business" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving || !form.name}>
            {saving ? 'Saving...' : 'Save Chatbot'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}