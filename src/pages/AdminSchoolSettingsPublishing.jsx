import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Globe, Save, AlertCircle } from 'lucide-react';

const PUBLISHING_CHANNELS = [
  {
    id: 'bulldog_tv',
    name: 'Bulldog TV (School Hub)',
    description: 'Featured on your school\'s video hub and home page',
    icon: '📺',
    enabled: true,
  },
  {
    id: 'yearbook',
    name: 'Yearbook Integration',
    description: 'Content can be linked to yearbook pages and seasons',
    icon: '📚',
    enabled: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Publish to your school\'s YouTube channel',
    icon: '▶️',
    enabled: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Share to your school\'s Facebook page',
    icon: 'f',
    enabled: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Share to your school\'s Instagram account',
    icon: '📷',
    enabled: false,
  },
];

const PUBLISHING_RULES = [
  {
    id: 'require_approval_before_publish',
    label: 'Require Approval Before Publishing',
    default: true,
    description: 'At least one admin must approve before content goes live',
  },
  {
    id: 'manual_publish_only',
    label: 'Manual Publishing Only',
    default: true,
    description: 'Admin must manually trigger publishing (no auto-publish)',
  },
  {
    id: 'show_contributor_names',
    label: 'Show Contributor Names',
    default: true,
    description: 'Display creator/contributor names on published content',
  },
  {
    id: 'allow_commenting',
    label: 'Allow Comments on Published Content',
    default: false,
    description: 'Viewers can comment on published videos and stories',
  },
  {
    id: 'enable_sharing',
    label: 'Allow Sharing to Social Media',
    default: false,
    description: 'Viewers can share content to their personal social accounts',
  },
];

export default function AdminSchoolSettingsPublishing() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [channels, setChannels] = useState(PUBLISHING_CHANNELS);
  const [rules, setRules] = useState(
    PUBLISHING_RULES.reduce((acc, rule) => {
      acc[rule.id] = rule.default;
      return acc;
    }, {})
  );
  const [saving, setSaving] = useState(false);

  const handleChannelToggle = (channelId) => {
    setChannels(
      channels.map((ch) =>
        ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
      )
    );
  };

  const handleRuleToggle = (ruleId) => {
    setRules({
      ...rules,
      [ruleId]: !rules[ruleId],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real app, would save to Settings entity
      alert('Publishing settings saved successfully');
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
        <Link
          to={`${createPageUrl('AdminSchoolSettings')}?schoolSlug=${schoolSlug}`}
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Globe className="h-8 w-8" /> Publishing Settings
        </h1>
        <p className="text-gray-600">Control where and how content is published</p>
      </div>

      {/* Publishing Channels */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Publishing Channels</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <label
              key={channel.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                channel.enabled
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={channel.enabled}
                  onChange={() => handleChannelToggle(channel.id)}
                  className="w-5 h-5 mt-1 accent-blue-600 rounded"
                />
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-lg">{channel.icon}</span>
                    {channel.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Publishing Rules */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Publishing Rules</h3>
        <div className="space-y-4">
          {PUBLISHING_RULES.map((rule) => (
            <label
              key={rule.id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={rules[rule.id]}
                onChange={() => handleRuleToggle(rule.id)}
                className="w-5 h-5 mt-1 accent-blue-600 rounded"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{rule.label}</p>
                <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
              </div>
              <div className="text-xs font-semibold px-2 py-1 rounded mt-1">
                {rules[rule.id] ? (
                  <span className="bg-green-100 text-green-800">✓ Enabled</span>
                ) : (
                  <span className="bg-gray-100 text-gray-700">✗ Disabled</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Safe Defaults Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-8">
        <div className="flex gap-4">
          <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-amber-900 mb-2">Recommended Publishing Workflow</h4>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>1. <strong>Submission:</strong> Student or staff submits content with consent</li>
              <li>2. <strong>Review:</strong> Teacher/reviewer approves appropriateness</li>
              <li>3. <strong>Admin Check:</strong> Admin conducts final review</li>
              <li>4. <strong>Manual Publish:</strong> Admin decides when and where to publish</li>
              <li>5. <strong>Monitor:</strong> Track engagement and student safety</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : '✓ Save Publishing Settings'}
        </button>
      </div>
    </AdminShell>
  );
}