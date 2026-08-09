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
import { Plus, Zap } from 'lucide-react';
import AdminNav from '@/components/nav/AdminNav';
import { createPageUrl } from '@/utils';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  qualified: 'bg-green-100 text-green-800',
  converted: 'bg-slate-100 text-slate-800',
  disqualified: 'bg-red-100 text-red-800'
};

const SOURCES = ['website','referral','cold_outreach','social_media','ad_campaign','event','partner','other'];

export default function SalesLeads() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '',
    industry: '', lead_source: 'website', status: 'new', notes: '', assigned_to: ''
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['sales_leads'],
    queryFn: () => base44.asServiceRole.entities.SalesLead.list('-created_date', 200)
  });

  const createLead = useMutation({
    mutationFn: (data) => base44.asServiceRole.entities.SalesLead.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_leads'] });
      setShowCreate(false);
      setForm({ company_name: '', contact_name: '', email: '', phone: '', industry: '', lead_source: 'website', status: 'new', notes: '', assigned_to: '' });
    }
  });

  const convertToDeal = useMutation({
    mutationFn: async (lead) => {
      const deal = await base44.asServiceRole.entities.SalesDeal.create({
        lead_id: lead.id,
        company_name: lead.company_name,
        contact_name: lead.contact_name,
        email: lead.email,
        stage: 'new_lead',
        deal_value: 0
      });
      await base44.asServiceRole.entities.SalesLead.update(lead.id, { status: 'converted' });
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_leads'] });
      queryClient.invalidateQueries({ queryKey: ['sales_deals'] });
    }
  });

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.company_name.toLowerCase().includes(search.toLowerCase()) || l.contact_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminNav>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Leads</h1>
              <p className="text-slate-500 mt-1">{leads.length} total leads</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.href = createPageUrl('SalesDashboard')}>← Dashboard</Button>
              <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" />Add Lead</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>New Lead</DialogTitle></DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); createLead.mutate(form); }} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Company *</label>
                        <Input required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Contact Name *</label>
                        <Input required value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Email *</label>
                        <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Phone</label>
                        <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Industry</label>
                        <Input value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold mb-1 block">Lead Source *</label>
                        <select value={form.lead_source} onChange={e => setForm({ ...form, lead_source: e.target.value })} className="w-full h-10 border border-slate-300 rounded-md px-3 text-sm">
                          {SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Notes</label>
                      <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Assigned To</label>
                      <Input value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} placeholder="rep@company.com" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                      <Button type="submit" disabled={createLead.isPending}>{createLead.isPending ? 'Saving...' : 'Create Lead'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
            {['all','new','contacted','qualified','converted','disqualified'].map(s => (
              <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s)} className="capitalize">{s}</Button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {['new','contacted','qualified','converted','disqualified'].map(s => (
              <Card key={s}>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-slate-500 capitalize">{s}</p>
                  <p className="text-xl font-bold">{leads.filter(l => l.status === s).length}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leads Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-semibold">Company</th>
                      <th className="text-left py-3 px-4 font-semibold">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold">Source</th>
                      <th className="text-left py-3 px-4 font-semibold">Industry</th>
                      <th className="text-left py-3 px-4 font-semibold">Assigned</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="py-10 text-center text-slate-400">No leads found.</td></tr>
                    )}
                    {filtered.map(lead => (
                      <tr key={lead.id} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold">{lead.company_name}</td>
                        <td className="py-3 px-4">
                          <p>{lead.contact_name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </td>
                        <td className="py-3 px-4 capitalize text-slate-600">{lead.lead_source?.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4 text-slate-600">{lead.industry || '—'}</td>
                        <td className="py-3 px-4 text-slate-600">{lead.assigned_to || '—'}</td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[lead.status] || 'bg-gray-100'}>{lead.status}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          {lead.status !== 'converted' && lead.status !== 'disqualified' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => convertToDeal.mutate(lead)}
                              disabled={convertToDeal.isPending}
                              className="text-xs"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              To Deal
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
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