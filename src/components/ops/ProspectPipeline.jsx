import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Search, Plus, Phone, Mail, Globe, Calendar,
  DollarSign, ChevronRight, Loader2, FileText, Briefcase, Pencil, Trash2
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  prospect:      { label: 'Prospect',      color: 'bg-slate-700 text-slate-300', dot: 'bg-slate-400' },
  new:           { label: 'New Lead',       color: 'bg-blue-900 text-blue-300', dot: 'bg-blue-400' },
  contacted:     { label: 'Contacted',      color: 'bg-yellow-900 text-yellow-300', dot: 'bg-yellow-400' },
  proposal_sent: { label: 'Proposal Sent',  color: 'bg-purple-900 text-purple-300', dot: 'bg-purple-400' },
  won:           { label: 'Won',            color: 'bg-green-900 text-green-300', dot: 'bg-green-400' },
  lost:          { label: 'Lost',           color: 'bg-red-900 text-red-300', dot: 'bg-red-400' },
};

const SERVICE_OPTIONS = [
  { value: 'website_new', label: 'New Website' },
  { value: 'website_rebuild', label: 'Website Rebuild' },
  { value: 'social_diy', label: 'Social Media DIY' },
  { value: 'social_dfy', label: 'Social Media DFY' },
  { value: 'ada_compliance', label: 'ADA Compliance' },
  { value: 'streaming_tv', label: 'Streaming TV Ads' },
];

const EMPTY_FORM = {
  name: '', email: '', phone: '', business_name: '', website: '',
  industry: '', city: '', state: '', message: '', internal_notes: '',
  status: 'new', source: 'website', deal_value: '', next_follow_up: '',
  tags: '', service_interest: ''
};

