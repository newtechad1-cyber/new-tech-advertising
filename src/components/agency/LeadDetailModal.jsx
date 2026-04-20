import React, { useState } from 'react';
import { X, Phone, Mail, Globe, MapPin, MessageSquare, Check, Edit, Save, ChevronDown, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STAGES = ['New Lead', 'Contacted', 'Demo Sent', 'Proposal', 'Closed Won', 'Closed Lost'];

const STAGE_COLORS = {
  'New Lead':    'bg-slate-700 text-slate-300',
  'Contacted':   'bg-blue-900 text-blue-300',
  'Demo Sent':   'bg-violet-900 text-violet-300',
  'Proposal':    'bg-amber-900 text-amber-300',
  'Closed Won':  'bg-emerald-900 text-emerald-300',
  'Closed Lost': 'bg-red-900 text-red-300',
};

const SOURCE_LABELS = {
  website: 'Website', cold_outreach: 'Cold Outreach', referral: 'Referral',
  walk_in: 'Walk-In', other: 'Other',
};

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d + 'T12:00:00') < new Date();
}

function isIncomplete(lead) {
  const hasName = !!(lead?.contact_name || lead?.first_name || lead?.last_name);
  const hasContact = !!(lead?.phone || lead?.email);
  return !hasName || !hasContact;
}

