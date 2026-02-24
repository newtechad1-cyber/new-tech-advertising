import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';

export default function AddCampaignModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({
    campaign_name: '',
    client_name: '',
    advertiser_id: '',
    campaign_id: '',
    status: 'active',
    start_date: '',
    end_date: '',
    budget: '',
    monthly_spend: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, budget: Number(form.budget) || null, monthly_spend: Number(form.monthly_spend) || null };
    await base44.entities.VibeCampaign.create(data);
    setSaving(false);
    onSaved();
    onClose();
  };

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Vibe Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Campaign Name *</Label>
              <Input value={form.campaign_name} onChange={e => set('campaign_name', e.target.value)} placeholder="e.g. Spring Local Push" />
            </div>
            <div>
              <Label>Client Name</Label>
              <Input value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Business name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Vibe Advertiser ID *</Label>
              <Input value={form.advertiser_id} onChange={e => set('advertiser_id', e.target.value)} placeholder="From Vibe dashboard" />
            </div>
            <div>
              <Label>Vibe Campaign ID</Label>
              <Input value={form.campaign_id} onChange={e => set('campaign_id', e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Budget ($)</Label>
              <Input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="e.g. 2000" />
            </div>
            <div>
              <Label>Monthly Spend ($)</Label>
              <Input type="number" value={form.monthly_spend} onChange={e => set('monthly_spend', e.target.value)} placeholder="e.g. 500" />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.campaign_name || !form.advertiser_id}
              className="bg-purple-600 hover:bg-purple-700 text-white">
              {saving ? 'Saving...' : 'Save Campaign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}