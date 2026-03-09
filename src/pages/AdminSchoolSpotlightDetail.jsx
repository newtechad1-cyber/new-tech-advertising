import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Save, Plus, Zap } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

export default function AdminSchoolSpotlightDetail() {
  const { schoolSlug, spotlightId } = useParams();
  const [spotlight, setSpotlight] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        let spotlightData;
        if (spotlightId === 'new') {
          spotlightData = {
            school_slug: schoolSlug,
            title: '',
            slug: '',
            status: 'draft',
            spotlight_type: 'student_achievement',
          };
        } else {
          const data = await base44.entities.Spotlights.filter({
            id: spotlightId,
            school_slug: schoolSlug,
          });
          spotlightData = data[0] || null;
        }

        if (spotlightData) {
          setSpotlight(spotlightData);
        }
      } catch (error) {
        console.error('Error loading spotlight:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, spotlightId]);

  const saveSpotlight = async () => {
    setSaving(true);
    try {
      if (spotlightId === 'new') {
        const newSpotlight = await base44.entities.Spotlights.create(spotlight);
        window.location.href = `/admin/schools/${schoolSlug}/spotlights/${newSpotlight.id}`;
      } else {
        await base44.entities.Spotlights.update(spotlightId, spotlight);
        alert('Spotlight saved successfully!');
      }
    } catch (error) {
      console.error('Error saving spotlight:', error);
      alert('Error saving spotlight');
    } finally {
      setSaving(false);
    }
  };

  const createAIJob = async (jobType) => {
    try {
      await base44.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: jobType,
        status: 'pending',
        source_entity_type: 'Spotlights',
        source_entity_id: spotlightId,
        requested_by: 'admin',
      });
      alert(`${jobType.replace(/_/g, ' ')} job queued!`);
    } catch (error) {
      console.error('Error creating AI job:', error);
      alert('Error queuing AI job');
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!spotlight) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Spotlight not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/spotlights`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Spotlights
      </Link>

      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{spotlight.title || 'New Spotlight'}</h1>
          <p className="text-gray-600">{spotlight.subject_name || 'Unnamed subject'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[spotlight.status]}`}>
            {spotlight.status.charAt(0).toUpperCase() + spotlight.status.slice(1)}
          </span>
          <button
            onClick={saveSpotlight}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <Save className="h-5 w-5" /> Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['content', 'media', 'ai-tools', 'links', 'publishing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition-colors text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'ai-tools' ? 'AI Tools' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Spotlight Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={spotlight.title}
                  onChange={(e) => setSpotlight({ ...spotlight, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Spotlight title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
                <input
                  type="text"
                  value={spotlight.subject_name || ''}
                  onChange={(e) => setSpotlight({ ...spotlight, subject_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Student or staff member name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={spotlight.description || ''}
                  onChange={(e) => setSpotlight({ ...spotlight, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell their story..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Spotlight Type</label>
                <select
                  value={spotlight.spotlight_type || 'student_achievement'}
                  onChange={(e) => setSpotlight({ ...spotlight, spotlight_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student_achievement">Student Achievement</option>
                  <option value="staff_member">Staff Member</option>
                  <option value="team_feature">Team Feature</option>
                  <option value="alumni_profile">Alumni Profile</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spotlight.featured || false}
                  onChange={(e) => setSpotlight({ ...spotlight, featured: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 font-semibold">Featured Spotlight</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Media & Images</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image</label>
              <input
                type="text"
                value={spotlight.featured_image_url || ''}
                onChange={(e) => setSpotlight({ ...spotlight, featured_image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              {spotlight.featured_image_url && (
                <img src={spotlight.featured_image_url} alt="Featured" className="w-full h-48 object-cover rounded-lg mt-4" />
              )}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" /> Add Media Gallery
            </button>
          </div>
        </div>
      )}

      {/* AI Tools Tab */}
      {activeTab === 'ai-tools' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5" /> AI Content Tools
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => createAIJob('spotlight_generation')}
              className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
            >
              Generate Draft
            </button>
            <button
              onClick={() => createAIJob('story_generation')}
              className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
            >
              Improve Spotlight
            </button>
            <button
              onClick={() => createAIJob('headline')}
              className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
            >
              Generate Headlines
            </button>
            <button className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm">
              Accept AI Draft
            </button>
          </div>
        </div>
      )}

      {/* Links Tab */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-6">Link to Other Content</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Story</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select a story...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Event</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select an event...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Yearbook Category</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select a yearbook category...</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Linked Video</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select a video project...</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold mt-4">
              Save Links
            </button>
          </div>
        </div>
      )}

      {/* Publishing Tab */}
      {activeTab === 'publishing' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-6">Publishing Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={spotlight.status}
                onChange={(e) => setSpotlight({ ...spotlight, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
              <select
                value={spotlight.visibility || 'staff'}
                onChange={(e) => setSpotlight({ ...spotlight, visibility: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="staff">Staff Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule Publish (Optional)</label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold mb-2">
                Publish Spotlight
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold">
                Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}