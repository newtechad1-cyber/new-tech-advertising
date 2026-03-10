import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import AdminShell from '@/components/school-tv/AdminShell';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export default function AdminCreateProject() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const [step, setStep] = useState(1);
  const [project, setProject] = useState({
    school_slug: schoolSlug,
    title: '',
    project_type: 'weekly_recap',
    status: 'draft',
    tone: 'warm',
    duration_target: '2-3 minutes',
    format_type: 'landscape',
    voiceover_enabled: true,
    captions_enabled: true,
    intro_enabled: true,
    outro_enabled: true,
    publish_to_gallery: true,
    publish_to_youtube: false,
  });
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [brandingProfiles, setBrandingProfiles] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [submissionsData, brandingData] = await Promise.all([
          base44.entities.StudentVideoSubmissions.filter({
            school_slug: schoolSlug,
            status: 'approved',
          }),
          base44.entities.SchoolBranding.filter({
            school_slug: schoolSlug,
          }),
        ]);
        setSubmissions(submissionsData);
        setBrandingProfiles(brandingData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [schoolSlug]);

  const createProject = async () => {
    setCreating(true);
    try {
      const newProject = await base44.entities.SchoolVideoProjects.create({
        ...project,
        description: project.title,
      });
      window.location.href = `${createPageUrl('AdminSchoolProjectDetail')}?id=${newProject.id}&schoolSlug=${schoolSlug}`;
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
      setCreating(false);
    }
  };

  const toggleSubmission = (submissionId) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Header */}
      <Link to={`${createPageUrl('AdminSchoolProjects')}?schoolSlug=${schoolSlug}`} className="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-2 font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Video Project</h1>

      {/* Step Indicator */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => setStep(s)}
                className={`h-10 w-10 rounded-full font-bold flex items-center justify-center transition-all ${
                  step === s
                    ? 'bg-blue-600 text-white'
                    : step > s
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </button>
              {s < 4 && <div className="w-12 h-1 mx-2 bg-gray-200"></div>}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs font-semibold text-gray-600">
          <span>Details</span>
          <span>Assets</span>
          <span>Branding</span>
          <span>Settings</span>
        </div>
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold mb-6">Project Details</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Week 12 Sports Recap"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Type</label>
              <select
                value={project.project_type}
                onChange={(e) => setProject({ ...project, project_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly_recap">Weekly Recap</option>
                <option value="sports_highlight">Sports Highlight</option>
                <option value="classroom_spotlight">Classroom Spotlight</option>
                <option value="event_recap">Event Recap</option>
                <option value="student_story">Student Story</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tone</label>
              <select
                value={project.tone}
                onChange={(e) => setProject({ ...project, tone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="warm">Warm</option>
                <option value="energetic">Energetic</option>
                <option value="proud">Proud</option>
                <option value="inspiring">Inspiring</option>
                <option value="documentary">Documentary</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration Target</label>
              <select
                value={project.duration_target}
                onChange={(e) => setProject({ ...project, duration_target: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1-2 minutes">1-2 minutes</option>
                <option value="2-3 minutes">2-3 minutes</option>
                <option value="3-5 minutes">3-5 minutes</option>
                <option value="5+ minutes">5+ minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
              <select
                value={project.format_type}
                onChange={(e) => setProject({ ...project, format_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="landscape">Landscape (16:9)</option>
                <option value="square">Square (1:1)</option>
                <option value="vertical">Vertical (9:16)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button disabled className="px-6 py-2 text-gray-400 font-semibold">
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!project.title}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Assets */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold mb-6">Select Submissions</h2>

          {submissions.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {submissions.map((sub) => (
                <label key={sub.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubmissions.includes(sub.id)}
                    onChange={() => toggleSubmission(sub.id)}
                    className="w-4 h-4 accent-blue-600 mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{sub.submission_title}</p>
                    <p className="text-xs text-gray-600">{sub.contributor_name}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No approved submissions available</p>
          )}

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Branding */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold mb-6">Branding & Publishing</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Branding Profile</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Default School Branding</option>
              {brandingProfiles.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.school_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-gray-900">Publishing Destinations</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={project.publish_to_gallery}
                onChange={(e) => setProject({ ...project, publish_to_gallery: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">Bulldog TV (Story Hub)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={project.publish_to_youtube}
                onChange={(e) => setProject({ ...project, publish_to_youtube: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">YouTube</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">Facebook</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700">Instagram</span>
            </label>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Settings */}
      {step === 4 && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold mb-6">Video Settings</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={project.voiceover_enabled}
                onChange={(e) => setProject({ ...project, voiceover_enabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700 font-semibold">Include Voiceover</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={project.captions_enabled}
                onChange={(e) => setProject({ ...project, captions_enabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700 font-semibold">Include Captions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={project.intro_enabled}
                onChange={(e) => setProject({ ...project, intro_enabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700 font-semibold">Include Intro</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={project.outro_enabled}
                onChange={(e) => setProject({ ...project, outro_enabled: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-gray-700 font-semibold">Include Outro</span>
            </label>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={createProject}
              disabled={creating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Save className="h-5 w-5" /> Create Project
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}