export default function ProspectPipeline() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');

  useEffect(() => { load(); }, []);
  useEffect(() => { if (selectedLead) loadNotes(); }, [selectedLead?.id]);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Lead.list('-created_date', 500);
    setLeads(data);
    setLoading(false);
  };

  const loadNotes = async () => {
    const data = await base44.entities.LeadNote.filter({ lead_id: selectedLead.id }, '-created_date');
    setNotes(data);
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.business_name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    proposal_sent: leads.filter(l => l.status === 'proposal_sent').length,
    won: leads.filter(l => l.status === 'won').length,
    pipeline: leads.filter(l => !['won','lost'].includes(l.status)).reduce((s,l) => s + (l.deal_value||0), 0),
  };

  const save = async () => {
    if (!form.name || !form.email || !form.business_name) { toast.error('Name, email, and business name required'); return; }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      deal_value: form.deal_value ? parseFloat(form.deal_value) : null
    };
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

  const quickStatus = async (lead, status, e) => {
    e?.stopPropagation();
    await base44.entities.Lead.update(lead.id, { status });
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status } : l));
    if (selectedLead?.id === lead.id) setSelectedLead(prev => ({ ...prev, status }));
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    await base44.entities.LeadNote.create({ lead_id: selectedLead.id, note: newNote, note_type: noteType });
    setNewNote('');
    loadNotes();
    toast.success('Note added');
  };

  const openEdit = (lead, e) => {
    e?.stopPropagation();
    setEditing(lead);
    setForm({
      name: lead.name||'', email: lead.email||'', phone: lead.phone||'',
      business_name: lead.business_name||'', website: lead.website||'',
      industry: lead.industry||'', city: lead.city||'', state: lead.state||'',
      message: lead.message||'', internal_notes: lead.internal_notes||'',
      status: lead.status||'new', source: lead.source||'website',
      deal_value: lead.deal_value||'', next_follow_up: lead.next_follow_up||'',
      tags: (lead.tags||[]).join(', '), service_interest: lead.service_interest||''
    });
    setShowForm(true);
  };

  const deleteLead = async (id, e) => {
    e?.stopPropagation();
    await base44.entities.Lead.delete(id);
    if (selectedLead?.id === id) setSelectedLead(null);
    load();
    toast.success('Lead removed');
  };

  return (
    <div className="flex gap-6">
      {/* Left: list */}
      <div className={`${selectedLead ? 'flex-1 min-w-0' : 'w-full'}`}>
        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
          {[
            { label: 'Total', value: stats.total, color: 'text-white' },
            { label: 'New', value: stats.new, color: 'text-blue-400' },
            { label: 'Contacted', value: stats.contacted, color: 'text-yellow-400' },
            { label: 'Proposal Out', value: stats.proposal_sent, color: 'text-purple-400' },
            { label: 'Won', value: stats.won, color: 'text-green-400' },
            { label: 'Pipeline $', value: `$${stats.pipeline.toLocaleString()}`, color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-800 rounded-xl p-3 text-center">
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 bg-slate-800 border-slate-700 text-white w-48" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([k,v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); }} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No leads found. Add your first prospect!</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(lead => {
              const sc = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(isSelected ? null : lead)}
                  className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-slate-700 hover:border-amber-500/50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white truncate">{lead.business_name}</p>
                        <Badge className={`${sc.color} text-xs border-0`}>{sc.label}</Badge>
                        {lead.deal_value > 0 && <span className="text-emerald-400 text-xs font-medium">${lead.deal_value.toLocaleString()}</span>}
                        {lead.tags?.includes('social_dfy') && <Badge className="bg-pink-900 text-pink-300 text-xs border-0">Social DFY</Badge>}
                      </div>
                      <p className="text-slate-400 text-sm mt-0.5 truncate">{lead.name} · {lead.email}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500">
                        {lead.phone && <span>{lead.phone}</span>}
                        {lead.industry && <span>{lead.industry}</span>}
                        {lead.city && <span>{lead.city}, {lead.state}</span>}
                        {lead.next_follow_up && <span className="text-orange-400 flex items-center gap-1"><Calendar className="w-3 h-3" />Follow up: {lead.next_follow_up}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white" onClick={e => openEdit(lead, e)}><Pencil className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-400" onClick={e => deleteLead(lead.id, e)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
                      <button key={s} onClick={e => quickStatus(lead, s, e)}
                        className={`px-2 py-0.5 rounded-full text-xs border transition-all ${lead.status === s ? cfg.color + ' border-transparent' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: detail panel */}
      {selectedLead && (
        <div className="w-80 flex-shrink-0 bg-slate-800 border border-amber-500 rounded-xl h-fit sticky top-4">
          <div className="p-4 border-b border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white">{selectedLead.business_name}</p>
                <p className="text-slate-400 text-sm">{selectedLead.name}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setSelectedLead(null)} className="h-7 w-7 text-slate-400">✕</Button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedLead.email && <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-1 bg-blue-900/50 text-blue-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-900 transition-colors"><Mail className="w-3 h-3" />Email</a>}
              {selectedLead.phone && <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1 bg-green-900/50 text-green-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-green-900 transition-colors"><Phone className="w-3 h-3" />Call</a>}
              {selectedLead.website && <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-600 transition-colors"><Globe className="w-3 h-3" />Site</a>}
            </div>
            <div className="mt-3 flex gap-2">
              <Link to={createPageUrl('OperationsHub') + '?tab=proposals&lead=' + selectedLead.id} className="flex-1">
                <Button size="sm" className="w-full bg-blue-700 hover:bg-blue-600 text-xs">
                  <FileText className="w-3 h-3 mr-1.5" />Create Proposal
                </Button>
              </Link>
              <Link to={createPageUrl('OperationsHub') + '?tab=fulfillment&lead=' + selectedLead.id} className="flex-1">
                <Button size="sm" variant="outline" className="w-full text-xs border-slate-600">
                  <Briefcase className="w-3 h-3 mr-1.5" />Workflow
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {selectedLead.message && (
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-slate-500 text-xs font-medium mb-1">INITIAL MESSAGE</p>
                <p className="text-slate-300 text-sm">{selectedLead.message}</p>
              </div>
            )}
            <div>
              <p className="text-slate-400 text-xs font-medium mb-2">ACTIVITY LOG</p>
              <div className="flex gap-2 mb-2">
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white h-7 text-xs flex-shrink-0 w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['call','email','meeting','follow_up','general'].map(t => <SelectItem key={t} value={t}>{t.replace('_',' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} placeholder="Log activity..." className="bg-slate-900 border-slate-700 text-white h-7 text-xs" />
                <Button size="sm" onClick={addNote} className="bg-amber-600 hover:bg-amber-700 h-7 text-xs px-2">+</Button>
              </div>
              <div className="space-y-2">
                {notes.map(n => (
                  <div key={n.id} className="bg-slate-900 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400 text-xs font-medium">{n.note_type?.replace('_',' ')}</span>
                      <span className="text-slate-600 text-xs">{new Date(n.created_date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 text-xs">{n.note}</p>
                  </div>
                ))}
                {notes.length === 0 && <p className="text-slate-600 text-xs text-center py-2">No activity yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: 'name', label: 'Contact Name *', placeholder: 'John Smith' },
                { field: 'business_name', label: 'Business Name *', placeholder: 'Acme HVAC' },
                { field: 'email', label: 'Email *', placeholder: 'john@acme.com' },
                { field: 'phone', label: 'Phone', placeholder: '555-000-1234' },
                { field: 'website', label: 'Website', placeholder: 'https://acme.com' },
                { field: 'industry', label: 'Industry', placeholder: 'HVAC, Restaurant...' },
                { field: 'city', label: 'City', placeholder: 'Chicago' },
                { field: 'state', label: 'State', placeholder: 'IL' },
                { field: 'deal_value', label: 'Deal Value ($)', placeholder: '500', type: 'number' },
                { field: 'next_follow_up', label: 'Follow-up Date', type: 'date' },
              ].map(f => (
                <div key={f.field}>
                  <label className="text-slate-400 text-xs mb-1 block">{f.label}</label>
                  <Input type={f.type||'text'} value={form[f.field]} onChange={e => setForm(prev => ({...prev, [f.field]: e.target.value}))} placeholder={f.placeholder} className="bg-slate-800 border-slate-700 text-white" />
                </div>
              ))}
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Status</label>
                <Select value={form.status} onValueChange={v => setForm(f => ({...f, status: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(STATUS_CONFIG).map(([k,v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Service Interest</label>
                <Select value={form.service_interest} onValueChange={v => setForm(f => ({...f, service_interest: v}))}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select service..." /></SelectTrigger>
                  <SelectContent>
                    {SERVICE_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Tags (comma separated)</label>
              <Input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="hvac, local, high-priority" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Lead Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} rows={2} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Internal Notes (admin only)</label>
              <textarea value={form.internal_notes} onChange={e => setForm(f => ({...f, internal_notes: e.target.value}))} rows={2} className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 flex-1">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
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