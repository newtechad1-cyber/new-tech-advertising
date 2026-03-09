import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function AddDealModal({ defaultStage = 'new_lead' }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', plan: '',
    deal_value: '', closing_date: '', assigned_to: '', stage: defaultStage
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.SalesDeals.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_deals'] });
      setOpen(false);
      setForm({ company_name: '', contact_name: '', email: '', plan: '', deal_value: '', closing_date: '', assigned_to: '', stage: defaultStage });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...form, deal_value: parseFloat(form.deal_value) || 0 });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New Deal</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-semibold mb-1 block">Company Name *</label>
            <Input required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} placeholder="Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold mb-1 block">Contact Name</label>
              <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Email</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@acme.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold mb-1 block">Plan / Package</label>
              <Input value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })} placeholder="SEO Pro" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Deal Value ($) *</label>
              <Input required type="number" value={form.deal_value} onChange={e => setForm({ ...form, deal_value: e.target.value })} placeholder="2500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold mb-1 block">Closing Date</label>
              <Input type="date" value={form.closing_date} onChange={e => setForm({ ...form, closing_date: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Stage</label>
              <select
                value={form.stage}
                onChange={e => setForm({ ...form, stage: e.target.value })}
                className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm"
              >
                {['new_lead','contacted','demo_scheduled','proposal_sent','negotiation','closed_won','closed_lost'].map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Assigned To</label>
            <Input value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} placeholder="rep@company.com" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Creating...' : 'Create Deal'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}