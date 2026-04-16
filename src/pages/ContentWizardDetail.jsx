import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { CheckCircle2, Circle, Loader2, ChevronLeft, AlertTriangle, Video, FileText, Send, Calendar } from 'lucide-react';

const STAGES = [
  { key: 'topic_created',        label: 'Topic' },
  { key: 'script_ready',         label: 'Script' },
  { key: 'script_approved',      label: 'Approved' },
  { key: 'heygen_pending',       label: 'HeyGen' },
  { key: 'video_ready',          label: 'Video' },
  { key: 'caption_ready',        label: 'Caption' },
  { key: 'approved_for_posting', label: 'Approved' },
  { key: 'scheduled',            label: 'Scheduled' },
  { key: 'published',            label: 'Published' },
];

const STAGE_INDEX = Object.fromEntries(STAGES.map((s, i) => [s.key, i]));

const CHANNEL_OPTIONS = ['facebook', 'instagram', 'linkedin', 'youtube', 'gbp', 'website'];

export default function ContentWizardDetail() {
  const { id } = useParams();
  const [wf, setWf] = useState(null);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success'|'error', msg }

  // Local editable fields
  const [scriptText, setScriptText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [captionText, setCaptionText] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedChannels, setSelectedChannels] = useState([]);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const w = await base44.entities.ContentWorkflow.filter({ id });
      const record = Array.isArray(w) ? w[0] : w;
      if (!record) return;
      setWf(record);
      setScriptText(record.script_text || '');
      setVideoUrl(record.heygen_video_url || '');
      setCaptionText(record.caption_text || '');
      setScheduledDate(record.scheduled_date || '');
      setSelectedChannels(record.publish_channels || []);
      if (record.content_topic_id) {
        const topics = await base44.entities.ContentTopics.filter({ id: record.content_topic_id });
        setTopic(Array.isArray(topics) ? topics[0] : topics);
      }
    } finally {
      setLoading(false);
    }
  };

  const save = async (updates) => {
    setSaving(true);
    try {
      const updated = await base44.entities.ContentWorkflow.update(id, updates);
      setWf(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  };

  const showNotice = (type, msg) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 4000);
  };

  // ---- STAGE ACTIONS ----

  const generateScript = async () => {
    setSaving(true);
    try {
      const prompt = `Write a professional 60-second video script for: "${wf.title}".
Client: ${wf.client || 'local business'}. 
${topic?.primary_keyword ? `Primary keyword: ${topic.primary_keyword}.` : ''}
${topic?.market ? `Market: ${topic.market}.` : ''}
${topic?.notes ? `Notes: ${topic.notes}` : ''}
Format: Hook (5s) → Problem (10s) → Solution (20s) → Proof (15s) → CTA (10s).
Keep it conversational and direct.`;

      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      const generated = typeof res === 'string' ? res : res?.text || res?.content || JSON.stringify(res);
      setScriptText(generated);
      await save({ script_text: generated, script_status: 'generated', current_stage: 'script_ready' });
      showNotice('success', 'Script generated! Review and approve below.');
    } catch (err) {
      showNotice('error', 'Script generation failed: ' + err.message);
      setSaving(false);
    }
  };

  const approveScript = async () => {
    await save({ script_text: scriptText, script_status: 'approved', current_stage: 'script_approved' });
    showNotice('success', 'Script approved!');
  };

  const regenerateScript = async () => {
    await save({ script_status: 'not_started', current_stage: 'topic_created' });
    setWf(w => ({ ...w, script_status: 'not_started', current_stage: 'topic_created' }));
    await generateScript();
  };

  const sendToHeygen = async () => {
    await save({ script_text: scriptText, heygen_status: 'queued', current_stage: 'heygen_pending' });
    showNotice('success', 'Sent to HeyGen queue. Enter the video URL when ready.');
  };

  const submitVideoUrl = async () => {
    if (!videoUrl.trim()) { showNotice('error', 'Please enter a video URL.'); return; }
    await save({ heygen_video_url: videoUrl, heygen_status: 'completed', current_stage: 'video_ready' });
    showNotice('success', 'Video URL saved!');
  };

  const generateCaption = async () => {
    setSaving(true);
    try {
      const prompt = `Write an engaging social media caption for this video: "${wf.title}".
Client: ${wf.client || 'local business'}.
${topic?.primary_keyword ? `Focus keyword: ${topic.primary_keyword}.` : ''}
Include: 1-2 sentences, a clear CTA, and 3-5 relevant hashtags.
Keep it punchy and local-business focused.`;

      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      const generated = typeof res === 'string' ? res : res?.text || res?.content || JSON.stringify(res);
      setCaptionText(generated);
      await save({ caption_text: generated, caption_status: 'generated', current_stage: 'caption_ready' });
      showNotice('success', 'Caption generated!');
    } catch (err) {
      showNotice('error', 'Caption generation failed: ' + err.message);
      setSaving(false);
    }
  };

  const approveForPosting = async () => {
    await save({ caption_text: captionText, caption_status: 'approved', current_stage: 'approved_for_posting' });
    showNotice('success', 'Approved for posting!');
  };

  const schedulePost = async () => {
    if (!scheduledDate) { showNotice('error', 'Please select a schedule date.'); return; }
    await save({
      publish_channels: selectedChannels,
      scheduled_date: scheduledDate,
      publishing_status: 'scheduled',
      current_stage: 'scheduled',
    });
    showNotice('success', 'Post scheduled!');
  };

  const markPosted = async () => {
    await save({
      publish_channels: selectedChannels,
      publishing_status: 'posted',
      current_stage: 'published',
    });
    showNotice('success', 'Marked as published! 🎉');
  };

  if (loading) {
    return (
      <AgencyLayout>
        <div className="flex items-center justify-center h-full py-32 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading workflow...
        </div>
      </AgencyLayout>
    );
  }

  if (!wf) {
    return (
      <AgencyLayout>
        <div className="p-6 text-center text-slate-400">Workflow not found.</div>
      </AgencyLayout>
    );
  }

  const currentIdx = STAGE_INDEX[wf.current_stage] ?? 0;

  return (
    <AgencyLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Back + Header */}
        <div>
          <Link to="/agency/content-wizard" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white mb-3 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> All Workflows
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-bold text-white">{wf.title}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{wf.client || '—'}</p>
            </div>
            {wf.due_date && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                Due {new Date(wf.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar stages={STAGES} currentIdx={currentIdx} />

        {/* Notice */}
        {notice && (
          <div className={`px-4 py-3 rounded-lg text-sm border font-medium ${
            notice.type === 'success'
              ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
              : 'bg-red-900/30 border-red-800 text-red-300'
          }`}>
            {notice.msg}
          </div>
        )}

        {/* Stage panel */}
        <StagePanel
          wf={wf}
          topic={topic}
          saving={saving}
          scriptText={scriptText}
          setScriptText={setScriptText}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          captionText={captionText}
          setCaptionText={setCaptionText}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
          onGenerateScript={generateScript}
          onApproveScript={approveScript}
          onRegenerateScript={regenerateScript}
          onSendToHeygen={sendToHeygen}
          onSubmitVideoUrl={submitVideoUrl}
          onGenerateCaption={generateCaption}
          onApproveForPosting={approveForPosting}
          onSchedulePost={schedulePost}
          onMarkPosted={markPosted}
        />
      </div>
    </AgencyLayout>
  );
}

function ProgressBar({ stages, currentIdx }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-0">
        {stages.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const future = i > currentIdx;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  done ? 'bg-emerald-600 border-emerald-600 text-white'
                    : active ? 'bg-blue-600 border-blue-500 text-white scale-110'
                    : 'bg-slate-800 border-slate-700 text-slate-600'
                }`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  active ? 'text-blue-400' : done ? 'text-emerald-500' : 'text-slate-700'
                }`}>{s.label}</span>
              </div>
              {i < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 mx-0.5 ${done ? 'bg-emerald-600' : 'bg-slate-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function StagePanelBtn({ onClick, disabled, children, variant = 'primary' }) {
  const base = 'inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    ghost: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function StagePanel({
  wf, topic, saving,
  scriptText, setScriptText,
  videoUrl, setVideoUrl,
  captionText, setCaptionText,
  scheduledDate, setScheduledDate,
  selectedChannels, setSelectedChannels,
  onGenerateScript, onApproveScript, onRegenerateScript,
  onSendToHeygen, onSubmitVideoUrl,
  onGenerateCaption, onApproveForPosting,
  onSchedulePost, onMarkPosted,
}) {
  const stage = wf.current_stage;

  const toggleChannel = (ch) =>
    setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);

  const Card = ({ title, icon: CardIcon, children }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        {CardIcon && <CardIcon className="w-4 h-4 text-blue-400" />}
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );

  if (stage === 'topic_created') return (
    <Card title="Step 1: Generate Script" icon={FileText}>
      <div className="space-y-1 text-sm text-slate-400">
        <p><span className="text-slate-500">Topic:</span> <span className="text-white font-medium">{wf.title}</span></p>
        {topic?.primary_keyword && <p><span className="text-slate-500">Keyword:</span> {topic.primary_keyword}</p>}
        {topic?.market && <p><span className="text-slate-500">Market:</span> {topic.market}</p>}
        {topic?.notes && <p><span className="text-slate-500">Notes:</span> {topic.notes}</p>}
      </div>
      <p className="text-xs text-slate-500">AI will write a 60-second video script based on your topic details.</p>
      <StagePanelBtn onClick={onGenerateScript} disabled={saving}>
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><FileText className="w-4 h-4" /> Generate Script</>}
      </StagePanelBtn>
    </Card>
  );

  if (stage === 'script_ready') return (
    <Card title="Step 2: Review & Approve Script" icon={FileText}>
      <p className="text-xs text-slate-500">Edit if needed, then approve to continue.</p>
      <textarea
        value={scriptText}
        onChange={e => setScriptText(e.target.value)}
        rows={12}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white resize-y focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
      />
      <div className="flex gap-2 flex-wrap">
        <StagePanelBtn onClick={onApproveScript} disabled={saving || !scriptText.trim()} variant="success">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve Script
        </StagePanelBtn>
        <StagePanelBtn onClick={onRegenerateScript} disabled={saving} variant="ghost">
          Regenerate Script
        </StagePanelBtn>
      </div>
    </Card>
  );

  if (stage === 'script_approved') return (
    <Card title="Step 3: Send to HeyGen" icon={Send}>
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">Approved Script</p>
        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">{scriptText}</p>
      </div>
      <p className="text-xs text-slate-500">This will queue the script for HeyGen video production. Come back here to enter the video URL once it's done.</p>
      <StagePanelBtn onClick={onSendToHeygen} disabled={saving}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send to HeyGen
      </StagePanelBtn>
    </Card>
  );

  if (stage === 'heygen_pending') return (
    <Card title="Step 4: Enter Video URL" icon={Video}>
      <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-900/20 border border-amber-800 rounded-lg px-3 py-2.5">
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
        Waiting for HeyGen video render to complete...
      </div>
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">Script Sent</p>
        <p className="text-sm text-slate-400 whitespace-pre-wrap max-h-32 overflow-y-auto">{scriptText}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5">HeyGen Video URL</label>
        <input
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
          placeholder="https://app.heygen.com/videos/..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>
      <StagePanelBtn onClick={onSubmitVideoUrl} disabled={saving || !videoUrl.trim()}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />} Save Video URL
      </StagePanelBtn>
    </Card>
  );

  if (stage === 'video_ready') return (
    <Card title="Step 5: Generate Caption" icon={FileText}>
      <div className="space-y-2">
        <p className="text-xs text-slate-500 font-semibold uppercase">Video Preview</p>
        <div className="bg-slate-800 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">{videoUrl}</a>
        </div>
      </div>
      <p className="text-xs text-slate-500">AI will write a caption and hashtags for social media posting.</p>
      <StagePanelBtn onClick={onGenerateCaption} disabled={saving}>
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><FileText className="w-4 h-4" /> Generate Caption</>}
      </StagePanelBtn>
    </Card>
  );

  if (stage === 'caption_ready') return (
    <Card title="Step 6: Review Caption" icon={FileText}>
      {videoUrl && (
        <div className="bg-slate-800 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">{videoUrl}</a>
        </div>
      )}
      <textarea
        value={captionText}
        onChange={e => setCaptionText(e.target.value)}
        rows={6}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white resize-y focus:outline-none focus:border-blue-500"
      />
      <StagePanelBtn onClick={onApproveForPosting} disabled={saving || !captionText.trim()} variant="success">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve for Posting
      </StagePanelBtn>
    </Card>
  );

  if (stage === 'approved_for_posting' || stage === 'scheduled') return (
    <Card title={stage === 'scheduled' ? 'Step 8: Confirm Posted' : 'Step 7: Schedule Post'} icon={Calendar}>
      {videoUrl && (
        <div className="bg-slate-800 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">{videoUrl}</a>
        </div>
      )}
      <div className="bg-slate-800 rounded-lg p-3">
        <p className="text-xs text-slate-500 mb-1">Caption</p>
        <p className="text-sm text-slate-300">{captionText}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5">Channels</label>
        <div className="flex flex-wrap gap-2">
          {CHANNEL_OPTIONS.map(ch => (
            <button key={ch} onClick={() => toggleChannel(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                selectedChannels.includes(ch)
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}>{ch}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5">Schedule Date & Time</label>
        <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {stage !== 'scheduled' && (
          <StagePanelBtn onClick={onSchedulePost} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />} Schedule Post
          </StagePanelBtn>
        )}
        <StagePanelBtn onClick={onMarkPosted} disabled={saving} variant="success">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Mark as Posted
        </StagePanelBtn>
      </div>
    </Card>
  );

  if (stage === 'published') return (
    <Card title="Published! 🎉" icon={CheckCircle2}>
      <div className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-700 rounded-xl p-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="font-bold text-emerald-300">Content Complete</p>
          <p className="text-xs text-emerald-500 mt-0.5">"{wf.title}" has been published successfully.</p>
        </div>
      </div>
      {videoUrl && (
        <div className="bg-slate-800 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">{videoUrl}</a>
        </div>
      )}
      {selectedChannels.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedChannels.map(ch => (
            <span key={ch} className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800 px-2 py-1 rounded-lg capitalize">{ch}</span>
          ))}
        </div>
      )}
      {wf.notes && <p className="text-sm text-slate-400">{wf.notes}</p>}
      <Link to="/agency/content-wizard">
        <StagePanelBtn variant="ghost" onClick={() => {}}>← Back to Workflows</StagePanelBtn>
      </Link>
    </Card>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
      <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
      <p className="text-slate-400 text-sm">Unknown stage: <code className="text-amber-400">{stage}</code></p>
    </div>
  );
}