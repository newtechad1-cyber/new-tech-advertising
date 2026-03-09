import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SchoolNavAdmin from '@/components/school-tv/SchoolNavAdmin';
import { Loader2, Save } from 'lucide-react';

export default function AdminSchoolBranding() {
  const [branding, setBranding] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    base44.entities.SchoolBranding.filter({ is_active: true }).then(records => {
      if (records.length) setBranding(records[0]);
      else setBranding({ is_active: true });
    });
  }, []);

  const set = (k, v) => setBranding(b => ({ ...b, [k]: v }));

  const save = async () => {
    setSaving(true);
    if (branding.id) {
      await base44.entities.SchoolBranding.update(branding.id, branding);
    } else {
      await base44.entities.SchoolBranding.create(branding);
    }
    setSaving(false);
  };

  if (!branding) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolNavAdmin currentPage="AdminSchoolBranding" />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-slate-900">School Branding</h1><p className="text-slate-500 text-sm">Customize the look and messaging for your school district</p></div>
          <Button onClick={save} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Branding</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800">School Information</h2>
              {[['school_name','School Name'], ['district_name','District Name'], ['mascot_name','Mascot Name'], ['network_name','Network Name (e.g. Bulldog TV)']].map(([k, l]) => (
                <div key={k}><label className="text-xs font-semibold text-slate-500 block mb-1">{l}</label><Input value={branding[k] || ''} onChange={e => set(k, e.target.value)} /></div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800">Colors & Logo</h2>
              <div className="grid grid-cols-3 gap-3">
                {[['primary_color','Primary Color'], ['secondary_color','Secondary Color'], ['accent_color','Accent Color']].map(([k, l]) => (
                  <div key={k}><label className="text-xs font-semibold text-slate-500 block mb-1">{l}</label><div className="flex gap-2"><input type="color" value={branding[k] || '#000000'} onChange={e => set(k, e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" /><Input value={branding[k] || ''} onChange={e => set(k, e.target.value)} className="flex-1 font-mono text-xs" /></div></div>
                ))}
              </div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Logo URL</label><Input value={branding.logo || ''} onChange={e => set('logo', e.target.value)} placeholder="https://..." /></div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800">Public Pages</h2>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Submission Page Title</label><Input value={branding.public_submission_page_title || ''} onChange={e => set('public_submission_page_title', e.target.value)} /></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Gallery Page Title</label><Input value={branding.public_gallery_title || ''} onChange={e => set('public_gallery_title', e.target.value)} /></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Intro Text (Gallery Hero)</label><textarea value={branding.intro_text || ''} onChange={e => set('intro_text', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" /></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Outro Text (Footer)</label><textarea value={branding.outro_text || ''} onChange={e => set('outro_text', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" /></div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800">Submission Instructions & Legal</h2>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Upload Instructions</label><textarea value={branding.upload_instructions || ''} onChange={e => set('upload_instructions', e.target.value)} rows={3} placeholder="Tell users what kinds of videos to submit..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" /></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Legal Release Text</label><textarea value={branding.legal_release_text || ''} onChange={e => set('legal_release_text', e.target.value)} rows={2} placeholder="Terms users agree to when submitting..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" /></div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-bold text-slate-800">Contact & Social</h2>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Contact Email</label><Input type="email" value={branding.contact_email || ''} onChange={e => set('contact_email', e.target.value)} /></div>
              {[['social_youtube_url','YouTube URL'], ['social_facebook_url','Facebook URL'], ['social_instagram_url','Instagram URL'], ['default_music_style','Default Music Style']].map(([k, l]) => (
                <div key={k}><label className="text-xs font-semibold text-slate-500 block mb-1">{l}</label><Input value={branding[k] || ''} onChange={e => set(k, e.target.value)} placeholder="https://..." /></div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold text-slate-800 mb-3">Color Preview</h3>
              <div className="space-y-2">
                <div className="rounded-lg p-4 text-white text-center font-bold" style={{ backgroundColor: branding.primary_color || '#000' }}>Primary</div>
                <div className="rounded-lg p-4 text-white text-center font-bold" style={{ backgroundColor: branding.secondary_color || '#f59e0b' }}>Secondary</div>
                <div className="rounded-lg p-4 text-center font-bold border-2" style={{ borderColor: branding.accent_color || '#fff' }}>Accent</div>
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-500 mb-2">Logo Preview</h4>
                {branding.logo ? <img src={branding.logo} alt="logo" className="w-full h-auto rounded-lg border border-slate-200" /> : <div className="w-full h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No logo</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}