/**
 * P-001 Publishing Engine — Article Editor
 * Create/edit source article content with all metadata fields.
 */
import React, { useState, useEffect } from 'react';
import {
  FileEdit, Save, X, Tag, BookOpen, Image, Link as LinkIcon,
  Clock, BarChart2, Sparkles
} from 'lucide-react';
import { CONTENT_TYPES, THEMES, CHANNEL_LIST, CHANNELS, slugify } from './publishingData';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const SERIES_OPTIONS = [
  'NTA Journal', 'AI Explained', 'Marketing Lessons', 'Business Growth',
  'Website Strategy', 'Local Business', 'From Rick\'s Desk', 'Case Studies'
];

export default function ArticleEditor({ article, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    slug: '',
    summary: '',
    body: '',
    author: 'Rick Hesse',
    content_type: 'Article',
    primary_theme: '',
    secondary_themes: [],
    tags: [],
    featured_image_url: '',
    featured_image_prompt: '',
    series: '',
    cta_text: '',
    cta_url: '',
    difficulty: 'Beginner',
    estimated_read_time: 5,
    publish_to_channels: [...CHANNEL_LIST],
    default_schedule_day: 'Monday',
    default_schedule_time: '07:00',
    workflow_notes: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (article) {
      setForm(prev => ({
        ...prev,
        ...article,
        tags: article.tags || [],
        secondary_themes: article.secondary_themes || [],
        publish_to_channels: article.publish_to_channels || [...CHANNEL_LIST],
      }));
      setAutoSlug(false);
    }
  }, [article]);

  function updateField(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && autoSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      updateField('tags', [...form.tags, tag]);
    }
    setTagInput('');
  }

  function removeTag(tag) {
    updateField('tags', form.tags.filter(t => t !== tag));
  }

  function toggleChannel(ch) {
    const channels = form.publish_to_channels.includes(ch)
      ? form.publish_to_channels.filter(c => c !== ch)
      : [...form.publish_to_channels, ch];
    updateField('publish_to_channels', channels);
  }

  function toggleSecondaryTheme(theme) {
    const themes = form.secondary_themes.includes(theme)
      ? form.secondary_themes.filter(t => t !== theme)
      : [...form.secondary_themes, theme];
    updateField('secondary_themes', themes);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    onSave(form);
  }

  const inputCls = "w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 text-sm";
  const labelCls = "text-xs font-semibold text-slate-400 mb-1.5 block";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-blue-400" />
          {article ? 'Edit Article' : 'New Article'}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim() || saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Your article headline..."
              className={`${inputCls} text-lg font-semibold`}
            />
          </div>

          {/* Subtitle + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Subtitle</label>
              <input type="text" value={form.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Optional subtitle or deck" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <div className="flex gap-2">
                <input type="text" value={form.slug} onChange={(e) => { updateField('slug', e.target.value); setAutoSlug(false); }} placeholder="url-safe-slug" className={`${inputCls} flex-1`} />
                <button onClick={() => { updateField('slug', slugify(form.title)); }} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white transition-colors" title="Auto-generate from title">
                  <Sparkles className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className={labelCls}>Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder="2-3 sentence summary for distribution and SEO..."
              rows={3}
              className={inputCls}
            />
          </div>

          {/* Body */}
          <div>
            <label className={labelCls}>Body (Markdown)</label>
            <textarea
              value={form.body}
              onChange={(e) => updateField('body', e.target.value)}
              placeholder="Write your article content in markdown..."
              rows={16}
              className={`${inputCls} font-mono text-xs leading-relaxed`}
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Call to Action Text</label>
              <input type="text" value={form.cta_text} onChange={(e) => updateField('cta_text', e.target.value)} placeholder="e.g. Get Your Free Gap Audit" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>CTA URL</label>
              <input type="text" value={form.cta_url} onChange={(e) => updateField('cta_url', e.target.value)} placeholder="https://newtechadvertising.com/gap-audit" className={inputCls} />
            </div>
          </div>

          {/* Workflow notes */}
          <div>
            <label className={labelCls}>Internal Notes</label>
            <textarea value={form.workflow_notes} onChange={(e) => updateField('workflow_notes', e.target.value)} placeholder="Internal notes about this article..." rows={2} className={inputCls} />
          </div>
        </div>

        {/* Sidebar metadata (1/3) */}
        <div className="space-y-4">
          {/* Content Type */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <label className={labelCls}>Content Type</label>
            <select value={form.content_type} onChange={(e) => updateField('content_type', e.target.value)} className={inputCls}>
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Theme */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <label className={labelCls}>Primary Theme</label>
            <select value={form.primary_theme} onChange={(e) => updateField('primary_theme', e.target.value)} className={inputCls}>
              <option value="">Select theme...</option>
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <label className={`${labelCls} mt-3`}>Secondary Themes</label>
            <div className="flex flex-wrap gap-1.5">
              {THEMES.filter(t => t !== form.primary_theme).map(theme => (
                <button
                  key={theme}
                  onClick={() => toggleSecondaryTheme(theme)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                    form.secondary_themes.includes(theme)
                      ? 'bg-blue-500/15 border-blue-500/25 text-blue-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Series + Difficulty + Read Time */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div>
              <label className={labelCls}>Series</label>
              <select value={form.series} onChange={(e) => updateField('series', e.target.value)} className={inputCls}>
                <option value="">No series</option>
                {SERIES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Difficulty</label>
                <select value={form.difficulty} onChange={(e) => updateField('difficulty', e.target.value)} className={inputCls}>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Read Time (min)</label>
                <input type="number" min="1" max="60" value={form.estimated_read_time} onChange={(e) => updateField('estimated_read_time', parseInt(e.target.value) || 5)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <label className={labelCls}>Tags / Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className={`${inputCls} flex-1`}
              />
              <button onClick={addTag} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white">
                <Tag className="w-3 h-3" />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                    {tag}
                    <button onClick={() => removeTag(tag)}><X className="w-2.5 h-2.5 text-slate-500 hover:text-red-400" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <label className={labelCls}>Featured Image URL</label>
            <input type="text" value={form.featured_image_url} onChange={(e) => updateField('featured_image_url', e.target.value)} placeholder="https://..." className={inputCls} />
            <label className={`${labelCls} mt-2`}>Image Prompt (for AI generation)</label>
            <input type="text" value={form.featured_image_prompt} onChange={(e) => updateField('featured_image_prompt', e.target.value)} placeholder="Describe the image..." className={inputCls} />
          </div>

          {/* Publishing Channels */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <label className={labelCls}>Publish To</label>
            <div className="space-y-1.5">
              {CHANNEL_LIST.map(ch => {
                const cfg = CHANNELS[ch];
                const active = form.publish_to_channels.includes(ch);
                return (
                  <button
                    key={ch}
                    onClick={() => toggleChannel(ch)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left ${
                      active
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-slate-800/30 border-slate-700 text-slate-500'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-sm border ${active ? 'bg-green-500 border-green-500' : 'border-slate-600'}`} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Default Schedule */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <label className={labelCls}>Default Schedule</label>
            <div className="grid grid-cols-2 gap-2">
              <select value={form.default_schedule_day} onChange={(e) => updateField('default_schedule_day', e.target.value)} className={inputCls}>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input type="time" value={form.default_schedule_time} onChange={(e) => updateField('default_schedule_time', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Author */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <label className={labelCls}>Author</label>
            <input type="text" value={form.author} onChange={(e) => updateField('author', e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>
    </div>
  );
}
