import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, X, Save, Phone, Mail, Globe, ChevronDown } from 'lucide-react';

const STAGES = ['New Lead', 'Audit Sent', 'Demo Built', 'Follow-Up', 'Closed'];

const STAGE_COLORS = {
  'New Lead':   { col: 'border-slate-600',   dot: 'bg-slate-400',   badge: 'bg-slate-700 text-slate-300' },
  'Audit Sent': { col: 'border-blue-700',    dot: 'bg-blue-400',    badge: 'bg-blue-900 text-blue-300' },
  'Demo Built': { col: 'border-violet-700',  dot: 'bg-violet-400',  badge: 'bg-violet-900 text-violet-300' },
  'Follow-Up':  { col: 'border-amber-600',   dot: 'bg-amber-400',   badge: 'bg-amber-900 text-amber-300' },
  'Closed':     { col: 'border-emerald-700', dot: 'bg-emerald-400', badge: 'bg-emerald-900 text-emerald-300' },
};

// Map SalesDeal stages to our 5-stage system
function mapStage(stage) {
  const m = {
    'New Lead': 'New Lead',
    'Contacted': 'Follow-Up',
    'Demo Sent': 'Demo Built',
    'Proposal': 'Follow-Up',
    'Closed Won': 'Closed',
    'Closed Lost': 'Closed',
    'Audit Sent': 'Audit Sent',
    'Demo Built': 'Demo Built',
    'Follow-Up': 'Follow-Up',
    'Closed': 'Closed',
  };
  return m[stage] || 'New Lead';
}

