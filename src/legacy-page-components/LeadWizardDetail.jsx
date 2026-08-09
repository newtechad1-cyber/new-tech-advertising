import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { logSystemEvent } from '@/lib/logSystemEvent';
import {
  ChevronLeft, Loader2, CheckCircle2, Copy, Check,
  Zap, Search, Mail, Phone, RefreshCw, AlertTriangle,
  TrendingUp, Calendar, FileText, DollarSign, StickyNote, Video, ExternalLink
} from 'lucide-react';

const STAGES = [
  { key: 'new_lead',             label: 'New Lead' },
  { key: 'audit_pending',        label: 'Audit' },
  { key: 'audit_ready',          label: 'Audit Ready' },
  { key: 'outreach_ready',       label: 'Outreach' },
  { key: 'outreach_sent',        label: 'Sent' },
  { key: 'followup_in_progress', label: 'Follow-Up' },
  { key: 'demo_scheduled',       label: 'Demo' },
  { key: 'proposal_sent',        label: 'Proposal' },
  { key: 'closed_won',           label: 'Won' },
  { key: 'closed_lost',          label: 'Lost' },
];
const STAGE_IDX = Object.fromEntries(STAGES.map((s, i) => [s.key, i]));

const NEXT_ACTION_MAP = {
  new_lead:             { label: 'Start Audit',        color: 'primary' },
  audit_pending:        { label: 'Generate Audit',     color: 'primary' },
  audit_ready:          { label: 'Approve Audit',      color: 'success' },
  outreach_ready:       { label: 'Send Outreach Email',color: 'primary' },
  outreach_sent:        { label: 'Start Follow-Up',    color: 'primary' },
  followup_in_progress: { label: 'Log Follow-Up',      color: 'primary' },
  demo_scheduled:       { label: 'Mark Demo Complete', color: 'primary' },
  proposal_sent:        { label: 'Close Deal',         color: 'success' },
};

const BTN = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  warning: 'bg-amber-600 hover:bg-amber-500 text-white',
  ghost:   'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700',
  danger:  'bg-red-700 hover:bg-red-600 text-white',
};

function Btn({ onClick, disabled, variant = 'primary', size = 'md', children }) {
  const sz = size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2';
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 font-semibold rounded-lg transition-colors disabled:opacity-50 ${sz} ${BTN[variant]}`}>
      {children}
    </button>
  );
}

function CopyBtn({ text, label = 'Copy', keyName, copied, setCopied }) {
  const done = copied === keyName;
  const handleCopy = () => {
    navigator.clipboard.writeText(text || '');
    setCopied(keyName);
    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <button onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${done ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}>
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? 'Copied!' : label}
    </button>
  );
}

function Card({ icon: Icon, title, color = 'text-blue-400', children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${color}`} />}
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      {children}
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

function TextArea({ value, onChange, rows = 4, placeholder }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white resize-y focus:outline-none focus:border-blue-500" />
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
  );
}

