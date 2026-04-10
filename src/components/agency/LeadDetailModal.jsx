import React, { useState } from 'react';
import { X, Phone, Mail, Globe, MapPin, ChevronDown, MessageSquare, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STAGES = ['New Lead', 'Contacted', 'Demo Sent', 'Proposal', 'Closed Won', 'Closed Lost'];
const STAGE_COLORS = {
  'New Lead': 'bg-slate-700 text-slate-300',
  'Contacted': 'bg-blue-900 text-blue-300',
  'Demo Sent': 'bg-violet-900 text-violet-300',
  'Proposal': 'bg-amber-900 text-amber-300',
  'Closed Won': 'bg-emerald-900 text-emerald-300',
  'Closed Lost': 'bg-red-900 text-red-300',
};

export default function LeadDetailModal({ deal, lead, onClose, onUpdated }) {
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [currentStage, setCurrentStage] = useState(deal.stage);
  const [movingStage, setMovingStage] = useState(false);

  const moveStage = async (stage) => {
    setMovingStage(true);
    await base44.entities.SalesDeal.update(deal.id, { stage });
    setCurrentStage(stage);
    setMovingStage(false);
    onUpdated({ ...deal, stage });
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    const existing = deal.notes || '';
    const ts = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const updated = existing ? `${existing}\n\n[${ts}] ${note}` : `[${ts}] ${note}`;
    await base44.entities.SalesDeal.update(deal.id, { notes: updated });
    setNote('');
    setAddingNote(false);
    onUpdated({ ...deal, notes: updated });
  };

  const fullName = [lead?.first_name, lead?.last_name].filter(Boolean).join(' ') || 'Unknown';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-white text-lg">{lead?.business_name || deal.deal_name}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STAGE_COLORS[currentStage] || 'bg-slate-700 text-slate-300'}`}>
                {currentStage}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{fullName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg flex-shrink-0"><X className="w-4 h-4" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Contact quick actions */}
          {lead && (
            <div className="grid grid-cols-2 gap-3">
              {lead.phone && (
                <a href={`tel:${lead.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-300 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
                  <Phone className="w-4 h-4" /> {lead.phone}
                </a>
              )}
              {lead.email && (
                <a href={`mailto:${lead.email}`}
                  className="flex items-center gap-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-300 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors">
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
            </div>
          )}

          {/* Lead info */}
          {lead && (
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contact Details</p>
              {lead.email && <InfoRow icon={Mail} label={lead.email} href={`mailto:${lead.email}`} />}
              {lead.phone && <InfoRow icon={Phone} label={lead.phone} href={`tel:${lead.phone.replace(/\D/g, '')}`} />}
              {lead.website && <InfoRow icon={Globe} label={lead.website} href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} />}
              {(lead.city || lead.state) && <InfoRow icon={MapPin} label={[lead.city, lead.state].filter(Boolean).join(', ')} />}
              {lead.industry && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-4">🏢</span>
                  <span className="text-slate-300">{lead.industry}</span>
                </div>
              )}
              {lead.lead_source && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-4">📌</span>
                  <span className="text-slate-300 capitalize">{lead.lead_source.replace('_', ' ')}</span>
                </div>
              )}
              {lead.notes && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">Lead Notes</p>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Move stage */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Move Stage</p>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button key={s} onClick={() => moveStage(s)} disabled={movingStage}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
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

          {/* Deal notes */}
          {deal.notes && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
              <div className="bg-slate-800/50 rounded-xl p-3">
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{deal.notes}</p>
              </div>
            </div>
          )}

          {/* Add note */}
          {addingNote ? (
            <div>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                autoFocus rows={3} placeholder="Add a note about this deal..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" />
              <div className="flex gap-2 mt-2">
                <button onClick={saveNote} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg">
                  <Check className="w-3.5 h-3.5" /> Save Note
                </button>
                <button onClick={() => { setNote(''); setAddingNote(false); }} className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingNote(true)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl w-full transition-colors">
              <MessageSquare className="w-4 h-4" /> Add Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, href }) {
  const content = (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
      <span className={`${href ? 'text-blue-400 hover:text-blue-300' : 'text-slate-300'} truncate`}>{label}</span>
    </div>
  );
  return href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{content}</a> : content;
}