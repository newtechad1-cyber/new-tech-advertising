import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  X, Phone, Mail, Globe, MapPin, Tag, Calendar,
  DollarSign, User, MessageSquare, Plus, UserCheck, Activity
} from 'lucide-react';

const NOTE_TYPES = [
  { value: 'call', label: '📞 Call', color: 'text-blue-400' },
  { value: 'email', label: '📧 Email', color: 'text-cyan-400' },
  { value: 'meeting', label: '🤝 Meeting', color: 'text-purple-400' },
  { value: 'follow_up', label: '🔔 Follow Up', color: 'text-orange-400' },
  { value: 'general', label: '📝 Note', color: 'text-slate-400' },
];

export default function LeadDetailPanel({ lead, onClose, onSubscribeToEmail }) {
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({ note: '', note_type: 'general' });
  const [savingNote, setSavingNote] = useState(false);
  const [showJournalPermission, setShowJournalPermission] = useState(false);
  const [journalForm, setJournalForm] = useState({
    consent_method: 'verbal',
    consent_date: new Date().toISOString().slice(0, 10),
    consent_context: '',
    confirmed: false,
  });

  useEffect(() => {
    if (lead?.id) loadNotes();
  }, [lead?.id]);

  const loadNotes = async () => {
    setLoadingNotes(true);
    const data = await base44.entities.LeadNote.filter({ lead_id: lead.id }, '-created_date');
    setNotes(data);
    setLoadingNotes(false);
  };

  const addNote = async () => {
    if (!noteForm.note.trim()) return;
    setSavingNote(true);
    await base44.entities.LeadNote.create({ ...noteForm, lead_id: lead.id });
    setNoteForm({ note: '', note_type: 'general' });
    setShowNoteForm(false);
    setSavingNote(false);
    loadNotes();
    toast.success('Note added');
  };

  const deleteNote = async (id) => {
    await base44.entities.LeadNote.delete(id);
    loadNotes();
  };

  const handleSubscribe = async () => {
    if (!lead.email) {
      toast.error('Add an email address before recording Journal permission');
      return;
    }
    setShowJournalPermission(true);
  };

  const confirmJournalPermission = async () => {
    if (!journalForm.confirmed) {
      toast.error('Confirm that this person gave permission');
      return;
    }
    const existing = await base44.entities.Subscriber.filter({ email: lead.email });
    const nameParts = (lead.contact_name || '').trim().split(/\s+/).filter(Boolean);
    const subscriberPayload = {
      email: lead.email,
      first_name: lead.first_name || nameParts[0] || '',
      last_name: lead.last_name || nameParts.slice(1).join(' '),
      business_name: lead.business_name,
      tags: [lead.industry, 'nta-journal'].filter(Boolean),
      source: lead.lead_source || 'crm_prospect',
      status: 'active',
      consent_status: 'confirmed',
      consent_date: journalForm.consent_date,
      consent_method: journalForm.consent_method,
      consent_context: journalForm.consent_context || lead.relationship_origin || '',
      sales_lead_id: lead.id,
    };
    let subscriber;
    if (existing.length > 0) {
      subscriber = await base44.entities.Subscriber.update(existing[0].id, subscriberPayload);
    } else {
      subscriber = await base44.entities.Subscriber.create(subscriberPayload);
    }
    await base44.entities.SalesLead.update(lead.id, {
      journal_permission_status: 'granted',
      journal_permission_date: journalForm.consent_date,
      journal_permission_method: journalForm.consent_method,
      journal_subscriber_id: subscriber.id || existing[0]?.id,
    });
    setShowJournalPermission(false);
    toast.success(`Journal permission recorded for ${lead.contact_name || lead.business_name}`);
    if (onSubscribeToEmail) onSubscribeToEmail();
  };

  const getNoteTypeConfig = (type) => NOTE_TYPES.find(n => n.value === type) || NOTE_TYPES[4];

  return (
    <div className="bg-slate-800 border border-amber-500 rounded-xl h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-5 py-4 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">{lead.business_name}</h3>
            <p className="text-slate-400 text-sm">{lead.name}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} className="text-slate-400 h-7 w-7 flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 bg-blue-900/50 hover:bg-blue-900 text-blue-300 text-xs px-3 py-1.5 rounded-lg transition-colors">
              <Mail className="w-3 h-3" /> Email
            </a>
          )}
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 bg-green-900/50 hover:bg-green-900 text-green-300 text-xs px-3 py-1.5 rounded-lg transition-colors">
              <Phone className="w-3 h-3" /> Call
            </a>
          )}
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors">
              <Globe className="w-3 h-3" /> Website
            </a>
          )}
          <button
            onClick={handleSubscribe}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${lead.journal_permission_status === 'granted' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-orange-900/50 hover:bg-orange-900 text-orange-300 cursor-pointer'}`}
          >
            <UserCheck className="w-3 h-3" />
            {lead.journal_permission_status === 'granted' ? 'Journal Permission Recorded' : 'Record Journal Permission'}
          </button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Contact Details */}
        <div className="space-y-2 text-sm">
          {lead.email && <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />{lead.email}</div>}
          {lead.phone && <div className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />{lead.phone}</div>}
          {(lead.city || lead.state) && <div className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />{[lead.city, lead.state].filter(Boolean).join(', ')}</div>}
          {lead.industry && <div className="flex items-center gap-2 text-slate-300"><Tag className="w-4 h-4 text-slate-500 flex-shrink-0" />{lead.industry}</div>}
          {lead.deal_value > 0 && <div className="flex items-center gap-2 text-emerald-400 font-semibold"><DollarSign className="w-4 h-4 text-emerald-500 flex-shrink-0" />${lead.deal_value.toLocaleString()} deal value</div>}
          {lead.next_follow_up && <div className="flex items-center gap-2 text-orange-300"><Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />Follow up: {lead.next_follow_up}</div>}
          {lead.assigned_to && <div className="flex items-center gap-2 text-slate-300"><User className="w-4 h-4 text-slate-500 flex-shrink-0" />Assigned: {lead.assigned_to}</div>}
          {lead.lead_source && <div className="flex items-center gap-2 text-slate-400 text-xs">Found through: {lead.lead_source.replaceAll('_', ' ')}</div>}
          {lead.first_contact_method && lead.first_contact_method !== 'not_contacted' && <div className="flex items-center gap-2 text-slate-400 text-xs">First contact: {lead.first_contact_method.replaceAll('_', ' ')}</div>}
          {lead.relationship_origin && <div className="flex items-start gap-2 text-slate-300 text-xs"><MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />{lead.relationship_origin}</div>}
          {lead.journal_permission_status === 'granted' && <div className="flex items-center gap-2 text-orange-300 text-xs"><UserCheck className="w-4 h-4 text-orange-500" />Journal permission: {lead.journal_permission_date || 'recorded'} via {(lead.journal_permission_method || 'other').replaceAll('_', ' ')}</div>}
        </div>

        {lead.tags?.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {lead.tags.map(t => <span key={t} className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full">{t}</span>)}
          </div>
        )}

        {/* Initial Message */}
        {lead.message && (
          <div className="bg-slate-900 rounded-lg p-3">
            <p className="text-slate-500 text-xs font-medium mb-1">INITIAL MESSAGE</p>
            <p className="text-slate-300 text-sm">{lead.message}</p>
          </div>
        )}

        {/* Internal Notes */}
        {lead.internal_notes && (
          <div className="bg-yellow-950/40 border border-yellow-800/50 rounded-lg p-3">
            <p className="text-yellow-600 text-xs font-medium mb-1">INTERNAL NOTES</p>
            <p className="text-slate-300 text-sm">{lead.internal_notes}</p>
          </div>
        )}

        {/* Activity Log */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <p className="text-slate-400 text-sm font-medium">Activity Log</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setShowNoteForm(!showNoteForm)} className="text-amber-400 hover:text-amber-300 h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" /> Log Activity
            </Button>
          </div>

          {showNoteForm && (
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 space-y-3 mb-3">
              <Select value={noteForm.note_type} onValueChange={v => setNoteForm(f => ({...f, note_type: v}))}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTE_TYPES.map(n => <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <textarea
                value={noteForm.note}
                onChange={e => setNoteForm(f => ({...f, note: e.target.value}))}
                placeholder="What happened? What was discussed?"
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={addNote} disabled={savingNote} className="bg-amber-600 hover:bg-amber-700 h-8 text-xs">Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNoteForm(false)} className="text-slate-400 h-8 text-xs">Cancel</Button>
              </div>
            </div>
          )}

          {loadingNotes ? (
            <p className="text-slate-500 text-xs text-center py-4">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-slate-600 text-xs text-center py-4">No activity logged yet</p>
          ) : (
            <div className="space-y-2">
              {notes.map(note => {
                const typeConfig = getNoteTypeConfig(note.note_type);
                return (
                  <div key={note.id} className="bg-slate-900 rounded-lg p-3 group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${typeConfig.color}`}>{typeConfig.label}</span>
                          <span className="text-slate-600 text-xs">{new Date(note.created_date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300 text-sm">{note.note}</p>
                      </div>
                      <button onClick={() => deleteNote(note.id)} className="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-slate-600 text-xs text-center">Prospect added: {new Date(lead.created_date).toLocaleDateString()}</p>
      </div>

      <Dialog open={showJournalPermission} onOpenChange={setShowJournalPermission}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader><DialogTitle>Record NTA Journal Permission</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">This records that {lead.contact_name || lead.business_name} agreed to receive the weekly NTA Journal. It does not treat a cold contact as a subscriber.</p>
          <div className="space-y-4 pt-2">
            <div><label className="text-slate-400 text-xs mb-1 block">How permission was given</label><Select value={journalForm.consent_method} onValueChange={value => setJournalForm(current => ({ ...current, consent_method: value }))}><SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{['website_form', 'email_reply', 'verbal', 'written', 'event_signup', 'other'].map(method => <SelectItem key={method} value={method}>{method.replaceAll('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
            <div><label className="text-slate-400 text-xs mb-1 block">Permission date</label><Input type="date" value={journalForm.consent_date} onChange={event => setJournalForm(current => ({ ...current, consent_date: event.target.value }))} className="bg-slate-800 border-slate-700" /></div>
            <div><label className="text-slate-400 text-xs mb-1 block">Context</label><textarea value={journalForm.consent_context} onChange={event => setJournalForm(current => ({ ...current, consent_context: event.target.value }))} placeholder="Replied yes by email, signed up after chamber webinar…" rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm" /></div>
            <label className="flex items-start gap-3 bg-slate-800 rounded-lg p-3 cursor-pointer"><input type="checkbox" checked={journalForm.confirmed} onChange={event => setJournalForm(current => ({ ...current, confirmed: event.target.checked }))} className="mt-0.5" /><span className="text-sm text-slate-300">I confirm this person gave permission to receive the NTA Journal.</span></label>
            <div className="flex gap-3"><Button onClick={confirmJournalPermission} className="bg-orange-600 hover:bg-orange-700 flex-1">Save Permission & Subscribe</Button><Button variant="ghost" onClick={() => setShowJournalPermission(false)} className="text-slate-400">Cancel</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
