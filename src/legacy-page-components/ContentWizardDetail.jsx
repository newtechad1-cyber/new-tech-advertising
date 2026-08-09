import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { logSystemEvent } from '@/lib/logSystemEvent';
import {
  ChevronLeft, Loader2, CheckCircle2, Copy, Check,
  FileText, Image, Video, Send, Calendar, StickyNote, Zap, RefreshCw
} from 'lucide-react';
import ContentWizardPublishSection from '../components/publishing/ContentWizardPublishSection';

const STAGES = [
  { key: 'topic_created', label: 'Topic' },
  { key: 'script_ready', label: 'Script' },
  { key: 'script_approved', label: 'Approved' },
  { key: 'heygen_pending', label: 'HeyGen' },
  { key: 'video_ready', label: 'Video' },
  { key: 'caption_ready', label: 'Caption' },
  { key: 'approved_for_posting', label: 'Post Ready' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'published', label: 'Published' },
];
const STAGE_INDEX = Object.fromEntries(STAGES.map((s, i) => [s.key, i]));

const CHANNELS = ['facebook', 'instagram', 'linkedin', 'youtube', 'gbp', 'website'];

const STATUS_COLOR = {
  not_started: 'text-slate-500', not_sent: 'text-slate-500', not_created: 'text-slate-500',
  generated: 'text-amber-400', in_progress: 'text-amber-400', queued: 'text-amber-400', processing: 'text-amber-400',
  approved: 'text-emerald-400', completed: 'text-emerald-400', posted: 'text-emerald-400', scheduled: 'text-blue-400',
  rejected: 'text-red-400', failed: 'text-red-400',
};

const NEXT_ACTION = {
  topic_created:        { label: 'Generate Script',       section: 'scripts' },
  script_ready:         { label: 'Approve Script',        section: 'scripts' },
  script_approved:      { label: 'Send to HeyGen',        section: 'heygen' },
  heygen_pending:       { label: 'Add Video URL',         section: 'heygen' },
  video_ready:          { label: 'Generate Caption',      section: 'captions' },
  caption_ready:        { label: 'Approve Post Assets',   section: 'captions' },
  approved_for_posting: { label: 'Schedule Post',         section: 'posting' },
  scheduled:            { label: 'Mark as Posted',        section: 'posting' },
  published:            { label: '✓ Published',           section: null },
};

function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = (text, key) => {
    navigator.clipboard.writeText(text || '');
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };
  return { copied, copy };
}

function CopyBtn({ text, label = 'Copy', copyKey, copied, copy }) {
  const done = copied === copyKey;
  return (
    <button
      onClick={() => copy(text, copyKey)}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${done ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
    >
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? 'Copied!' : label}
    </button>
  );
}

