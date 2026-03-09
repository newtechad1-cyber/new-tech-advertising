import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

const payoutColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
};

export default function AdminResellerRevenue() {
  const queryClient = useQueryClient();
  const [resellerFilter, setResellerFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    reseller_id: '', period_label: '', period_start: '', period_end: '',
    gross_revenue: '', commission_rate: '', commission_amount: '',
    payout_status: 'pending', source: 'subscription', notes: ''
  });

  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: () => base44.asServiceRole.entities.ResellerAccounts.list('-created_date', 100)
  });

  const { data: revenue = [] } = useQuery({
    queryKey: ['reseller_revenue_all'],
    queryFn: () => base44.asServiceRole.entities.ResellerRevenue.list('-period_start', 500)
  });

  const createRevenue = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.ResellerRevenue.create({
      ...data,
      gross_revenue: parseFloat(data.gross_revenue),
      commission_rate: parseFloat(data.commission_rate),
      commission_amount: parseFloat(data.commission_amount)
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['reseller_revenue_all'] }); setShowAdd(false); }
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.asServiceRole.entities.ResellerRevenue.update(id, {
      payout_status: status,
      paid_at: status === 'paid' ? new Date().toISOString().split('T')[0] : undefined
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reseller_revenue_all'] })
  });

  const getResellerName = (id) => resellers.find(r => r.id === id)?.reseller_name || id;

  const totalCommissions = revenue.reduce((s, r) => s + (r.commission_amount || 0), 0);
  const pendingPayouts = revenue.filter(r => r.payout_status === 'pending').reduce((s, r) => s + (r.commission_amount || 0), 0);
  const paidOut = revenue.filter(r => r.payout_status === 'paid').reduce((s, r) => s + (r.commission_amount || 0), 0);

  const filtered = revenue.filter(r => {
    const matchReseller = resellerFilter === 'all' || r.reseller_id === resellerFilter;
    const matchStatus = statusFilter === 'all' || r.payout_status === statusFilter;
    return matchReseller && matchStatus;
  });

  // Auto-calculate commission when gross + rate change
  const handleGrossOrRateChange = (field, value) => {
    const updated = { ...form, [field]: value };
    const gross = parseFloat(updated.gross_revenue) || 0;
    const rate = parseFloat(updated.commission_rate) || 0;
    updated.commission_amount = ((gross * rate) / 100).toFixed(2);
    setForm(updated);
  };

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Reseller Revenue</h1>
              <p className="text-slate-500 mt-1">Commission tracking and payout management</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('AdminResellers')}>← Resellers</Button>
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" />Log Revenue</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Log Commission</DialogTitle></DialogHeader>
                  <form onSubmit={e => { e.preventDefault(); createRevenue.mutate(form); }} className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Reseller *</label>
                      <select required value={form.reseller_id} onChange={e => setForm({ ...form, reseller_id: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                        <option value="">Select reseller...</option>
                        {resellers.map(r => <option key={r.id} value={r.id}>{r.reseller_name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Period Label *</label>
                        <Input required placeholder="March 2026" value={form.period_label} onChange={e => setForm({ ...form, period_label: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Source</label>
                        <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                          {['subscription','setup_fee','bonus','manual'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Period Start</label>
                        <Input type="date" value={form.period_start} onChange={e => setForm({ ...form, period_start: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Period End</label>
                        <Input type="date" value={form.period_end} onChange={e => setForm({ ...form, period_end: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Gross Revenue ($)</label>
                        <Input type="number" step="0.01" value={form.gross_revenue} onChange={e => handleGrossOrRateChange('gross_revenue', e.target.value)} placeholder="5000" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Rate (%)</label>
                        <Input type="number" step="0.1" value={form.commission_rate} onChange={e => handleGrossOrRateChange('commission_rate', e.target.value)} placeholder="20" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Commission ($)</label>
                        <Input type="number" step="0.01" value={form.commission_amount} onChange={e => setForm({ ...form, commission_amount: e.target.value })} placeholder="1000" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Status</label>
                      <select value={form.payout_status} onChange={e => setForm({ ...form, payout_status: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                        {['pending','processing','paid','failed'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                      <Button type="submit" disabled={createRevenue.isPending}>{createRevenue.isPending ? 'Saving...' : 'Save'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <Card><CardContent className="p-5 flex items-center gap-3"><div className="p-2.5 rounded-xl bg-blue-50"><TrendingUp className="w-5 h-5 text-blue-600" /></div><div><p className="text-xs text-slate-500">Total Commissions</p><p className="text-2xl font-bold">${totalCommissions.toLocaleString()}</p></div></CardContent></Card>
            <Card><CardContent className="p-5 flex items-center gap-3"><div className="p-2.5 rounded-xl bg-orange-50"><DollarSign className="w-5 h-5 text-orange-600" /></div><div><p className="text-xs text-slate-500">Pending Payouts</p><p className="text-2xl font-bold text-orange-600">${pendingPayouts.toLocaleString()}</p></div></CardContent></Card>
            <Card><CardContent className="p-5 flex items-center gap-3"><div className="p-2.5 rounded-xl bg-green-50"><CheckCircle className="w-5 h-5 text-green-600" /></div><div><p className="text-xs text-slate-500">Paid Out</p><p className="text-2xl font-bold text-green-600">${paidOut.toLocaleString()}</p></div></CardContent></Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select value={resellerFilter} onChange={e => setResellerFilter(e.target.value)} className="h-9 border border-slate-300 rounded-md px-3 text-sm">
              <option value="all">All Resellers</option>
              {resellers.map(r => <option key={r.id} value={r.id}>{r.reseller_name}</option>)}
            </select>
            {['all','pending','processing','paid','failed'].map(s => (
              <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s)} className="capitalize">{s}</Button>
            ))}
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left py-3 px-4 font-semibold">Reseller</th>
                    <th className="text-left py-3 px-4 font-semibold">Period</th>
                    <th className="text-left py-3 px-4 font-semibold">Gross Rev</th>
                    <th className="text-left py-3 px-4 font-semibold">Rate</th>
                    <th className="text-left py-3 px-4 font-semibold">Commission</th>
                    <th className="text-left py-3 px-4 font-semibold">Source</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-slate-400">No revenue records.</td></tr>}
                  {filtered.map(r => (
                    <tr key={r.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold">{getResellerName(r.reseller_id)}</td>
                      <td className="py-3 px-4">{r.period_label}</td>
                      <td className="py-3 px-4">${(r.gross_revenue || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">{r.commission_rate}%</td>
                      <td className="py-3 px-4 font-bold text-green-700">${(r.commission_amount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 capitalize text-slate-500">{r.source}</td>
                      <td className="py-3 px-4"><Badge className={payoutColors[r.payout_status] || 'bg-slate-100'}>{r.payout_status}</Badge></td>
                      <td className="py-3 px-4">
                        {r.payout_status === 'pending' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: r.id, status: 'paid' })}>
                            Mark Paid
                          </Button>
                        )}
                        {r.payout_status === 'paid' && <span className="text-xs text-green-600">✓ {r.paid_at}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminNav>
  );
}