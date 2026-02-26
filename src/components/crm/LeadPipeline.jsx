import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Search, Plus, Pencil, Trash2, Phone, Mail, Globe,
  MapPin, Tag, Calendar, DollarSign, User, Loader2, ChevronRight, X
} from 'lucide-react';

const STATUS_CONFIG = {
  prospect: { label: 'Prospect', color: 'bg-slate-700 text-slate-300', dot: 'bg-slate-400' },
  new: { label: 'New Lead', color: 'bg-blue-900 text-blue-300', dot: 'bg-blue-400' },
  contacted: { label: 'Contacted', color: 'bg-yellow-900 text-yellow-300', dot: 'bg-yellow-400' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-purple-900 text-purple-300', dot: 'bg-purple-400' },
  won: { label: 'Won', color: 'bg-green-900 text-green-300', dot: 'bg-green-400' },
  lost: { label: 'Lost', color: 'bg-red-900 text-red-300', dot: 'bg-red-400' },
};

const STATUSES = Object.keys(STATUS_CONFIG);

const SOURCES = ['website', 'referral', 'social_media', 'cold_outreach', 'event', 'ad_campaign', 'other'];

const EMPTY_FORM = {
  name: '', email: '', phone: '', business_name: '', website: '',
  industry: '', city: '', state: '', message: '', internal_notes: '',
  status: 'new', source: 'website', assigned_to: '', tags: '',
  next_follow_up: '', deal_value: ''
};

export default function LeadPipeline({ onSelectLead, selectedLeadId }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Lead.list('-created_date', 500);
    setLeads(data);
    setLoading(false);
  };

  const filtered = leads.filter(l => {
    const matchSearch =
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    won: leads.filter(l => l.status === 'won').length,
    pipeline: leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((s, l) => s + (l.deal_value || 0), 0),
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (lead, e) => {
    e?.stopPropagation();
    setEditing(lead);
    setForm({
      name: lead.name || '', email: lead.email || '', phone: lead.phone || '',
      business_name: lead.business_name || '', website: lead.website || '',
      industry: lead.industry || '', city: lead.city || '', state: lead.state || '',
      message: lead.message || '', internal_notes: lead.internal_notes || '',
      status: lead.status || 'new', source: lead.source || 'website',
      assigned_to: lead.assigned_to || '', tags: (lead.tags || []).join(', '),
      next_follow_up: lead.next_follow_up || '', deal_value: lead.deal_value || ''
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.email || !form.business_name) {
      toast.error('Name, email, and business name are required');
      return;
    }
    setSaving(true);
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], deal_value: form.deal_value ? parseFloat(form.deal_value) : null };
    if (editing) {
      await base44.entities.Lead.update(editing.id, payload);
      toast.success('Lead updated');
    } else {
      await base44.entities.Lead.create(payload);
      toast.success('Lead added');
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const deleteLead = async (id, e) => {
    e?.stopPropagation();
    await base44.entities.Lead.delete(id);
    toast.success('Lead removed');
    if (selectedLeadId === id) onSelectLead(null);
    load();
  };

  const quickStatus = async (lead, status, e) => {
    e?.stopPropagation();
    await base44.entities.Lead.update(lead.id, { status });
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l));
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Leads', value: stats.total, color: 'text-white' },
          { label: 'New', value: stats.new, color: 'text-blue-400' },
          { label: 'Contacted', value: stats.contacted, color: 'text-yellow-400' },
          { label: 'Won', value: stats.won, color: 'text-green-400' },
          { label: 'Pipeline Value', value: `$${stats.pipeline.toLocaleString()}`, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 rounded-xl p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Add */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="pl-9 bg-slate-800 border-slate-700 text-white w-52" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" /> Add Lead
        </Button>
      </div>

      {/* Lead List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No leads found. Add your first!</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => {
            const sc = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
            const isSelected = selectedLeadId === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(isSelected ? null : lead)}
                className={`bg-slate-800 border rounded-xl p-4 cursor-pointer hover:border-amber-500 transition-all ${isSelected ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-slate-700'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white truncate">{lead.business_name}</p>
                      <Badge className={sc.color + ' text-xs'}>{sc.label}</Badge>
                      {lead.deal_value > 0 && <span className="text-emerald-400 text-xs font-medium">${lead.deal_value.toLocaleString()}</span>}
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5 truncate">{lead.name} · {lead.email}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {lead.phone && <span className="text-slate-500 text-xs">{lead.phone}</span>}
                      {lead.industry && <span className="text-slate-500 text-xs">{lead.industry}</span>}
                      {lead.source && <span className="text-slate-600 text-xs">{lead.source.replace('_', ' ')}</span>}
                      {lead.next_follow_up && <span className="text-orange-400 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />Follow up: {lead.next_follow_up}</span>}
                    </div>
                    {lead.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {lead.tags.map(t => <span key={t} className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white" onClick={e => openEdit(lead, e)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-400" onClick={e => deleteLead(lead.id, e)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {/* Quick status row */}
                <div className="flex gap-1 mt-3 flex-wrap">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={e => quickStatus(lead, s, e)}
                      className={`px-2 py-0.5 rounded-full text-xs border transition-all ${lead.status === s ? STATUS_CONFIG[s].color + ' border-transparent' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-slate-400 text-xs mb-1 block">Contact Name *</label><Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="John Smith" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">Business Name *</label><Input value={form.business_name} onChange={e => setForm(f => ({...f, business_name: e.target.value}))} placeholder="Acme HVAC" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">Email *</label><Input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="john@acme.com" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">Phone</label><Input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="555-000-1234" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">Website</label><Input value={form.website} onChange={e => setForm(f => ({...f, website: e.target.value}))} placeholder="https://acme.com" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">Industry</label><Input value={form.industry} onChange={e => setForm(f => ({...f, industry: e.target.value}))} placeholder="HVAC, Restaurant..." className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">City</label><Input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} placeholder="Chicago" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">State</label><Input value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))} placeholder="IL" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Status</label>
                <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Source</label>
                <Select value={form.source} onValueChange={v => setForm(f => ({...f, source: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-slate-400 text-xs mb-1 block">Deal Value ($)</label><Input type="number" value={form.deal_value} onChange={e => setForm(f => ({...f, deal_value: e.target.value}))} placeholder="500" className="bg-slate-800 border-slate-700 text-white" /></div>
              <div><label className="text-slate-400 text-xs mb-1 block">Follow-up Date</label><Input type="date" value={form.next_follow_up} onChange={e => setForm(f => ({...f, next_follow_up: e.target.value}))} className="bg-slate-800 border-slate-700 text-white" /></div>
            </div>
            <div><label className="text-slate-400 text-xs mb-1 block">Assigned To (email)</label><Input value={form.assigned_to} onChange={e => setForm(f => ({...f, assigned_to: e.target.value}))} placeholder="manager@yourco.com" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div><label className="text-slate-400 text-xs mb-1 block">Tags (comma separated)</label><Input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="hvac, local, high-priority" className="bg-slate-800 border-slate-700 text-white" /></div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Lead Message / Initial Notes</label>
              <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="What did they say when they came in?" rows={2} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Internal Notes (not visible to lead)</label>
              <textarea value={form.internal_notes} onChange={e => setForm(f => ({...f, internal_notes: e.target.value}))} placeholder="Private notes for your team..." rows={2} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 flex-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editing ? 'Update' : 'Add'} Lead
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}