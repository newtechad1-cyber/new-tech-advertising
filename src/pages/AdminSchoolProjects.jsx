import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import SchoolNavAdmin from '@/components/school-tv/SchoolNavAdmin';
import StatusBadge from '@/components/school-tv/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, FolderOpen } from 'lucide-react';

const STATUSES = ['all','draft','collecting_assets','ready_for_ai','script_generated','queued_for_render','rendering','review_ready','approved','published','failed'];
const TYPES = ['all','weekly_recap','sports_highlight','classroom_spotlight','club_feature','arts_feature','event_recap','district_message','recruitment_video','community_pride','custom'];

export default function AdminSchoolProjects() {
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: '', project_type: 'weekly_recap', school: 'Hampton-Dumont', activity_type: 'student_life', event_name: '', description: '', tone: 'warm', duration_target: '2-3 minutes', format_type: 'landscape', voiceover_enabled: true, captions_enabled: true, intro_enabled: true, outro_enabled: true, publish_to_gallery: true });
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    base44.entities.SchoolVideoProjects.list('-created_date', 100).then(setProjects);
    base44.entities.SchoolSubmissions.filter({ status: 'approved' }).then(setSubmissions);
  }, []);

  const filtered = projects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (typeFilter !== 'all' && p.project_type !== typeFilter) return false;
    if (search) return (p.title || '').toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const handleCreate = async () => {
    setSaving(true);
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const proj = await base44.entities.SchoolVideoProjects.create({
      ...form, slug,
      status: selectedSubs.length > 0 ? 'collecting_assets' : 'draft',
      priority: 'normal',
    });
    for (const sub of selectedSubs) {
      const vids = JSON.parse(sub.video_files || '[]');
      const photos = JSON.parse(sub.photo_files || '[]');
      for (const url of [...vids, ...photos]) {
        await base44.entities.SchoolVideoClips.create({
          submission_id: sub.id,
          project_id: proj.id,
          media_type: vids.includes(url) ? 'video' : 'photo',
          media_url: url,
          clip_title: `${sub.submission_title} — clip`,
          detected_activity: sub.activity_type,
          is_selected: true,
        });
      }
      await base44.entities.SchoolSubmissions.update(sub.id, { status: 'assigned_to_project', project_id: proj.id });
    }
    setProjects(prev => [proj, ...prev]);
    setShowNew(false);
    setSaving(false);
    setSelectedSubs([]);
    window.location.href = createPageUrl('AdminSchoolProjectDetail') + '?id=' + proj.id;
  };

  const toggleSub = (sub) => setSelectedSubs(prev => prev.find(s => s.id === sub.id) ? prev.filter(s => s.id !== sub.id) : [...prev, sub]);

  const STATUS_COLORS = { draft: 'bg-slate-100', collecting_assets: 'bg-yellow-50', ready_for_ai: 'bg-indigo-50', script_generated: 'bg-blue-50', rendering: 'bg-purple-50', published: 'bg-green-50', failed: 'bg-red-50' };

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolNavAdmin currentPage="AdminSchoolProjects" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-slate-900">Video Projects</h1><p className="text-slate-500 text-sm">Manage the full pipeline from assets through publishing</p></div>
          <Button onClick={() => setShowNew(true)} className="bg-slate-900 hover:bg-slate-800 text-white"><Plus className="w-4 h-4 mr-2" /> New Project</Button>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="pl-9 w-56" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">{STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.replace(/_/g,' ')}</option>)}</select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">{TYPES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Types' : s.replace(/_/g,' ')}</option>)}</select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Link key={p.id} to={createPageUrl('AdminSchoolProjectDetail') + '?id=' + p.id}>
              <div className={`rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${STATUS_COLORS[p.status] || 'bg-white'}`}>
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  {p.cover_image ? <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900"><FolderOpen className="w-10 h-10 text-white/30" /></div>}
                  <div className="absolute top-2 left-2"><StatusBadge status={p.status} /></div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-400 mb-1 capitalize">{p.project_type?.replace(/_/g,' ')}</div>
                  <h3 className="font-bold text-slate-900 leading-tight">{p.title}</h3>
                  {p.event_name && <p className="text-xs text-slate-500 mt-1">{p.event_name}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400 capitalize">{p.tone}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{p.format_type}</span>
                    {p.publish_to_gallery && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Gallery</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400">No projects yet. Create one from approved submissions.</div>}
        </div>
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create New Video Project</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><label className="text-xs font-semibold text-slate-500 block mb-1">Project Title *</label><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Bulldogs Spring Sports Recap" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Project Type</label><select value={form.project_type} onChange={e => set('project_type', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm capitalize">{TYPES.slice(1).map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}</select></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Tone</label><select value={form.tone} onChange={e => set('tone', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">{['inspiring','energetic','warm','proud','documentary','celebratory'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Activity Category</label><Input value={form.activity_type} onChange={e => set('activity_type', e.target.value)} /></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Event Name</label><Input value={form.event_name} onChange={e => set('event_name', e.target.value)} /></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Duration Target</label><Input value={form.duration_target} onChange={e => set('duration_target', e.target.value)} /></div>
              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Format</label><select value={form.format_type} onChange={e => set('format_type', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">{['landscape','square','vertical'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            </div>
            <div><label className="text-xs font-semibold text-slate-500 block mb-1">Description / Objective</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" /></div>
            {submissions.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Attach Approved Submissions ({selectedSubs.length} selected)</label>
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {submissions.map(s => (
                    <label key={s.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-colors ${selectedSubs.find(ss => ss.id === s.id) ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                      <input type="checkbox" checked={!!selectedSubs.find(ss => ss.id === s.id)} onChange={() => toggleSub(s)} />
                      <div><div className="text-sm font-medium text-slate-800">{s.submission_title}</div><div className="text-xs text-slate-400">{s.contributor_name} · {s.activity_type}</div></div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving || !form.title} className="bg-slate-900 text-white hover:bg-slate-800">{saving ? 'Creating...' : 'Create Project'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}