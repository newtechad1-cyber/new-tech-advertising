import React, { useState } from 'react';
import {
  X, Phone, Mail, Globe, MapPin, MessageSquare, Check, Edit, Save,
  ChevronDown, Calendar, AlertCircle, ArrowRight, FileText, Trophy,
  XCircle, Clock, Send, Activity, PhoneCall
} from 'lucide-react';
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

// Activity entry types with icons/colors
const ACTIVITY_TYPES = {
  call:           { label: 'Call Attempted',    icon: '📞', color: 'text-emerald-400' },
  call_connected: { label: 'Call Connected',    icon: '✅', color: 'text-emerald-400' },
  email:          { label: 'Email Sent',        icon: '📧', color: 'text-blue-400' },
  note:           { label: 'Note Added',        icon: '📝', color: 'text-slate-400' },
  followup:       { label: 'Follow-Up Set',     icon: '📅', color: 'text-amber-400' },
  stage:          { label: 'Stage Changed',     icon: '🔄', color: 'text-violet-400' },
  proposal_drafted:{ label: 'Proposal Drafted', icon: '📋', color: 'text-amber-400' },
  proposal_sent:  { label: 'Proposal Sent',     icon: '🚀', color: 'text-blue-400' },
  won:            { label: 'Marked Won',        icon: '🏆', color: 'text-emerald-400' },
  lost:           { label: 'Marked Lost',       icon: '❌', color: 'text-red-400' },
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

// Parse notes field into structured activity entries
function parseActivity(notes) {
  if (!notes) return [];
  return notes.split('\n\n').filter(Boolean).map(entry => {
    const match = entry.match(/^\[(.+?)\]\[(.+?)\] (.+)$/s);
    if (match) return { ts: match[1], type: match[2], text: match[3] };
    const oldMatch = entry.match(/^\[(.+?)\] (.+)$/s);
    if (oldMatch) return { ts: oldMatch[1], type: 'note', text: oldMatch[2] };
    return { ts: '', type: 'note', text: entry };
  });
}

// Append to notes with type tag
function buildEntry(type, text) {
  const ts = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  return `[${ts}][${type}] ${text}`;
}

export default function LeadDetailModal({ deal, lead: initialLead, onClose, onUpdated }) {
  const [lead, setLead] = useState(initialLead || {});
  const [currentDeal, setCurrentDeal] = useState(deal);
  const [currentStage, setCurrentStage] = useState(deal.stage);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [movingStage, setMovingStage] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Quick follow-up
  const [editingFollowUp, setEditingFollowUp] = useState(false);
  const [followUpVal, setFollowUpVal] = useState(lead.next_follow_up || '');

  // Quick activity logging
  const [quickLog, setQuickLog] = useState(null); // null | { type, prompt, placeholder }
  const [quickText, setQuickText] = useState('');
  const [quickSaving, setQuickSaving] = useState(false);

  // Close / won-lost capture
  const [closeModal, setCloseModal] = useState(null); // null | 'won' | 'lost'
  const [closeValue, setCloseValue] = useState(currentDeal?.value ? String(currentDeal.value) : '');
  const [closeReason, setCloseReason] = useState('');
  const [closeSaving, setCloseSaving] = useState(false);

  // Proposal follow-up date
  const [editingProposalFollowUp, setEditingProposalFollowUp] = useState(false);
  const [proposalFollowUpVal, setProposalFollowUpVal] = useState(currentDeal?.proposal_follow_up || '');

  const activities = parseActivity(lead.notes);

  // ── helpers ──────────────────────────────────────────────────────────
  const appendNote = async (type, text, extraLeadFields = {}, extraDealFields = {}) => {
    const entry = buildEntry(type, text);
    const existing = lead.notes || '';
    const updatedNotes = existing ? `${entry}\n\n${existing}` : entry;
    const today = new Date().toISOString().split('T')[0];
    const leadUpdate = { notes: updatedNotes, last_contacted: today, ...extraLeadFields };
    await base44.entities.SalesLead.update(lead.id, leadUpdate);
    const updatedLead = { ...lead, ...leadUpdate };
    setLead(updatedLead);

    if (currentDeal?.id && Object.keys(extraDealFields).length > 0) {
      await base44.entities.SalesDeal.update(currentDeal.id, extraDealFields);
      const updatedDealObj = { ...currentDeal, ...extraDealFields };
      setCurrentDeal(updatedDealObj);
      onUpdated(updatedDealObj, updatedLead);
    } else {
      onUpdated(currentDeal, updatedLead);
    }
    return updatedLead;
  };

  const moveStage = async (stage) => {
    if (!currentDeal?.id || movingStage) return;
    setMovingStage(true);
    await base44.entities.SalesDeal.update(currentDeal.id, { stage });
    const updatedDealObj = { ...currentDeal, stage };
    setCurrentDeal(updatedDealObj);
    setCurrentStage(stage);
    const updatedLead = await appendNote('stage', `Stage → ${stage}`);
    onUpdated(updatedDealObj, updatedLead);
    setMovingStage(false);
  };

  // Quick log submit
  const submitQuickLog = async () => {
    if (!lead.id) return;
    setQuickSaving(true);
    const text = quickText.trim() || quickLog.defaultText || quickLog.prompt;
    await appendNote(quickLog.type, text);
    setQuickLog(null);
    setQuickText('');
    setQuickSaving(false);
  };

  // Proposal shortcuts
  const markProposalDrafted = () => {
    if (!lead.id) return;
    appendNote('proposal_drafted', 'Proposal drafted and ready to send');
    if (currentDeal?.id && currentStage !== 'Proposal') moveStage('Proposal');
  };

  const markProposalSent = () => {
    if (!lead.id) return;
    const today = new Date().toISOString().split('T')[0];
    appendNote('proposal_sent', 'Proposal sent to client', {}, { proposal_sent_date: today });
    if (currentDeal?.id && currentStage !== 'Proposal') moveStage('Proposal');
  };

  const saveProposalFollowUp = async () => {
    if (!currentDeal?.id) return;
    await base44.entities.SalesDeal.update(currentDeal.id, { proposal_follow_up: proposalFollowUpVal });
    const updatedDealObj = { ...currentDeal, proposal_follow_up: proposalFollowUpVal };
    setCurrentDeal(updatedDealObj);
    onUpdated(updatedDealObj, lead);
    setEditingProposalFollowUp(false);
  };

  // Close capture
  const submitClose = async (outcome) => {
    if (!currentDeal?.id || closeSaving) return;
    setCloseSaving(true);
    const stage = outcome === 'won' ? 'Closed Won' : 'Closed Lost';
    const today = new Date().toISOString().split('T')[0];
    const dealUpdate = { stage, closed_date: today };
    if (closeValue) dealUpdate.value = Number(closeValue);
    if (closeReason) dealUpdate.close_reason = closeReason;

    const noteText = outcome === 'won'
      ? `Won${closeValue ? ` — $${Number(closeValue).toLocaleString()}` : ''}${closeReason ? ` — ${closeReason}` : ''}`
      : `Lost${closeReason ? ` — Reason: ${closeReason}` : ''}`;

    await base44.entities.SalesDeal.update(currentDeal.id, dealUpdate);
    const updatedDealObj = { ...currentDeal, ...dealUpdate };
    setCurrentDeal(updatedDealObj);
    setCurrentStage(stage);

    const entry = buildEntry(outcome, noteText);
    const existing = lead.notes || '';
    const updatedNotes = existing ? `${entry}\n\n${existing}` : entry;
    await base44.entities.SalesLead.update(lead.id, { notes: updatedNotes, last_contacted: today, status: outcome === 'won' ? 'qualified' : 'unresponsive' });
    const updatedLead = { ...lead, notes: updatedNotes, last_contacted: today };
    setLead(updatedLead);

    onUpdated(updatedDealObj, updatedLead);
    setCloseModal(null);
    setCloseReason('');
    setCloseSaving(false);
  };

  // Follow-up save
  const saveFollowUp = async () => {
    if (!lead.id) return;
    await base44.entities.SalesLead.update(lead.id, { next_follow_up: followUpVal });
    const entry = buildEntry('followup', `Follow-up set → ${followUpVal || 'cleared'}`);
    const existing = lead.notes || '';
    const updatedNotes = existing ? `${entry}\n\n${existing}` : entry;
    await base44.entities.SalesLead.update(lead.id, { notes: updatedNotes });
    const updatedLead = { ...lead, next_follow_up: followUpVal, notes: updatedNotes };
    setLead(updatedLead);
    onUpdated(currentDeal, updatedLead);
    setEditingFollowUp(false);
  };

  // Edit mode
  const startEdit = () => {
    setEditForm({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      contact_name: lead.contact_name || '',
      business_name: lead.business_name || currentDeal.deal_name || '',
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

  const saveLead = async () => {
    setSaveError(null);
    if (!editForm.business_name?.trim()) { setSaveError('Business name is required.'); return; }
    setSaving(true);
    if (lead.id) {
      await base44.entities.SalesLead.update(lead.id, editForm);
      const updated = { ...lead, ...editForm };
      setLead(updated);
      setFollowUpVal(editForm.next_follow_up || '');
      if (currentDeal.id && editForm.business_name !== currentDeal.deal_name) {
        await base44.entities.SalesDeal.update(currentDeal.id, { deal_name: editForm.business_name });
        onUpdated({ ...currentDeal, deal_name: editForm.business_name }, updated);
      } else {
        onUpdated(currentDeal, updated);
      }
    }
    setSaving(false);
    setEditMode(false);
  };

  const set = (k, v) => setEditForm(p => ({ ...p, [k]: v }));
  const displayName = lead.contact_name || [lead.first_name, lead.last_name].filter(Boolean).join(' ') || null;
  const incomplete = isIncomplete(lead);
  const overdue = isOverdue(lead.next_follow_up);
  const isProposalStage = ['Proposal', 'Closed Won', 'Closed Lost'].includes(currentStage);
  const isClosed = ['Closed Won', 'Closed Lost'].includes(currentStage);

  // Quick log actions config
  const QUICK_ACTIONS = [
    { type: 'call', label: 'Log Call', icon: PhoneCall, color: 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20', prompt: 'Call notes (optional)', placeholder: 'e.g. Left voicemail, will try again tomorrow' },
    { type: 'email', label: 'Log Email', icon: Mail, color: 'text-blue-400 bg-blue-400/10 hover:bg-blue-400/20', prompt: 'Email notes (optional)', placeholder: 'e.g. Sent follow-up email with pricing' },
    { type: 'note', label: 'Add Note', icon: MessageSquare, color: 'text-slate-400 bg-slate-700/60 hover:bg-slate-700', prompt: 'Note', placeholder: 'What happened or needs to happen...' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[96vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h2 className="font-bold text-white text-base truncate">{lead.business_name || currentDeal.deal_name}</h2>
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
              {/* Incomplete CTA */}
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

              {/* Contact quick-actions */}
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

              {/* ── QUICK LOG ACTIONS ── */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quick Log</p>
                <div className="flex gap-2 flex-wrap">
                  {QUICK_ACTIONS.map(a => (
                    <button key={a.type} onClick={() => { setQuickLog(a); setQuickText(''); }}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${a.color}`}>
                      <a.icon className="w-3.5 h-3.5" />{a.label}
                    </button>
                  ))}
                  <button onClick={() => { setEditingFollowUp(true); }}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 transition-colors">
                    <Calendar className="w-3.5 h-3.5" />Set Follow-Up
                  </button>
                </div>

                {/* Quick log input */}
                {quickLog && (
                  <div className="mt-2 bg-slate-800 border border-slate-700 rounded-xl p-3">
                    <p className="text-xs font-semibold text-slate-400 mb-1.5">{quickLog.prompt}</p>
                    <textarea
                      value={quickText} onChange={e => setQuickText(e.target.value)}
                      autoFocus rows={2} placeholder={quickLog.placeholder}
                      className="w-full bg-slate-700 border border-slate-600 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={submitQuickLog} disabled={quickSaving}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-3 py-1.5 rounded-lg">
                        <Check className="w-3.5 h-3.5" />{quickSaving ? 'Saving...' : 'Log It'}
                      </button>
                      <button onClick={() => { setQuickLog(null); setQuickText(''); }}
                        className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg bg-slate-700">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── FOLLOW-UP ── */}
              <div className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className={`w-4 h-4 flex-shrink-0 ${overdue ? 'text-red-400' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Next Follow-Up</p>
                    {editingFollowUp ? (
                      <input type="date" value={followUpVal} onChange={e => setFollowUpVal(e.target.value)} autoFocus
                        className="mt-1 bg-slate-700 border border-blue-500 rounded-lg px-2 py-1 text-sm text-white focus:outline-none" />
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

              {/* ── PROPOSAL WORKFLOW ── */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proposal</p>
                <div className="bg-slate-800/50 rounded-xl p-3 space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={markProposalDrafted}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 transition-colors">
                      <FileText className="w-3.5 h-3.5" /> Mark Drafted
                    </button>
                    <button onClick={markProposalSent}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 transition-colors">
                      <Send className="w-3.5 h-3.5" /> Mark Sent
                    </button>
                  </div>

                  {/* Proposal sent date */}
                  {currentDeal?.proposal_sent_date && (
                    <p className="text-xs text-slate-500">Sent: {fmtDate(currentDeal.proposal_sent_date)}</p>
                  )}

                  {/* Proposal follow-up */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Proposal Follow-Up</p>
                        {editingProposalFollowUp ? (
                          <input type="date" value={proposalFollowUpVal} onChange={e => setProposalFollowUpVal(e.target.value)} autoFocus
                            className="mt-1 bg-slate-700 border border-blue-500 rounded-lg px-2 py-1 text-sm text-white focus:outline-none" />
                        ) : (
                          <p className="text-xs font-semibold text-slate-300">
                            {currentDeal?.proposal_follow_up ? fmtDate(currentDeal.proposal_follow_up) : 'Not set'}
                          </p>
                        )}
                      </div>
                    </div>
                    {editingProposalFollowUp ? (
                      <div className="flex gap-1.5">
                        <button onClick={saveProposalFollowUp} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-2.5 py-1.5 rounded-lg">Save</button>
                        <button onClick={() => setEditingProposalFollowUp(false)} className="text-xs text-slate-500 px-2 py-1.5 rounded-lg bg-slate-700">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingProposalFollowUp(true)} className="text-xs font-semibold text-slate-500 hover:text-white bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded-lg transition-colors">
                        {currentDeal?.proposal_follow_up ? 'Change' : 'Set'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── CLOSE ACTIONS ── */}
              {!isClosed && (
                <div className="flex gap-2">
                  <button onClick={() => { setCloseModal('won'); setCloseValue(currentDeal?.value ? String(currentDeal.value) : ''); setCloseReason(''); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 px-3 py-2 rounded-xl transition-colors">
                    <Trophy className="w-3.5 h-3.5" /> Mark Won
                  </button>
                  <button onClick={() => { setCloseModal('lost'); setCloseValue(''); setCloseReason(''); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-red-300 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 px-3 py-2 rounded-xl transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Mark Lost
                  </button>
                </div>
              )}

              {/* Close reason display */}
              {isClosed && currentDeal?.close_reason && (
                <div className={`rounded-xl p-3 border ${currentStage === 'Closed Won' ? 'bg-emerald-950/30 border-emerald-800/50' : 'bg-red-950/30 border-red-800/50'}`}>
                  <p className={`text-xs font-bold mb-1 ${currentStage === 'Closed Won' ? 'text-emerald-400' : 'text-red-400'}`}>{currentStage}</p>
                  {currentDeal?.value && <p className="text-sm font-bold text-emerald-400">${Number(currentDeal.value).toLocaleString()}</p>}
                  <p className="text-xs text-slate-400 mt-0.5">{currentDeal.close_reason}</p>
                </div>
              )}

              {/* ── PIPELINE STAGE ── */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pipeline Stage</p>
                {!currentDeal.id && <p className="text-xs text-amber-600 mb-2">No pipeline deal yet — stage moves disabled.</p>}
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => moveStage(s)} disabled={movingStage || !currentDeal.id}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 ${
                        currentStage === s
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 enabled:hover:bg-slate-700'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Deal value */}
              {currentDeal.value && (
                <div className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Deal Value</p>
                  <p className="text-lg font-bold text-emerald-400">${Number(currentDeal.value).toLocaleString()}</p>
                </div>
              )}

              {/* Contact details */}
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details</p>
                {lead.website && <InfoRow icon={Globe} label={lead.website} href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} ext />}
                {(lead.city || lead.state) && <InfoRow icon={MapPin} label={[lead.city, lead.state].filter(Boolean).join(', ')} />}
                {lead.industry && <InfoRow icon={() => <span className="text-xs">🏢</span>} label={lead.industry} />}
                {lead.lead_source && <InfoRow icon={() => <span className="text-xs">📌</span>} label={SOURCE_LABELS[lead.lead_source] || lead.lead_source} />}
                {lead.last_contacted && <InfoRow icon={() => <span className="text-xs">📆</span>} label={`Last contacted: ${fmtDate(lead.last_contacted)}`} />}
              </div>

              {/* ── ACTIVITY LOG ── */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3.5 h-3.5 text-slate-500" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Log</p>
                </div>
                {activities.length === 0 ? (
                  <p className="text-xs text-slate-700 italic">No activity logged yet. Use the quick log buttons above.</p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {activities.map((entry, i) => {
                      const def = ACTIVITY_TYPES[entry.type] || { label: entry.type, icon: '•', color: 'text-slate-400' };
                      return (
                        <div key={i} className="flex gap-2.5 bg-slate-800/40 rounded-lg px-3 py-2">
                          <span className="text-sm flex-shrink-0 mt-0.5">{def.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-semibold ${def.color}`}>{def.label}</span>
                              {entry.ts && <span className="text-xs text-slate-600">{entry.ts}</span>}
                            </div>
                            {entry.text && entry.text !== def.label && (
                              <p className="text-xs text-slate-400 mt-0.5 whitespace-pre-wrap">{entry.text}</p>
                            )}
                          </div>
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

      {/* ── CLOSE CAPTURE MODAL ── */}
      {closeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              {closeModal === 'won'
                ? <Trophy className="w-5 h-5 text-emerald-400" />
                : <XCircle className="w-5 h-5 text-red-400" />}
              <h3 className="font-bold text-white">{closeModal === 'won' ? 'Mark as Won' : 'Mark as Lost'}</h3>
            </div>

            {closeModal === 'won' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Deal Value (optional)</label>
                <input type="number" value={closeValue} onChange={e => setCloseValue(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                {closeModal === 'won' ? 'Win notes (optional)' : 'Loss reason (optional)'}
              </label>
              <textarea value={closeReason} onChange={e => setCloseReason(e.target.value)}
                rows={2} placeholder={closeModal === 'won' ? 'e.g. Liked the video demo, quick close' : 'e.g. Price too high, went with competitor'}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" />
            </div>

            <div className="flex gap-2">
              <button onClick={() => submitClose(closeModal)} disabled={closeSaving}
                className={`flex-1 font-bold text-white py-2.5 rounded-xl text-sm disabled:opacity-50 ${closeModal === 'won' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}>
                {closeSaving ? 'Saving...' : closeModal === 'won' ? 'Confirm Win 🏆' : 'Confirm Loss'}
              </button>
              <button onClick={() => setCloseModal(null)} className="px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
  return href ? <a href={href} target={ext ? '_blank' : undefined} rel="noopener noreferrer">{content}</a> : content;
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