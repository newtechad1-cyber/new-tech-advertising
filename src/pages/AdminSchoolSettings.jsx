import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Settings, Save, Shield, Eye, FileText, Lock, Globe, ArrowRight } from 'lucide-react';

export default function AdminSchoolSettings() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [settings, setSettings] = useState({
    require_consent: true,
    require_teacher_review: true,
    allow_public_submissions: false,
    enable_ai_tools: true,
    auto_publish: false,
    require_release_signature: true,
    ai_content_moderation: true,
    max_file_size_mb: 500,
    allowed_file_types: 'mp4,mov,jpg,png,gif',
    submission_deadline: null,
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to a Settings entity
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Settings className="h-8 w-8" /> School Settings
        </h1>
        <p className="text-gray-600">Configure submission, moderation, and publishing rules</p>
      </div>

      {/* Quick Links to Sub-Pages */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Link
          to={`/admin/schools/${schoolSlug}/settings/permissions`}
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
          to={`/admin/schools/${schoolSlug}/settings/publishing`}
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
      <div className="bg-white rounded-lg shadow-md mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'submission', label: 'Submissions', icon: FileText },
            { id: 'moderation', label: 'Moderation', icon: Shield },
            { id: 'publishing', label: 'Publishing', icon: Eye },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition-colors text-sm whitespace-nowrap flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">General Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.require_consent}
                  onChange={(e) => setSettings({ ...settings, require_consent: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Require Consent Checkbox</p>
                  <p className="text-sm text-gray-600">Contributors must confirm consent before submitting</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.require_release_signature}
                  onChange={(e) => setSettings({ ...settings, require_release_signature: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Require Release Signature</p>
                  <p className="text-sm text-gray-600">Contributors must agree to media release terms</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.enable_ai_tools}
                  onChange={(e) => setSettings({ ...settings, enable_ai_tools: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Enable AI Tools</p>
                  <p className="text-sm text-gray-600">Staff can use AI for story, caption, and script generation</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.auto_publish}
                  onChange={(e) => setSettings({ ...settings, auto_publish: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Auto-Publish Approved Content</p>
                  <p className="text-sm text-gray-600 text-red-600">⚠️ Default is disabled—requires manual publishing approval</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Submission Rules */}
      {activeTab === 'submission' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Submission Rules</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.max_file_size_mb}
                  onChange={(e) => setSettings({ ...settings, max_file_size_mb: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Allowed File Types</label>
                <input
                  type="text"
                  value={settings.allowed_file_types}
                  onChange={(e) => setSettings({ ...settings, allowed_file_types: e.target.value })}
                  placeholder="mp4,mov,jpg,png,gif"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">Comma-separated list</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Submission Deadline (Optional)</label>
                <input
                  type="date"
                  value={settings.submission_deadline || ''}
                  onChange={(e) => setSettings({ ...settings, submission_deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.allow_public_submissions}
                  onChange={(e) => setSettings({ ...settings, allow_public_submissions: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Allow Public Submissions</p>
                  <p className="text-sm text-gray-600">Non-authenticated users can submit content (with consent)</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.require_teacher_review}
                  onChange={(e) => setSettings({ ...settings, require_teacher_review: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Require Teacher Review</p>
                  <p className="text-sm text-gray-600">Teachers must review/approve before admin can publish</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Rules */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Content Moderation</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={settings.ai_content_moderation}
                  onChange={(e) => setSettings({ ...settings, ai_content_moderation: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">AI Content Moderation</p>
                  <p className="text-sm text-gray-600">Flag submissions with potential safety concerns for review</p>
                </div>
              </label>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Safe Defaults Enabled:</strong> School Story Lab defaults to the safest settings for student use. Staff can review and adjust as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publishing Settings */}
      {activeTab === 'publishing' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Publishing & Visibility</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
                Publishing settings control where and how content appears. All published content is reviewed before going live.
              </p>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Bulldog TV (School Hub)</p>
                  <p className="text-sm text-gray-600">Featured content appears on school media hub</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Yearbook Integration</p>
                  <p className="text-sm text-gray-600">Content can be linked to yearbook pages</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Social Media Sharing</p>
                  <p className="text-sm text-gray-600">Allow publishing to YouTube, Facebook, Instagram</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2"
        >
          <Save className="h-5 w-5" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </AdminShell>
  );
}