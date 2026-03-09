import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { Plus, Search, AlertCircle, CheckCircle2, Eye } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  archived: 'bg-gray-100 text-gray-800',
  assigned_to_project: 'bg-purple-100 text-purple-800',
};

const AI_STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AdminSubmissionsList() {
  const { schoolSlug } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedActivityType, setSelectedActivityType] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedAIStatus, setSelectedAIStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.StudentVideoSubmissions.filter({
          school_slug: schoolSlug,
        });
        setSubmissions(data.sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date)));
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = submissions;
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }
    if (selectedActivityType !== 'all') {
      filtered = filtered.filter(s => s.activity_type === selectedActivityType);
    }
    if (selectedRole !== 'all') {
      filtered = filtered.filter(s => s.contributor_role === selectedRole);
    }
    if (selectedAIStatus !== 'all') {
      filtered = filtered.filter(s => 
        selectedAIStatus === 'flagged' ? s.ai_safety_flagged : 
        !s.ai_safety_flagged
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.submission_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contributor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSubmissions(filtered);
  }, [submissions, selectedStatus, selectedActivityType, selectedRole, selectedAIStatus, searchTerm]);

  const getFileCount = (submission) => {
    if (!submission.media_urls) return 0;
    try {
      return JSON.parse(submission.media_urls).length;
    } catch {
      return 0;
    }
  };

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Submissions</h1>
          <p className="text-gray-600">Review and moderate student submissions</p>
        </div>
        <Link
          to={`/admin/schools/${schoolSlug}/submissions/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> New Submission
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
        {/* Search & Status Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Title, contributor, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="assigned_to_project">Assigned to Project</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Activity Type & Role Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Type</label>
            <select
              value={selectedActivityType}
              onChange={(e) => setSelectedActivityType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="sports">Sports</option>
              <option value="classroom">Classroom</option>
              <option value="arts">Arts</option>
              <option value="music">Music</option>
              <option value="clubs">Clubs</option>
              <option value="event">Event</option>
              <option value="student_life">Student Life</option>
              <option value="academic">Academic</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contributor Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="coach">Coach</option>
              <option value="staff">Staff</option>
              <option value="parent">Parent</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* AI & Media Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">AI Status</label>
            <select
              value={selectedAIStatus}
              onChange={(e) => setSelectedAIStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="safe">AI Approved</option>
              <option value="flagged">AI Flagged</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Clear Filters</label>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedActivityType('all');
                setSelectedRole('all');
                setSelectedAIStatus('all');
                setSearchTerm('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contributor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Files</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AI</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">{submission.submission_title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{submission.contributor_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{submission.activity_type}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[submission.status] || 'bg-gray-100 text-gray-800'}`}>
                        {submission.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                      {getFileCount(submission)} file{getFileCount(submission) !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {submission.ai_safety_flagged ? (
                        <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${AI_STATUS_COLORS.failed}`}>
                          <AlertCircle className="h-3 w-3" /> Flagged
                        </span>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${AI_STATUS_COLORS.completed}`}>
                          <CheckCircle2 className="h-3 w-3" /> Safe
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        to={`/admin/schools/${schoolSlug}/submissions/${submission.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" /> Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No submissions found</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}