import React, { useState } from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Palette,
  Upload,
  Eye,
  Save,
} from 'lucide-react';

export default function AdminSchoolBranding() {
  const { schoolSlug, currentPath } = useSchoolRoute();

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Palette className="h-8 w-8 text-purple-600" />
                Branding
              </h1>
              <p className="text-gray-600 mt-1">Customize your school's public pages</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          {/* Logo Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Logo & Identity</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Logo</label>
                <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Secondary Logo</label>
                <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Brand Colors</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { label: 'Primary Color', value: '#1e3a5f', hex: '1e3a5f' },
                { label: 'Secondary Color', value: '#f59e0b', hex: 'f59e0b' },
              ].map((color, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">{color.label}</label>
                  <div className="flex gap-3">
                    <div
                      className="h-12 w-12 rounded-lg border-2 border-gray-300"
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <input
                      type="text"
                      value={color.value}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text & Messages Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Text & Messages</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Public Page Title</label>
                <input
                  type="text"
                  value="Hampton-Dumont Bulldog Story Lab"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Intro Text</label>
                <textarea
                  value="Welcome to our digital yearbook and student media hub. Share your stories, celebrate achievements, and preserve memories."
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Outro Text</label>
                <textarea
                  value="Thank you for being part of our school community. Together, we're building something special."
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Legal & Safety */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Legal & Safety</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Terms of Use</label>
                <textarea
                  value="All content is moderated and must comply with school policies. Students are responsible for obtaining appropriate permissions."
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Privacy Notice</label>
                <textarea
                  value="Your privacy is important to us. We do not share personal information with third parties."
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </h2>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <div
                className="h-32 text-white p-6 flex items-end"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                <h3 className="text-2xl font-bold">Hampton-Dumont Bulldog Story Lab</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to our digital yearbook and student media hub. Share your stories, celebrate achievements, and preserve memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}