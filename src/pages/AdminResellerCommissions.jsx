import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  disputed: 'bg-red-100 text-red-800',
  voided: 'bg-gray-100 text-gray-800'
};

export default function AdminResellerCommissions() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    reseller_id: '', commission_type: 'monthly_recurring', period_label: '',
    period_start: '', period_end: '', gross_revenue: '', commission_rate: '',
    commission_amount: '', status: 'pending'
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ['commissions_all'],
    queryFn: () => base44.asServiceRole.entities.ResellerCommissions.list('-created_date', 200)
  });

  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: () => base44.asServiceRole.entities.ResellerAccounts.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.ResellerCommissions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions_all'] });
      setShowCreate(false);
    }
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.asServiceRole.entities.ResellerCommissions.update(id, { status, paid_date: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['commissions_all'] })
  });

  const filtered = commissions.filter(c => {
    const reseller = resellers.find(r => r.id === c.reseller_id);
    const matchSearch = !search || reseller?.reseller_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.commission_amount || 0), 0);
  const totalPaid = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + (c.commission_amount || 0), 0);
  const totalApproved = commissions.filter(c => c.status === 'approved').reduce((s, c) => s + (c.commission_amount || 0), 0);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Reseller Commissions</h1>
              <p className="text-slate-500 mt-1">Track and manage partner commission payouts</p>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Log Commission</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Log Commission</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...form, gross_revenue: parseFloat(form.gross_revenue) || 0, commission_rate: parseFloat(form.commission_rate) || 0, commission_amount: parseFloat(form.commission_amount) || 0 }); }} className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Reseller *</label>
                    <select value={form.reseller_id} onChange={e => setForm({ ...form, reseller_id: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm" required>
                      <option value="">Select Reseller</option>
                      {resellers.map(r => <option key={r.id} value={r.id}>{r.reseller_name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Period Label</label>
                      <Input value={form.period_label} onChange={e => setForm({ ...form, period_label: e.target.value })} placeholder="March 2026" required />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Type</label>
                      <select value={form.commission_type} onChange={e => setForm({ ...form, commission_type: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                        <option value="monthly_recurring">Monthly Recurring</option>
                        <option value="one_time">One-Time</option>
                        <option value="bonus">Bonus</option>
                        <option value="adjustment">Adjustment</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Period Start</label>
                      <Input type="date" value={form.period_start} onChange={e => setForm({ ...form, period_start: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Period End</label>
                      <Input type="date" value={form.period_end} onChange={e => setForm({ ...form, period_end: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Gross Revenue</label>
                      <Input type="number" value={form.gross_revenue} onChange={e => setForm({ ...form, gross_revenue: e.target.value })} placeholder="0" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Rate (%)</label>
                      <Input type="number" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: e.target.value })} placeholder="20" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Amount *</label>
                      <Input type="number" value={form.commission_amount} onChange={e => setForm({ ...form, commission_amount: e.target.value })} placeholder="0.00" required />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Log Commission'}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="p-6"><p className="text-xs text-slate-500">Pending Payout</p><p className="text-3xl font-bold text-yellow-600">${totalPending.toFixed(2)}</p></CardContent></Card>
            <Card><CardContent className="p-6"><p className="text-xs text-slate-500">Approved (Ready to Pay)</p><p className="text-3xl font-bold text-blue-600">${totalApproved.toFixed(2)}</p></CardContent></Card>
            <Card><CardContent className="p-6"><p className="text-xs text-slate-500">Total Paid All Time</p><p className="text-3xl font-bold text-green-600">${totalPaid.toFixed(2)}</p></CardContent></Card>
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center flex-wrap">
            <Input placeholder="Search reseller..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
            {['all', 'pending', 'approved', 'paid', 'disputed'].map(s => (
              <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s)} className="capitalize">{s}</Button>
            ))}
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-semibold">Reseller</th>
                      <th className="text-left py-3 px-4 font-semibold">Period</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Gross Revenue</th>
                      <th className="text-left py-3 px-4 font-semibold">Rate</th>
                      <th className="text-left py-3 px-4 font-semibold">Commission</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} className="py-10 text-center text-slate-500">No commissions found.</td></tr>
                    )}
                    {filtered.map(c => {
                      const reseller = resellers.find(r => r.id === c.reseller_id);
                      return (
                        <tr key={c.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold">{reseller?.reseller_name || '—'}</td>
                          <td className="py-3 px-4 text-slate-600">{c.period_label}</td>
                          <td className="py-3 px-4 text-slate-600 capitalize">{c.commission_type.replace(/_/g, ' ')}</td>
                          <td className="py-3 px-4">${(c.gross_revenue || 0).toLocaleString()}</td>
                          <td className="py-3 px-4">{c.commission_rate ? `${c.commission_rate}%` : '—'}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">${(c.commission_amount || 0).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Badge className={statusColors[c.status] || 'bg-gray-100'}>{c.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              {c.status === 'pending' && (
                                <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: c.id, status: 'approved' })}>Approve</Button>
                              )}
                              {c.status === 'approved' && (
                                <Button size="sm" onClick={() => updateStatus.mutate({ id: c.id, status: 'paid' })}>Mark Paid</Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminNav>
  );
}