import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import SchoolNavAdmin from '@/components/school-tv/SchoolNavAdmin';
import SchoolStatCards from '@/components/school-tv/SchoolStatCards';
import StatusBadge from '@/components/school-tv/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, X, Eye, Search, Filter, Loader2 } from 'lucide-react';

const STATUS_OPTIONS = ['all','pending','under_review','approved','rejected','assigned_to_project'];
const ACTIVITY_OPTIONS = ['all','sports','classroom','arts','music','clubs','student_life','event','other'];

export default function AdminSchoolSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [renders, setRenders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actFilter, setActFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [moderating, setModerating] = useState(false);

  useEffect(() => {
    base44.entities.SchoolSubmissions.list('-created_date', 200).then(setSubmissions);
    base44.entities.SchoolVideoProjects.list('-created_date', 100).then(setProjects);
    base44.entities.SchoolVideoRenders.list('-created_date', 100).then(setRenders);
  }, []);

  const filtered = submissions.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (actFilter !== 'all' && s.activity_type !== actFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (s.submission_title || '').toLowerCase().includes(q) || (s.contributor_name || '').toLowerCase().includes(q) || (s.event_name || '').toLowerCase().includes(q);
    }
    return true;
  });

  const updateStatus = async (id, status) => {
    setSaving(true);
    const updated = await base44.entities.SchoolSubmissions.update(id, { status, moderation_notes: notes, reviewed_at: new Date().toISOString() });
    setSubmissions(prev => prev.map(s => s.id === id ? updated : s));
    if (selected?.id === id) setSelected(updated);
    setSaving(false);
    setNotes('');
  };

  const runAIReview = async (sub) => {
    setModerating(true);
    try {
      await base44.functions.invoke('moderateSchoolSubmission', { submission_id: sub.id });
      const refreshed = await base44.entities.SchoolSubmissions.filter({ id: sub.id });
      if (refreshed.length) {
        setSubmissions(prev => prev.map(s => s.id === sub.id ? refreshed[0] : s));
        setSelected(refreshed[0]);
      }
    } catch (e) {}
    setModerating(false);
  };

  const videoFiles = (s) => { try { return JSON.parse(s.video_files || '[]'); } catch { return []; } };
  const photoFiles = (s) => { try { return JSON.parse(s.photo_files || '[]'); } catch { return []; } };

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolNavAdmin currentPage="AdminSchoolSubmissions" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8"><h1 className="text-3xl font-black text-slate-900">📹 Video Submissions</h1><p className="text-slate-500 text-base">Review and approve media from students, staff, and contributors</p></div>
        <div className="mb-8"><SchoolStatCards submissions={submissions} projects={projects} renders={renders} /></div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or contributor..." className="pl-10 font-medium" /></div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white font-medium"><option value="all">All Status</option>{STATUS_OPTIONS.slice(1).map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}</select>
            <select value={actFilter} onChange={e => setActFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white font-medium"><option value="all">All Categories</option>{ACTIVITY_OPTIONS.slice(1).map(a => <option key={a} value={a}>{a}</option>)}</select>
          </div>
          <div className="mt-3 text-xs text-slate-500"><strong>{filtered.length}</strong> submission{filtered.length !== 1 ? 's' : ''} • <strong>{submissions.filter(s => s.status === 'pending').length}</strong> awaiting review</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200"><tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Contributor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">AI Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{s.submission_title}</div>
                    {s.event_name && <div className="text-xs text-slate-400 mt-0.5">{s.event_name}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-700">{s.contributor_name}</div>
                    <div className="text-xs text-slate-400 capitalize">{s.contributor_role}</div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-600 capitalize">{s.activity_type?.replace(/_/g,' ')}</span></td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                    {s.ai_safety_flag && <span className="ml-1 text-xs text-red-600 font-bold">⚠</span>}
                  </td>
                  <td className="px-4 py-3">
                    {s.ai_quality_score ? (
                      <span className={`text-xs font-bold ${s.ai_quality_score >= 70 ? 'text-green-600' : s.ai_quality_score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>{s.ai_quality_score}</span>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelected(s)}><Eye className="w-3.5 h-3.5" /></Button>
                      {s.status === 'pending' && <><Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs" onClick={() => updateStatus(s.id, 'approved')}><CheckCircle className="w-3 h-3 mr-1" />Approve</Button><Button size="sm" variant="ghost" className="text-red-500 h-7 px-2 text-xs" onClick={() => updateStatus(s.id, 'rejected')}><X className="w-3 h-3" /></Button></>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No submissions found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selected?.submission_title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Contributor', selected.contributor_name], ['Role', selected.contributor_role], ['Category', selected.activity_type], ['Event', selected.event_name || '—'], ['Grade', selected.grade_level || '—'], ['Email', selected.contributor_email || '—']].map(([k, v]) => (
                  <div key={k}><span className="text-slate-400 text-xs">{k}</span><div className="font-medium text-slate-800 capitalize">{v}</div></div>
                ))}
              </div>
              {selected.description && <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">{selected.description}</div>}

              {/* Media previews */}
              {photoFiles(selected).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">Photos ({photoFiles(selected).length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {photoFiles(selected).map((url, i) => <img key={i} src={url} alt="" className="aspect-square rounded-lg object-cover" />)}
                  </div>
                </div>
              )}
              {videoFiles(selected).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2">Videos ({videoFiles(selected).length})</p>
                  <div className="space-y-2">
                    {videoFiles(selected).map((url, i) => <video key={i} src={url} controls className="w-full rounded-lg" />)}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-lg p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>AI Quality Score:</span><span className={`font-bold ${selected.ai_quality_score >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>{selected.ai_quality_score || '—'}</span></div>
                <div className="flex justify-between"><span>Safety Flag:</span><span className={selected.ai_safety_flag ? 'text-red-600 font-bold' : 'text-green-600'}>{selected.ai_safety_flag ? '⚠ Flagged' : '✓ Clear'}</span></div>
                {selected.moderation_notes && <div className="text-slate-500 italic mt-1">{selected.moderation_notes}</div>}
              </div>

              <Button onClick={() => runAIReview(selected)} variant="outline" disabled={moderating} className="w-full">
                {moderating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running AI Review...</> : 'Run AI Review'}
              </Button>

              <div><label className="text-xs font-semibold text-slate-500 block mb-1">Moderation Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none" /></div>

              <div className="flex gap-2">
                <Button onClick={() => updateStatus(selected.id, 'approved')} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white">{saving ? '...' : '✓ Approve'}</Button>
                <Button onClick={() => updateStatus(selected.id, 'rejected')} disabled={saving} variant="destructive" className="flex-1">{saving ? '...' : '✗ Reject'}</Button>
                <Button onClick={() => updateStatus(selected.id, 'archived')} disabled={saving} variant="outline">Archive</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}