import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function AddClientModal({ resellerId }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    plan_type: '',
    monthly_value: ''
  });

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.ResellerClients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller_clients', resellerId] });
      setOpen(false);
      setForm({ client_name: '', client_email: '', plan_type: '', monthly_value: '' });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      reseller_id: resellerId,
      monthly_value: parseFloat(form.monthly_value) || 0,
      status: 'active',
      portal_access_enabled: true,
      branding_override_enabled: true,
      start_date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Company Name</label>
            <Input
              required
              placeholder="e.g. Acme Corp"
              value={form.client_name}
              onChange={e => setForm({ ...form, client_name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Contact Email</label>
            <Input
              required
              type="email"
              placeholder="contact@acme.com"
              value={form.client_email}
              onChange={e => setForm({ ...form, client_email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Plan / Package</label>
            <Input
              placeholder="e.g. SEO Retainer Pro"
              value={form.plan_type}
              onChange={e => setForm({ ...form, plan_type: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Monthly Value ($)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={form.monthly_value}
              onChange={e => setForm({ ...form, monthly_value: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}