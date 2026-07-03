import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Save, CheckCircle2, Send, Phone, FileText,
  Globe, Shield, MapPin, Bot, Target, BookOpen, Handshake,
  MessageSquare, Lightbulb, ChevronDown, ChevronUp, Loader2,
  AlertCircle, Star, TrendingUp, Users, Calendar, RefreshCw,
  Zap, Eye, Search, Sparkles, ClipboardCheck, ArrowRight
} from 'lucide-react';
import RecommendationPanel from '@/components/RecommendationPanel';

// ─────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────

const AUDIT_CATEGORIES = [
  { key: 'website_visibility',      label: 'Website Visibility',      icon: Globe,      color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  { key: 'trust_signals',           label: 'Trust Signals',           icon: Shield,     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'local_search_readiness',  label: 'Local Search Readiness',  icon: MapPin,     color: 'text-orange-400',  bg: 'bg-orange-500/10' },
  { key: 'ai_search_readiness',     label: 'AI Search Readiness',     icon: Bot,        color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { key: 'customer_journey_clarity',label: 'Customer Journey Clarity', icon: Target,    color: 'text-pink-400',    bg: 'bg-pink-500/10' },
  { key: 'content_depth',           label: 'Content Depth',           icon: BookOpen,   color: 'text-sky-400',     bg: 'bg-sky-500/10' },
  { key: 'follow_up_system',        label: 'Follow-Up System',        icon: Handshake,  color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
];

const RECOMMENDATION_OPTIONS = [
  { value: 'growth_conversation',     label: 'Growth Conversation',      desc: 'Deep-dive strategy call' },
  { value: 'growth_roadmap',          label: 'Growth Roadmap',           desc: 'Custom growth plan' },
  { value: 'starter_visibility_fix',  label: 'Starter Visibility Fix',   desc: 'Quick wins to get found' },
  { value: 'relationship_builder',    label: 'Relationship Builder',     desc: 'Trust & nurture system' },
  { value: 'full_operating_system',   label: 'Full Operating System',    desc: 'Complete NTA build' },
  { value: 'custom_plan',             label: 'Custom Plan',              desc: 'Tailored solution' },
];

const OUTCOME_OPTIONS = [
  { value: 'proposal_requested', label: 'Proposal Requested',  icon: FileText,  color: 'text-emerald-400' },
  { value: 'follow_up_needed',   label: 'Follow-up Needed',    icon: Calendar,  color: 'text-yellow-400' },
  { value: 'not_ready',          label: 'Not Ready',           icon: AlertCircle, color: 'text-orange-400' },
  { value: 'lost_opportunity',   label: 'Lost Opportunity',    icon: AlertCircle, color: 'text-red-400' },
];

// ─────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────

function RatingBadge({ rating }) {
  const styles = {
    strong:            'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
    needs_improvement: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
    missing:           'bg-red-900/50 text-red-300 border-red-700/50',
  };
  const labels = { strong: 'Strong', needs_improvement: 'Needs Improvement', missing: 'Missing' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles[rating] || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
      {labels[rating] || rating || '—'}
    </span>
  );
}

function ScorePill({ score, label }) {
  if (score === null || score === undefined) return null;
  const n = Number(score);
  const color = n >= 70 ? 'text-emerald-300' : n >= 40 ? 'text-yellow-300' : 'text-red-300';
  const bg = n >= 70 ? 'bg-emerald-900/30' : n >= 40 ? 'bg-yellow-900/30' : 'bg-red-900/30';
  return (
    <div className={`${bg} rounded-xl px-3 py-2 text-center`}>
      <p className={`text-2xl font-black ${color}`}>{n}</p>
      {label && <p className="text-xs text-slate-500 mt-0.5">{label}</p>}
    </div>
  );
}

function Checkbox({ checked, onChange, label, sublabel }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group py-1.5">
      <div className="mt-0.5 flex-shrink-0">
        <div
          onClick={() => onChange(!checked)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
            checked
              ? 'bg-violet-600 border-violet-500'
              : 'border-slate-600 group-hover:border-slate-400'
          }`}
        >
          {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>
      <div>
        <span className={`text-sm ${checked ? 'text-slate-400 line-through' : 'text-white'}`}>{label}</span>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
      </div>
    </label>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none transition-colors"
    />
  );
}

function CollapsibleStage({ num, title, icon: Icon, color, complete, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${
      complete ? 'border-emerald-800/50 bg-emerald-900/5' : 'border-slate-800 bg-slate-900/50'
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            complete ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {complete ? <CheckCircle2 className="w-4 h-4" /> : num}
          </div>
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────
// LEFT PANEL — Audit Summary (Read-only)
// ─────────────────────────────────────────────────

function LeftPanel({ lead, audit }) {
  if (!lead) return <div className="p-4 text-slate-500 text-sm">Loading lead data...</div>;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Business Info Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-4">
        <h2 className="text-white font-bold text-lg">{lead.business_name || 'Unknown Business'}</h2>
        <p className="text-slate-400 text-sm mt-1">{lead.contact_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || '—'}</p>
        <div className="mt-3 space-y-1.5 text-xs text-slate-400">
          {lead.phone && <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {lead.phone}</p>}
          {lead.email && <p className="flex items-center gap-2"><Send className="w-3 h-3" /> {lead.email}</p>}
          {lead.website && <p className="flex items-center gap-2"><Globe className="w-3 h-3" /> {lead.website}</p>}
          {lead.city && <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {lead.city}{lead.state ? `, ${lead.state}` : ''}</p>}
          {lead.industry && <p className="flex items-center gap-2"><Target className="w-3 h-3" /> {lead.industry}</p>}
        </div>
      </div>

      {/* Audit Summary */}
      {audit ? (
        <>
          {/* Overall Score */}
          {audit.overall_score != null && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI Visibility Score</p>
              <p className={`text-4xl font-black ${
                audit.overall_score >= 70 ? 'text-emerald-400' : audit.overall_score >= 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>{audit.overall_score}</p>
              <p className="text-xs text-slate-500 mt-1">out of 100</p>
            </div>
          )}

          {/* 7 Category Cards */}
          <div className="space-y-2">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-semibold px-1">7 Audit Categories</h3>
            {AUDIT_CATEGORIES.map(cat => {
              const rating = audit[`${cat.key}_rating`];
              const score = audit[`${cat.key}_score`];
              const detail = audit[`${cat.key}_detail`];
              return (
                <div key={cat.key} className={`${cat.bg} border border-slate-800/50 rounded-xl p-3`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                      <span className="text-white text-xs font-semibold">{cat.label}</span>
                    </div>
                    <RatingBadge rating={rating} />
                  </div>
                  {score != null && (
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1.5">
                      <div
                        className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, score)}%` }}
                      />
                    </div>
                  )}
                  {detail && <p className="text-xs text-slate-400 leading-relaxed">{detail.substring(0, 200)}{detail.length > 200 ? '...' : ''}</p>}
                </div>
              );
            })}
          </div>

          {/* Future Vision */}
          {audit.future_vision && (
            <div className="bg-violet-900/20 border border-violet-800/40 rounded-2xl p-4">
              <h3 className="text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Future Vision
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{audit.future_vision}</p>
            </div>
          )}

          {/* Recommended System Step */}
          {audit.recommended_system_step && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Recommended System Step</h3>
              <p className="text-white text-sm font-semibold">{audit.recommended_system_step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              {audit.recommended_system_step_reason && <p className="text-xs text-slate-400 mt-1">{audit.recommended_system_step_reason}</p>}
            </div>
          )}

          {/* Quick Wins */}
          {audit.quick_wins?.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Quick Wins
              </h3>
              <ul className="space-y-1.5">
                {audit.quick_wins.map((win, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-yellow-500 flex-shrink-0 mt-0.5">→</span> {win}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Gaps */}
          {(audit.gap_1 || audit.gaps_summary) && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Top Gaps
              </h3>
              {audit.gaps_summary ? (
                <p className="text-xs text-slate-300 leading-relaxed">{audit.gaps_summary}</p>
              ) : (
                <ul className="space-y-1.5">
                  {audit.gap_1 && <li className="text-xs text-slate-300 flex items-start gap-2"><span className="text-red-500 flex-shrink-0">1.</span> {audit.gap_1}</li>}
                  {audit.gap_2 && <li className="text-xs text-slate-300 flex items-start gap-2"><span className="text-red-500 flex-shrink-0">2.</span> {audit.gap_2}</li>}
                  {audit.gap_3 && <li className="text-xs text-slate-300 flex items-start gap-2"><span className="text-red-500 flex-shrink-0">3.</span> {audit.gap_3}</li>}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center">
          <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No AI Visibility Audit found</p>
          <p className="text-slate-600 text-xs mt-1">Run an audit first to populate this panel</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
// RIGHT PANEL — AI Assistant
// ─────────────────────────────────────────────────

function RightPanel({ call, onUpdateCall, lead, audit }) {
  const [generating, setGenerating] = useState(false);

  const generateAISummary = async () => {
    setGenerating(true);
    try {
      const result = await base44.functions.invoke('generateDiscoverySummary', {
        discovery_call_id: call.id,
        lead_id: call.lead_id,
        audit_id: call.audit_id,
      });
      if (result.data) {
        onUpdateCall({
          ai_summary: result.data.summary || '',
          ai_suggested_services: result.data.suggested_services || '',
          ai_suggested_follow_up: result.data.suggested_follow_up || '',
          ai_recommended_proposal: result.data.recommended_proposal || '',
        });
      }
    } catch (err) {
      console.error('AI summary failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-violet-900/40 to-slate-900 border border-violet-800/30 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">AI Assistant</p>
            <p className="text-violet-300 text-xs">Discovery Call Intelligence</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* Live Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ClipboardCheck className="w-3.5 h-3.5" /> Live Notes
        </h3>
        <TextArea
          value={call.ai_live_notes}
          onChange={v => onUpdateCall({ ai_live_notes: v })}
          placeholder="Type notes as the conversation flows... (future: auto-populated by voice transcription)"
          rows={6}
        />
      </div>

      {/* AI Summary (after generation) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Summary
          </h3>
          <button
            onClick={generateAISummary}
            disabled={generating}
            className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {call.ai_summary ? (
          <p className="text-sm text-slate-300 leading-relaxed">{call.ai_summary}</p>
        ) : (
          <p className="text-sm text-slate-500 italic">Click Generate after completing the call to get an AI summary</p>
        )}
      </div>

      {/* Suggested Services */}
      {call.ai_suggested_services && (
        <div className="bg-emerald-900/10 border border-emerald-800/30 rounded-2xl p-4">
          <h3 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Recommended Services
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">{call.ai_suggested_services}</p>
        </div>
      )}

      {/* Suggested Follow-Up */}
      {call.ai_suggested_follow_up && (
        <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-2xl p-4">
          <h3 className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5" /> Suggested Follow-Up
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">{call.ai_suggested_follow_up}</p>
        </div>
      )}

      {/* Recommended Proposal */}
      {call.ai_recommended_proposal && (
        <div className="bg-violet-900/10 border border-violet-800/30 rounded-2xl p-4">
          <h3 className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Recommended Proposal
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">{call.ai_recommended_proposal}</p>
        </div>
      )}

      {/* Recommended Next Step (from audit) */}
      {audit?.recommended_system_step && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">From Audit: Recommended Step</h3>
          <p className="text-white text-sm font-semibold">{audit.recommended_system_step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
        </div>
      )}

      {/* I-001 Recommendation Panel */}
      <RecommendationPanel
        contextType="discovery"
        contextDescription={`Discovery call with ${lead?.business_name || 'prospect'}. Industry: ${lead?.industry || 'unknown'}. Preparing questions and knowledge for the conversation.`}
        businessType={lead?.industry || ''}
        leadId={call?.lead_id || ''}
        maxResults={5}
        compact={true}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────
// CENTER PANEL — Discovery Conversation Guide
// ─────────────────────────────────────────────────

function CenterPanel({ call, onUpdateCall, audit }) {
  const isStage1Complete = call.s1_greeting_done && call.s1_expectations_set && call.s1_no_pressure_explained;
  const isStage2Complete = !!(call.s2_business_story && call.s2_ideal_customer && call.s2_current_marketing);
  const isStage3Complete = !!(call.s3_where_want_to_be && call.s3_growth_goals);
  const auditCats = ['website_visibility', 'trust_signals', 'local_search', 'ai_search', 'customer_journey', 'content_depth', 'follow_up_system'];
  const isStage4Complete = auditCats.every(k => call[`s4_${k}_discussed`]);
  const isStage5Complete = call.s5_complete;
  const isStage6Complete = !!call.s6_future_vision;
  const isStage7Complete = !!call.s7_recommendation;
  const isStage9Complete = !!call.s9_outcome;

  const completedCount = [isStage1Complete, isStage2Complete, isStage3Complete, isStage4Complete, isStage5Complete, isStage6Complete, isStage7Complete, true, isStage9Complete].filter(Boolean).length;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      {/* Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-sm font-semibold">Discovery Progress</h3>
          <span className="text-xs text-slate-400">{completedCount}/9 stages</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-violet-600 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Stage 1: Welcome */}
      <CollapsibleStage num="1" title="Welcome" icon={Handshake} color="text-violet-400" complete={isStage1Complete} defaultOpen={!isStage1Complete}>
        <Checkbox checked={call.s1_greeting_done} onChange={v => onUpdateCall({ s1_greeting_done: v })} label="Greeting completed" />
        <Checkbox checked={call.s1_expectations_set} onChange={v => onUpdateCall({ s1_expectations_set: v })} label="Expectations set" sublabel="Explain what the call is about and what they'll learn" />
        <Checkbox checked={call.s1_no_pressure_explained} onChange={v => onUpdateCall({ s1_no_pressure_explained: v })} label="No-pressure conversation explained" sublabel="This is a conversation, not a sales pitch" />
      </CollapsibleStage>

      {/* Stage 2: Learn Their Story */}
      <CollapsibleStage num="2" title="Learn Their Story" icon={MessageSquare} color="text-blue-400" complete={isStage2Complete}>
        <TextArea value={call.s2_business_story} onChange={v => onUpdateCall({ s2_business_story: v })} placeholder="Tell me about your business..." rows={2} />
        <TextArea value={call.s2_ideal_customer} onChange={v => onUpdateCall({ s2_ideal_customer: v })} placeholder="Who is your ideal customer?" rows={2} />
        <TextArea value={call.s2_current_marketing} onChange={v => onUpdateCall({ s2_current_marketing: v })} placeholder="What marketing are you doing now?" rows={2} />
        <TextArea value={call.s2_current_frustrations} onChange={v => onUpdateCall({ s2_current_frustrations: v })} placeholder="What frustrates you about your current marketing?" rows={2} />
        <TextArea value={call.s2_current_strengths} onChange={v => onUpdateCall({ s2_current_strengths: v })} placeholder="What IS working well for you?" rows={2} />
      </CollapsibleStage>

      {/* Stage 3: Business Goals */}
      <CollapsibleStage num="3" title="Business Goals" icon={TrendingUp} color="text-emerald-400" complete={isStage3Complete}>
        <TextArea value={call.s3_where_want_to_be} onChange={v => onUpdateCall({ s3_where_want_to_be: v })} placeholder="Where do you want to be?" rows={2} />
        <TextArea value={call.s3_growth_goals} onChange={v => onUpdateCall({ s3_growth_goals: v })} placeholder="Growth goals..." rows={2} />
        <TextArea value={call.s3_hiring_plans} onChange={v => onUpdateCall({ s3_hiring_plans: v })} placeholder="Any hiring plans?" rows={2} />
        <TextArea value={call.s3_revenue_goals} onChange={v => onUpdateCall({ s3_revenue_goals: v })} placeholder="Revenue goals..." rows={2} />
        <TextArea value={call.s3_personal_goals} onChange={v => onUpdateCall({ s3_personal_goals: v })} placeholder="Personal goals — freedom, time, etc." rows={2} />
      </CollapsibleStage>

      {/* Stage 4: Audit Discussion */}
      <CollapsibleStage num="4" title="Audit Discussion" icon={Search} color="text-orange-400" complete={isStage4Complete}>
        {audit ? (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 mb-2">Walk through each category from their AI Visibility Audit:</p>
            {AUDIT_CATEGORIES.map(cat => {
              const rating = audit[`${cat.key}_rating`];
              const fieldKey = `s4_${cat.key === 'customer_journey_clarity' ? 'customer_journey' : cat.key === 'follow_up_system' ? 'follow_up_system' : cat.key === 'local_search_readiness' ? 'local_search' : cat.key === 'ai_search_readiness' ? 'ai_search' : cat.key}_discussed`;
              return (
                <div key={cat.key} className="flex items-center gap-3 bg-slate-800/30 rounded-xl px-3 py-2">
                  <Checkbox
                    checked={call[fieldKey]}
                    onChange={v => onUpdateCall({ [fieldKey]: v })}
                    label={cat.label}
                  />
                  <RatingBadge rating={rating} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No audit available — discuss their online presence generally</p>
        )}
      </CollapsibleStage>

      {/* Stage 5: Connect The Dots */}
      <CollapsibleStage num="5" title="Connect The Dots" icon={Lightbulb} color="text-yellow-400" complete={isStage5Complete}>
        <div className="bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-3 mb-3">
          <p className="text-xs text-yellow-300 leading-relaxed">
            Explain how visibility, trust, AI readiness, customer journey, and follow-up work <em>together</em> as a system — not isolated pieces.
          </p>
        </div>
        <TextArea value={call.s5_notes} onChange={v => onUpdateCall({ s5_notes: v })} placeholder="Notes from connecting the dots..." rows={3} />
        <Checkbox checked={call.s5_complete} onChange={v => onUpdateCall({ s5_complete: v })} label="Connection explained — prospect understands" />
      </CollapsibleStage>

      {/* Stage 6: Future Vision */}
      <CollapsibleStage num="6" title="Future Vision" icon={Sparkles} color="text-violet-400" complete={isStage6Complete}>
        <div className="bg-violet-900/10 border border-violet-800/30 rounded-xl p-3 mb-3">
          <p className="text-xs text-violet-300">"What would success look like one year from now?"</p>
        </div>
        <TextArea value={call.s6_future_vision} onChange={v => onUpdateCall({ s6_future_vision: v })} placeholder="Their vision for the future..." rows={4} />
      </CollapsibleStage>

      {/* Stage 7: Recommendation */}
      <CollapsibleStage num="7" title="Recommendation" icon={Star} color="text-emerald-400" complete={isStage7Complete}>
        <div className="grid grid-cols-2 gap-2">
          {RECOMMENDATION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onUpdateCall({ s7_recommendation: opt.value })}
              className={`text-left p-3 rounded-xl border transition-all ${
                call.s7_recommendation === opt.value
                  ? 'border-violet-500 bg-violet-900/30 ring-1 ring-violet-500'
                  : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
              }`}
            >
              <p className="text-white text-xs font-semibold">{opt.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
        <TextArea value={call.s7_recommendation_reason} onChange={v => onUpdateCall({ s7_recommendation_reason: v })} placeholder="Why this recommendation?" rows={2} />
      </CollapsibleStage>

      {/* Stage 8: Questions */}
      <CollapsibleStage num="8" title="Questions & Objections" icon={MessageSquare} color="text-pink-400" complete={!!(call.s8_objections || call.s8_concerns || call.s8_opportunities)}>
        <TextArea value={call.s8_objections} onChange={v => onUpdateCall({ s8_objections: v })} placeholder="Objections raised..." rows={2} />
        <TextArea value={call.s8_concerns} onChange={v => onUpdateCall({ s8_concerns: v })} placeholder="Concerns expressed..." rows={2} />
        <TextArea value={call.s8_opportunities} onChange={v => onUpdateCall({ s8_opportunities: v })} placeholder="Opportunities identified..." rows={2} />
      </CollapsibleStage>

      {/* Stage 9: Close */}
      <CollapsibleStage num="9" title="Close" icon={CheckCircle2} color="text-emerald-400" complete={isStage9Complete}>
        <div className="grid grid-cols-2 gap-2">
          {OUTCOME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onUpdateCall({ s9_outcome: opt.value })}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                call.s9_outcome === opt.value
                  ? 'border-violet-500 bg-violet-900/30 ring-1 ring-violet-500'
                  : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
              }`}
            >
              <opt.icon className={`w-4 h-4 ${opt.color}`} />
              <span className="text-white text-xs font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>
        {call.s9_outcome === 'follow_up_needed' && (
          <div className="mt-3">
            <label className="text-xs text-slate-400 mb-1 block">Follow-up Date</label>
            <input
              type="date"
              value={call.s9_follow_up_date || ''}
              onChange={e => onUpdateCall({ s9_follow_up_date: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        )}
      </CollapsibleStage>
    </div>
  );
}

// ─────────────────────────────────────────────────
// MAIN WORKSPACE
// ─────────────────────────────────────────────────

export default function DiscoveryCallWorkspace() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [audit, setAudit] = useState(null);
  const [call, setCall] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef(null);

  // Load data
  useEffect(() => {
    if (!leadId) return;
    (async () => {
      setLoading(true);
      try {
        // Load lead
        const leadData = await base44.entities.SalesLead.get(leadId);
        setLead(leadData);

        // Find audit for this lead
        try {
          const audits = await base44.entities.GapAudit.filter({ lead_id: leadId });
          if (audits?.length > 0) setAudit(audits[0]);
        } catch { /* no audit yet */ }

        // Find or create discovery call
        let calls = [];
        try {
          calls = await base44.entities.DiscoveryCall.filter({ lead_id: leadId });
        } catch { /* entity may not exist yet */ }

        if (calls?.length > 0) {
          setCall(calls[0]);
        } else {
          // Create a new discovery call session
          const newCall = await base44.entities.DiscoveryCall.create({
            lead_id: leadId,
            audit_id: audit?.id || null,
            business_name: leadData.business_name,
            contact_name: leadData.contact_name || `${leadData.first_name || ''} ${leadData.last_name || ''}`.trim(),
            call_date: new Date().toISOString(),
            status: 'in_progress',
          });
          setCall(newCall);
        }
      } catch (err) {
        console.error('Failed to load workspace:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [leadId]);

  // Auto-save with debounce
  const onUpdateCall = useCallback((updates) => {
    setCall(prev => {
      const next = { ...prev, ...updates };

      // Debounced save
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        setSaving(true);
        try {
          await base44.entities.DiscoveryCall.update(next.id, updates);
          setLastSaved(new Date());
        } catch (err) {
          console.error('Save failed:', err);
        } finally {
          setSaving(false);
        }
      }, 1500);

      return next;
    });
  }, []);

  // Action Handlers
  const handleComplete = async () => {
    const updates = { status: 'completed', completed_at: new Date().toISOString() };
    onUpdateCall(updates);

    // Update SalesLead status based on outcome
    if (call.s9_outcome === 'proposal_requested') {
      try {
        await base44.entities.SalesLead.update(leadId, { status: 'interested' });
      } catch {}
    }
  };

  const handleGenerateProposal = () => {
    // Navigate to proposal builder with context
    navigate(`/admin/proposal-generator?leadId=${leadId}&callId=${call?.id}`);
  };

  const handleScheduleFollowUp = () => {
    window.open('https://calendar.app.google/p6ieYanvwhixXxZ67', '_blank');
  };

  const handleTransferToClientSuccess = async () => {
    try {
      await base44.entities.SalesLead.update(leadId, { status: 'closed_won' });
      onUpdateCall({ status: 'proposal_requested' });
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading Discovery Workspace...</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-white font-semibold">Could not load discovery call</p>
          <p className="text-slate-400 text-sm mt-1">Lead ID: {leadId}</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-violet-400 hover:text-violet-300">← Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-5 w-px bg-slate-700" />
          <div>
            <h1 className="text-white font-bold text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-violet-400" />
              Discovery Call — {call.business_name || 'Unknown'}
            </h1>
            <p className="text-xs text-slate-500">
              E-003 · {call.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {lastSaved && <span className="ml-2 text-emerald-500">• Saved {lastSaved.toLocaleTimeString()}</span>}
              {saving && <span className="ml-2 text-yellow-400">• Saving...</span>}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateCall(call)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Complete Call
          </button>
          <button
            onClick={handleGenerateProposal}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Generate Proposal
          </button>
          <button
            onClick={handleScheduleFollowUp}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" /> Schedule Follow-up
          </button>
          <button
            onClick={handleTransferToClientSuccess}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Users className="w-3.5 h-3.5" /> Client Success
          </button>
        </div>
      </header>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT — Audit Summary */}
        <aside className="w-80 border-r border-slate-800 flex-shrink-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Business Snapshot</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <LeftPanel lead={lead} audit={audit} />
            </div>
          </div>
        </aside>

        {/* CENTER — Discovery Guide */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Discovery Conversation Guide</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <CenterPanel call={call} onUpdateCall={onUpdateCall} audit={audit} />
            </div>
          </div>
        </main>

        {/* RIGHT — AI Assistant */}
        <aside className="w-80 border-l border-slate-800 flex-shrink-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">AI Assistant</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <RightPanel call={call} onUpdateCall={onUpdateCall} lead={lead} audit={audit} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
