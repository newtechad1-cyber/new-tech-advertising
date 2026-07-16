import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Archive, Calendar, ChevronRight, Loader2, MailCheck, Pencil, Plus, Search } from 'lucide-react';

const STATUS_CONFIG = {
  new: { label: 'Identified', color: 'bg-slate-700 text-slate-200' },
  contacted: { label: 'Introduced', color: 'bg-blue-900 text-blue-300' },
  replied: { label: 'Replied', color: 'bg-cyan-900 text-cyan-300' },
  interested: { label: 'Interested', color: 'bg-amber-900 text-amber-300' },
  audit_requested: { label: 'Audit Requested', color: 'bg-violet-900 text-violet-300' },
  audit_sent: { label: 'Audit Sent', color: 'bg-indigo-900 text-indigo-300' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-purple-900 text-purple-300' },
  closed_won: { label: 'Client', color: 'bg-green-900 text-green-300' },
  closed_lost: { label: 'Closed', color: 'bg-red-900 text-red-300' },
  no_response: { label: 'No Response', color: 'bg-slate-800 text-slate-400' },
};

const SOURCES = ['google_maps', 'facebook', 'linkedin', 'cold_email', 'phone_call', 'chamber', 'event', 'referral', 'website', 'manual', 'other'];
const CONTACT_METHODS = ['not_contacted', 'email', 'phone', 'linkedin', 'facebook', 'in_person', 'website', 'referral', 'event', 'other'];
const EMPTY_FORM = {
  contact_name: '', email: '', phone: '', business_name: '', website: '', industry: '', city: '', state: '',
  status: 'new', lead_source: 'manual', first_contact_method: 'not_contacted', relationship_origin: '',
  next_follow_up: '', estimated_value: '', opportunity_notes: '', internal_notes: '', priority: 'medium',
};

const titleCase = value => value.replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase());

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
    const data = await base44.entities.SalesLead.list('-created_date', 500);
    setLeads((data || []).filter(lead => !lead.archived));
    setLoading(false);
  };

  const filtered = leads.filter(lead => {
    const query = search.toLowerCase();
    const matchesSearch = [lead.contact_name, lead.business_name, lead.email, lead.city]
      .some(value => value?.toLowerCase().includes(query));
    return matchesSearch && (statusFilter === 'all' || lead.status === statusFilter);
  });

  const stats = {
    prospects: leads.filter(lead => !['closed_won', 'closed_lost'].includes(lead.status)).length,
    introduced: leads.filter(lead => ['contacted', 'replied'].includes(lead.status)).length,
    journal: leads.filter(lead => lead.journal_permission_status === 'granted').length,
    interested: leads.filter(lead => ['interested', 'audit_requested', 'audit_sent', 'proposal_sent'].includes(lead.status)).length,
    won: leads.filter(lead => lead.status === 'closed_won').length,
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (lead, event) => {
    event?.stopPropagation();
    setEditing(lead);
    setForm({
      ...EMPTY_FORM,
      ...lead,
      estimated_value: lead.estimated_value || '',
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.business_name.trim()) return toast.error('Business name is required');
    setSaving(true);
    const payload = {
      ...form,
      estimated_value: form.estimated_value ? Number(form.estimated_value) : null,
      date_first_contacted: form.first_contact_method !== 'not_contacted' && !editing?.date_first_contacted
        ? new Date().toISOString().slice(0, 10)
        : editing?.date_first_contacted,
    };
    if (editing) await base44.entities.SalesLead.update(editing.id, payload);
    else await base44.entities.SalesLead.create(payload);
    toast.success(editing ? 'Prospect updated' : 'Prospect added');
    setSaving(false);
    setShowForm(false);
    load();
  };

  const quickStatus = async (lead, status, event) => {
    event?.stopPropagation();
    const updates = { status };
    if (status === 'contacted' && !lead.date_first_contacted) updates.date_first_contacted = new Date().toISOString().slice(0, 10);
    await base44.entities.SalesLead.update(lead.id, updates);
    setLeads(current => current.map(item => item.id === lead.id ? { ...item, ...updates } : item));
  };

  const archive = async (lead, event) => {
    event?.stopPropagation();
    await base44.entities.SalesLead.update(lead.id, { archived: true });
    setLeads(current => current.filter(item => item.id !== lead.id));
    if (selectedLeadId === lead.id) onSelectLead(null);
    toast.success('Prospect archived; history preserved');
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          ['Active Prospects', stats.prospects, 'text-white'], ['Introduced', stats.introduced, 'text-blue-400'],
          ['Journal Permission', stats.journal, 'text-orange-400'], ['Interested', stats.interested, 'text-amber-400'],
          ['Clients Won', stats.won, 'text-green-400'],
        ].map(([label, value, color]) => <div key={label} className="bg-slate-800 rounded-xl p-4 text-center"><p className={`text-xl font-bold ${color}`}>{value}</p><p className="text-slate-400 text-xs mt-1">{label}</p></div>)}
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search prospects…" className="pl-9 bg-slate-800 border-slate-700 text-white w-56" /></div>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="bg-slate-800 border-slate-700 text-white w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All stages</SelectItem>{Object.entries(STATUS_CONFIG).map(([value, config]) => <SelectItem key={value} value={value}>{config.label}</SelectItem>)}</SelectContent></Select>
        </div>
        <Button onClick={openAdd} className="bg-amber-600 hover:bg-amber-700"><Plus className="w-4 h-4 mr-2" /> Add Prospect</Button>
      </div>

      {loading ? <div className="text-center py-12 text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading…</div> : filtered.length === 0 ? <div className="text-center py-12 text-slate-500">No prospects found.</div> : (
        <div className="space-y-2">
          {filtered.map(lead => {
            const config = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
            const selected = selectedLeadId === lead.id;
            return <div key={lead.id} onClick={() => onSelectLead(selected ? null : lead)} className={`bg-slate-800 border rounded-xl p-4 cursor-pointer hover:border-amber-500 transition-all ${selected ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-slate-700'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-white">{lead.business_name}</p><Badge className={`${config.color} text-xs`}>{config.label}</Badge>{lead.journal_permission_status === 'granted' && <Badge className="bg-orange-900 text-orange-300 text-xs"><MailCheck className="w-3 h-3 mr-1" />Journal</Badge>}</div>
                  <p className="text-slate-400 text-sm mt-1">{lead.contact_name || 'Contact not identified'}{lead.email ? ` · ${lead.email}` : ''}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-500"><span>{titleCase(lead.lead_source || 'manual')}</span>{lead.city && <span>{lead.city}{lead.state ? `, ${lead.state}` : ''}</span>}{lead.next_follow_up && <span className="text-orange-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{lead.next_follow_up}</span>}{lead.relationship_origin && <span className="truncate max-w-sm">{lead.relationship_origin}</span>}</div>
                </div>
                <div className="flex items-center"><ChevronRight className={`w-4 h-4 text-slate-500 ${selected ? 'rotate-90' : ''}`} /><Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400" onClick={event => openEdit(lead, event)}><Pencil className="w-3 h-3" /></Button><Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 hover:text-amber-400" onClick={event => archive(lead, event)}><Archive className="w-3 h-3" /></Button></div>
              </div>
              <div className="flex gap-1 mt-3 flex-wrap">{Object.entries(STATUS_CONFIG).map(([status, statusConfig]) => <button key={status} onClick={event => quickStatus(lead, status, event)} className={`px-2 py-0.5 rounded-full text-xs border ${lead.status === status ? `${statusConfig.color} border-transparent` : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}>{statusConfig.label}</button>)}</div>
            </div>;
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}><DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editing ? 'Edit Prospect' : 'Add Prospect'}</DialogTitle></DialogHeader><div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Business Name *"><Input value={form.business_name} onChange={event => setForm(current => ({ ...current, business_name: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <Field label="Contact Name"><Input value={form.contact_name} onChange={event => setForm(current => ({ ...current, contact_name: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={event => setForm(current => ({ ...current, phone: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <Field label="Website"><Input value={form.website} onChange={event => setForm(current => ({ ...current, website: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <Field label="Industry"><Input value={form.industry} onChange={event => setForm(current => ({ ...current, industry: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <Field label="City"><Input value={form.city} onChange={event => setForm(current => ({ ...current, city: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <Field label="State"><Input value={form.state} onChange={event => setForm(current => ({ ...current, state: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
          <SelectField label="Where did you find them?" value={form.lead_source} onChange={value => setForm(current => ({ ...current, lead_source: value }))} options={SOURCES} />
          <SelectField label="First contact method" value={form.first_contact_method} onChange={value => setForm(current => ({ ...current, first_contact_method: value }))} options={CONTACT_METHODS} />
          <SelectField label="Relationship stage" value={form.status} onChange={value => setForm(current => ({ ...current, status: value }))} options={Object.keys(STATUS_CONFIG)} labels={STATUS_CONFIG} />
          <Field label="Next Follow-up"><Input type="date" value={form.next_follow_up || ''} onChange={event => setForm(current => ({ ...current, next_follow_up: event.target.value }))} className="bg-slate-800 border-slate-700" /></Field>
        </div>
        <Field label="How did the relationship begin?"><Input value={form.relationship_origin} onChange={event => setForm(current => ({ ...current, relationship_origin: event.target.value }))} placeholder="Met at chamber event, replied on Facebook, cold email…" className="bg-slate-800 border-slate-700" /></Field>
        <Field label="What opportunity or need did you notice?"><textarea value={form.opportunity_notes} onChange={event => setForm(current => ({ ...current, opportunity_notes: event.target.value }))} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm" /></Field>
        <div className="flex gap-3"><Button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 flex-1">{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{editing ? 'Update Prospect' : 'Add Prospect'}</Button><Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancel</Button></div>
      </div></DialogContent></Dialog>
    </div>
  );
}

function Field({ label, children }) { return <div><label className="text-slate-400 text-xs mb-1 block">{label}</label>{children}</div>; }
function SelectField({ label, value, onChange, options, labels }) { return <Field label={label}><Select value={value} onValueChange={onChange}><SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{options.map(option => <SelectItem key={option} value={option}>{labels?.[option]?.label || titleCase(option)}</SelectItem>)}</SelectContent></Select></Field>; }
