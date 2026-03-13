import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MessageSquare, Eye, MousePointer, Building2, MapPin, Zap, ArrowRight } from 'lucide-react';
import SFUPhaseTimeline from './SFUPhaseTimeline';
import { EngagementBadge, PriorityBadge } from './SFUEngagementBadge';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

const PHASE_LABELS = { 1: 'Recap', 2: 'Authority Proof', 3: 'ROI Perspective', 4: 'Urgency', 5: 'Check-In', 6: 'Re-Engage' };

export default function SFUSequenceCard({ seq, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [previewMsg, setPreviewMsg] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleAdvance = async () => {
    setAdvancing(true);
    await base44.functions.invoke('ntaSalesFollowUpEngine', { action: 'advance_phase', sequence_id: seq.id });
    onRefresh?.();
    setAdvancing(false);
  };

  const handlePreview = async () => {
    if (previewMsg) { setPreviewMsg(null); return; }
    setLoadingPreview(true);
    const res = await base44.functions.invoke('ntaSalesFollowUpEngine', {
      action: 'generate_message',
      sequence_id: seq.id,
      phase: seq.current_phase,
    });
    setPreviewMsg(res.data);
    setLoadingPreview(false);
  };

  const isCritical = seq.priority_flag === 'critical' || seq.priority_flag === 'urgent';

  return (
    <div className={`bg-white rounded-2xl border transition-all ${isCritical ? 'border-red-200 shadow-lg shadow-red-500/5' : 'border-slate-200 shadow-sm'} overflow-hidden`}>
      {/* Priority stripe */}
      {isCritical && <div className="h-1 w-full bg-gradient-to-r from-red-500 to-orange-400" />}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-black text-slate-900 text-sm truncate">{seq.company_name}</h3>
              <EngagementBadge tier={seq.engagement_tier} score={seq.engagement_score} />
              <PriorityBadge priority={seq.priority_flag} />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              {seq.industry && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{seq.industry}</span>}
              {seq.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{seq.city}</span>}
              {seq.contact_name && <span>{seq.contact_name}</span>}
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Phase timeline compact */}
        <div className="mt-3 mb-3">
          <SFUPhaseTimeline currentPhase={seq.current_phase} engagementTier={seq.engagement_tier} compact />
        </div>

        {/* Signal stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-blue-500" />{seq.deal_room_visits || 0} visits</span>
          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-purple-500" />{seq.proposal_view_count || 0} proposal views</span>
          <span className="flex items-center gap-1"><MousePointer className="w-3 h-3 text-green-500" />{seq.cta_clicks || 0} CTA clicks</span>
          {seq.deal_value > 0 && <span className="ml-auto font-bold text-slate-700">${seq.deal_value.toLocaleString()}</span>}
        </div>

        {/* Next step */}
        {seq.next_follow_up_date && (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Next: <span className="font-bold text-slate-700">{seq.next_follow_up_action || PHASE_LABELS[seq.current_phase]}</span>
              {' · '}{seq.next_follow_up_date && format(new Date(seq.next_follow_up_date), 'MMM d')}
            </div>
            {seq.cadence_override === 'accelerated' && (
              <span className="text-xs font-bold text-orange-500 flex items-center gap-1"><Zap className="w-3 h-3" /> Accelerated</span>
            )}
          </div>
        )}
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-4">
          {/* Full phase timeline */}
          <SFUPhaseTimeline currentPhase={seq.current_phase} engagementTier={seq.engagement_tier} />

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={handlePreview} disabled={loadingPreview}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200">
              <MessageSquare className="w-3.5 h-3.5" />
              {loadingPreview ? 'Generating…' : previewMsg ? 'Hide Message' : 'Preview Next Message'}
            </button>
            {seq.current_phase < 6 && (
              <button onClick={handleAdvance} disabled={advancing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
                {advancing ? 'Advancing…' : `Advance to Phase ${(seq.current_phase || 1) + 1}`}
              </button>
            )}
          </div>

          {/* Message preview */}
          {previewMsg && (
            <div className="rounded-xl border border-blue-200 bg-white p-4">
              <p className="text-xs font-bold text-slate-500 mb-1">SUBJECT</p>
              <p className="text-sm font-bold text-slate-900 mb-3">{previewMsg.subject}</p>
              <p className="text-xs font-bold text-slate-500 mb-1">BODY</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{previewMsg.body}</p>
            </div>
          )}

          {/* Meta info */}
          <div className="text-xs text-slate-400 space-y-0.5">
            {seq.demo_completed_date && <p>Demo completed: {format(new Date(seq.demo_completed_date), 'MMM d, yyyy')}</p>}
            {seq.last_engagement_date && <p>Last engagement: {format(new Date(seq.last_engagement_date), 'MMM d, h:mm a')}</p>}
            {seq.assigned_owner && <p>Owner: {seq.assigned_owner}</p>}
          </div>
        </div>
      )}
    </div>
  );
}