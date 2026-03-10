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
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminSchoolModeration() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('school') || 'hampton-dumont';

  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [moderating, setModerating] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    status: 'submitted',
    category: 'all',
  });

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const data = await base44.entities.StudentUploads.filter({
          school_slug: schoolSlug,
        }, '-created_date', 200);
        setUploads(data || []);
      } catch (err) {
        console.error('Error loading uploads:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUploads();
  }, [schoolSlug]);

  useEffect(() => {
    let result = uploads;

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(u =>
        u.title.toLowerCase().includes(q) ||
        u.student_name.toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(u => u.status === filters.status);
    }

    if (filters.category !== 'all') {
      result = result.filter(u => u.category === filters.category);
    }

    setFilteredUploads(result);
  }, [uploads, filters]);

  const handleApprove = async (uploadId) => {
    setModerating(true);
    try {
      await base44.entities.StudentUploads.update(uploadId, {
        status: 'approved',
        moderation_status: 'safe',
        reviewed_by: 'admin',
        reviewed_at: new Date().toISOString(),
      });
      setUploads(uploads.map(u => u.id === uploadId ? { ...u, status: 'approved' } : u));
      setSelectedUpload(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setModerating(false);
    }
  };

  const handleReject = async (uploadId) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setModerating(true);
    try {
      await base44.entities.StudentUploads.update(uploadId, {
        status: 'rejected',
        rejection_reason: rejectReason,
        reviewed_by: 'admin',
        reviewed_at: new Date().toISOString(),
      });
      setUploads(uploads.map(u => u.id === uploadId ? { ...u, status: 'rejected' } : u));
      setSelectedUpload(null);
      setRejectReason('');
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setModerating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout currentPageName="AdminSchoolModeration">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  const content = (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Moderation Center</h1>
        <p className="text-gray-600 mt-1">Review and moderate student uploads</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Title or student name..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="sports">Sports</option>
            <option value="classroom">Classroom</option>
            <option value="arts">Arts</option>
            <option value="music">Music</option>
            <option value="clubs">Clubs</option>
            <option value="student_life">Student Life</option>
            <option value="event">Event</option>
          </select>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-yellow-900 font-semibold">Awaiting Review</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {uploads.filter(u => u.status === 'submitted').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-900 font-semibold">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {uploads.filter(u => u.status === 'approved').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-900 font-semibold">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {uploads.filter(u => u.status === 'rejected').length}
          </p>
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Moderation</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUploads.map((upload) => (
              <tr key={upload.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{upload.student_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{upload.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{upload.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[upload.status]}`}>
                    {upload.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {upload.moderation_status === 'flagged' && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs font-semibold">Flagged</span>
                    </div>
                  )}
                  {upload.moderation_status === 'safe' && (
                    <span className="text-xs text-green-600">Safe</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUpload(upload)}
                    className="gap-1"
                  >
                    <Eye className="h-3 w-3" />
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{selectedUpload.title}</h2>
              <button onClick={() => setSelectedUpload(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Student</p>
                <p className="text-gray-900">{selectedUpload.student_name}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">Description</p>
                <p className="text-gray-900">{selectedUpload.description || '—'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Category</p>
                  <p className="text-gray-900 capitalize">{selectedUpload.category}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Type</p>
                  <p className="text-gray-900 capitalize">{selectedUpload.upload_type}</p>
                </div>
              </div>

              {selectedUpload.file_urls && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">File</p>
                  {JSON.parse(selectedUpload.file_urls).map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      Preview File {idx + 1}
                    </a>
                  ))}
                </div>
              )}

              {(selectedUpload.status === 'submitted' || selectedUpload.status === 'under_review') && (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Button
                    onClick={() => handleApprove(selectedUpload.id)}
                    disabled={moderating}
                    className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    {moderating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Approve
                  </Button>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rejection Reason</label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Why is this being rejected?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => handleReject(selectedUpload.id)}
                    disabled={moderating || !rejectReason.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
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

  return <AdminLayout currentPageName="AdminSchoolModeration">{content}</AdminLayout>;
}