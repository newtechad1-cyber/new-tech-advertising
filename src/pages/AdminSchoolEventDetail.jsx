import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Save, Plus, Trash2, Zap } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-red-100 text-red-800',
};

export default function AdminSchoolEventDetail() {
  const { schoolSlug, eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [linkedContent, setLinkedContent] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        let eventData;
        if (eventId === 'new') {
          eventData = {
            school_slug: schoolSlug,
            title: '',
            slug: '',
            event_type: 'other',
            event_date: new Date().toISOString().split('T')[0],
            status: 'draft',
            publish_status: 'unpublished',
          };
        } else {
          const data = await base44.entities.SchoolEvents.filter({
            id: eventId,
            school_slug: schoolSlug,
          });
          eventData = data[0] || null;
        }

        if (eventData) {
          setEvent(eventData);

          if (eventId !== 'new') {
            const linksData = await base44.entities.EventContentLinks.filter({
              event_id: eventId,
            });
            setLinkedContent(linksData.sort((a, b) => a.sort_order - b.sort_order));
          }
        }
      } catch (error) {
        console.error('Error loading event:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, eventId]);

  const saveEvent = async () => {
    setSaving(true);
    try {
      if (eventId === 'new') {
        const newEvent = await base44.entities.SchoolEvents.create(event);
        window.location.href = `/admin/schools/${schoolSlug}/events/${newEvent.id}`;
      } else {
        await base44.entities.SchoolEvents.update(eventId, event);
        alert('Event saved successfully!');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    } finally {
      setSaving(false);
    }
  };

  const removeLink = async (linkId) => {
    try {
      await base44.entities.EventContentLinks.delete(linkId);
      setLinkedContent(linkedContent.filter(l => l.id !== linkId));
    } catch (error) {
      console.error('Error removing link:', error);
      alert('Error removing link');
    }
  };

  const createAIJob = async (jobType) => {
    try {
      await base44.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: jobType,
        status: 'pending',
        source_entity_type: 'SchoolEvents',
        source_entity_id: eventId,
        requested_by: 'admin',
      });
      alert(`${jobType.replace(/_/g, ' ')} job queued!`);
    } catch (error) {
      console.error('Error creating AI job:', error);
      alert('Error queuing AI job');
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!event) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Event not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/events`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{event.title || 'New Event'}</h1>
          <p className="text-gray-600">{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[event.status]}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
          <button
            onClick={saveEvent}
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
          {['overview', 'content', 'ai-recap', 'publishing', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition-colors text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'ai-recap' ? 'AI Recap' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Event Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => setEvent({ ...event, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date *</label>
                <input
                  type="date"
                  value={event.event_date}
                  onChange={(e) => setEvent({ ...event, event_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                  <select
                    value={event.event_type}
                    onChange={(e) => setEvent({ ...event, event_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="game">Game</option>
                    <option value="concert">Concert</option>
                    <option value="play">Play</option>
                    <option value="assembly">Assembly</option>
                    <option value="competition">Competition</option>
                    <option value="celebration">Celebration</option>
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={event.location || ''}
                    onChange={(e) => setEvent({ ...event, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Where is this event?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Summary</label>
                <textarea
                  value={event.summary || ''}
                  onChange={(e) => setEvent({ ...event, summary: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief event summary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={event.description || ''}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full event description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={event.cover_image_url || ''}
                  onChange={(e) => setEvent({ ...event, cover_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {event.cover_image_url && (
                  <img src={event.cover_image_url} alt="Cover" className="w-full h-48 object-cover rounded-lg mt-4" />
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={event.featured || false}
                  onChange={(e) => setEvent({ ...event, featured: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-700 font-semibold">Featured Event</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Linked Content Tab */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Linked Content ({linkedContent.length})</h3>
          </div>

          {linkedContent.length > 0 ? (
            <div className="space-y-3">
              {linkedContent.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">{link.content_id}</p>
                    <p className="text-xs text-gray-600 capitalize">{link.content_type} • {link.link_type}</p>
                  </div>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No content linked yet. Add content to showcase at this event.</p>
          )}
        </div>
      )}

      {/* AI Recap Tab */}
      {activeTab === 'ai-recap' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" /> Generate Event Recap
            </h3>
            <p className="text-gray-700 mb-4">Create an AI-generated recap of this event using linked content</p>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => createAIJob('event_recap')}
                className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
              >
                Generate Recap
              </button>
              <button
                onClick={() => createAIJob('story_generation')}
                className="bg-white hover:bg-blue-50 border border-blue-200 text-gray-800 px-4 py-3 rounded-lg font-semibold text-sm"
              >
                Improve Recap
              </button>
            </div>
          </div>

          {event.ai_summary_draft && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">AI Summary Draft</h4>
              <div className="bg-white rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-700">{event.ai_summary_draft}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  Save as Story Draft
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                  Use as Summary
                </button>
              </div>
            </div>
          )}
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
                value={event.status}
                onChange={(e) => setEvent({ ...event, status: e.target.value })}
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
                value={event.visibility || 'staff'}
                onChange={(e) => setEvent({ ...event, visibility: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="staff">Staff Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Activity Log</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">Event Created</p>
              <p className="text-gray-600">{new Date(event.created_date).toLocaleString()}</p>
            </div>
            {event.updated_date && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Last Updated</p>
                <p className="text-gray-600">{new Date(event.updated_date).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}