import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';

const STATUS_COLORS = {
  queued: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700',
  complete: 'bg-green-100 text-green-700', failed: 'bg-red-100 text-red-700',
};

export default function AdminVideoEngineRenders() {
  const [renders, setRenders] = useState([]);

  useEffect(() => {
    base44.entities.VideoRenders.list('-created_date', 100).then(setRenders);
  }, []);

  const content = (
    <div className="bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminVideoEngine')}><Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Render Jobs</h1>
            <p className="text-slate-400 text-sm mt-0.5">Track all video render jobs and output files</p>
          </div>
        </div>

        <div className="space-y-3">
          {renders.map(r => (
            <Card key={r.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-orange-400 shrink-0" />
                    <div>
                      <div className="font-medium text-white">{r.render_type} · {r.provider}</div>
                      {r.provider_job_id && <div className="text-xs text-slate-400 mt-0.5">Job: {r.provider_job_id}</div>}
                      {r.started_at && <div className="text-xs text-slate-500 mt-0.5">Started: {new Date(r.started_at).toLocaleString()}</div>}
                    </div>
                  </div>
                  <Badge className={`text-xs ${STATUS_COLORS[r.render_status]}`}>{r.render_status}</Badge>
                </div>
                {(r.output_url || r.thumbnail_url) && (
                  <div className="flex gap-3 mt-3">
                    {r.output_url && <a href={r.output_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><ExternalLink className="w-3 h-3" /> Video</a>}
                    {r.thumbnail_url && <a href={r.thumbnail_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><ExternalLink className="w-3 h-3" /> Thumbnail</a>}
                    {r.caption_url && <a href={r.caption_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline"><ExternalLink className="w-3 h-3" /> Captions</a>}
                  </div>
                )}
                {r.error_message && <div className="mt-2 text-xs text-red-400 bg-red-950 p-2 rounded">{r.error_message}</div>}
              </CardContent>
            </Card>
          ))}
          {renders.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Play className="w-10 h-10 mx-auto mb-3 opacity-30" />
              No render jobs yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return <AdminLayout currentPageName="AdminVideoEngineRenders">{content}</AdminLayout>;
}