function SectionCard({ icon: Icon, title, color = 'text-blue-400', children }) {
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

function ActionBtn({ onClick, disabled, children, variant = 'primary', size = 'md' }) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-lg transition-colors disabled:opacity-50';
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2' };
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white',
    ghost: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function StatusDot({ status }) {
  return <span className={`text-xs font-semibold ${STATUS_COLOR[status] || 'text-slate-500'}`}>{status?.replace(/_/g, ' ') || '—'}</span>;
}

export default function ContentWizardDetail() {
  const { id } = useParams();
  const [wf, setWf] = useState(null);
  const [topic, setTopic] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const { copied, copy } = useCopy();

  // Local editable state
  const [scriptLong, setScriptLong] = useState('');
  const [scriptShort, setScriptShort] = useState('');
  const [hook, setHook] = useState('');
  const [cta, setCta] = useState('');
  const [scriptNotes, setScriptNotes] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [thumbnailNotes, setThumbnailNotes] = useState('');
  const [heygenAvatar, setHeygenAvatar] = useState('');
  const [heygenTemplate, setHeygenTemplate] = useState('');
  const [heygenScript, setHeygenScript] = useState('');
  const [heygenVideoUrl, setHeygenVideoUrl] = useState('');
  const [heygenNotes, setHeygenNotes] = useState('');
  const [captionPrimary, setCaptionPrimary] = useState('');
  const [captionShort, setCaptionShort] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [newPublishUrl, setNewPublishUrl] = useState('');
  const [publishingNotes, setPublishingNotes] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const results = await base44.entities.ContentWorkflow.filter({ id });
      const record = Array.isArray(results) ? results[0] : results;
      if (!record) return;
      hydrate(record);
      if (record.content_topic_id) {
        const topics = await base44.entities.ContentTopics.filter({ id: record.content_topic_id });
        setTopic(Array.isArray(topics) ? topics[0] : topics);
      }
      // Load channel connections for publishing
      const conns = await base44.entities.ChannelConnection.filter({ client_id: record.client_id });
      setConnections(conns.filter(c => c.status === 'connected'));
    } finally {
      setLoading(false);
    }
  };

  const hydrate = (record) => {
    setWf(record);
    setScriptLong(record.script_long || record.script_text || '');
    setScriptShort(record.script_short || '');
    setHook(record.hook || '');
    setCta(record.cta || '');
    setScriptNotes(record.script_notes || '');
    setImagePrompt(record.image_prompt || '');
    setImageUrl(record.image_url || '');
    setThumbnailNotes(record.thumbnail_notes || '');
    setHeygenAvatar(record.heygen_avatar || '');
    setHeygenTemplate(record.heygen_template || '');
    setHeygenScript(record.heygen_script || record.script_long || record.script_text || '');
    setHeygenVideoUrl(record.heygen_video_url || '');
    setHeygenNotes(record.heygen_notes || '');
    setCaptionPrimary(record.caption_primary || record.caption_text || '');
    setCaptionShort(record.caption_short || '');
    setHashtags(record.hashtags || '');
    setSelectedChannels(record.selected_channels || record.publish_channels || []);
    setScheduledDate(record.scheduled_date || '');
    setPublishingNotes(record.publishing_notes || '');
    setNotes(record.notes || '');
  };

  const showNotice = (type, msg) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 3500);
  };

  const save = async (updates) => {
    setSaving(true);
    try {
      const updated = await base44.entities.ContentWorkflow.update(id, updates);
      if (updates.current_stage && wf && updates.current_stage !== wf.current_stage) {
        logSystemEvent({ event_type: 'content_workflow_stage_changed', source_system: 'agency', source_route: '/agency/content-wizard', source_component: 'ContentWizardDetail', entity_type: 'ContentWorkflow', entity_id: id, workflow_type: 'content', workflow_stage: updates.current_stage, status: 'success', message: `Workflow "${wf?.title}" → ${updates.current_stage}` });
      }
      setWf(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  };

  // --- SCRIPT ACTIONS ---
  const generateScript = async () => {
    setSaving(true);
    try {
      const prompt = `Write a professional 60-second video script for: "${wf.title}".
Client: ${wf.client || 'local business'}.
${topic?.primary_keyword ? `Primary keyword: ${topic.primary_keyword}.` : ''}
${topic?.market ? `Market: ${topic.market}.` : ''}
${topic?.notes ? `Notes: ${topic.notes}` : ''}

Return a JSON object with these fields:
- script_long: full 60-second script (Hook → Problem → Solution → Proof → CTA format, conversational)
- script_short: 30-second version
- hook: opening 5 seconds only
- cta: closing call to action only`;

      const res = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: { type: 'object', properties: { script_long: { type: 'string' }, script_short: { type: 'string' }, hook: { type: 'string' }, cta: { type: 'string' } } } });
      const sl = res?.script_long || '';
      const ss = res?.script_short || '';
      const h = res?.hook || '';
      const c = res?.cta || '';
      setScriptLong(sl); setScriptShort(ss); setHook(h); setCta(c);
      setHeygenScript(sl);
      await save({ script_long: sl, script_short: ss, hook: h, cta: c, script_text: sl, heygen_script: sl, script_status: 'generated', current_stage: 'script_ready' });
      showNotice('success', 'Script generated!');
    } catch (err) {
      showNotice('error', 'Script generation failed: ' + err.message);
      setSaving(false);
    }
  };

  const approveScript = async () => {
    await save({ script_long: scriptLong, script_short: scriptShort, hook, cta, script_notes: scriptNotes, script_text: scriptLong, heygen_script: scriptLong, script_status: 'approved', current_stage: 'script_approved' });
    setHeygenScript(scriptLong);
    showNotice('success', 'Script approved!');
  };

  const saveScript = async () => {
    await save({ script_long: scriptLong, script_short: scriptShort, hook, cta, script_notes: scriptNotes, script_text: scriptLong });
    showNotice('success', 'Script saved.');
  };

  // --- VISUAL ACTIONS ---
  const generateImagePrompt = async () => {
    setSaving(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({ prompt: `Write a detailed image generation prompt for a thumbnail/visual for this video: "${wf.title}". Client: ${wf.client}. Make it vivid, professional, and local-business appropriate. Return just the prompt text, no extra commentary.` });
      const p = typeof res === 'string' ? res : res?.text || '';
      setImagePrompt(p);
      await save({ image_prompt: p });
      showNotice('success', 'Image prompt generated!');
    } catch (err) {
      showNotice('error', err.message);
      setSaving(false);
    }
  };

  const saveVisuals = async () => {
    await save({ image_prompt: imagePrompt, image_url: imageUrl, thumbnail_notes: thumbnailNotes });
    showNotice('success', 'Visuals saved.');
  };

  // --- HEYGEN ACTIONS ---
  const markSentToHeygen = async () => {
    await save({ heygen_avatar: heygenAvatar, heygen_template: heygenTemplate, heygen_script: heygenScript, heygen_notes: heygenNotes, heygen_status: 'in_progress', current_stage: 'heygen_pending' });
    showNotice('success', 'Marked as sent to HeyGen!');
  };

  const saveVideoUrl = async () => {
    if (!heygenVideoUrl.trim()) { showNotice('error', 'Enter a video URL first.'); return; }
    await save({ heygen_video_url: heygenVideoUrl, heygen_status: 'completed', current_stage: 'video_ready' });
    showNotice('success', 'Video URL saved!');
  };

  // --- CAPTION ACTIONS ---
  const generateCaption = async () => {
    setSaving(true);
    try {
      const prompt = `Write social media captions for this video: "${wf.title}". Client: ${wf.client}.
${topic?.primary_keyword ? `Keyword: ${topic.primary_keyword}.` : ''}

Return JSON with:
- caption_primary: full caption (2-3 sentences + CTA)
- caption_short: under 100 chars version
- hashtags: 5-8 relevant hashtags as a single string`;

      const res = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: { type: 'object', properties: { caption_primary: { type: 'string' }, caption_short: { type: 'string' }, hashtags: { type: 'string' } } } });
      const cp = res?.caption_primary || '';
      const cs = res?.caption_short || '';
      const ht = res?.hashtags || '';
      setCaptionPrimary(cp); setCaptionShort(cs); setHashtags(ht);
      await save({ caption_primary: cp, caption_short: cs, hashtags: ht, caption_text: cp, caption_status: 'generated', current_stage: 'caption_ready' });
      showNotice('success', 'Caption generated!');
    } catch (err) {
      showNotice('error', 'Caption generation failed: ' + err.message);
      setSaving(false);
    }
  };

  const approvePostAssets = async () => {
    await save({ caption_primary: captionPrimary, caption_short: captionShort, hashtags, caption_text: captionPrimary, caption_status: 'approved', selected_channels: selectedChannels, publish_channels: selectedChannels, current_stage: 'approved_for_posting' });
    showNotice('success', 'Post assets approved!');
  };

  // --- POSTING ACTIONS ---
  const schedulePost = async () => {
    if (!scheduledDate) { showNotice('error', 'Select a scheduled date first.'); return; }
    await save({ selected_channels: selectedChannels, publish_channels: selectedChannels, scheduled_date: scheduledDate, publishing_status: 'scheduled', current_stage: 'scheduled' });
    showNotice('success', 'Post scheduled!');
  };

  const markPosted = async () => {
    await save({ publishing_status: 'posted', published_date: new Date().toISOString(), current_stage: 'published' });
    showNotice('success', 'Marked as posted! 🎉');
  };

  const addPublishUrl = async () => {
    if (!newPublishUrl.trim()) return;
    const existing = wf?.publish_urls || [];
    const updated = [...existing, newPublishUrl.trim()];
    await save({ publish_urls: updated });
    setNewPublishUrl('');
    showNotice('success', 'URL added.');
  };

  const toggleChannel = (ch) => setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);

  // --- SAVE TO REVIEW ---
  const [savedAssetId, setSavedAssetId] = useState(null);
  const [savingToReview, setSavingToReview] = useState(false);

  const saveToReview = async () => {
    setSavingToReview(true);
    try {
      // Determine what content to use: caption > script > title
      const bodyText = captionPrimary || scriptLong || wf.title;
      const assetType = heygenVideoUrl ? 'video_script' : captionPrimary ? 'social_series' : 'video_script';

      const asset = await base44.entities.ContentAssets.create({
        topic_id: wf.content_topic_id || wf.id,
        topic_title: wf.title,
        client_id: wf.client_id,
        client: wf.client,
        asset_type: assetType,
        title: wf.title,
        content: bodyText,
        caption: captionPrimary || captionShort || '',
        hashtags: hashtags || '',
        media_url: imageUrl || '',
        video_url: heygenVideoUrl || '',
        status: 'needs_review',
        review_notes: `Saved from Content Wizard (stage: ${wf.current_stage})`,
      });

      setSavedAssetId(asset.id);

      logSystemEvent({
        event_type: 'content_asset_created',
        source_system: 'agency',
        source_route: '/agency/content-wizard',
        source_component: 'ContentWizardDetail',
        entity_type: 'ContentAssets',
        entity_id: asset.id,
        workflow_type: 'content',
        workflow_stage: 'saved_to_review',
        status: 'success',
        message: `Content asset saved to Review from wizard: "${wf.title}" (${asset.id})`,
        payload_snapshot: { asset_id: asset.id, workflow_id: wf.id, client_id: wf.client_id, status: 'needs_review' },
      });

      showNotice('success', `Saved to Review! Asset ID: ${asset.id.slice(0, 8)}…`);
    } catch (err) {
      logSystemEvent({
        event_type: 'content_asset_creation_failed',
        source_system: 'agency',
        source_route: '/agency/content-wizard',
        source_component: 'ContentWizardDetail',
        workflow_type: 'content',
        workflow_stage: 'save_to_review_failed',
        status: 'failed',
        message: `Failed to save asset to Review: ${err.message}`,
        error_details: err.message,
      });
      showNotice('error', 'Failed to save to Review: ' + err.message);
    } finally {
      setSavingToReview(false);
    }
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

  const currentIdx = STAGE_INDEX[wf.current_stage] ?? 0;
  const nextAction = NEXT_ACTION[wf.current_stage];

  return (
    <AgencyLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Back */}
        <Link to="/agency/content-wizard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> All Workflows
        </Link>

        {/* SECTION 1: Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-bold text-white">{wf.title}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{wf.client || '—'}{wf.due_date ? ` · Due ${new Date(wf.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg capitalize">{wf.current_stage?.replace(/_/g, ' ')}</span>
              <button onClick={load} className="p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-0.5 overflow-x-auto pb-1">
            {STAGES.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${done ? 'bg-emerald-600 border-emerald-600 text-white' : active ? 'bg-blue-600 border-blue-500 text-white scale-110' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs mt-1 font-medium whitespace-nowrap ${active ? 'text-blue-400' : done ? 'text-emerald-500' : 'text-slate-700'}`}>{s.label}</span>
                  </div>
                  {i < STAGES.length - 1 && <div className={`flex-1 h-0.5 mb-4 mx-0.5 min-w-2 ${done ? 'bg-emerald-600' : 'bg-slate-800'}`} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Next Action CTA */}
          {nextAction && nextAction.section && (
            <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-800 rounded-lg px-4 py-3">
              <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-sm text-blue-300 font-medium">Next Step: {nextAction.label}</span>
            </div>
          )}
          {wf.current_stage === 'published' && (
            <div className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-700 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-300 font-medium">This workflow is complete and published!</span>
            </div>
          )}
        </div>

        {/* Notice */}
        {notice && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium border ${notice.type === 'success' ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : 'bg-red-900/30 border-red-800 text-red-300'}`}>
            {notice.msg}
          </div>
        )}

        {/* SECTION 2: Scripts */}
        <SectionCard icon={FileText} title="Scripts" color="text-blue-400">
          <div className="flex items-center gap-4 flex-wrap text-xs">
            <span className="text-slate-500">Script status: <StatusDot status={wf.script_status} /></span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Full Script (60s)</label>
                <CopyBtn text={scriptLong} label="Copy Script" copyKey="scriptLong" copied={copied} copy={copy} />
              </div>
              <textarea value={scriptLong} onChange={e => setScriptLong(e.target.value)} rows={10}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white resize-y focus:outline-none focus:border-blue-500 font-mono leading-relaxed" placeholder="Script will appear here after generation..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Short Script (30s)</label>
                <textarea value={scriptShort} onChange={e => setScriptShort(e.target.value)} rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" placeholder="Short version..." />
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Hook (5s)</label>
                  <input value={hook} onChange={e => setHook(e.target.value)} placeholder="Opening hook..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">CTA</label>
                  <input value={cta} onChange={e => setCta(e.target.value)} placeholder="Call to action..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Script Notes</label>
              <input value={scriptNotes} onChange={e => setScriptNotes(e.target.value)} placeholder="Tone, direction notes..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ActionBtn onClick={generateScript} disabled={saving} variant="primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {wf.script_status === 'not_started' ? 'Generate Script' : 'Regenerate Script'}
            </ActionBtn>
            {scriptLong && wf.script_status !== 'approved' && (
              <ActionBtn onClick={approveScript} disabled={saving} variant="success">
                <CheckCircle2 className="w-4 h-4" /> Approve Script
              </ActionBtn>
            )}
            <ActionBtn onClick={saveScript} disabled={saving} variant="ghost">Save Draft</ActionBtn>
            {scriptLong && (
              <ActionBtn onClick={saveToReview} disabled={savingToReview} variant="ghost">
                {savingToReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Save to Review
              </ActionBtn>
            )}
          </div>

          {savedAssetId && (
            <div className="flex items-center gap-3 bg-emerald-900/30 border border-emerald-700 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-emerald-300 font-semibold">Saved to Review!</p>
                <p className="text-xs text-emerald-500 font-mono mt-0.5">Asset ID: {savedAssetId}</p>
              </div>
              <Link to="/agency/content?tab=review" className="text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg whitespace-nowrap">
                Open in Review →
              </Link>
            </div>
          )}
        </SectionCard>

        {/* SECTION 3: Visuals */}
        <SectionCard icon={Image} title="Visuals & Thumbnail" color="text-violet-400">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Image Prompt</label>
                <CopyBtn text={imagePrompt} label="Copy Prompt" copyKey="imagePrompt" copied={copied} copy={copy} />
              </div>
              <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" placeholder="AI image generation prompt for thumbnail..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Image URL</label>
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              {imageUrl && <img src={imageUrl} alt="thumbnail" className="mt-2 rounded-lg max-h-40 object-cover border border-slate-700" />}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Thumbnail Notes</label>
              <input value={thumbnailNotes} onChange={e => setThumbnailNotes(e.target.value)} placeholder="Text overlay, colors, style notes..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ActionBtn onClick={generateImagePrompt} disabled={saving} variant="primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Generate Image Prompt
            </ActionBtn>
            <ActionBtn onClick={saveVisuals} disabled={saving} variant="ghost">Save Visuals</ActionBtn>
          </div>
        </SectionCard>

        {/* SECTION 4: HeyGen Handoff */}
        <SectionCard icon={Video} title="HeyGen Handoff" color="text-amber-400">
          <div className="flex items-center gap-4 flex-wrap text-xs">
            <span className="text-slate-500">HeyGen status: <StatusDot status={wf.heygen_status} /></span>
          </div>
          <div className="bg-amber-900/10 border border-amber-800/40 rounded-lg px-3 py-2.5 text-xs text-amber-400">
            Copy the script below, paste it into HeyGen, generate the video, then paste the video URL back here.
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Avatar</label>
                <input value={heygenAvatar} onChange={e => setHeygenAvatar(e.target.value)} placeholder="Avatar name or ID..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Template</label>
                <input value={heygenTemplate} onChange={e => setHeygenTemplate(e.target.value)} placeholder="Template name or ID..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Script for HeyGen</label>
                <CopyBtn text={heygenScript} label="Copy for HeyGen" copyKey="heygenScript" copied={copied} copy={copy} />
              </div>
              <textarea value={heygenScript} onChange={e => setHeygenScript(e.target.value)} rows={8}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white resize-y focus:outline-none focus:border-blue-500 font-mono" placeholder="Script to paste into HeyGen..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">HeyGen Video URL</label>
              <input value={heygenVideoUrl} onChange={e => setHeygenVideoUrl(e.target.value)} placeholder="https://app.heygen.com/videos/..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              {wf.heygen_video_url && (
                <a href={wf.heygen_video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 block">↗ View Video</a>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">HeyGen Notes</label>
              <input value={heygenNotes} onChange={e => setHeygenNotes(e.target.value)} placeholder="Voice, pacing, style notes..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {wf.heygen_status === 'not_sent' && (
              <ActionBtn onClick={markSentToHeygen} disabled={saving} variant="warning">
                <Send className="w-4 h-4" /> Mark Sent to HeyGen
              </ActionBtn>
            )}
            <ActionBtn onClick={saveVideoUrl} disabled={saving || !heygenVideoUrl.trim()} variant="success">
              <Video className="w-4 h-4" /> Save Video URL
            </ActionBtn>
          </div>
        </SectionCard>

        {/* SECTION 5: Post Assets */}
        <SectionCard icon={Send} title="Post Assets" color="text-teal-400">
          <div className="flex items-center gap-4 flex-wrap text-xs">
            <span className="text-slate-500">Caption status: <StatusDot status={wf.caption_status} /></span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-400">Primary Caption</label>
                <CopyBtn text={captionPrimary} label="Copy Caption" copyKey="captionPrimary" copied={copied} copy={copy} />
              </div>
              <textarea value={captionPrimary} onChange={e => setCaptionPrimary(e.target.value)} rows={5}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white resize-y focus:outline-none focus:border-blue-500" placeholder="Full social media caption..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Short Caption</label>
              <input value={captionShort} onChange={e => setCaptionShort(e.target.value)} placeholder="Short version under 100 chars..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Hashtags</label>
              <input value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="#marketing #localbusiness..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">Channels</label>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map(ch => (
                  <button key={ch} onClick={() => toggleChannel(ch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${selectedChannels.includes(ch) ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ActionBtn onClick={generateCaption} disabled={saving} variant="primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {wf.caption_status === 'not_created' ? 'Generate Caption' : 'Regenerate Caption'}
            </ActionBtn>
            {captionPrimary && wf.caption_status !== 'approved' && (
              <ActionBtn onClick={approvePostAssets} disabled={saving} variant="success">
                <CheckCircle2 className="w-4 h-4" /> Approve Post Assets
              </ActionBtn>
            )}
            <ActionBtn onClick={saveToReview} disabled={savingToReview || (!captionPrimary && !scriptLong)} variant="ghost">
              {savingToReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Save to Review Queue
            </ActionBtn>
          </div>

          {/* Saved-to-review confirmation */}
          {savedAssetId && (
            <div className="flex items-center gap-3 bg-emerald-900/30 border border-emerald-700 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-emerald-300 font-semibold">Saved to Review!</p>
                <p className="text-xs text-emerald-500 font-mono mt-0.5">Asset ID: {savedAssetId}</p>
              </div>
              <Link to="/agency/content?tab=review" className="text-xs font-semibold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg whitespace-nowrap">
                Open in Review →
              </Link>
            </div>
          )}
        </SectionCard>

        {/* SECTION 6: Publishing */}
        <ContentWizardPublishSection wf={wf} connections={connections} onSaved={load} />

        {/* SECTION 7: Notes */}
        <SectionCard icon={StickyNote} title="Notes" color="text-slate-400">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Workflow Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" placeholder="General notes..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Publishing Notes</label>
              <textarea value={publishingNotes} onChange={e => setPublishingNotes(e.target.value)} rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" placeholder="Publishing-specific notes..." />
            </div>
          </div>
          <ActionBtn onClick={() => save({ notes, publishing_notes: publishingNotes })} disabled={saving} variant="ghost">
            Save Notes
          </ActionBtn>
        </SectionCard>

      </div>
    </AgencyLayout>
  );
}