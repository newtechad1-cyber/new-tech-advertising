import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, FileText, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';

export default function SchoolStudentDashboard() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = searchParams.get('school') || 'hampton-dumont';

  const [student, setStudent] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [schoolBranding, setSchoolBranding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionStr = localStorage.getItem('studentSession');
    if (!sessionStr) {
      navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
      return;
    }

    const loadData = async () => {
      try {
        const session = JSON.parse(sessionStr);

        // Verify student still exists and is active
        const students = await base44.entities.StudentUsers.filter({
          id: session.student_user_id,
          is_active: true,
        });

        if (!students || students.length === 0) {
          throw new Error('Account no longer active');
        }

        const studentData = students[0];
        setStudent(studentData);

        // Load uploads
        const studentUploads = await base44.entities.StudentUploads.filter({
          student_user_id: session.student_user_id,
          school_slug: schoolSlug,
        }, '-created_date', 50);
        setUploads(studentUploads || []);

        // Load school branding
        const brandData = await base44.entities.SchoolBranding.filter({
          school_slug: schoolSlug,
        });
        if (brandData?.length > 0) setSchoolBranding(brandData[0]);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [schoolSlug, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentSession');
    navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
  };

  const handleNewUpload = () => {
    navigate(`${createPageUrl('SchoolStudentUploadNew')}?school=${schoolSlug}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'needs_changes':
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Session expired</p>
          <Button onClick={() => navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`)} className="mt-4">
            Sign In Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {student.full_name}!
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {schoolBranding?.school_name || 'School Portal'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Share Your Content</h2>
              <p className="text-blue-100">Upload videos, photos, or documents for your school</p>
            </div>
            <Button
              onClick={handleNewUpload}
              className="bg-white text-blue-600 hover:bg-gray-100 gap-2"
            >
              <Plus className="h-5 w-5" />
              New Upload
            </Button>
          </div>
        </div>

        {/* Recent Uploads Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Your Uploads
          </h3>

          {uploads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold mb-2">No uploads yet</p>
              <p className="text-sm mb-4">Click the button above to share your first content</p>
              <Button onClick={handleNewUpload} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Upload
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{upload.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{upload.description}</p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {upload.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(upload.created_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(upload.status)}`}>
                        {getStatusIcon(upload.status)}
                        {upload.status.replace(/_/g, ' ')}
                      </div>
                      {upload.admin_notes && (
                        <p className="text-xs text-gray-600 text-right max-w-xs">
                          {upload.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
            <h4 className="font-semibold text-gray-900 mb-2">📋 Total Uploads</h4>
            <p className="text-3xl font-bold text-blue-600">{uploads.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
            <h4 className="font-semibold text-gray-900 mb-2">✓ Approved</h4>
            <p className="text-3xl font-bold text-green-600">
              {uploads.filter(u => u.status === 'approved' || u.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-yellow-500">
            <h4 className="font-semibold text-gray-900 mb-2">⏳ Pending Review</h4>
            <p className="text-3xl font-bold text-yellow-600">
              {uploads.filter(u => u.status === 'submitted' || u.status === 'under_review').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}