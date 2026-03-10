import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail, School, Award, Loader2, ArrowLeft } from 'lucide-react';

export default function SchoolStudentProfile() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = searchParams.get('school') || 'hampton-dumont';

  const [student, setStudent] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // Load full student record
        const students = await base44.entities.StudentUsers.filter({
          id: session.student_user_id,
        });

        if (students?.length > 0) {
          setStudent(students[0]);
        }

        // Load school info
        const schools = await base44.entities.SchoolBranding.filter({
          school_slug: schoolSlug,
        });

        if (schools?.length > 0) {
          setSchool(schools[0]);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        localStorage.removeItem('studentSession');
        navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [schoolSlug, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">Unable to load profile</p>
          <Button onClick={() => navigate(`${createPageUrl('SchoolStudentDashboard')}?school=${schoolSlug}`)} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(`${createPageUrl('SchoolStudentDashboard')}?school=${schoolSlug}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{student.full_name}</h2>
              <p className="text-gray-600">{student.role || 'Student'}</p>
              {student.is_active ? (
                <p className="text-sm text-green-600 font-semibold mt-1">✓ Account Active</p>
              ) : (
                <p className="text-sm text-red-600 font-semibold mt-1">Account Inactive</p>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-600">Email</p>
              </div>
              <p className="text-gray-900">{student.email}</p>
            </div>

            {/* School */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <School className="h-4 w-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-600">School</p>
              </div>
              <p className="text-gray-900">{school?.school_name || schoolSlug}</p>
            </div>

            {/* Grade */}
            {student.grade && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-600">Grade</p>
                </div>
                <p className="text-gray-900 capitalize">{student.grade}</p>
              </div>
            )}

            {/* Team/Club */}
            {student.team_or_club && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-600">Team / Club</p>
                </div>
                <p className="text-gray-900">{student.team_or_club}</p>
              </div>
            )}
          </div>

          {/* Upload Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Upload Access:</span>{' '}
              {student.can_upload ? (
                <span className="text-green-600 font-semibold">✓ Enabled</span>
              ) : (
                <span className="text-red-600 font-semibold">✗ Disabled</span>
              )}
            </p>
            {student.suspended_until && new Date(student.suspended_until) > new Date() && (
              <p className="text-sm text-orange-900 mt-2">
                <span className="font-semibold">Suspension until:</span> {new Date(student.suspended_until).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Last Login */}
          {student.last_login_at && (
            <div className="text-xs text-gray-500 text-center">
              Last login: {new Date(student.last_login_at).toLocaleString()}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={() => navigate(`${createPageUrl('SchoolStudentDashboard')}?school=${schoolSlug}`)}
            className="w-full"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate(`${createPageUrl('SchoolStudentUploads')}?school=${schoolSlug}`)}
            variant="outline"
            className="w-full"
          >
            View My Uploads
          </Button>
        </div>
      </div>
    </div>
  );
}