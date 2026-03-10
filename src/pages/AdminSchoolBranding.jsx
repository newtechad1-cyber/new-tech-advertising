import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Save, Upload, Eye, ArrowLeft } from 'lucide-react';

export default function AdminSchoolBranding() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || 'hampton-dumont';
  const [branding, setBranding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.SchoolBranding.filter({
          school_slug: schoolSlug,
        });
        if (data.length > 0) {
          setBranding(data[0]);
        }
      } catch (error) {
        console.error('Error loading branding:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  const handleSave = async () => {
    if (!branding) return;
    setSaving(true);
    try {
      await base44.entities.SchoolBranding.update(branding.id, branding);
      alert('Branding updated successfully');
    } catch (error) {
      console.error('Error saving branding:', error);
      alert('Failed to save branding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">School Branding</h1>
          <p className="text-gray-600">Customize your school's appearance and content</p>
        </div>
        <button
          onClick={() => setShowPreview(true)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Eye className="h-5 w-5" /> Preview
        </button>
      </div>

      {branding ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Logo & Name */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Logo & Identity</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">School Logo</label>
                  {branding.logo && (
                    <img src={branding.logo} alt="School Logo" className="h-20 mb-4" />
                  )}
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-600 font-semibold">Click to upload logo</span>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">School Name</label>
                  <input
                    type="text"
                    value={branding.school_name || ''}
                    onChange={(e) => setBranding({ ...branding, school_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Network/Platform Name</label>
                  <input
                    type="text"
                    value={branding.network_name || ''}
                    onChange={(e) => setBranding({ ...branding, network_name: e.target.value })}
                    placeholder="e.g., Bulldog Story Lab"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">District Name</label>
                  <input
                    type="text"
                    value={branding.district_name || ''}
                    onChange={(e) => setBranding({ ...branding, district_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Brand Colors</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.primary_color || '#1e3a5f'}
                      onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                      className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primary_color || '#1e3a5f'}
                      onChange={(e) => setBranding({ ...branding, primary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.secondary_color || '#f59e0b'}
                      onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                      className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.secondary_color || '#f59e0b'}
                      onChange={(e) => setBranding({ ...branding, secondary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={branding.accent_color || '#ffffff'}
                      onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                      className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.accent_color || '#ffffff'}
                      onChange={(e) => setBranding({ ...branding, accent_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Video Templates</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Intro Text</label>
                  <textarea
                    value={branding.intro_text || ''}
                    onChange={(e) => setBranding({ ...branding, intro_text: e.target.value })}
                    placeholder="Text shown at start of videos..."
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Outro Text</label>
                  <textarea
                    value={branding.outro_text || ''}
                    onChange={(e) => setBranding({ ...branding, outro_text: e.target.value })}
                    placeholder="Text shown at end of videos..."
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission Page */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Submission Page</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Instructions</label>
                  <textarea
                    value={branding.upload_instructions || ''}
                    onChange={(e) => setBranding({ ...branding, upload_instructions: e.target.value })}
                    placeholder="Guidelines and instructions for submitters..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Legal Release Text</label>
                  <textarea
                    value={branding.legal_release_text || ''}
                    onChange={(e) => setBranding({ ...branding, legal_release_text: e.target.value })}
                    placeholder="Consent and release language..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Contact & Social</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={branding.contact_email || ''}
                    onChange={(e) => setBranding({ ...branding, contact_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                    <input
                      type="url"
                      value={branding.social_youtube_url || ''}
                      onChange={(e) => setBranding({ ...branding, social_youtube_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                    <input
                      type="url"
                      value={branding.social_facebook_url || ''}
                      onChange={(e) => setBranding({ ...branding, social_facebook_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                    <input
                      type="url"
                      value={branding.social_instagram_url || ''}
                      onChange={(e) => setBranding({ ...branding, social_instagram_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all"
            >
              <Save className="h-5 w-5" /> {saving ? 'Updating...' : '✓ Save Branding'}
            </button>
            {saving && <p className="text-sm text-gray-600 text-center mt-3">Updating your school branding...</p>}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-6">
            <h3 className="text-lg font-bold mb-4">Preview</h3>
            <div
              className="rounded-lg overflow-hidden shadow-lg"
              style={{
                backgroundColor: branding.primary_color,
                color: branding.accent_color,
              }}
            >
              <div className="p-6 text-center">
                {branding.logo && (
                  <img src={branding.logo} alt="Logo" className="h-16 mx-auto mb-4" />
                )}
                <h2 className="text-2xl font-bold mb-2">{branding.network_name || branding.school_name}</h2>
                <p className="text-sm opacity-90">{branding.district_name}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div>
                <p className="text-gray-600 font-semibold mb-1">Primary</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded border border-gray-300"
                    style={{ backgroundColor: branding.primary_color }}
                  />
                  <span className="font-mono text-gray-700">{branding.primary_color}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 font-semibold mb-1">Secondary</p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded border border-gray-300"
                    style={{ backgroundColor: branding.secondary_color }}
                  />
                  <span className="font-mono text-gray-700">{branding.secondary_color}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">Branding settings not configured</p>
        </div>
      )}
    </AdminShell>
  );
}