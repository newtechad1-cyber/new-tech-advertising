/**
 * Y-001 YouTube Knowledge Engine — Panel Component
 * Manages YouTube metadata, scripts, playlists, and cross-links for a journal entry.
 * Used inside the Publishing Article View to connect every Journal → YouTube.
 */
import React, { useState } from 'react';
import {
  Youtube, Film, FileText, Hash, Image, ListVideo,
  Clock, Eye, ExternalLink, ChevronDown, ChevronRight,
  Sparkles, Scissors, BookOpen
} from 'lucide-react';

const PLAYLISTS = [
  'Start Here', 'NTA Journal', 'Marketing Lessons', 'AI Explained',
  'Business Growth', 'Website Strategy', 'Local Business', 'Case Studies'
];

const PUBLISH_STATUSES = [
  'Idea', 'Script Ready', 'Recording', 'Editing',
  'Ready to Publish', 'Published', 'Archived'
];

const CATEGORIES = ['Education', 'Howto & Style', 'Science & Technology', 'People & Blogs'];
const VISIBILITIES = ['Public', 'Unlisted', 'Private'];

const STATUS_COLORS = {
  'Idea':              'bg-slate-500/10 text-slate-400 border-slate-500/20',
  'Script Ready':      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Recording':         'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Editing':           'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Ready to Publish':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Published':         'bg-green-500/10 text-green-400 border-green-500/20',
  'Archived':          'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

function Section({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-3 bg-slate-900/50 hover:bg-slate-900/80 transition-colors text-left"
      >
        <Icon className="w-4 h-4 text-red-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-white flex-1">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="p-3 space-y-3 border-t border-slate-800">{children}</div>}
    </div>
  );
}

export default function YouTubePanel({ youtubeData, onChange, articleTitle }) {
  const data = youtubeData || {};
  const inputCls = "w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 text-sm";
  const labelCls = "text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block";
  const textareaCls = `${inputCls} font-mono text-xs leading-relaxed`;

  function update(field, value) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-500" />
          YouTube Knowledge Engine
        </h3>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${STATUS_COLORS[data.publish_status] || STATUS_COLORS['Idea']}`}>
          {data.publish_status || 'Idea'}
        </span>
      </div>

      {/* Quick metadata */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Publish Status</label>
          <select value={data.publish_status || 'Idea'} onChange={(e) => update('publish_status', e.target.value)} className={inputCls}>
            {PUBLISH_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Playlist</label>
          <select value={data.playlist || ''} onChange={(e) => update('playlist', e.target.value)} className={inputCls}>
            <option value="">Select playlist...</option>
            {PLAYLISTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Video Metadata */}
      <Section title="Video Metadata" icon={Film} defaultOpen={true}>
        <div>
          <label className={labelCls}>Video Title</label>
          <input type="text" value={data.video_title || ''} onChange={(e) => update('video_title', e.target.value)} placeholder={articleTitle || 'Video title...'} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea value={data.description || ''} onChange={(e) => update('description', e.target.value)} placeholder="YouTube description with links, timestamps, keywords..." rows={5} className={textareaCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Category</label>
            <select value={data.category || 'Education'} onChange={(e) => update('category', e.target.value)} className={inputCls}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Visibility</label>
            <select value={data.visibility || 'Public'} onChange={(e) => update('visibility', e.target.value)} className={inputCls}>
              {VISIBILITIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input type="text" value={(data.tags || []).join(', ')} onChange={(e) => update('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="AI, marketing, small business..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Video URL (if published)</label>
          <input type="text" value={data.video_url || ''} onChange={(e) => update('video_url', e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inputCls} />
        </div>
      </Section>

      {/* Scripts */}
      <Section title="Video Scripts" icon={FileText}>
        <div>
          <label className={labelCls}>Long-Form Video Script (5-15 min)</label>
          <textarea value={data.video_script_long || ''} onChange={(e) => update('video_script_long', e.target.value)} placeholder="Full video script..." rows={10} className={textareaCls} />
        </div>
        <div>
          <label className={labelCls}>Shorts Script (&lt; 60 sec)</label>
          <textarea value={data.video_script_short || ''} onChange={(e) => update('video_script_short', e.target.value)} placeholder="Short-form hook script..." rows={5} className={textareaCls} />
        </div>
        <div>
          <label className={labelCls}>Shorts Hook (opening line)</label>
          <input type="text" value={data.shorts_hook || ''} onChange={(e) => update('shorts_hook', e.target.value)} placeholder="The one thing every business owner needs to know..." className={inputCls} />
        </div>
      </Section>

      {/* Thumbnail */}
      <Section title="Thumbnail" icon={Image}>
        <div>
          <label className={labelCls}>Thumbnail URL</label>
          <input type="text" value={data.thumbnail_url || ''} onChange={(e) => update('thumbnail_url', e.target.value)} placeholder="https://..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Thumbnail AI Prompt</label>
          <textarea value={data.thumbnail_prompt || ''} onChange={(e) => update('thumbnail_prompt', e.target.value)} placeholder="Describe the thumbnail image for AI generation..." rows={3} className={textareaCls} />
        </div>
        {data.thumbnail_url && (
          <div className="rounded-lg overflow-hidden border border-slate-800">
            <img src={data.thumbnail_url} alt="Thumbnail preview" className="w-full h-auto" />
          </div>
        )}
      </Section>

      {/* Cross-Links */}
      <Section title="Cross-Links & Relationships" icon={BookOpen}>
        <div>
          <label className={labelCls}>Related Journal URL</label>
          <input type="text" value={data.related_journal_url || ''} onChange={(e) => update('related_journal_url', e.target.value)} placeholder="/journal-entry-slug" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Related Services (comma separated slugs)</label>
          <input type="text" value={(data.related_service_slugs || []).join(', ')} onChange={(e) => update('related_service_slugs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ai-marketing, local-seo, web-design..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Related Case Studies (comma separated slugs)</label>
          <input type="text" value={(data.related_case_study_slugs || []).join(', ')} onChange={(e) => update('related_case_study_slugs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="johnson-heating, monson-plumbing..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Related Audit ID</label>
          <input type="text" value={data.related_audit_id || ''} onChange={(e) => update('related_audit_id', e.target.value)} placeholder="Gap Audit ID..." className={inputCls} />
        </div>
      </Section>

      {/* Transcript */}
      <Section title="Transcript" icon={FileText}>
        <div>
          <label className={labelCls}>Full Video Transcript</label>
          <textarea value={data.transcript || ''} onChange={(e) => update('transcript', e.target.value)} placeholder="Paste or generate full video transcript..." rows={10} className={textareaCls} />
        </div>
      </Section>
    </div>
  );
}
