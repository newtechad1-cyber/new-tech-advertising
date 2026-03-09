import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, CheckCircle2, AlertCircle, Zap, FileText } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800',
  assigned_to_project: 'bg-purple-100 text-purple-800',
};

export default function AdminSubmissionDetail() {
  const { schoolSlug, submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.StudentVideoSubmissions.filter({
          school_slug: schoolSlug,
          id: submissionId,
        });
        if (data.length > 0) {
          setSubmission(data[0]);
          try {
            setMediaFiles(JSON.parse(data[0].media_urls || '[]'));
          } catch {
            setMediaFiles([]);
          }
        }
      } catch (error) {
        console.error('Error loading submission:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug, submissionId]);

  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await base44.entities.StudentVideoSubmissions.update(submissionId, {
        status: newStatus,
      });
      setSubmission(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating submission status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const createAIJob = async (jobType) => {
    try {
      await base44.entities.AIContentJobs.create({
        school_slug: schoolSlug,
        job_type: jobType,
        status: 'pending',
        source_entity_type: 'StudentVideoSubmissions',
        source_entity_id: submissionId,
        requested_by: 'admin',
      });
      alert(`${jobType.replace(/_/g, ' ')} job queued!`);
    } catch (error) {
      console.error('Error creating AI job:', error);
      alert('Error queuing AI job');
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;
  if (!submission) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Submission not found</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`/admin/schools/${schoolSlug}/submissions`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Submissions
      </Link>

      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{submission.submission_title}</h1>
          <p className="text-gray-600">
            Submitted by {submission.contributor_name} ({submission.contributor_role}) on {new Date(submission.created_date).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${STATUS_COLORS[submission.status]}`}>
          {submission.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* AI Safety Banner */}
      {submission.ai_safety_flagged && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 mb-1">AI Safety Review</p>
            <p className="text-sm text-red-800">This submission has been flagged by safety systems. Please review carefully before approving.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {['overview', 'media', 'ai-drafts', 'assignment', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition-colors text-sm ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'ai-drafts' ? 'AI Drafts' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Submission Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="text-gray-900 font-semibold">{submission.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Activity Type</p>
                <p className="text-gray-900 font-semibold capitalize">{submission.activity_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Type</p>
                <p className="text-gray-900 font-semibold capitalize">{submission.submission_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Files</p>
                <p className="text-gray-900 font-semibold">{mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''}</p>
              </div>
              {submission.team_or_group && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Team/Group</p>
                  <p className="text-gray-900 font-semibold">{submission.team_or_group}</p>
                </div>
              )}
              {submission.event_name && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Event</p>
                  <p className="text-gray-900 font-semibold">{submission.event_name}</p>
                </div>
              )}
              {submission.event_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Event Date</p>
                  <p className="text-gray-900 font-semibold">{new Date(submission.event_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Consent & Legal */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Permissions & Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {submission.consent_confirmed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={submission.consent_confirmed ? 'text-green-800' : 'text-red-800'}>
                  {submission.consent_confirmed ? '✓ Consent Confirmed' : '✗ No Consent'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {submission.legal_acknowledged ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={submission.legal_acknowledged ? 'text-green-800' : 'text-red-800'}>
                  {submission.legal_acknowledged ? '✓ Legal Acknowledged' : '✗ Legal Not Acknowledged'}
                </span>
              </div>
            </div>
          </div>

          {/* Moderation Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Moderation Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => updateStatus('approved')}
                disabled={updatingStatus}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" /> Approve Submission
              </button>
              <button
                onClick={() => updateStatus('rejected')}
                disabled={updatingStatus}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Reject Submission
              </button>
              <button
                onClick={() => updateStatus('under_review')}
                disabled={updatingStatus}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Mark Under Review
              </button>
              <button
                onClick={() => updateStatus('archived')}
                disabled={updatingStatus}
                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Media Files</h3>
          {mediaFiles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {mediaFiles.map((url, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  {url.match(/\.(mp4|mov|avi)$/i) ? (
                    <div className="w-full h-40 bg-gray-900 rounded-lg flex items-center justify-center mb-3">
                      <p className="text-gray-400 text-sm">Video Preview</p>
                    </div>
                  ) : (
                    <img src={url} alt={`Media ${idx + 1}`} className="w-full h-40 object-cover rounded-lg mb-3" />
                  )}
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                    View Full Size →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No media files</p>
          )}
        </div>
      )}

      {/* AI Drafts Tab */}
      {activeTab === 'ai-drafts' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" /> AI Content Generation
            </h3>
            <p className="text-gray-600 text-sm mb-4">Generate AI-assisted content from this submission</p>
            <div className="grid md:grid-cols-2 gap-4">
              <button onClick={() => createAIJob('story_generation')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-sm">
                Generate Story
              </button>
              <button onClick={() => createAIJob('caption_generation')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-sm">
                Generate Captions
              </button>
              <button onClick={() => createAIJob('headline')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-sm">
                Generate Headlines
              </button>
              <button onClick={() => createAIJob('video_script')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-sm">
                Generate Video Script
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-sm text-blue-800">AI jobs will be processed asynchronously. You'll see drafts in the AI Lab once they're completed.</p>
          </div>
        </div>
      )}

      {/* Assignment Tab */}
      {activeTab === 'assignment' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Project Assignment</h3>
          {submission.assigned_project_id ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">Assigned to Project</p>
              <p className="text-green-700 text-sm">Project ID: {submission.assigned_project_id}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Assign this submission to a video project</p>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select a project...</option>
              </select>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
                Assign to Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Activity Log</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold">Submission Created</p>
              <p className="text-gray-600">{new Date(submission.created_date).toLocaleString()}</p>
            </div>
            {submission.reviewed_at && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">Last Reviewed</p>
                <p className="text-gray-600">{new Date(submission.reviewed_at).toLocaleString()}</p>
                <p className="text-gray-600">By: {submission.reviewed_by || 'Unknown'}</p>
              </div>
            )}
            {submission.moderation_notes && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900">Moderation Notes</p>
                <p className="text-blue-800">{submission.moderation_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}