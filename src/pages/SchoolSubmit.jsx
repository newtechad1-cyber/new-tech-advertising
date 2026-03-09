import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PublicShell from '@/components/school-tv/PublicShell';
import { Upload, Check } from 'lucide-react';

const ACTIVITY_TYPES = [
  'sports', 'classroom', 'arts', 'music', 'clubs', 'event', 'student_life', 'academic', 'other'
];

const CONTRIBUTOR_ROLES = [
  'student', 'teacher', 'coach', 'staff', 'parent', 'other'
];

export default function SchoolSubmit() {
  const { schoolSlug } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    submission_title: '',
    contributor_name: '',
    contributor_email: '',
    contributor_role: 'student',
    school: schoolSlug,
    grade_level: '',
    activity_type: 'student_life',
    team_or_group: '',
    event_name: '',
    event_date: '',
    description: '',
    upload_type: 'video_only',
    consent_confirmed: false,
    legal_acknowledgement: false,
  });
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent_confirmed || !formData.legal_acknowledged) {
      alert('Please confirm consent and legal acknowledgement');
      return;
    }

    setLoading(true);
    try {
      // Upload files if present
      let mediaUrls = [];
      if (files.length > 0) {
        for (const file of files) {
          try {
            const result = await base44.integrations.Core.UploadFile({ file });
            mediaUrls.push(result.file_url);
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }
      }

      // Create submission in SchoolSubmissions entity
       const submissionData = {
         school: schoolSlug,
         submission_title: formData.submission_title,
         contributor_name: formData.contributor_name,
         contributor_email: formData.contributor_email,
         contributor_role: formData.contributor_role,
         activity_type: formData.activity_type,
         team_or_group: formData.team_or_group,
         event_name: formData.event_name,
         event_date: formData.event_date,
         description: formData.description,
         upload_type: formData.upload_type,
         grade_level: formData.grade_level,
         consent_confirmed: formData.consent_confirmed,
         legal_acknowledgement: formData.legal_acknowledgement,
         status: 'pending',
       };

       // Separate video and photo files
       if (mediaUrls.length > 0) {
         const videoFiles = [];
         const photoFiles = [];
         mediaUrls.forEach(url => {
           if (url.match(/\.(mp4|mov|avi|webm)$/i)) {
             videoFiles.push(url);
           } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
             photoFiles.push(url);
           }
         });
         if (videoFiles.length > 0) submissionData.video_files = JSON.stringify(videoFiles);
         if (photoFiles.length > 0) submissionData.photo_files = JSON.stringify(photoFiles);
         if (videoFiles.length > 0) submissionData.thumbnail = videoFiles[0]; // Set first video as thumbnail placeholder
       }

       await base44.entities.SchoolSubmissions.create(submissionData);

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting your content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PublicShell currentPath="submit">
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="bg-green-50 rounded-lg p-12 border-2 border-green-200">
            <Check className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-green-900 mb-4">Thank You!</h2>
            <p className="text-green-800 text-lg mb-4">Your submission has been received.</p>
            <p className="text-green-700">Our team will review your content and publish it soon. Check back to see your story featured!</p>
          </div>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell currentPath="submit">
      <div className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Share Your Story</h1>
          <p className="text-gray-700 text-lg">Submit your videos, photos, and memories to be featured</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-12">
        {/* About You */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">About You</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="contributor_name"
              placeholder="Your Name"
              value={formData.contributor_name}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="contributor_email"
              placeholder="Your Email"
              value={formData.contributor_email}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="contributor_role"
              value={formData.contributor_role}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CONTRIBUTOR_ROLES.map(role => (
                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
              ))}
            </select>
            <input
              type="text"
              name="grade_level"
              placeholder="Grade Level (optional)"
              value={formData.grade_level}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Content Details</h2>
          <div className="space-y-6">
            <input
              type="text"
              name="submission_title"
              placeholder="Title of Your Submission"
              value={formData.submission_title}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <select
                name="upload_type"
                value={formData.upload_type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="video_only">Video Only</option>
                <option value="photos_only">Photos Only</option>
                <option value="mixed_media">Mixed Media</option>
              </select>

              <select
                name="activity_type"
                value={formData.activity_type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ACTIVITY_TYPES.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="team_or_group"
                placeholder="Team or Group (optional)"
                value={formData.team_or_group}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="event_name"
                placeholder="Event Name (optional)"
                value={formData.event_name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="description"
              placeholder="Describe your submission..."
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload Files</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="text-blue-600 font-semibold hover:underline">Click to upload</span> or drag and drop
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="video/*,image/*"
              />
            </label>
            <p className="text-gray-500 text-sm mt-2">MP4, MOV, JPG, PNG up to 500MB</p>
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">{files.length} file(s) selected:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {files.map((file, idx) => (
                    <li key={idx}>✓ {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Consent & Legal */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Permissions & Acknowledgments</h2>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consent_confirmed"
                checked={formData.consent_confirmed}
                onChange={handleInputChange}
                required
                className="mt-1 w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">I confirm that I have obtained consent from all persons in this submission to share their image and information</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="legal_acknowledged"
                checked={formData.legal_acknowledged}
                onChange={handleInputChange}
                required
                className="mt-1 w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">I acknowledge that submitted content must be school-appropriate and I grant the school permission to use this content on their platforms</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-12 rounded-lg transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Content'}
          </button>
        </div>
      </form>
    </PublicShell>
  );
}