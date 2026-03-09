import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import SchoolNavAdmin from '@/components/school-tv/SchoolNavAdmin';
import StatusBadge from '@/components/school-tv/StatusBadge';
import { Button } from '@/components/ui/button';
import { Loader2, Play, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSchoolRenderQueue() {
  const [renders, setRenders] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    base44.entities.SchoolVideoRenders.list('-created_date', 100).then(setRenders);
    base44.entities.SchoolVideoProjects.list('-created_date', 100).then(setProjects);
  }, []);

  const getProject = (projId) => projects.find(p => p.id === projId);

  const queued = renders.filter(r => ['queued','preparing','processing','rendering'].includes(r.status));
  const completed = renders.filter(r => r.status === 'completed');
  const failed = renders.filter(r => r.status === 'failed');

  const retryRender = async (render) => {
    await base44.entities.SchoolVideoRenders.update(render.id, { status: 'queued', retry_count: (render.retry_count || 0) + 1, error_log: null });
    const updated = await base44.entities.SchoolVideoRenders.filter({ id: render.id });
    setRenders(prev => prev.map(r => r.id === render.id ? updated[0] : r));
  };

  const RenderRow = ({ render, accent }) => {
    const proj = getProject(render.project_id);
    return (
      <div className={`rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4 ${accent}`}>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-slate-900 truncate">{render.render_name}</div>
          <div className="text-xs text-slate-400 mt-1">{render.resolution} · {render.aspect_ratio}</div>
          {proj && <Link to={createPageUrl('AdminSchoolProjectDetail') + '?id=' + proj.id} className="text-xs text-blue-600 hover:underline mt-1 inline-block">{proj.title}</Link>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {render.status === 'rendering' && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
          {render.status === 'completed' && render.output_url && <a href={render.output_url} target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200"><Play className="w-3 h-3" /> Preview</a>}
          {render.status === 'failed' && <Button size="sm" onClick={() => retryRender(render)} variant="outline" className="text-xs h-7">Retry</Button>}
          <StatusBadge status={render.status} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolNavAdmin currentPage="AdminSchoolRenderQueue" />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Render Queue</h1>
        <p className="text-slate-500 text-sm mb-6">Monitor video rendering jobs</p>

        <div className="space-y-6">
          {queued.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing ({queued.length})</h2>
              <div className="space-y-2">{queued.map(r => <RenderRow key={r.id} render={r} accent="bg-yellow-50" />)}</div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Completed ({completed.length})</h2>
              <div className="space-y-2">{completed.map(r => <RenderRow key={r.id} render={r} accent="bg-green-50" />)}</div>
            </div>
          )}

          {failed.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600" /> Failed ({failed.length})</h2>
              <div className="space-y-2">{failed.map(r => <RenderRow key={r.id} render={r} accent="bg-red-50" />)}</div>
            </div>
          )}

          {renders.length === 0 && <div className="text-center py-16 text-slate-400">No renders in queue. Queue renders from project pages.</div>}
        </div>
      </div>
    </div>
  );
}