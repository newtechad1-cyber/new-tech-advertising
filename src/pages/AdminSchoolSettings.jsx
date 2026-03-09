import React, { useState } from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Bell,
  Lock,
  Shield,
  Save,
} from 'lucide-react';

export default function AdminSchoolSettings() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="h-8 w-8 text-gray-700" />
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Configure your school's platform</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {['general', 'submissions', 'publishing', 'ai', 'safety'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tab === 'ai' ? 'AI Settings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">School Name</label>
                <input
                  type="text"
                  defaultValue="Hampton-Dumont Community Schools"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">District Name</label>
                <input
                  type="text"
                  defaultValue="Hampton-Dumont Community School District"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  defaultValue="media@hampton-dumont.edu"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div className="pt-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700">Enable public yearbook</span>
                </label>
              </div>
            </div>
          )}

          {/* Submission Rules */}
          {activeTab === 'submissions' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Submission Rules</h2>
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Require parent consent for minors</span>
                </label>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Require all submissions to be reviewed</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Allow anonymous submissions</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max file size (MB)</label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Publishing Settings */}
          {activeTab === 'publishing' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Publishing Settings</h2>
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Auto-publish approved stories</span>
                </label>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Show contributor names</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Allow comments on stories</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Default story visibility</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-200">
                  <option>Public (visible to everyone)</option>
                  <option>Internal (school only)</option>
                  <option>Private (contributors only)</option>
                </select>
              </div>
            </div>
          )}

          {/* AI Settings */}
          {activeTab === 'ai' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">AI Settings</h2>
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Enable AI tools for students</span>
                </label>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Require AI disclosure in content</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Enable AI guidelines module</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">AI tools available</label>
                <div className="space-y-2">
                  {['Story Title Ideas', 'Article Draft', 'Video Script', 'Caption Writer'].map((tool) => (
                    <label key={tool} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                      <span className="text-gray-700">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Safety Settings */}
          {activeTab === 'safety' && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety & Moderation
              </h2>
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Enable content filtering</span>
                </label>
                <label className="flex items-center gap-2 mb-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Flag potentially sensitive content</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-200" />
                  <span className="text-gray-700 font-semibold">Require consent forms for identifiable students</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Auto-flag keywords (comma-separated)</label>
                <textarea
                  defaultValue="inappropriate, offensive"
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Data retention (days)</label>
                <input
                  type="number"
                  defaultValue="365"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}