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
import { createPageUrl } from '@/utils';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800'
};

export default function AdminResellers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    reseller_name: '', contact_name: '', contact_email: '',
    commission_rate: 20, commission_model: 'revenue_share', white_label_enabled: false, status: 'pending'
  });

  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: () => base44.asServiceRole.entities.ResellerAccounts.list('-created_date', 100)
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['reseller_clients_all'],
    queryFn: () => base44.asServiceRole.entities.ResellerClients.list()
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ['commissions_all'],
    queryFn: () => base44.asServiceRole.entities.ResellerCommissions.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.ResellerAccounts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resellers'] });
      setShowCreate(false);
      setForm({ reseller_name: '', contact_name: '', contact_email: '', commission_rate: 20, commission_model: 'revenue_share', white_label_enabled: false, status: 'pending' });
    }
  });

  const filtered = resellers.filter(r =>
    !search || r.reseller_name.toLowerCase().includes(search.toLowerCase()) || r.contact_email.toLowerCase().includes(search.toLowerCase())
  );

  // Summary metrics
  const totalMRR = clients.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_value || 0), 0);
  const totalPaidCommissions = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + (c.commission_amount || 0), 0);
  const totalPending = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.commission_amount || 0), 0);

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Reseller Management</h1>
              <p className="text-slate-500 mt-1">Manage reseller partners, commissions, and white label settings</p>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Add Reseller</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Reseller Account</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Reseller Name *</label>
                    <Input required value={form.reseller_name} onChange={e => setForm({ ...form, reseller_name: e.target.value })} placeholder="Agency Name" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Contact Name</label>
                    <Input value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Contact Email *</label>
                    <Input required type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="partner@agency.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Commission Rate (%)</label>
                      <Input type="number" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: parseFloat(e.target.value) })} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Status</label>
                      <select
                        value={form.status}
                        onChange={e => setForm({ ...form, status: e.target.value })}
                        className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.white_label_enabled} onChange={e => setForm({ ...form, white_label_enabled: e.target.checked })} />
                    <span className="text-sm">Enable White Label</span>
                  </label>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? 'Creating...' : 'Create Reseller'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-6"><p className="text-xs text-slate-500">Total Resellers</p><p className="text-3xl font-bold text-slate-900">{resellers.length}</p></CardContent></Card>
            <Card><CardContent className="p-6"><p className="text-xs text-slate-500">Active Partners</p><p className="text-3xl font-bold text-green-600">{resellers.filter(r => r.status === 'active').length}</p></CardContent></Card>
            <Card><CardContent className="p-6"><p className="text-xs text-slate-500">Reseller Client MRR</p><p className="text-3xl font-bold text-blue-600">${totalMRR.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="p-6"><p className="text-xs text-slate-500">Commissions Paid</p><p className="text-3xl font-bold text-purple-600">${totalPaidCommissions.toFixed(0)}</p></CardContent></Card>
          </div>

          {/* Resellers Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Resellers</CardTitle>
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-semibold">Reseller</th>
                      <th className="text-left py-3 px-4 font-semibold">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold">Commission</th>
                      <th className="text-left py-3 px-4 font-semibold">Clients</th>
                      <th className="text-left py-3 px-4 font-semibold">White Label</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => {
                      const rClients = clients.filter(c => c.reseller_id === r.id);
                      const rMRR = rClients.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_value || 0), 0);
                      return (
                        <tr key={r.id} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-semibold">{r.reseller_name}</td>
                          <td className="py-3 px-4 text-slate-600 text-xs">
                            <p>{r.contact_name}</p>
                            <p>{r.contact_email}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold">{r.commission_rate}%</span>
                            <span className="text-xs text-slate-500 ml-1">({r.commission_model})</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold">{rClients.length}</span>
                            <span className="text-xs text-slate-500 ml-1">${rMRR.toLocaleString()}/mo</span>
                          </td>
                          <td className="py-3 px-4">
                            {r.white_label_enabled
                              ? <Badge className="bg-purple-100 text-purple-800">Enabled</Badge>
                              : <Badge variant="outline">No</Badge>}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={statusColors[r.status] || 'bg-gray-100 text-gray-800'}>{r.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="ghost"
                              onClick={() => window.location.href = createPageUrl(`AdminResellerClients?reseller_id=${r.id}`)}>
                              Manage
                            </Button>
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