import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  X, Phone, Mail, Globe, MapPin, Tag, Calendar,
  DollarSign, User, MessageSquare, Plus, Send, UserCheck,
  StickyNote, Clock, CheckCircle, Activity
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
  const [showEmailModal, setShowEmailModal] = useState(false);

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
    // Check if already a subscriber
    const existing = await base44.entities.Subscriber.filter({ email: lead.email });
    if (existing.length > 0) {
      toast.info(`${lead.email} is already a subscriber`);
      return;
    }
    await base44.entities.Subscriber.create({
      email: lead.email,
      first_name: lead.name?.split(' ')[0] || '',
      last_name: lead.name?.split(' ').slice(1).join(' ') || '',
      tags: [lead.industry, lead.source].filter(Boolean),
      source: 'crm_lead',
      status: 'active'
    });
    await base44.entities.Lead.update(lead.id, { converted_to_subscriber: true });
    toast.success(`${lead.name} added to email list!`);
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
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${lead.converted_to_subscriber ? 'bg-emerald-900/50 text-emerald-400 cursor-default' : 'bg-orange-900/50 hover:bg-orange-900 text-orange-300 cursor-pointer'}`}
          >
            <UserCheck className="w-3 h-3" />
            {lead.converted_to_subscriber ? 'On Email List' : 'Add to Email List'}
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
          {lead.source && <div className="flex items-center gap-2 text-slate-400 text-xs">Source: {lead.source.replace('_', ' ')}</div>}
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

        <p className="text-slate-600 text-xs text-center">Lead added: {new Date(lead.created_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}