export default function CRMPipelinePanel() {
  const [deals, setDeals] = useState([]);
  const [leadsMap, setLeadsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState(null); // { lead, deal }

  const load = async () => {
    const [d, l] = await Promise.all([
      base44.entities.SalesDeal.filter({ archived: false }),
      base44.entities.SalesLead.list('-created_date', 500),
    ]);
    const map = {};
    l.forEach(lead => { map[lead.id] = lead; });
    setDeals(d);
    setLeadsMap(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stageMap = STAGES.reduce((acc, s) => {
    acc[s] = deals.filter(d => mapStage(d.stage) === s);
    return acc;
  }, {});

  const moveStage = async (dealId, newStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
    await base44.entities.SalesDeal.update(dealId, { stage: newStage });
  };

  const onLeadSaved = ({ lead, deal }) => {
    setLeadsMap(prev => ({ ...prev, [lead.id]: lead }));
    setDeals(prev => {
      const exists = prev.find(d => d.id === deal.id);
      return exists ? prev.map(d => d.id === deal.id ? deal : d) : [deal, ...prev];
    });
    setShowAdd(false);
    setEditLead(null);
  };

  const openEdit = (deal) => {
    const lead = leadsMap[deal.lead_id] || {};
    setEditLead({ lead, deal });
  };

  const total = deals.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-white">CRM Pipeline</h2>
          <p className="text-slate-500 text-xs">{total} deals · click any card to edit</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Lead
        </button>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STAGES.map(s => <div key={s} className="flex-shrink-0 w-44 h-40 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STAGES.map(stage => {
            const sc = STAGE_COLORS[stage];
            const items = stageMap[stage];
            return (
              <div key={stage} className={`flex-shrink-0 w-48 bg-slate-900 border ${sc.col} rounded-xl p-3 min-h-[120px]`}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  <p className="text-xs font-bold text-slate-300">{stage}</p>
                  <span className="ml-auto text-xs text-slate-600 font-bold">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map(deal => {
                    const lead = leadsMap[deal.lead_id];
                    return (
                      <div key={deal.id}
                        onClick={() => openEdit(deal)}
                        className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg p-2.5 cursor-pointer group transition-colors">
                        <p className="text-xs font-semibold text-white truncate">{deal.deal_name}</p>
                        {lead?.contact_name && <p className="text-xs text-slate-500 truncate mt-0.5">{lead.contact_name}</p>}
                        <div className="flex gap-1.5 mt-1.5">
                          {lead?.phone && <span className="text-xs text-emerald-500">📞</span>}
                          {lead?.email && <span className="text-xs text-blue-500">✉</span>}
                          {!lead?.phone && !lead?.email && <span className="text-xs text-amber-600">⚠</span>}
                        </div>
                      </div>
                    );
                  })}
                  {items.length === 0 && <p className="text-slate-700 text-xs text-center py-3">Empty</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onSaved={onLeadSaved} />}
      {editLead && (
        <EditLeadModal
          lead={editLead.lead}
          deal={editLead.deal}
          onClose={() => setEditLead(null)}
          onSaved={onLeadSaved}
          onStageChange={(dealId, stage) => { moveStage(dealId, stage); setEditLead(s => s ? { ...s, deal: { ...s.deal, stage } } : null); }}
        />
      )}
    </div>
  );
}

// ── Add Lead Modal ──
function AddLeadModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ business_name: '', contact_name: '', phone: '', email: '', website: '', notes: '', status: 'new' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.business_name.trim()) return;
    setSaving(true);
    const lead = await base44.entities.SalesLead.create(form);
    const deal = await base44.entities.SalesDeal.create({ lead_id: lead.id, deal_name: form.business_name, stage: 'New Lead', archived: false });
    setSaving(false);
    onSaved({ lead, deal });
  };

  return (
    <Modal title="Add New Lead" onClose={onClose}>
      <FormFields form={form} set={set} />
      <div className="flex gap-2 mt-4">
        <button onClick={save} disabled={saving || !form.business_name.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm">
          {saving ? 'Saving...' : 'Add Lead'}
        </button>
        <button onClick={onClose} className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </Modal>
  );
}

// ── Edit Lead Modal ──
function EditLeadModal({ lead, deal, onClose, onSaved, onStageChange }) {
  const [form, setForm] = useState({
    business_name: deal.deal_name || '',
    contact_name: lead.contact_name || '',
    phone: lead.phone || '',
    email: lead.email || '',
    website: lead.website || '',
    notes: lead.notes || '',
    status: lead.status || 'new',
  });
  const [stage, setStage] = useState(deal.stage || 'New Lead');
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const updatedLead = lead.id
      ? await base44.entities.SalesLead.update(lead.id, {
          contact_name: form.contact_name, phone: form.phone, email: form.email,
          website: form.website, notes: form.notes, status: form.status,
          business_name: form.business_name,
        })
      : await base44.entities.SalesLead.create({ ...form });

    const updatedDeal = await base44.entities.SalesDeal.update(deal.id, {
      deal_name: form.business_name, stage,
    });
    setSaving(false);
    onSaved({ lead: updatedLead || { ...lead, ...form }, deal: updatedDeal || { ...deal, deal_name: form.business_name, stage } });
  };

  return (
    <Modal title={`Edit: ${form.business_name || 'Lead'}`} onClose={onClose}>
      {/* Stage selector */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-400 block mb-1">Pipeline Stage</label>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map(s => (
            <button key={s} onClick={() => { setStage(s); onStageChange(deal.id, s); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                stage === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <FormFields form={form} set={set} />
      <div className="flex gap-2 mt-4">
        <button onClick={save} disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={onClose} className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm">Cancel</button>
      </div>
    </Modal>
  );
}

function FormFields({ form, set }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Business Name *">
          <input value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Acme HVAC" className={inp} />
        </Field>
        <Field label="Contact Name">
          <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="John Smith" className={inp} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone">
          <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(641) 555-0100" className={inp} />
        </Field>
        <Field label="Email">
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@acme.com" className={inp} />
        </Field>
      </div>
      <Field label="Website">
        <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="acmehvac.com" className={inp} />
      </Field>
      <Field label="Status">
        <div className="relative">
          <select value={form.status} onChange={e => set('status', e.target.value)} className={inp + ' appearance-none pr-8'}>
            {['new','contacted','qualified','unresponsive'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </Field>
      <Field label="Notes">
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Notes about this lead..." className={inp + ' resize-none'} />
      </Field>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <h3 className="font-bold text-white text-sm">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';