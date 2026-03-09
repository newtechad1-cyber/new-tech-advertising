import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserPlus, CalendarCheck, Briefcase, FileText } from 'lucide-react';

function Field({ label, children }) {
  return <div><label className="text-xs text-gray-400 font-medium block mb-1">{label}</label>{children}</div>;
}

export default function SalesQuickActions() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openModal = (name) => { setForm({}); setModal(name); };
  const closeModal = () => setModal(null);

  const saveNewLead = async () => {
    if (!form.company_name || !form.contact_name || !form.email || !form.lead_source) return toast.error('Fill in all required fields');
    setSaving(true);
    await base44.entities.SalesLeads.create({ ...form, status: 'new' });
    qc.invalidateQueries({ queryKey: ['sc-leads'] });
    toast.success('Lead created');
    setSaving(false);
    closeModal();
  };

  const saveScheduleDemo = async () => {
    if (!form.deal_id || !form.date) return toast.error('Fill in all required fields');
    setSaving(true);
    await base44.entities.SalesActivities.create({ deal_id: form.deal_id, activity_type: 'demo', date: form.date, notes: form.notes || 'Demo scheduled', user: form.user || '' });
    qc.invalidateQueries({ queryKey: ['sc-activity-feed'] });
    toast.success('Demo scheduled');
    setSaving(false);
    closeModal();
  };

  const saveNewDeal = async () => {
    if (!form.company_name || !form.deal_value) return toast.error('Fill required fields');
    setSaving(true);
    await base44.entities.SalesDeals.create({ ...form, deal_value: parseFloat(form.deal_value), stage: 'new_lead' });
    qc.invalidateQueries({ queryKey: ['sc-pipeline-deals'] });
    qc.invalidateQueries({ queryKey: ['sc-deals'] });
    toast.success('Deal created');
    setSaving(false);
    closeModal();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="bg-green-700 hover:bg-green-600 text-white" onClick={() => openModal('lead')}>
          <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add Lead
        </Button>
        <Button size="sm" className="bg-purple-700 hover:bg-purple-600 text-white" onClick={() => openModal('demo')}>
          <CalendarCheck className="w-3.5 h-3.5 mr-1.5" /> Schedule Demo
        </Button>
        <Button size="sm" className="bg-orange-700 hover:bg-orange-600 text-white" onClick={() => openModal('deal')}>
          <Briefcase className="w-3.5 h-3.5 mr-1.5" /> Create Deal
        </Button>
      </div>

      {/* Add Lead Modal */}
      <Dialog open={modal === 'lead'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Field label="Company Name *"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="Acme Corp" value={form.company_name || ''} onChange={e => set('company_name', e.target.value)} /></Field>
            <Field label="Contact Name *"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="John Doe" value={form.contact_name || ''} onChange={e => set('contact_name', e.target.value)} /></Field>
            <Field label="Email *"><Input className="bg-gray-800 border-gray-700 text-white" type="email" placeholder="john@acme.com" value={form.email || ''} onChange={e => set('email', e.target.value)} /></Field>
            <Field label="Lead Source *">
              <Select onValueChange={v => set('lead_source', v)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['website', 'referral', 'cold_outreach', 'social_media', 'ad_campaign', 'event', 'partner', 'other'].map(s => (
                    <SelectItem key={s} value={s} className="text-white">{s.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Assigned To"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="rep@company.com" value={form.assigned_to || ''} onChange={e => set('assigned_to', e.target.value)} /></Field>
            <Button className="w-full bg-green-700 hover:bg-green-600" onClick={saveNewLead} disabled={saving}>{saving ? 'Saving...' : 'Create Lead'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Demo Modal */}
      <Dialog open={modal === 'demo'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader><DialogTitle>Schedule Demo</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Field label="Deal ID *"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="Paste deal ID" value={form.deal_id || ''} onChange={e => set('deal_id', e.target.value)} /></Field>
            <Field label="Demo Date *"><Input className="bg-gray-800 border-gray-700 text-white" type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} /></Field>
            <Field label="Your Email"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="rep@company.com" value={form.user || ''} onChange={e => set('user', e.target.value)} /></Field>
            <Field label="Notes"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="Notes..." value={form.notes || ''} onChange={e => set('notes', e.target.value)} /></Field>
            <Button className="w-full bg-purple-700 hover:bg-purple-600" onClick={saveScheduleDemo} disabled={saving}>{saving ? 'Saving...' : 'Schedule Demo'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Deal Modal */}
      <Dialog open={modal === 'deal'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader><DialogTitle>Create Deal</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Field label="Company Name *"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="Acme Corp" value={form.company_name || ''} onChange={e => set('company_name', e.target.value)} /></Field>
            <Field label="Contact Name"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="John Doe" value={form.contact_name || ''} onChange={e => set('contact_name', e.target.value)} /></Field>
            <Field label="Deal Value ($/mo) *"><Input className="bg-gray-800 border-gray-700 text-white" type="number" placeholder="1500" value={form.deal_value || ''} onChange={e => set('deal_value', e.target.value)} /></Field>
            <Field label="Plan / Package"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="Growth, Pro, etc." value={form.plan || ''} onChange={e => set('plan', e.target.value)} /></Field>
            <Field label="Assigned Rep"><Input className="bg-gray-800 border-gray-700 text-white" placeholder="rep@company.com" value={form.assigned_to || ''} onChange={e => set('assigned_to', e.target.value)} /></Field>
            <Button className="w-full bg-orange-700 hover:bg-orange-600" onClick={saveNewDeal} disabled={saving}>{saving ? 'Saving...' : 'Create Deal'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}