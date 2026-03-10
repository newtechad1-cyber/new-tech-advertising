import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { useSchoolPermissions } from '@/components/school-tv/useSchoolPermissions';
import PermissionGuard from '@/components/school-tv/PermissionGuard';
import { Settings, Save, Shield, Globe, Lock, ArrowRight, Zap, Film, Bell, CheckCircle } from 'lucide-react';

const DEFAULTS = {
  enable_ai_tools: true,
  ai_tone_default: 'warm',
  ai_auto_generate_captions: true,
  ai_auto_generate_story: false,
  ai_story_word_count_min: 120,
  ai_story_word_count_max: 200,
  ai_content_moderation: true,
  moderation_strictness: 'standard',
  auto_approve_staff_submissions: false,
  require_consent: true,
  require_release_signature: true,
  manual_publish_only: true,
  auto_publish: false,
  default_content_visibility: 'staff',
  publish_to_gallery_default: true,
  publish_to_youtube_default: false,
  publish_to_facebook_default: false,
  publish_to_instagram_default: false,
  enable_social_sharing: false,
  voiceover_enabled_default: true,
  captions_enabled_default: true,
  intro_enabled_default: true,
  outro_enabled_default: true,
  video_format_default: 'landscape',
  video_resolution_default: '1920x1080',
  video_duration_target: '2-3 minutes',
  music_enabled_default: true,
  require_teacher_review: true,
  approval_required_for_publish: true,
  min_approvals_required: 1,
  auto_archive_rejected: false,
  submission_review_deadline_days: 7,
  allow_public_submissions: false,
  max_file_size_mb: 500,
  allowed_file_types: 'mp4,mov,jpg,png,gif',
  submission_deadline: null,
  notify_on_new_submission: true,
  notify_on_ai_completion: true,
  notify_on_render_complete: true,
  notify_on_publish: true,
  notification_email: '',
  notify_contributor_on_approval: true,
  notify_contributor_on_rejection: true,
};

