import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const REQUEST_TYPES = [
  { value: 'sales_demo', label: 'Sales Demo' },
  { value: 'feature_explainer', label: 'Feature Explainer' },
  { value: 'industry_promo', label: 'Industry Promo' },
  { value: 'offer_ad', label: 'Offer Ad' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'social_post_video', label: 'Social Post Video' },
  { value: 'website_hero', label: 'Website Hero' },
];

const INDUSTRIES = ['HVAC', 'Restaurant', 'Plumbing', 'Contractor', 'Dental', 'Med Spa', 'Roofing', 'Retail', 'General'];
const FORMATS = [
  { value: 'hybrid', label: 'Hybrid (Avatar + Visuals)' },
  { value: 'avatar', label: 'Avatar Talking Head' },
  { value: 'motion_promo', label: 'Motion Promo' },
  { value: 'screen_demo', label: 'Screen Demo' },
];
const ORIENTATIONS = [
  { value: 'landscape', label: 'Landscape (16:9)' },
  { value: 'square', label: 'Square (1:1)' },
  { value: 'vertical', label: 'Vertical (9:16)' },
];

export default function NewRequestModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', request_type: 'feature_explainer', goal: '', industry: '',
    audience: '', offer: '', cta: '', video_format: 'hybrid',
    orientation: 'landscape', duration_target: '2 minutes', avatar_required: false,
    priority: 'normal', notes: ''
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title) return;
    setSaving(true);
    const record = await base44.entities.VideoRequests.create({ ...form, status: 'draft' });
    setSaving(false);
    onCreated(record);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Video Request</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="col-span-2">
            <Label>Video Title *</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. HVAC Spring Tune-Up Promo" />
          </div>
          <div>
            <Label>Request Type</Label>
            <Select value={form.request_type} onValueChange={v => set('request_type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{REQUEST_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Industry</Label>
            <Select value={form.industry} onValueChange={v => set('industry', v)}>
              <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>{INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Goal</Label>
            <Input value={form.goal} onChange={e => set('goal', e.target.value)} placeholder="What should this video accomplish?" />
          </div>
          <div>
            <Label>Video Format</Label>
            <Select value={form.video_format} onValueChange={v => set('video_format', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FORMATS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Orientation</Label>
            <Select value={form.orientation} onValueChange={v => set('orientation', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ORIENTATIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target Duration</Label>
            <Input value={form.duration_target} onChange={e => set('duration_target', e.target.value)} placeholder="e.g. 90 seconds" />
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={v => set('priority', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target Audience</Label>
            <Input value={form.audience} onChange={e => set('audience', e.target.value)} placeholder="e.g. HVAC homeowners" />
          </div>
          <div>
            <Label>CTA</Label>
            <Input value={form.cta} onChange={e => set('cta', e.target.value)} placeholder="e.g. Start Free Trial" />
          </div>
          <div className="col-span-2">
            <Label>Offer / Message</Label>
            <Textarea value={form.offer} onChange={e => set('offer', e.target.value)} placeholder="What offer or message should be highlighted?" rows={2} />
          </div>
          <div className="col-span-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes or instructions" rows={2} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !form.title} className="bg-blue-600 hover:bg-blue-700 text-white">
            {saving ? 'Creating...' : 'Create Request'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}