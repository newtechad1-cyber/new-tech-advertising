import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Mail, CheckCircle2, Clock, Copy, Loader2, Send, CalendarPlus } from 'lucide-react';

function getEmailStage(status) {
  if (['new', 'researched', 'ready_for_outreach'].includes(status)) return 'intro';
  if (['contacted', 'opened'].includes(status)) return 'followup';
  return 'final_checkin';
}

function getEmailStageLabel(stage) {
  if (stage === 'intro') return 'Intro Email';
  if (stage === 'followup') return 'Follow-up Email';
  return 'Final Check-in';
}

function getSuggestedFollowupDays(status) {
  if (['new', 'ready_for_outreach'].includes(status)) return 3;
  if (['contacted'].includes(status)) return 7;
  if (['replied'].includes(status)) return 2;
  if (['demo_scheduled'].includes(status)) return 1;
  return 5;
}

export default function OutreachAssistPanel({ lead, leadId }) {
  const queryClient = useQueryClient();
  const [research, setResearch] = useState(null);
  const [researchLoading, setResearchLoading] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [followupDays, setFollowupDays] = useState(7);
  const [followupLoading, setFollowupLoading] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const emailStage = getEmailStage(lead?.outreach_status);
  const suggestedDays = getSuggestedFollowupDays(lead?.outreach_status);

  useEffect(() => {
    if (leadId) loadResearch();
  }, [leadId]);

  const loadResearch = async () => {
    setResearchLoading(true);
    try {
      const res = await base44.functions.invoke('schoolLeadResearchHelper', { school_lead_id: leadId });
      setResearch(res.data);
    } catch (e) {
      console.error(e);
    }
    setResearchLoading(false);
  };

  const generateEmail = async () => {
    setEmailLoading(true);
    try {
      const res = await base44.functions.invoke('generateSchoolLeadOutreachEmail', {
        school_lead_id: leadId,
        stage: emailStage,
      });
      setEmailData(res.data);
      setEditedSubject(res.data.subject);
      setEditedBody(res.data.body);
      setShowEmail(true);
    } catch (e) {
      console.error(e);
    }
    setEmailLoading(false);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const logOutreachSent = async () => {
    setLogLoading(true);
    try {
      await base44.entities.SchoolOutreachActivity.create({
        school_lead_id: leadId,
        activity_type: 'email_sent',
        activity_date: new Date().toISOString(),
        subject: editedSubject || `Outreach - ${emailStage}`,
        message: editedBody || '',
        response_status: 'sent',
      });
      const shouldAdvance = ['new', 'researched', 'ready_for_outreach'].includes(lead.outreach_status);
      if (shouldAdvance) {
        await base44.entities.SchoolLeads.update(leadId, {
          outreach_status: 'contacted',
          last_contact_date: new Date().toISOString(),
        });
      } else {
        await base44.entities.SchoolLeads.update(leadId, {
          last_contact_date: new Date().toISOString(),
        });
      }
      queryClient.invalidateQueries({ queryKey: ['school_lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['school_activities', leadId] });
      setShowEmail(false);
      showSuccess('Outreach logged successfully!');
    } catch (e) {
      console.error(e);
    }
    setLogLoading(false);
  };

  const scheduleFollowup = async () => {
    setFollowupLoading(true);
    try {
      await base44.functions.invoke('createSchoolLeadFollowup', {
        school_lead_id: leadId,
        days_until_followup: followupDays,
        activity_type: 'email_sent',
        activity_note: `Follow-up scheduled in ${followupDays} days`,
      });
      queryClient.invalidateQueries({ queryKey: ['school_lead', leadId] });
      queryClient.invalidateQueries({ queryKey: ['school_activities', leadId] });
      setShowFollowupModal(false);
      showSuccess(`Follow-up scheduled for ${followupDays} days from now`);
    } catch (e) {
      console.error(e);
    }
    setFollowupLoading(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(`Subject: ${editedSubject}\n\n${editedBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h2 className="font-bold text-slate-900">AI Outreach Assistant</h2>
        <Badge className="bg-blue-100 text-blue-800 text-xs">
          Next: {getEmailStageLabel(emailStage)}
        </Badge>
      </div>

      {successMsg && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2 text-green-800 text-sm">
          <CheckCircle2 className="h-4 w-4" />
          {successMsg}
        </div>
      )}

      {researchLoading ? (
        <div className="flex items-center gap-2 text-slate-600 text-sm py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyzing lead...
        </div>
      ) : research ? (
        <div className="space-y-3">
          {/* Recommended Action */}
          <div className="bg-white rounded-lg border border-blue-200 p-4">
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Recommended Next Action</div>
            <p className="text-sm font-medium text-slate-900">{research.recommended_next_step}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Talking Points */}
            {research.talking_points?.length > 0 && (
              <div className="bg-white rounded-lg border border-blue-200 p-4">
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Talking Points</div>
                <ul className="space-y-1">
                  {research.talking_points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* School Summary */}
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">School Summary</div>
              <div className="space-y-1.5 text-sm">
                <div><span className="text-slate-500">Size:</span> <span className="font-medium">{research.size_category} ({research.size?.toLocaleString() || '?'} students)</span></div>
                <div><span className="text-slate-500">Location:</span> <span className="font-medium">{research.location}</span></div>
                <div><span className="text-slate-500">Last Contact:</span> <span className="font-medium">{research.timeline?.last_contact}</span></div>
                <div><span className="text-slate-500">Next Follow-up:</span> <span className="font-medium">{research.timeline?.next_followup}</span></div>
                <div><span className="text-slate-500">Activities Logged:</span> <span className="font-medium">{research.activity_count}</span></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-500 py-2">No research data yet. Click Refresh Analysis to load.</div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          onClick={generateEmail}
          disabled={emailLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          {emailLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Mail className="h-4 w-4 mr-1" />}
          Generate Outreach Email
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setShowFollowupModal(!showFollowupModal); setFollowupDays(suggestedDays); }}
        >
          <CalendarPlus className="h-4 w-4 mr-1" />
          Schedule Follow-up
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={loadResearch}
          disabled={researchLoading}
        >
          {researchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Email Preview / Editor */}
      {showEmail && emailData && (
        <div className="mt-4 bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-slate-900 text-sm">Generated Email — {getEmailStageLabel(emailStage)}</div>
            <button onClick={() => setShowEmail(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>
          <div className="mb-3">
            <label className="text-xs font-semibold text-slate-600 block mb-1">Subject</label>
            <input
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-600 block mb-1">Body (editable)</label>
            <textarea
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm h-52 font-mono text-xs leading-relaxed"
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={copyEmail} variant="outline">
              <Copy className="h-4 w-4 mr-1" />
              {copied ? 'Copied!' : 'Copy Email'}
            </Button>
            <a href={`mailto:${lead?.contact_email}?subject=${encodeURIComponent(editedSubject)}&body=${encodeURIComponent(editedBody)}`}>
              <Button size="sm" variant="outline">
                <Send className="h-4 w-4 mr-1" />
                Open in Mail App
              </Button>
            </a>
            <Button
              size="sm"
              onClick={logOutreachSent}
              disabled={logLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {logLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
              Log Outreach Sent
            </Button>
          </div>
        </div>
      )}

      {/* Follow-up Scheduler */}
      {showFollowupModal && (
        <div className="mt-4 bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-slate-900 text-sm">Schedule Follow-up</div>
            <button onClick={() => setShowFollowupModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
          </div>
          <p className="text-sm text-slate-600 mb-3">
            Days until next follow-up: <span className="text-blue-700 font-semibold">{followupDays} days</span>
            <span className="text-xs text-slate-400 ml-2">(suggested: {suggestedDays}d based on stage)</span>
          </p>
          <div className="flex gap-2 mb-4 flex-wrap">
            {[2, 3, 5, 7, 10, 14].map(d => (
              <button
                key={d}
                onClick={() => setFollowupDays(d)}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${followupDays === d ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                {d}d
              </button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={scheduleFollowup}
            disabled={followupLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {followupLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Clock className="h-4 w-4 mr-1" />}
            Confirm Follow-up ({followupDays} days)
          </Button>
        </div>
      )}
    </div>
  );
}