export default function LeadDetailModal({ deal, lead: initialLead, onClose, onUpdated }) {
  const [lead, setLead] = useState(initialLead || {});
  const [currentStage, setCurrentStage] = useState(deal.stage);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [saving, setSaving] = useState(false);
  const [movingStage, setMovingStage] = useState(false);
  const [saveError, setSaveError] = useState(null);
  // Quick follow-up inline edit
  const [editingFollowUp, setEditingFollowUp] = useState(false);
  const [followUpVal, setFollowUpVal] = useState(lead.next_follow_up || '');

  const startEdit = () => {
    setEditForm({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      contact_name: lead.contact_name || '',
      business_name: lead.business_name || deal.deal_name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      website: lead.website || '',
      city: lead.city || '',
      state: lead.state || '',
      industry: lead.industry || '',
      lead_source: lead.lead_source || 'other',
      last_contacted: lead.last_contacted || '',
      next_follow_up: lead.next_follow_up || '',
      status: lead.status || 'new',
    });
    setEditMode(true);
    setSaveError(null);
  };

  const editIsIncomplete = !!(editForm.business_name) && (
    !(editForm.contact_name || editForm.first_name || editForm.last_name) ||
    !(editForm.phone || editForm.email)
  );

  const saveLead = async () => {
    setSaveError(null);
    if (!editForm.business_name?.trim()) {
      setSaveError('Business name is required.');
      return;
    }
    setSaving(true);
    if (lead.id) {
      await base44.entities.SalesLead.update(lead.id, editForm);
      const updated = { ...lead, ...editForm };
      setLead(updated);
      setFollowUpVal(editForm.next_follow_up || '');
      if (deal.id && editForm.business_name !== deal.deal_name) {
        await base44.entities.SalesDeal.update(deal.id, { deal_name: editForm.business_name });
        onUpdated({ ...deal, deal_name: editForm.business_name }, updated);
      } else {
        onUpdated(deal, updated);
      }
    }
    setSaving(false);
    setEditMode(false);
  };

  const moveStage = async (stage) => {
    if (!deal.id || movingStage) return;
    setMovingStage(true);
    await base44.entities.SalesDeal.update(deal.id, { stage });
    setCurrentStage(stage);
    onUpdated({ ...deal, stage }, lead);
    setMovingStage(false);
  };

  const saveNote = async () => {
    if (!note.trim() || !lead.id) return;
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const existing = lead.notes || '';
    const updated = existing ? `[${ts}] ${note}\n\n${existing}` : `[${ts}] ${note}`;
    const today = new Date().toISOString().split('T')[0];
    await base44.entities.SalesLead.update(lead.id, { notes: updated, last_contacted: today });
    const updatedLead = { ...lead, notes: updated, last_contacted: today };
    setLead(updatedLead);
    onUpdated(deal, updatedLead);
    setNote('');
    setAddingNote(false);
  };

  const saveFollowUp = async () => {
    if (!lead.id) return;
    await base44.entities.SalesLead.update(lead.id, { next_follow_up: followUpVal });
    const updatedLead = { ...lead, next_follow_up: followUpVal };
    setLead(updatedLead);
    onUpdated(deal, updatedLead);
    setEditingFollowUp(false);
  };

  const displayName = lead.contact_name
    || [lead.first_name, lead.last_name].filter(Boolean).join(' ')
    || null;

  const set = (k, v) => setEditForm(p => ({ ...p, [k]: v }));
  const incomplete = isIncomplete(lead);
  const overdue = isOverdue(lead.next_follow_up);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[94vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h2 className="font-bold text-white text-base truncate">{lead.business_name || deal.deal_name}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STAGE_COLORS[currentStage] || 'bg-slate-700 text-slate-300'}`}>
                {currentStage}
              </span>
              {incomplete && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-900/60 text-amber-400 flex items-center gap-0.5 flex-shrink-0">
                  <AlertCircle className="w-2.5 h-2.5" /> Incomplete
                </span>
              )}
            </div>
            {displayName && <p className="text-slate-400 text-sm">{displayName}</p>}
          </div>
          <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
            {!editMode && (
              <button onClick={startEdit} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition-colors">
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* ── EDIT MODE ── */}
          {editMode ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edit Lead Info</p>

              <EF label="Business Name *" value={editForm.business_name} onChange={v => set('business_name', v)} />

              <div className="grid grid-cols-2 gap-3">
                <EF label="Contact Name" value={editForm.contact_name} onChange={v => set('contact_name', v)} placeholder="Full Name" />
                <EF label="Phone" value={editForm.phone} onChange={v => set('phone', v)} placeholder="(641) 555-0100" />
              </div>
              <EF label="Email" value={editForm.email} onChange={v => set('email', v)} type="email" />
              <EF label="Website" value={editForm.website} onChange={v => set('website', v)} />
              <div className="grid grid-cols-2 gap-3">
                <EF label="City" value={editForm.city} onChange={v => set('city', v)} />
                <EF label="State" value={editForm.state} onChange={v => set('state', v)} />
              </div>
              <EF label="Industry" value={editForm.industry} onChange={v => set('industry', v)} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Lead Source</label>
                  <div className="relative">
                    <select value={editForm.lead_source} onChange={e => set('lead_source', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:border-blue-500">
                      {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Status</label>
                  <div className="relative">
                    <select value={editForm.status} onChange={e => set('status', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:border-blue-500">
                      {['new', 'contacted', 'qualified', 'unresponsive'].map(s => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <EF label="Last Contacted" value={editForm.last_contacted} onChange={v => set('last_contacted', v)} type="date" />
                <EF label="Next Follow-Up" value={editForm.next_follow_up} onChange={v => set('next_follow_up', v)} type="date" />
              </div>

              {saveError && (
                <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 rounded-xl px-3 py-2 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{saveError}
                </div>
              )}
              {editIsIncomplete && (
                <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-700/40 rounded-xl px-3 py-2 text-xs text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />Missing contact name or phone/email — this lead will be flagged as incomplete.
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={saveLead} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm">
                  <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditMode(false); setSaveError(null); }}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── VIEW MODE ── */}

              {/* Incomplete CTA — shown when lead has no contact info */}
              {incomplete && (
                <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-400">Missing contact info</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      {!lead.contact_name && !(lead.first_name || lead.last_name) ? 'No contact name. ' : ''}
                      {!lead.phone && !lead.email ? 'No phone or email.' : ''}
                    </p>
                  </div>
                  <button onClick={startEdit} className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors">
                    Fix Now <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Quick actions: call / email */}
              <div className="grid grid-cols-2 gap-2">
                {lead.phone && (
                  <a href={`tel:${lead.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-300 font-semibold text-sm px-3 py-2.5 rounded-xl transition-colors truncate">
                    <Phone className="w-4 h-4 flex-shrink-0" /><span className="truncate">{lead.phone}</span>
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-300 font-semibold text-sm px-3 py-2.5 rounded-xl transition-colors truncate">
                    <Mail className="w-4 h-4 flex-shrink-0" /><span className="truncate">{lead.email}</span>
                  </a>
                )}
              </div>

              {/* Follow-up quick-edit */}
              <div className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className={`w-4 h-4 flex-shrink-0 ${overdue ? 'text-red-400' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Next Follow-Up</p>
                    {editingFollowUp ? (
                      <input
                        type="date" value={followUpVal} onChange={e => setFollowUpVal(e.target.value)} autoFocus
                        className="mt-1 bg-slate-700 border border-blue-500 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                      />
                    ) : (
                      <p className={`text-sm font-semibold ${overdue ? 'text-red-400' : lead.next_follow_up ? 'text-white' : 'text-slate-600'}`}>
                        {lead.next_follow_up ? fmtDate(lead.next_follow_up) + (overdue ? ' — OVERDUE' : '') : 'Not set'}
                      </p>
                    )}
                  </div>
                </div>
                {editingFollowUp ? (
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={saveFollowUp} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1.5 rounded-lg">Save</button>
                    <button onClick={() => { setFollowUpVal(lead.next_follow_up || ''); setEditingFollowUp(false); }} className="text-xs text-slate-500 hover:text-white px-2 py-1.5 rounded-lg bg-slate-700">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingFollowUp(true)} className="text-xs font-semibold text-slate-500 hover:text-white bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded-lg flex-shrink-0 transition-colors">
                    {lead.next_follow_up ? 'Change' : 'Set Date'}
                  </button>
                )}
              </div>

              {/* Contact details */}
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details</p>
                {lead.website && <InfoRow icon={Globe} label={lead.website} href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} ext />}
                {(lead.city || lead.state) && <InfoRow icon={MapPin} label={[lead.city, lead.state].filter(Boolean).join(', ')} />}
                {lead.industry && <InfoRow icon={() => <span className="text-xs">🏢</span>} label={lead.industry} />}
                {lead.lead_source && <InfoRow icon={() => <span className="text-xs">📌</span>} label={SOURCE_LABELS[lead.lead_source] || lead.lead_source} />}
                {lead.last_contacted && <InfoRow icon={() => <span className="text-xs">📆</span>} label={`Last contacted: ${fmtDate(lead.last_contacted)}`} />}
              </div>

              {/* Move stage */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pipeline Stage</p>
                {!deal.id && (
                  <p className="text-xs text-amber-600 mb-2">No pipeline deal exists yet — stage moves disabled.</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => moveStage(s)} disabled={movingStage || !deal.id}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 ${
                        currentStage === s
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 enabled:hover:bg-slate-700'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deal value */}
              {deal.value && (
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Deal Value</p>
                  <p className="text-lg font-bold text-emerald-400">${Number(deal.value).toLocaleString()}</p>
                </div>
              )}

              {/* Notes */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
                {addingNote ? (
                  <div>
                    <textarea value={note} onChange={e => setNote(e.target.value)}
                      autoFocus rows={3} placeholder="Add a note about this call/meeting/action..."
                      className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={saveNote} disabled={!note.trim()} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-3 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5" /> Save Note
                      </button>
                      <button onClick={() => { setNote(''); setAddingNote(false); }} className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingNote(true)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl w-full transition-colors mb-3 border border-slate-700 border-dashed">
                    <MessageSquare className="w-4 h-4" /> Add a note...
                  </button>
                )}

                {lead.notes && (
                  <div className="space-y-2 mt-2">
                    {lead.notes.split('\n\n').filter(Boolean).map((entry, i) => {
                      const match = entry.match(/^\[(.+?)\] (.+)$/s);
                      if (match) {
                        return (
                          <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 mb-1">{match[1]}</p>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{match[2]}</p>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                          <p className="text-sm text-slate-300 whitespace-pre-wrap">{entry}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, href, ext }) {
  const content = (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500 w-4 flex-shrink-0"><Icon className="w-3.5 h-3.5" /></span>
      <span className={`${href ? 'text-blue-400 hover:text-blue-300' : 'text-slate-300'} truncate`}>{label}</span>
    </div>
  );
  return href
    ? <a href={href} target={ext ? '_blank' : undefined} rel="noopener noreferrer">{content}</a>
    : content;
}

function EF({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
    </div>
  );
}