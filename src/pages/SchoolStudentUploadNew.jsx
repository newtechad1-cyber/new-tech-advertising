import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Upload, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const MAX_FILE_SIZE_MB = 500;
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav'];

export default function SchoolStudentUploadNew() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = searchParams.get('school') || 'hampton-dumont';

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'student_life',
    consent: false,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    const sessionStr = localStorage.getItem('studentSession');
    if (!sessionStr) {
      navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
      return;
    }

    const loadStudent = async () => {
      try {
        const session = JSON.parse(sessionStr);
        const students = await base44.entities.StudentUsers.filter({
          id: session.student_user_id,
          is_active: true,
        });

        if (!students || students.length === 0 || !students[0].can_upload) {
          throw new Error('Upload access not available');
        }

        setStudent(students[0]);
      } catch (err) {
        console.error('Error loading student:', err);
        navigate(`${createPageUrl('SchoolStudentLogin')}?school=${schoolSlug}`);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [schoolSlug, navigate]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('File type not supported. Please upload video, photo, or audio files.');
      setSelectedFile(null);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      if (!selectedFile) throw new Error('Please select a file');
      if (!formData.title.trim()) throw new Error('Title is required');
      if (!formData.consent) throw new Error('You must confirm consent');

      const session = JSON.parse(localStorage.getItem('studentSession') || '{}');

      // Upload file
      const uploadRes = await base44.integrations.Core.UploadFile({
        file: selectedFile,
      });

      if (!uploadRes?.file_url) throw new Error('File upload failed');

      // Create upload record with student identity
      const upload = await base44.entities.StudentUploads.create({
        student_user_id: session.student_user_id,
        student_name: student.full_name,
        school_slug: schoolSlug,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        file_urls: JSON.stringify([uploadRes.file_url]),
        upload_type: selectedFile.type.includes('video') ? 'video' : 
                     selectedFile.type.includes('audio') ? 'audio' : 'photo',
        file_size_total_mb: selectedFile.size / (1024 * 1024),
        status: 'submitted',
        moderation_status: 'pending',
        consent_confirmed: true,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`${createPageUrl('SchoolStudentDashboard')}?school=${schoolSlug}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
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
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your content has been submitted for review. Your school's administrators will review it shortly.
          </p>
          <Button onClick={() => navigate(`${createPageUrl('SchoolStudentDashboard')}?school=${schoolSlug}`)}>
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
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(`${createPageUrl('SchoolStudentDashboard')}?school=${schoolSlug}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
          <p className="text-gray-600 mt-1">Submit video, photos, or audio for your school</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Student Identity Badge */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Uploading as:</span> {student.full_name}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              All uploads are recorded under your name for accountability and moderation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Errors */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <Input
                type="text"
                placeholder="e.g., Game Highlights, Classroom Project, Performance"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={uploading}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Tell us more about this content..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={uploading}
                maxLength={500}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sports">Sports</option>
                <option value="classroom">Classroom</option>
                <option value="arts">Arts</option>
                <option value="music">Music</option>
                <option value="clubs">Clubs</option>
                <option value="student_life">Student Life</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="video/*,image/*,audio/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  {selectedFile ? (
                    <>
                      <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)}MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900">Click to upload</p>
                      <p className="text-sm text-gray-600 mt-1">
                        MP4, MOV, JPG, PNG, GIF, MP3, WAV (max {MAX_FILE_SIZE_MB}MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
              {fileError && (
                <p className="text-sm text-red-600 mt-2">{fileError}</p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  disabled={uploading}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  I confirm that I have permission to share this content and that it complies with school policies. I understand it will be reviewed before publishing.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={uploading || !selectedFile || !formData.title.trim() || !formData.consent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Submit Upload
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}