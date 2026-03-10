import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, AlertCircle, LogOut, Filter, Loader2 } from 'lucide-react';

export default function SchoolStudentUploads() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = searchParams.get('school') || 'hampton-dumont';

  const [student, setStudent] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionStr = localStorage.getItem('studentSession');
        if (!sessionStr) {
          navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
          return;
        }

        const session = JSON.parse(sessionStr);

        // Validate session token against server-side record
        const validation = await base44.functions.invoke('validateStudentSessionSecure', {
          student_user_id: session.student_user_id,
          school_slug: schoolSlug,
          session_token: session.session_token,
        });

        if (!validation.data?.valid) {
          throw new Error('Session invalid');
        }

        setStudent(validation.data.student);

        // Load only this student's uploads (backend scoped)
        const studentUploads = await base44.entities.StudentUploads.filter({
          student_user_id: session.student_user_id,
          school_slug: schoolSlug,
        }, '-created_date', 100);

        setUploads(studentUploads || []);
      } catch (err) {
        console.error('Error loading uploads:', err);
        localStorage.removeItem('studentSession');
        navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [schoolSlug, navigate]);

  useEffect(() => {
    let result = uploads;
    if (statusFilter !== 'all') {
      result = result.filter(u => u.status === statusFilter);
    }
    setFilteredUploads(result);
  }, [uploads, statusFilter]);

  const handleLogout = async () => {
    try {
      const sessionStr = localStorage.getItem('studentSession');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        // Revoke server-side session
        await base44.functions.invoke('studentLogout', {
          student_user_id: session.student_user_id,
          school_slug: schoolSlug,
          session_token: session.session_token,
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear browser session regardless
      localStorage.removeItem('studentSession');
      navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'needs_changes':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
      case 'under_review':
        return <Clock className="h-4 w-4" />;
      case 'approved':
      case 'published':
        return <CheckCircle className="h-4 w-4" />;
      case 'needs_changes':
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Uploads</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter */}
        <div className="bg-white rounded-lg p-4 mb-6 flex items-center gap-4">
          <Filter className="h-4 w-4 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Uploads</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="needs_changes">Needs Changes</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Uploads List */}
        {filteredUploads.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">No uploads yet</p>
            <Button
              onClick={() => navigate(`${createPageUrl('SchoolStudentUploadNew')}?school=${schoolSlug}`)}
              className="mt-4"
            >
              Create Your First Upload
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUploads.map((upload) => (
              <div key={upload.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{upload.title}</h3>
                    {upload.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{upload.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                        {upload.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {upload.upload_type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(upload.created_date).toLocaleDateString()}
                      </span>
                      {upload.file_size_total_mb && (
                        <span className="text-xs text-gray-400">
                          {upload.file_size_total_mb.toFixed(1)}MB
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(upload.status)}`}>
                      {getStatusIcon(upload.status)}
                      {upload.status.replace(/_/g, ' ')}
                    </div>
                    {upload.admin_notes && (
                      <div className="bg-blue-50 rounded p-2 max-w-xs">
                        <p className="text-xs text-blue-900">{upload.admin_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}