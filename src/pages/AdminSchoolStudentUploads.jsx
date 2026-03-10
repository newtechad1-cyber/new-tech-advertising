import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X, AlertCircle, Loader2, Eye } from 'lucide-react';

const STATUS_COLORS = {
  submitted: 'bg-gray-100 text-gray-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  needs_changes: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  published: 'bg-green-200 text-green-900',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminSchoolStudentUploads() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('school') || 'hampton-dumont';

  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [moderating, setModerating] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    student: 'all',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load uploads
        const uploadsData = await base44.entities.StudentUploads.filter({
          school_slug: schoolSlug,
        }, '-created_date', 200);
        setUploads(uploadsData || []);

        // Load students
        const studentsData = await base44.entities.StudentUsers.filter({
          school_slug: schoolSlug,
        });
        const studentMap = {};
        (studentsData || []).forEach(s => {
          studentMap[s.id] = s;
        });
        setStudents(studentMap);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [schoolSlug]);

  // Apply filters
  useEffect(() => {
    let result = uploads;

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(u =>
        u.title.toLowerCase().includes(q) ||
        u.student_name.toLowerCase().includes(q) ||
        u.description?.toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(u => u.status === filters.status);
    }

    if (filters.student !== 'all') {
      result = result.filter(u => u.student_user_id === filters.student);
    }

    setFilteredUploads(result);
  }, [uploads, filters]);

  const handleApprove = async (uploadId) => {
    setModerating(true);
    try {
      const uploadToApprove = uploads.find(u => u.id === uploadId);

      // MODERATION SAFETY: If upload was flagged, require explicit safe marking
      if (uploadToApprove.moderation_status === 'flagged' || uploadToApprove.moderation_status === 'requires_review') {
        const confirm = window.confirm(
          `This upload has moderation status '${uploadToApprove.moderation_status}'.\n\nApproving will mark it as 'safe' and allow use in downstream workflows.\n\nContinue?`
        );
        if (!confirm) {
          setModerating(false);
          return;
        }
      }

      await base44.entities.StudentUploads.update(uploadId, {
        status: 'approved',
        moderation_status: 'safe',
        reviewed_by: 'admin',
        reviewed_at: new Date().toISOString(),
      });
      setUploads(uploads.map(u => u.id === uploadId ? { ...u, status: 'approved', moderation_status: 'safe' } : u));
      setSelectedUpload(null);
    } catch (err) {
      console.error('Error approving:', err);
      alert('Error approving upload');
    } finally {
      setModerating(false);
    }
  };

  const handleReject = async (uploadId, reason) => {
    setModerating(true);
    try {
      await base44.entities.StudentUploads.update(uploadId, {
        status: 'rejected',
        rejection_reason: reason,
        reviewed_by: 'admin',
        reviewed_at: new Date().toISOString(),
      });
      setUploads(uploads.map(u => u.id === uploadId ? { ...u, status: 'rejected' } : u));
      setSelectedUpload(null);
    } catch (err) {
      console.error('Error rejecting:', err);
    } finally {
      setModerating(false);
    }
  };

  const studentOptions = [{ id: 'all', name: 'All Students' }, ...Object.values(students)];

  if (loading) {
    return (
      <AdminLayout currentPageName="AdminSchoolStudentUploads">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  const content = (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Uploads</h1>
        <p className="text-gray-600 mt-1">Review and moderate student-submitted content</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Title, student name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="needs_changes">Needs Changes</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Student */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student</label>
            <select
              value={filters.student}
              onChange={(e) => setFilters({ ...filters, student: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {studentOptions.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name || 'All Students'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Uploads Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUploads.map((upload) => (
              <tr key={upload.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{upload.student_name}</p>
                    <p className="text-xs text-gray-500">{students[upload.student_user_id]?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{upload.title}</p>
                  {upload.moderation_status === 'flagged' && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Flagged for review
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{upload.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[upload.status]}`}>
                    {upload.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(upload.created_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUpload(upload)}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUploads.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No uploads found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{selectedUpload.title}</h2>
              <button
                onClick={() => setSelectedUpload(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Student</p>
                <p className="text-gray-900">{selectedUpload.student_name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 font-semibold">Description</p>
                <p className="text-gray-900">{selectedUpload.description || '—'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Category</p>
                  <p className="text-gray-900 capitalize">{selectedUpload.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Type</p>
                  <p className="text-gray-900 capitalize">{selectedUpload.upload_type}</p>
                </div>
              </div>

              {selectedUpload.file_urls && (
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">File</p>
                  {JSON.parse(selectedUpload.file_urls).map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block"
                    >
                      Preview File {idx + 1}
                    </a>
                  ))}
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 font-semibold mb-2">Moderation</p>
                <p className="text-sm text-gray-700">
                  Status: <span className="font-semibold capitalize">{selectedUpload.moderation_status}</span>
                </p>
                {selectedUpload.moderation_notes && (
                  <p className="text-sm text-gray-700 mt-1">{selectedUpload.moderation_notes}</p>
                )}
              </div>

              {selectedUpload.admin_notes && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Admin Notes:</span> {selectedUpload.admin_notes}
                  </p>
                </div>
              )}

              {(selectedUpload.status === 'submitted' || selectedUpload.status === 'under_review') && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleApprove(selectedUpload.id)}
                    disabled={moderating}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    {moderating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      if (reason) handleReject(selectedUpload.id, reason);
                    }}
                    disabled={moderating}
                    variant="destructive"
                    className="flex-1 gap-2"
                  >
                    {moderating ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return <AdminLayout currentPageName="AdminSchoolStudentUploads">{content}</AdminLayout>;
}