const TABS = [
  { id: 'ai', label: 'AI Tools', icon: Zap },
  { id: 'moderation', label: 'Moderation', icon: Shield },
  { id: 'publishing', label: 'Publishing', icon: Globe },
  { id: 'video', label: 'Video', icon: Film },
  { id: 'approval', label: 'Approval', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function AdminSchoolSettings() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const { can } = useSchoolPermissions(schoolSlug);

  const [settingsId, setSettingsId] = useState(null);
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');

  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    const load = async () => {
      try {
        const existing = await base44.entities.SchoolSettings.filter({ school_slug: schoolSlug });
        if (existing.length > 0) {
          setSettingsId(existing[0].id);
          setSettings({ ...DEFAULTS, ...existing[0] });
        } else {
          const created = await base44.entities.SchoolSettings.create({ school_slug: schoolSlug, ...DEFAULTS });
          setSettingsId(created.id);
          setSettings({ ...DEFAULTS, ...created });
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [schoolSlug]);

  const handleSave = async () => {
    if (!can('configure_settings')) { alert('You do not have permission to configure settings.'); return; }
    setSaving(true);
    try {
      const payload = { ...settings, school_slug: schoolSlug };
      if (settingsId) {
        await base44.entities.SchoolSettings.update(settingsId, payload);
      } else {
        const created = await base44.entities.SchoolSettings.create(payload);
        setSettingsId(created.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ field, label, description, warn = false }) => (
    <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <input
        type="checkbox"
        checked={!!settings[field]}
        onChange={e => set(field, e.target.checked)}
        className="w-5 h-5 accent-blue-600 mt-0.5 flex-shrink-0"
      />
      <div>
        <p className="font-semibold text-gray-900">{label}</p>
        {description && <p className={`text-sm mt-0.5 ${warn ? 'text-red-600' : 'text-gray-500'}`}>{description}</p>}
      </div>
    </label>
  );

  const SelectField = ({ field, label, options, hint }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <select
        value={settings[field] || ''}
        onChange={e => set(field, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );

  const NumberField = ({ field, label, min, max, hint }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={settings[field] ?? ''}
        onChange={e => set(field, parseInt(e.target.value))}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );

  if (loading) {
    return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12 text-gray-500">Loading settings...</div></AdminShell>;
  }

  if (!can('configure_settings')) {
    return (
      <AdminShell schoolSlug={schoolSlug}>
        <PermissionGuard can={can} permission="configure_settings" block>{null}</PermissionGuard>
      </AdminShell>
    );
  }

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-1">
            <Settings className="h-8 w-8" /> School Settings
          </h1>
          <p className="text-gray-600">Configure AI, moderation, video, and workflow defaults for {schoolSlug}</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
            <CheckCircle className="h-4 w-4" /> Settings saved
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Link
          to={`${createPageUrl('AdminSchoolSettingsPermissions')}?schoolSlug=${schoolSlug}`}
          className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">Permission Rules</p>
              <p className="text-xs text-gray-600">Who can do what</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
        </Link>
        <Link
          to={`${createPageUrl('AdminSchoolSettingsPublishing')}?schoolSlug=${schoolSlug}`}
          className="bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">Publishing Settings</p>
              <p className="text-xs text-gray-600">Where content goes</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-4 border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 font-semibold text-sm whitespace-nowrap flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-5">

        {/* ── AI Tools ── */}
        {activeTab === 'ai' && (
          <>
            <div>
              <h3 className="text-lg font-bold mb-1">AI Content Defaults</h3>
              <p className="text-sm text-gray-500">These values are injected into all AI generation prompts and job queues for this school.</p>
            </div>
            <Toggle field="enable_ai_tools" label="Enable AI Tools" description="Master switch — staff can use AI for story, caption, and script generation" />
            <SelectField
              field="ai_tone_default"
              label="Default Tone"
              hint="Injected into story, caption, script, and headline generation prompts"
              options={[
                { value: 'warm', label: 'Warm — friendly and community-focused' },
                { value: 'energetic', label: 'Energetic — upbeat and exciting' },
                { value: 'inspirational', label: 'Inspirational — motivating and uplifting' },
                { value: 'formal', label: 'Formal — professional and academic' },
                { value: 'professional', label: 'Professional — polished and concise' },
              ]}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <NumberField field="ai_story_word_count_min" label="Story Word Count — Min" min={50} hint="Minimum words for AI-generated stories" />
              <NumberField field="ai_story_word_count_max" label="Story Word Count — Max" max={1000} hint="Maximum words for AI-generated stories" />
            </div>
            <Toggle field="ai_auto_generate_captions" label="Auto-Generate Captions on Approval" description="Queue caption generation automatically when a submission is approved" />
            <Toggle field="ai_auto_generate_story" label="Auto-Generate Story on Approval" description="Queue story draft automatically when a submission is approved" />
          </>
        )}

        {/* ── Moderation ── */}
        {activeTab === 'moderation' && (
          <>
            <div>
              <h3 className="text-lg font-bold mb-1">Moderation Rules</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
                <strong>Safe Defaults:</strong> School Story Lab defaults to the safest settings for student use. Staff can adjust as needed.
              </div>
            </div>
            <Toggle field="ai_content_moderation" label="AI Content Moderation" description="Use AI to flag safety concerns on incoming submissions" />
            <SelectField
              field="moderation_strictness"
              label="Moderation Strictness"
              hint="Controls how the AI moderation prompt is calibrated"
              options={[
                { value: 'relaxed', label: 'Relaxed — flag only clearly inappropriate content' },
                { value: 'standard', label: 'Standard — recommended for most schools' },
                { value: 'strict', label: 'Strict — flag anything ambiguous' },
              ]}
            />
            <Toggle field="require_consent" label="Require Consent Checkbox" description="Contributors must confirm consent before submitting" />
            <Toggle field="require_release_signature" label="Require Release Signature" description="Contributors must agree to media release terms" />
            <Toggle field="auto_approve_staff_submissions" label="Auto-Approve Staff Submissions" description="Skip review queue for teacher, coach, or staff-submitted content" />
          </>
        )}

        {/* ── Publishing ── */}
        {activeTab === 'publishing' && (
          <>
            <div>
              <h3 className="text-lg font-bold mb-1">Publishing Defaults</h3>
              <p className="text-sm text-gray-500">These defaults are applied when creating new projects and content. Individual projects can override them.</p>
            </div>
            <Toggle field="manual_publish_only" label="Manual Publish Only" description="Require explicit admin approval before any content goes live" />
            <Toggle field="auto_publish" label="Auto-Publish Approved Content" description="Automatically publish once content is approved — use with caution" warn />
            <SelectField
              field="default_content_visibility"
              label="Default Content Visibility"
              hint="Applied to new stories, yearbook pages, and spotlights"
              options={[
                { value: 'staff', label: 'Staff Only' },
                { value: 'public', label: 'Public' },
                { value: 'private', label: 'Private' },
              ]}
            />
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-bold text-gray-700 mb-3">Default Platform Targets (pre-checked on new projects)</p>
              <div className="space-y-3">
                <Toggle field="publish_to_gallery_default" label="School Gallery" description="Publish to school media hub by default" />
                <Toggle field="enable_social_sharing" label="Enable Social Sharing" description="Allow publishing to external social platforms at all" />
                <Toggle field="publish_to_youtube_default" label="YouTube — pre-checked" description="Only applies when social sharing is enabled" />
                <Toggle field="publish_to_facebook_default" label="Facebook — pre-checked" description="Only applies when social sharing is enabled" />
                <Toggle field="publish_to_instagram_default" label="Instagram — pre-checked" description="Only applies when social sharing is enabled" />
              </div>
            </div>
          </>
        )}

        {/* ── Video ── */}
        {activeTab === 'video' && (
          <>
            <div>
              <h3 className="text-lg font-bold mb-1">Video Production Defaults</h3>
              <p className="text-sm text-gray-500">Passed to the render engine when new video projects are created. Projects can override individually.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <SelectField
                field="video_format_default"
                label="Output Format"
                options={[
                  { value: 'landscape', label: 'Landscape (16:9)' },
                  { value: 'square', label: 'Square (1:1)' },
                  { value: 'vertical', label: 'Vertical (9:16)' },
                ]}
              />
              <SelectField
                field="video_resolution_default"
                label="Resolution"
                options={[
                  { value: '1280x720', label: '720p (1280×720)' },
                  { value: '1920x1080', label: '1080p (1920×1080)' },
                  { value: '3840x2160', label: '4K (3840×2160)' },
                ]}
              />
              <SelectField
                field="video_duration_target"
                label="Duration Target"
                options={[
                  { value: '30-60 seconds', label: '30–60 seconds' },
                  { value: '1-2 minutes', label: '1–2 minutes' },
                  { value: '2-3 minutes', label: '2–3 minutes' },
                  { value: '3-5 minutes', label: '3–5 minutes' },
                ]}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3 pt-2">
              <Toggle field="voiceover_enabled_default" label="Voiceover" description="Include AI voiceover by default" />
              <Toggle field="captions_enabled_default" label="Captions" description="Burn captions into video by default" />
              <Toggle field="intro_enabled_default" label="Branded Intro" description="Include school intro card by default" />
              <Toggle field="outro_enabled_default" label="Branded Outro" description="Include school outro card by default" />
              <Toggle field="music_enabled_default" label="Background Music" description="Include background music by default" />
            </div>
          </>
        )}

        {/* ── Approval Workflow ── */}
        {activeTab === 'approval' && (
          <>
            <div>
              <h3 className="text-lg font-bold mb-1">Approval Workflow</h3>
              <p className="text-sm text-gray-500">Controls how content moves through the review and publish pipeline.</p>
            </div>
            <Toggle field="require_teacher_review" label="Require Teacher Review" description="Teachers must review and approve before admin can publish" />
            <Toggle field="approval_required_for_publish" label="Approval Required to Publish" description="Content must pass explicit approval step before going live" />
            <div className="grid md:grid-cols-2 gap-4">
              <NumberField field="min_approvals_required" label="Minimum Approvals Required" min={1} max={5} hint="Number of approvals needed before content can publish" />
              <NumberField field="submission_review_deadline_days" label="Review Deadline (days)" min={1} hint="Days staff have to review before submission escalates" />
            </div>
            <Toggle field="auto_archive_rejected" label="Auto-Archive Rejected" description="Automatically archive rejected submissions to keep the queue clean" />
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-bold text-gray-700 mb-3">Submission Rules</p>
              <div className="space-y-3">
                <Toggle field="allow_public_submissions" label="Allow Public Submissions" description="Non-authenticated users can submit content (with consent)" />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <NumberField field="max_file_size_mb" label="Max File Size (MB)" min={1} />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Allowed File Types</label>
                  <input
                    type="text"
                    value={settings.allowed_file_types || ''}
                    onChange={e => set('allowed_file_types', e.target.value)}
                    placeholder="mp4,mov,jpg,png,gif"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated extensions</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Submission Deadline (Optional)</label>
                <input
                  type="date"
                  value={settings.submission_deadline || ''}
                  onChange={e => set('submission_deadline', e.target.value || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </>
        )}

        {/* ── Notifications ── */}
        {activeTab === 'notifications' && (
          <>
            <div>
              <h3 className="text-lg font-bold mb-1">Notifications</h3>
              <p className="text-sm text-gray-500">Controls when the system sends alerts to staff and contributors.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Notification Email</label>
              <input
                type="email"
                value={settings.notification_email || ''}
                onChange={e => set('notification_email', e.target.value)}
                placeholder="admin@school.edu (falls back to branding contact email)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-bold text-gray-700 mb-3">Admin Alerts</p>
              <div className="space-y-3">
                <Toggle field="notify_on_new_submission" label="New Submission" description="Alert admins when a new submission arrives" />
                <Toggle field="notify_on_ai_completion" label="AI Generation Complete" description="Alert staff when AI content generation finishes" />
                <Toggle field="notify_on_render_complete" label="Render Complete" description="Alert staff when a video render finishes" />
                <Toggle field="notify_on_publish" label="Content Published" description="Alert admins when content goes live" />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-bold text-gray-700 mb-3">Contributor Alerts</p>
              <div className="space-y-3">
                <Toggle field="notify_contributor_on_approval" label="Approval Email" description="Email the contributor when their submission is approved" />
                <Toggle field="notify_contributor_on_rejection" label="Rejection Email" description="Email the contributor when their submission is rejected" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && (
          <span className="text-green-700 font-semibold text-sm flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </AdminShell>
  );
}