export default function LeadWizardDetail() {
  const { id } = useParams();
  const [wf, setWf] = useState(null);
  const [company, setCompany] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(null); // 'won' | 'lost'
  const [salesWf, setSalesWf] = useState(null);
  const [creatingContent, setCreatingContent] = useState(false);

  // Editable fields
  const [auditSummary, setAuditSummary] = useState('');
  const [auditUrl, setAuditUrl] = useState('');
  const [auditNotes, setAuditNotes] = useState('');
  const [outreachEmail, setOutreachEmail] = useState('');
  const [outreachNotes, setOutreachNotes] = useState('');
  const [followupNotes, setFollowupNotes] = useState('');
  const [nextFollowupDate, setNextFollowupDate] = useState('');
  const [dealValue, setDealValue] = useState('');
  const [closeNotes, setCloseNotes] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const results = await base44.entities.LeadWorkflow.filter({ id });
      const record = Array.isArray(results) ? results[0] : results;
      if (!record) return;
      hydrate(record);
      if (record.company_id) {
        const cos = await base44.entities.NTACompany.filter({ id: record.company_id });
        setCompany(Array.isArray(cos) ? cos[0] : cos);
      }
      if (record.submission_id) {
        const subs = await base44.entities.Submission.filter({ id: record.submission_id });
        setSubmission(Array.isArray(subs) ? subs[0] : subs);
      }
      if (record.content_workflow_id) {
        const cwfs = await base44.entities.ContentWorkflow.filter({ id: record.content_workflow_id });
        setSalesWf(Array.isArray(cwfs) ? cwfs[0] : cwfs);
      }
    } finally {
      setLoading(false);
    }
  };

  const hydrate = (r) => {
    setWf(r);
    setAuditSummary(r.audit_summary || '');
    setAuditUrl(r.audit_url || '');
    setAuditNotes(r.audit_notes || '');
    setOutreachEmail(r.outreach_email || '');
    setOutreachNotes(r.outreach_notes || '');
    setFollowupNotes(r.followup_notes || '');
    setNextFollowupDate(r.next_followup_date || '');
    setDealValue(r.deal_value?.toString() || '');
    setCloseNotes(r.close_notes || '');
    setNotes(r.notes || '');
  };

  const toast = (type, msg) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 3500);
  };

  const save = async (updates) => {
    setSaving(true);
    try {
      const updated = await base44.entities.LeadWorkflow.update(id, updates);
      hydrate(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  };

  const log = (event_type, message, extra = {}) => {
    logSystemEvent({
      event_type, source_system: 'agency', source_route: '/agency/lead-wizard',
      source_component: 'LeadWizardDetail', entity_type: 'LeadWorkflow', entity_id: id,
      workflow_type: 'crm', status: 'success', message, ...extra,
    });
  };

  // ---- STAGE ACTIONS ----
  const startAudit = async () => {
    await save({ audit_status: 'in_progress', current_stage: 'audit_pending' });
    log('audit_started', `Audit started for ${wf?.company_name || wf?.title}`);
    toast('success', 'Audit started!');
  };

  const generateAudit = async () => {
    setSaving(true);
    try {
      const co = company || {};
      const prompt = `You are a marketing analyst. Generate a concise website and online presence audit for this local business:
Business: ${co.company_name || wf?.company_name || wf?.title}
Website: ${co.website || 'unknown'}
Industry: ${co.industry || 'local business'}
City: ${co.city || ''}, ${co.state || ''}

Cover:
1. Website quality (speed, mobile, design) - estimated issues
2. Google Business Profile presence
3. Social media presence
4. Local SEO visibility
5. Top 3 improvement opportunities
6. Overall grade (A-F)

Be specific and actionable. Format as clear sections.`;
      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      const summary = typeof res === 'string' ? res : (res?.text || JSON.stringify(res));
      setAuditSummary(summary);
      await save({ audit_summary: summary, audit_status: 'completed', current_stage: 'audit_ready' });
      log('audit_generated', `Audit generated for ${wf?.company_name || wf?.title}`);
      toast('success', 'Audit generated!');
    } catch (err) {
      toast('error', 'Audit generation failed: ' + err.message);
      setSaving(false);
    }
  };

  const approveAudit = async () => {
    await save({ audit_summary: auditSummary, audit_url: auditUrl, audit_notes: auditNotes, current_stage: 'outreach_ready' });
    log('audit_approved', `Audit approved for ${wf?.company_name || wf?.title}`);
    toast('success', 'Audit approved! Creating sales video workflow...');
    // Auto-create sales content workflow
    setCreatingContent(true);
    try {
      const res = await base44.functions.invoke('createSalesContentWorkflow', { lead_workflow_id: id });
      if (res?.data?.content_workflow_id) {
        const cwfs = await base44.entities.ContentWorkflow.filter({ id: res.data.content_workflow_id });
        setSalesWf(Array.isArray(cwfs) ? cwfs[0] : cwfs);
        // Reload lead to get updated IDs
        const results = await base44.entities.LeadWorkflow.filter({ id });
        const record = Array.isArray(results) ? results[0] : results;
        if (record) hydrate(record);
        toast('success', res.data.script_generated ? 'Sales video script created! Open Content Workflow to review.' : 'Sales content workflow created — add script manually.');
      }
    } catch (err) {
      toast('error', 'Sales content creation failed: ' + err.message);
    } finally {
      setCreatingContent(false);
    }
  };

  const createSalesContentManually = async () => {
    if (wf?.content_workflow_id) return;
    setCreatingContent(true);
    try {
      const res = await base44.functions.invoke('createSalesContentWorkflow', { lead_workflow_id: id });
      if (res?.data?.content_workflow_id) {
        const cwfs = await base44.entities.ContentWorkflow.filter({ id: res.data.content_workflow_id });
        setSalesWf(Array.isArray(cwfs) ? cwfs[0] : cwfs);
        const results = await base44.entities.LeadWorkflow.filter({ id });
        const record = Array.isArray(results) ? results[0] : results;
        if (record) hydrate(record);
        toast('success', 'Sales content workflow created!');
      }
    } catch (err) {
      toast('error', err.message);
    } finally {
      setCreatingContent(false);
    }
  };

  const generateOutreachEmail = async () => {
    setSaving(true);
    try {
      const co = company || {};
      const prompt = `Write a short, personalized cold outreach email for a digital marketing agency reaching out to this local business.
Business: ${co.company_name || wf?.company_name}
Website: ${co.website || 'their website'}
City: ${co.city || ''}, ${co.state || ''}

Audit findings summary:
${auditSummary || 'Standard local business with room for improvement'}

Email must:
- Be under 150 words
- Sound human, not salesy
- Reference one specific finding from the audit
- Have a clear, low-pressure CTA (free call, free audit review)
- Subject line included at top as "Subject: ..."

Return only the email text.`;
      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      const email = typeof res === 'string' ? res : (res?.text || '');
      setOutreachEmail(email);
      await save({ outreach_email: email, outreach_status: 'draft' });
      log('outreach_generated', `Outreach email generated for ${wf?.company_name || wf?.title}`);
      toast('success', 'Outreach email generated!');
    } catch (err) {
      toast('error', 'Generation failed: ' + err.message);
      setSaving(false);
    }
  };

  const sendOutreach = async () => {
    await save({
      outreach_email: outreachEmail,
      outreach_notes: outreachNotes,
      outreach_status: 'sent',
      outreach_sent_date: new Date().toISOString(),
      current_stage: 'outreach_sent',
    });
    log('outreach_sent', `Outreach sent to ${wf?.company_name || wf?.title}`);
    toast('success', 'Outreach marked as sent!');
  };

  const startFollowUp = async () => {
    await save({
      followup_status: 'active',
      followup_count: 1,
      last_followup_date: new Date().toISOString(),
      current_stage: 'followup_in_progress',
    });
    log('followup_sent', `Follow-up started for ${wf?.company_name || wf?.title}`);
    toast('success', 'Follow-up started!');
  };

  const logFollowUp = async () => {
    const count = (wf?.followup_count || 0) + 1;
    await save({
      followup_count: count,
      last_followup_date: new Date().toISOString(),
      next_followup_date: nextFollowupDate,
      followup_notes: followupNotes,
    });
    log('followup_sent', `Follow-up #${count} logged for ${wf?.company_name || wf?.title}`);
    toast('success', `Follow-up #${count} logged!`);
  };

  const scheduleDemo = async () => {
    await save({ current_stage: 'demo_scheduled' });
    log('demo_scheduled', `Demo scheduled for ${wf?.company_name || wf?.title}`);
    toast('success', 'Demo scheduled!');
  };

  const sendProposal = async () => {
    await save({ current_stage: 'proposal_sent' });
    log('proposal_sent', `Proposal sent to ${wf?.company_name || wf?.title}`);
    toast('success', 'Proposal marked as sent!');
  };

  const markDemoComplete = async () => {
    await save({ current_stage: 'proposal_sent' });
    toast('success', 'Demo marked complete → ready for proposal.');
  };

  const closeWon = async () => {
    const val = parseFloat(dealValue) || 0;
    await save({ close_status: 'won', close_date: new Date().toISOString().split('T')[0], deal_value: val, close_notes: closeNotes, current_stage: 'closed_won' });
    // Mark company as active client
    if (wf?.company_id) {
      await base44.entities.NTACompany.update(wf.company_id, { active_client: true, status: 'active', lifecycle_stage: 'client' });
    }
    log('deal_won', `Deal WON: ${wf?.company_name || wf?.title} — $${val}`, { workflow_stage: 'closed_won' });
    setShowCloseModal(null);
    toast('success', '🎉 Deal marked as WON!');
  };

  const closeLost = async () => {
    await save({ close_status: 'lost', close_date: new Date().toISOString().split('T')[0], close_notes: closeNotes, current_stage: 'closed_lost' });
    log('deal_lost', `Deal LOST: ${wf?.company_name || wf?.title}`, { workflow_stage: 'closed_lost' });
    setShowCloseModal(null);
    toast('success', 'Deal marked as lost.');
  };

  if (loading) return (
    <AgencyLayout>
      <div className="flex items-center justify-center py-32 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
      </div>
    </AgencyLayout>
  );

  if (!wf) return (
    <AgencyLayout><div className="p-6 text-slate-400">Workflow not found.</div></AgencyLayout>
  );

  const currentIdx = STAGE_IDX[wf.current_stage] ?? 0;
  const nextAction = NEXT_ACTION_MAP[wf.current_stage];
  const isWon  = wf.current_stage === 'closed_won';
  const isLost = wf.current_stage === 'closed_lost';
  const isClosed = isWon || isLost;

  return (
    <AgencyLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-5">

        {/* Back */}
        <Link to="/agency/lead-wizard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> All Lead Workflows
        </Link>

        {/* OVERVIEW CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-bold text-white">{wf.company_name || wf.title}</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {wf.lead_source && <span className="mr-2">{wf.lead_source}</span>}
                {wf.deal_value ? <span className="text-emerald-400">${Number(wf.deal_value).toLocaleString()}</span> : null}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg capitalize">{wf.current_stage?.replace(/_/g, ' ')}</span>
              <button onClick={load} className="p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-0.5 overflow-x-auto pb-1">
            {STAGES.slice(0, 8).map((s, i) => {
              const done   = i < currentIdx;
              const active = i === currentIdx;
              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done ? 'bg-emerald-600 border-emerald-600 text-white' : active ? 'bg-blue-600 border-blue-500 text-white scale-110' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs mt-1 font-medium whitespace-nowrap ${active ? 'text-blue-400' : done ? 'text-emerald-500' : 'text-slate-700'}`}>{s.label}</span>
                  </div>
                  {i < 7 && <div className={`flex-1 h-0.5 mb-4 mx-0.5 min-w-2 ${done ? 'bg-emerald-600' : 'bg-slate-800'}`} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Next action banner */}
          {nextAction && (
            <div className="flex items-center justify-between gap-3 bg-blue-900/20 border border-blue-800 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-blue-300 font-medium">Next Step: {nextAction.label}</span>
              </div>
              {wf.current_stage === 'new_lead'             && <Btn onClick={startAudit}       disabled={saving} variant="primary" size="sm">Start Audit</Btn>}
              {wf.current_stage === 'audit_pending'        && <Btn onClick={generateAudit}    disabled={saving} variant="primary" size="sm">{saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />} Generate Audit</Btn>}
              {wf.current_stage === 'audit_ready'          && <Btn onClick={approveAudit}     disabled={saving} variant="success" size="sm"><CheckCircle2 className="w-3.5 h-3.5" /> Approve Audit</Btn>}
              {wf.current_stage === 'outreach_ready'       && <Btn onClick={sendOutreach}     disabled={saving || !outreachEmail.trim()} variant="primary" size="sm">Send Outreach</Btn>}
              {wf.current_stage === 'outreach_sent'        && <Btn onClick={startFollowUp}    disabled={saving} variant="primary" size="sm">Start Follow-Up</Btn>}
              {wf.current_stage === 'followup_in_progress' && <Btn onClick={logFollowUp}      disabled={saving} variant="primary" size="sm">Log Follow-Up #{(wf.followup_count || 0) + 1}</Btn>}
              {wf.current_stage === 'demo_scheduled'       && <Btn onClick={markDemoComplete} disabled={saving} variant="primary" size="sm">Mark Demo Done</Btn>}
              {wf.current_stage === 'proposal_sent'        && <Btn onClick={() => setShowCloseModal('won')} variant="success" size="sm">Close Deal</Btn>}
            </div>
          )}

          {isWon && (
            <div className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-700 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">🎉 Deal Won{wf.deal_value ? ` — $${Number(wf.deal_value).toLocaleString()}` : ''}!</span>
            </div>
          )}
          {isLost && (
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
              <span className="text-sm text-slate-400 font-medium">Deal closed as lost. {wf.close_notes ? `— ${wf.close_notes}` : ''}</span>
            </div>
          )}
        </div>

        {/* Notice */}
        {notice && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium border ${notice.type === 'success' ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : 'bg-red-900/30 border-red-800 text-red-300'}`}>
            {notice.msg}
          </div>
        )}

        {/* LEAD INFO */}
        {(company || submission) && (
          <Card icon={FileText} title="Lead Info" color="text-slate-400">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {company && <>
                <div><p className="text-slate-500 text-xs">Company</p><p className="text-white font-medium">{company.company_name}</p></div>
                {company.website && <div><p className="text-slate-500 text-xs">Website</p><a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate block">{company.website}</a></div>}
                {company.city    && <div><p className="text-slate-500 text-xs">Location</p><p className="text-white">{company.city}, {company.state}</p></div>}
                {company.industry && <div><p className="text-slate-500 text-xs">Industry</p><p className="text-white">{company.industry}</p></div>}
                {company.primary_contact_email && <div><p className="text-slate-500 text-xs">Contact Email</p><p className="text-white text-xs">{company.primary_contact_email}</p></div>}
                {company.primary_contact_phone && <div><p className="text-slate-500 text-xs">Phone</p><p className="text-white">{company.primary_contact_phone}</p></div>}
              </>}
              {submission && <>
                {submission.source_page    && <div><p className="text-slate-500 text-xs">Source</p><p className="text-white text-xs">{submission.source_page}</p></div>}
                {submission.submission_type && <div><p className="text-slate-500 text-xs">Type</p><p className="text-white capitalize">{submission.submission_type?.replace(/_/g, ' ')}</p></div>}
                {submission.notes          && <div className="col-span-2"><p className="text-slate-500 text-xs">Submission Notes</p><p className="text-slate-300 text-xs">{submission.notes}</p></div>}
              </>}
            </div>
          </Card>
        )}

        {/* AUDIT */}
        <Card icon={Search} title="Website Audit" color="text-amber-400">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">Status: <span className={`font-semibold ${wf.audit_status === 'completed' ? 'text-emerald-400' : wf.audit_status === 'in_progress' ? 'text-amber-400' : 'text-slate-500'}`}>{wf.audit_status?.replace(/_/g, ' ')}</span></span>
          </div>
          <div className="space-y-3">
            <Field label="Audit Summary">
              <div className="relative">
                <TextArea value={auditSummary} onChange={setAuditSummary} rows={8} placeholder="Audit findings will appear here..." />
                {auditSummary && <div className="absolute top-2 right-2"><CopyBtn text={auditSummary} label="Copy Audit" keyName="audit" copied={copied} setCopied={setCopied} /></div>}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Audit URL"><Input value={auditUrl} onChange={setAuditUrl} placeholder="https://..." /></Field>
              <Field label="Audit Notes"><Input value={auditNotes} onChange={setAuditNotes} placeholder="Internal notes..." /></Field>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {wf.current_stage === 'new_lead' && <Btn onClick={startAudit} disabled={saving} variant="primary"><Search className="w-4 h-4" /> Start Audit</Btn>}
            {wf.current_stage === 'audit_pending' && <Btn onClick={generateAudit} disabled={saving} variant="primary">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Generate Audit</Btn>}
            {auditSummary && wf.audit_status === 'completed' && wf.current_stage === 'audit_ready' && (
              <Btn onClick={approveAudit} disabled={saving} variant="success"><CheckCircle2 className="w-4 h-4" /> Approve Audit</Btn>
            )}
            {auditSummary && <Btn onClick={() => save({ audit_summary: auditSummary, audit_url: auditUrl, audit_notes: auditNotes })} disabled={saving} variant="ghost">Save</Btn>}
          </div>
        </Card>

        {/* SALES VIDEO WORKFLOW */}
        <Card icon={Video} title="Sales Video Workflow" color="text-purple-400">
          {wf.content_workflow_id && salesWf ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-500 text-xs">Purpose</p><p className="text-purple-300 font-semibold text-xs">Sales Outreach</p></div>
                <div><p className="text-slate-500 text-xs">Stage</p><p className="text-white capitalize text-xs">{salesWf.current_stage?.replace(/_/g, ' ')}</p></div>
                <div><p className="text-slate-500 text-xs">Script</p><p className={`text-xs font-semibold ${salesWf.script_status === 'approved' ? 'text-emerald-400' : salesWf.script_status === 'generated' ? 'text-amber-400' : 'text-slate-500'}`}>{salesWf.script_status?.replace(/_/g, ' ')}</p></div>
                <div><p className="text-slate-500 text-xs">HeyGen</p><p className={`text-xs font-semibold ${salesWf.heygen_status === 'completed' ? 'text-emerald-400' : salesWf.heygen_status === 'in_progress' ? 'text-amber-400' : 'text-slate-500'}`}>{salesWf.heygen_status?.replace(/_/g, ' ')}</p></div>
              </div>
              {salesWf.heygen_video_url && (
                <div>
                  <p className="text-slate-500 text-xs mb-1">Sales Video</p>
                  <a href={salesWf.heygen_video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> View Video
                  </a>
                </div>
              )}
              <div className="flex gap-2 flex-wrap pt-1">
                <Link to={`/agency/content-wizard/${wf.content_workflow_id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" /> Open Content Workflow
                </Link>
                {salesWf.script_long && (
                  <CopyBtn text={salesWf.script_long} label="Copy Script" keyName="salesScript" copied={copied} setCopied={setCopied} />
                )}
                {salesWf.heygen_video_url && (
                  <CopyBtn text={salesWf.heygen_video_url} label="Copy Video URL" keyName="videoUrl" copied={copied} setCopied={setCopied} />
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-500 text-sm">No sales video workflow linked yet.</p>
              {['outreach_ready', 'outreach_sent', 'followup_in_progress', 'demo_scheduled', 'proposal_sent'].includes(wf.current_stage) && (
                <Btn onClick={createSalesContentManually} disabled={creatingContent || saving} variant="primary">
                  {creatingContent ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Zap className="w-4 h-4" /> Create Sales Video Workflow</>}
                </Btn>
              )}
              {wf.current_stage === 'audit_ready' && (
                <p className="text-slate-600 text-xs">Approve the audit above to auto-create the sales video workflow.</p>
              )}
            </div>
          )}
        </Card>

        {/* OUTREACH */}
        <Card icon={Mail} title="Outreach" color="text-blue-400">
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">Status: <span className={`font-semibold ${wf.outreach_status === 'sent' ? 'text-emerald-400' : wf.outreach_status === 'draft' ? 'text-amber-400' : 'text-slate-500'}`}>{wf.outreach_status?.replace(/_/g, ' ')}</span></span>
            {wf.outreach_sent_date && <span className="text-slate-600">Sent: {new Date(wf.outreach_sent_date).toLocaleDateString()}</span>}
          </div>
          <div className="space-y-3">
            <Field label="Outreach Email">
              <div className="relative">
                <TextArea value={outreachEmail} onChange={setOutreachEmail} rows={10} placeholder="Outreach email will be generated here..." />
                {outreachEmail && <div className="absolute top-2 right-2"><CopyBtn text={outreachEmail} label="Copy Email" keyName="outreach" copied={copied} setCopied={setCopied} /></div>}
              </div>
            </Field>
            <Field label="Outreach Notes"><Input value={outreachNotes} onChange={setOutreachNotes} placeholder="Notes..." /></Field>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Btn onClick={generateOutreachEmail} disabled={saving} variant="primary">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} {outreachEmail ? 'Regenerate' : 'Generate'} Email</Btn>
            {outreachEmail && wf.outreach_status !== 'sent' && (
              <Btn onClick={sendOutreach} disabled={saving} variant="success"><Mail className="w-4 h-4" /> Mark as Sent</Btn>
            )}
          </div>
        </Card>

        {/* FOLLOW-UP */}
        <Card icon={Phone} title="Follow-Up" color="text-violet-400">
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <span className="text-slate-500">Status: <span className={`font-semibold ${wf.followup_status === 'active' ? 'text-violet-400' : wf.followup_status === 'completed' ? 'text-emerald-400' : 'text-slate-500'}`}>{wf.followup_status?.replace(/_/g, ' ')}</span></span>
            {wf.followup_count > 0 && <span className="text-slate-500">Follow-ups: <span className="text-white font-bold">{wf.followup_count}</span></span>}
            {wf.last_followup_date && <span className="text-slate-600">Last: {new Date(wf.last_followup_date).toLocaleDateString()}</span>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Next Follow-Up Date">
              <input type="date" value={nextFollowupDate} onChange={e => setNextFollowupDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </Field>
            <Field label="Follow-Up Notes"><Input value={followupNotes} onChange={setFollowupNotes} placeholder="Notes..." /></Field>
          </div>
          <div className="flex gap-2 flex-wrap">
            {wf.current_stage === 'outreach_sent' && <Btn onClick={startFollowUp} disabled={saving} variant="primary">Start Follow-Up</Btn>}
            {wf.current_stage === 'followup_in_progress' && <>
              <Btn onClick={logFollowUp} disabled={saving} variant="primary"><Phone className="w-4 h-4" /> Log Follow-Up #{(wf.followup_count || 0) + 1}</Btn>
              <Btn onClick={scheduleDemo} disabled={saving} variant="ghost"><Calendar className="w-4 h-4" /> Schedule Demo</Btn>
              <Btn onClick={sendProposal} disabled={saving} variant="ghost"><FileText className="w-4 h-4" /> Send Proposal</Btn>
            </>}
            {wf.current_stage === 'demo_scheduled' && <>
              <Btn onClick={markDemoComplete} disabled={saving} variant="primary">Mark Demo Complete</Btn>
              <Btn onClick={sendProposal} disabled={saving} variant="ghost"><FileText className="w-4 h-4" /> Send Proposal</Btn>
            </>}
          </div>
        </Card>

        {/* CLOSING */}
        {!isClosed && wf.current_stage === 'proposal_sent' && (
          <Card icon={TrendingUp} title="Close Deal" color="text-teal-400">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Deal Value ($)"><Input value={dealValue} onChange={setDealValue} placeholder="e.g. 1500" /></Field>
                <Field label="Close Notes"><Input value={closeNotes} onChange={setCloseNotes} placeholder="Notes..." /></Field>
              </div>
            </div>
            <div className="flex gap-2">
              <Btn onClick={() => setShowCloseModal('won')} variant="success"><CheckCircle2 className="w-4 h-4" /> Mark Won</Btn>
              <Btn onClick={() => setShowCloseModal('lost')} variant="danger">Mark Lost</Btn>
            </div>
          </Card>
        )}

        {/* NOTES */}
        <Card icon={StickyNote} title="Notes" color="text-slate-400">
          <TextArea value={notes} onChange={setNotes} rows={3} placeholder="General notes..." />
          <Btn onClick={() => save({ notes })} disabled={saving} variant="ghost">Save Notes</Btn>
        </Card>

      </div>

      {/* Close modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-white mb-3">{showCloseModal === 'won' ? '🎉 Mark as Won' : 'Mark as Lost'}</h3>
            <div className="space-y-3 mb-5">
              {showCloseModal === 'won' && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Deal Value ($)</label>
                  <input value={dealValue} onChange={e => setDealValue(e.target.value)} placeholder="e.g. 1500"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Close Notes</label>
                <textarea value={closeNotes} onChange={e => setCloseNotes(e.target.value)} rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              {showCloseModal === 'won'
                ? <Btn onClick={closeWon} disabled={saving} variant="success">Confirm Won</Btn>
                : <Btn onClick={closeLost} disabled={saving} variant="danger">Confirm Lost</Btn>}
              <Btn onClick={() => setShowCloseModal(null)} variant="ghost">Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}