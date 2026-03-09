import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useSchoolBranding } from '@/components/school-tv/useSchoolBranding';
import SchoolTVHeader from '@/components/school-tv/SchoolTVHeader';
import { Upload, CheckCircle, Camera, Video, Users, Music, Trophy, BookOpen, Star } from 'lucide-react';

const ACTIVITY_TYPES = [
  { value: 'sports', label: 'Sports & Athletics', icon: Trophy },
  { value: 'classroom', label: 'Classroom Moments', icon: BookOpen },
  { value: 'arts', label: 'Arts & Drama', icon: Star },
  { value: 'music', label: 'Band & Music', icon: Music },
  { value: 'clubs', label: 'Clubs & Activities', icon: Users },
  { value: 'student_life', label: 'Student Life', icon: Camera },
  { value: 'event', label: 'School Events', icon: Star },
  { value: 'other', label: 'Other', icon: Upload },
];

const ROLES = ['student','teacher','coach','staff','parent','other'];

export default function BulldogTVSubmit() {
  const { branding, loading } = useSchoolBranding();
  const [form, setForm] = useState({ submission_title: '', contributor_name: '', contributor_email: '', contributor_role: 'student', school: '', grade_level: '', activity_type: '', event_name: '', description: '', upload_type: 'video_only', consent_confirmed: false, legal_acknowledgement: false });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFiles = (incoming) => {
    setFiles(prev => [...prev, ...Array.from(incoming)]);
    const hasVideo = Array.from(incoming).some(f => f.type.startsWith('video/'));
    const hasPhoto = Array.from(incoming).some(f => f.type.startsWith('image/'));
    const hasVid = files.some(f => f.type.startsWith('video/')) || hasVideo;
    const hasPho = files.some(f => f.type.startsWith('image/')) || hasPhoto;
    if (hasVid && hasPho) set('upload_type', 'mixed_media');
    else if (hasVid) set('upload_type', 'video_only');
    else if (hasPho) set('upload_type', 'photos_only');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent_confirmed || !form.legal_acknowledgement) return;
    setSubmitting(true);

    let videoUrls = [];
    let photoUrls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (file.type.startsWith('video/')) videoUrls.push(file_url);
      else photoUrls.push(file_url);
    }

    await base44.entities.SchoolSubmissions.create({
      ...form,
      video_files: JSON.stringify(videoUrls),
      photo_files: JSON.stringify(photoUrls),
      thumbnail: photoUrls[0] || null,
      status: 'pending',
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  if (submitted) return (
    <div className="min-h-screen bg-slate-50">
      <SchoolTVHeader branding={branding} />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Submission Received!</h1>
        <p className="text-slate-500 text-lg mb-2">Thank you, {form.contributor_name}!</p>
        <p className="text-slate-500">Your content has been sent to our media team for review. If approved, it may appear on {branding.network_name}.</p>
        <p className="text-slate-400 text-sm mt-4">Questions? {branding.contact_email}</p>
        <button onClick={() => { setSubmitted(false); setForm({ submission_title:'',contributor_name:'',contributor_email:'',contributor_role:'student',school:'',grade_level:'',activity_type:'',event_name:'',description:'',upload_type:'video_only',consent_confirmed:false,legal_acknowledgement:false }); setFiles([]); }} className="mt-8 px-6 py-2.5 rounded-xl font-semibold text-white" style={{ backgroundColor: branding.primary_color }}>Submit Another</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolTVHeader branding={branding} />
      <div style={{ backgroundColor: branding.primary_color }} className="py-12 px-4 text-center">
        <h1 className="text-4xl font-black text-white mb-2">{branding.public_submission_page_title || 'Share Your Story'}</h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">{branding.intro_text} — submit your clips and photos to be featured on {branding.network_name}.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: what to submit */}
          <div className="lg:col-span-1">
            <h2 className="font-bold text-slate-800 text-lg mb-4">What can I submit?</h2>
            <div className="space-y-3">
              {ACTIVITY_TYPES.map(({ value, label, icon: TypeIcon }) => (
                <div key={value} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                  <TypeIcon className="w-5 h-5 text-slate-500 shrink-0" />
                  <span className="text-sm text-slate-700 font-medium">{label}</span>
                </div>
              ))}
            </div>
            {branding.upload_instructions && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
                <strong className="block mb-1">Upload Tips</strong>
                {branding.upload_instructions}
              </div>
            )}
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-xl text-slate-900 mb-5">Submit Your Clip or Photos</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* File drop zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Tap to select files or drag & drop</p>
                  <p className="text-slate-400 text-sm mt-1">Videos (MP4, MOV) · Photos (JPG, PNG) · Multiple files OK</p>
                  {files.length > 0 && <p className="text-green-600 font-semibold mt-2">{files.length} file{files.length > 1 ? 's' : ''} selected</p>}
                  <input ref={fileRef} type="file" multiple accept="video/*,image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-slate-500 block mb-1">Your Name *</label><input required value={form.contributor_name} onChange={e => set('contributor_name', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" /></div>
                  <div><label className="text-xs font-semibold text-slate-500 block mb-1">Email</label><input type="email" value={form.contributor_email} onChange={e => set('contributor_email', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" /></div>
                  <div><label className="text-xs font-semibold text-slate-500 block mb-1">Role *</label><select value={form.contributor_role} onChange={e => set('contributor_role', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm capitalize focus:outline-none">{ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                  <div><label className="text-xs font-semibold text-slate-500 block mb-1">Grade Level</label><input value={form.grade_level} onChange={e => set('grade_level', e.target.value)} placeholder="e.g. 10th Grade" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" /></div>
                </div>

                <div><label className="text-xs font-semibold text-slate-500 block mb-1">Video / Photo Title *</label><input required value={form.submission_title} onChange={e => set('submission_title', e.target.value)} placeholder="e.g. Varsity Football vs. Aplington Game Highlights" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" /></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold text-slate-500 block mb-1">Category *</label>
                    <select required value={form.activity_type} onChange={e => set('activity_type', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                      <option value="">Select a category...</option>
                      {ACTIVITY_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs font-semibold text-slate-500 block mb-1">Event Name</label><input value={form.event_name} onChange={e => set('event_name', e.target.value)} placeholder="e.g. Homecoming 2025" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" /></div>
                </div>

                <div><label className="text-xs font-semibold text-slate-500 block mb-1">Tell us about your clip</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="What's happening in this video or photo?" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none" /></div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.consent_confirmed} onChange={e => set('consent_confirmed', e.target.checked)} className="mt-0.5" />
                    <span className="text-sm text-slate-700">I confirm I have permission to share this media and the people in it have given consent to appear in school media.</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.legal_acknowledgement} onChange={e => set('legal_acknowledgement', e.target.checked)} className="mt-0.5" />
                    <span className="text-sm text-slate-600">{branding.legal_release_text || 'I agree to the media use terms for this school district.'}</span>
                  </label>
                </div>

                <button type="submit" disabled={submitting || !form.consent_confirmed || !form.legal_acknowledgement || !form.submission_title || !form.contributor_name || files.length === 0}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-base disabled:opacity-40 transition-opacity" style={{ backgroundColor: branding.primary_color }}>
                  {submitting ? 'Uploading...' : 'Submit My Content'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ backgroundColor: branding.primary_color }} className="mt-16 py-8 px-4 text-center text-white/60 text-sm">
        <p>{branding.district_name} · {branding.outro_text}</p>
        <p className="mt-1">{branding.contact_email}</p>
      </footer>
    </div>
  );
}