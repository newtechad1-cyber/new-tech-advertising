import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function SchoolStudentLogin() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('school') || 'hampton-dumont';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    const loadSchoolName = async () => {
      try {
        const schools = await base44.entities.SchoolBranding.filter({ school_slug: schoolSlug });
        if (schools?.length > 0) setSchoolName(schools[0].school_name);
      } catch (err) {
        console.error('Error loading school:', err);
      }
    };
    loadSchoolName();
  }, [schoolSlug]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.trim() || !accessCode.trim()) {
        throw new Error('Email and access code are required');
      }

      // Call backend validator - this enforces all security checks server-side
      const response = await base44.functions.invoke('studentLoginValidator', {
        school_slug: schoolSlug,
        email: email.toLowerCase().trim(),
        access_code: accessCode.trim(),
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Login failed');
      }

      const session = response.data.session;

      // Store session token (localStorage is now just a convenience layer)
      // The backend validates this on every API call
      localStorage.setItem('studentSession', JSON.stringify({
        student_user_id: session.student_user_id,
        student_name: session.student_name,
        email: session.email,
        school_slug: schoolSlug,
        session_token: session.session_token,
        login_at: new Date().toISOString(),
      }));

      // Redirect to dashboard
      navigate(`${createPageUrl('SchoolStudentDashboard')}?school=${schoolSlug}`);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {/* Logo/School Name */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {schoolName || 'School Portal'}
          </h1>
          <p className="text-gray-600">Student Content Upload</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              School Email
            </label>
            <Input
              type="email"
              placeholder="student@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Access Code Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Access Code
            </label>
            <Input
              type="text"
              placeholder="Enter your access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={loading}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask your teacher or administrator for your access code
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !email.trim() || !accessCode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Need help? Contact your school administrator
          </p>
        </div>
      </div>
    </div>
  );
}