import React, { useState } from 'react';
import { X, Phone, Mail, Globe, MapPin, MessageSquare, Check, Edit, Save, ChevronDown, Calendar } from 'lucide-react';
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

export default function LeadDetailModal({ deal, lead: initialLead, onClose, onUpdated }) {
  const [lead, setLead] = useState(initialLead || {});
  const [currentStage, setCurrentStage] = useState(deal.stage);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [saving, setSaving] = useState(false);
  const [movingStage, setMovingStage] = useState(false);

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
  };

  const saveLead = async () => {
    setSaving(true);
    if (lead.id) {
      await base44.entities.SalesLead.update(lead.id, editForm);
      const updated = { ...lead, ...editForm };
      setLead(updated);
      // Also sync deal_name if business_name changed
      if (editForm.business_name !== deal.deal_name) {
        await base44.entities.SalesDeal.update(deal.id, { deal_name: editForm.business_name });
        onUpdated({ ...deal, deal_name: editForm.business_name });
      }
    }
    setSaving(false);
    setEditMode(false);
  };

  const moveStage = async (stage) => {
    setMovingStage(true);
    await base44.entities.SalesDeal.update(deal.id, { stage });
    setCurrentStage(stage);
    onUpdated({ ...deal, stage });
    setMovingStage(false);
  };

  const saveNote = async () => {
    if (!note.trim() || !lead.id) return;
    const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const existing = lead.notes || '';
    // Prepend so most recent is first
    const updated = existing ? `[${ts}] ${note}\n\n${existing}` : `[${ts}] ${note}`;
    await base44.entities.SalesLead.update(lead.id, { notes: updated, last_contacted: new Date().toISOString().split('T')[0] });
    setLead(prev => ({ ...prev, notes: updated, last_contacted: new Date().toISOString().split('T')[0] }));
    setNote('');
    setAddingNote(false);
  };

  const displayName = lead.contact_name
    || [lead.first_name, lead.last_name].filter(Boolean).join(' ')
    || null;

  const set = (k, v) => setEditForm(p => ({ ...p, [k]: v }));

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

        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* ── EDIT MODE ── */}
          {editMode ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edit Lead</p>

              <div className="grid grid-cols-2 gap-3">
                <EF label="First Name" value={editForm.first_name} onChange={v => set('first_name', v)} />
                <EF label="Last Name" value={editForm.last_name} onChange={v => set('last_name', v)} />
              </div>
              <EF label="Contact Name (override)" value={editForm.contact_name} onChange={v => set('contact_name', v)} placeholder="Full Name" />
              <EF label="Business Name *" value={editForm.business_name} onChange={v => set('business_name', v)} />
              <div className="grid grid-cols-2 gap-3">
                <EF label="Phone" value={editForm.phone} onChange={v => set('phone', v)} placeholder="(641) 555-0100" />
                <EF label="Email" value={editForm.email} onChange={v => set('email', v)} type="email" />
              </div>
              <EF label="Website" value={editForm.website} onChange={v => set('website', v)} />
              <div className="grid grid-cols-2 gap-3">
                <EF label="City" value={editForm.city} onChange={v => set('city', v)} />
                <EF label="State" value={editForm.state} onChange={v => set('state', v)} />
              </div>
              <EF label="Industry" value={editForm.industry} onChange={v => set('industry', v)} />

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

              <div className="grid grid-cols-2 gap-3">
                <EF label="Last Contacted" value={editForm.last_contacted} onChange={v => set('last_contacted', v)} type="date" />
                <EF label="Next Follow-Up" value={editForm.next_follow_up} onChange={v => set('next_follow_up', v)} type="date" />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={saveLead} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm">
                  <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditMode(false)}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── VIEW MODE ── */}

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                {lead.phone && (
                  <a href={`tel:${lead.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-300 font-semibold text-sm px-3 py-2.5 rounded-xl transition-colors truncate">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{lead.phone}</span>
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}`}
                    className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-300 font-semibold text-sm px-3 py-2.5 rounded-xl transition-colors truncate">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </a>
                )}
                {!lead.phone && !lead.email && (
                  <button onClick={startEdit} className="col-span-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-2.5 rounded-xl hover:bg-amber-400/20 transition-colors">
                    ⚠️ No contact info — click Edit to add
                  </button>
                )}
              </div>

              {/* Contact details */}
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact</p>
                {lead.email && <InfoRow icon={Mail} label={lead.email} href={`mailto:${lead.email}`} />}
                {lead.phone && <InfoRow icon={Phone} label={lead.phone} href={`tel:${lead.phone.replace(/\D/g, '')}`} />}
                {lead.website && <InfoRow icon={Globe} label={lead.website} href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} ext />}
                {(lead.city || lead.state) && <InfoRow icon={MapPin} label={[lead.city, lead.state].filter(Boolean).join(', ')} />}
                {lead.industry && <InfoRow icon={() => <span className="text-xs">🏢</span>} label={lead.industry} />}
                {lead.lead_source && <InfoRow icon={() => <span className="text-xs">📌</span>} label={SOURCE_LABELS[lead.lead_source] || lead.lead_source} />}
              </div>

              {/* Follow-up tracking */}
              {(lead.last_contacted || lead.next_follow_up) && (
                <div className="grid grid-cols-2 gap-3">
                  {lead.last_contacted && (
                    <div className="bg-slate-800/50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-0.5">Last Contacted</p>
                      <p className="text-sm font-semibold text-white">{fmtDate(lead.last_contacted)}</p>
                    </div>
                  )}
                  {lead.next_follow_up && (
                    <div className={`rounded-xl p-3 ${isOverdue(lead.next_follow_up) ? 'bg-red-900/30 border border-red-800/40' : 'bg-slate-800/50'}`}>
                      <p className="text-xs text-slate-500 mb-0.5">Next Follow-Up</p>
                      <p className={`text-sm font-semibold ${isOverdue(lead.next_follow_up) ? 'text-red-400' : 'text-white'}`}>
                        {fmtDate(lead.next_follow_up)}{isOverdue(lead.next_follow_up) ? ' ⚠️' : ''}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Move stage */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Move Stage</p>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => moveStage(s)} disabled={movingStage}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        currentStage === s
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
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

              {/* Add note */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
                {addingNote ? (
                  <div>
                    <textarea value={note} onChange={e => setNote(e.target.value)}
                      autoFocus rows={3} placeholder="Add a note..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={saveNote} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5" /> Save Note
                      </button>
                      <button onClick={() => { setNote(''); setAddingNote(false); }} className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingNote(true)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl w-full transition-colors mb-3">
                    <MessageSquare className="w-4 h-4" /> Add Note
                  </button>
                )}

                {/* Notes history */}
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

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d + 'T12:00:00') < new Date();
}