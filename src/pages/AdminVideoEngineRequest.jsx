import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, Layers, Play, CheckCircle } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-600', queued: 'bg-yellow-100 text-yellow-700',
  script_ready: 'bg-blue-100 text-blue-700', assets_ready: 'bg-purple-100 text-purple-700',
  rendering: 'bg-orange-100 text-orange-700', review: 'bg-cyan-100 text-cyan-700',
  approved: 'bg-green-100 text-green-700', published: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700', archived: 'bg-slate-200 text-slate-500',
};

const STATUSES = ['draft','queued','script_ready','assets_ready','rendering','review','approved','published','failed','archived'];

export default function AdminVideoEngineRequest() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const [request, setRequest] = useState(null);
  const [script, setScript] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [renders, setRenders] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    if (!id) return;
    base44.entities.VideoRequests.list().then(all => setRequest(all.find(r => r.id === id)));
    base44.entities.VideoScripts.filter({ video_request_id: id }).then(s => setScript(s[0] || null));
    base44.entities.VideoScenes.filter({ video_request_id: id }, 'scene_number').then(setScenes);
    base44.entities.VideoRenders.filter({ video_request_id: id }).then(setRenders);
    base44.entities.VideoApprovals.filter({ video_request_id: id }).then(setApprovals);
    base44.entities.VideoPublications.filter({ video_request_id: id }).then(setPublications);
  }, [id]);

  const updateStatus = async (status) => {
    await base44.entities.VideoRequests.update(id, { status });
    setRequest(r => ({ ...r, status }));
  };

  if (!request) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminVideoEngineRequests')}>
            <Button variant="ghost" size="sm" className="text-slate-400"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{request.title}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{request.request_type?.replace(/_/g, ' ')} · {request.industry || 'General'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={request.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
            </Select>
            <Badge className={STATUS_COLORS[request.status]}>{request.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800"><CardContent className="p-4">
            <div className="text-xs text-slate-400">Format</div>
            <div className="font-semibold mt-1">{request.video_format || '—'}</div>
          </CardContent></Card>
          <Card className="bg-slate-900 border-slate-800"><CardContent className="p-4">
            <div className="text-xs text-slate-400">Duration Target</div>
            <div className="font-semibold mt-1">{request.duration_target || '—'}</div>
          </CardContent></Card>
          <Card className="bg-slate-900 border-slate-800"><CardContent className="p-4">
            <div className="text-xs text-slate-400">Orientation</div>
            <div className="font-semibold mt-1">{request.orientation || '—'}</div>
          </CardContent></Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Request Details */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" /> Request Details</h3>
              <dl className="space-y-2 text-sm">
                {[['Goal', request.goal], ['Audience', request.audience], ['Offer', request.offer], ['CTA', request.cta], ['Voice Style', request.voice_style]].map(([k, v]) => v ? (
                  <div key={k}><dt className="text-slate-400">{k}</dt><dd className="text-white">{v}</dd></div>
                ) : null)}
              </dl>
            </CardContent>
          </Card>

          {/* Script */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-purple-400" /> Script</h3>
              {script ? (
                <div className="text-sm text-slate-300 space-y-2">
                  <div><span className="text-slate-400">Hook: </span>{script.hook}</div>
                  <div><span className="text-slate-400">CTA: </span>{script.call_to_action}</div>
                  <div className="mt-2 max-h-40 overflow-y-auto text-xs text-slate-400 whitespace-pre-line">{script.script_text}</div>
                </div>
              ) : <p className="text-slate-500 text-sm">No script yet. Queue this request to generate one.</p>}
            </CardContent>
          </Card>

          {/* Scenes */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-yellow-400" /> Scenes ({scenes.length})</h3>
              {scenes.length === 0 ? <p className="text-slate-500 text-sm">No scenes built yet.</p> : (
                <div className="space-y-2">
                  {scenes.map(s => (
                    <div key={s.id} className="flex items-start gap-2 p-2 bg-slate-800 rounded">
                      <span className="text-xs font-bold text-slate-400 w-5 shrink-0">{s.scene_number}</span>
                      <div>
                        <div className="text-xs font-medium text-white">{s.scene_title || s.scene_purpose}</div>
                        <div className="text-xs text-slate-400">{s.visual_type} · {s.duration_seconds}s</div>
                      </div>
                      {s.cta_flag && <Badge className="ml-auto text-xs bg-green-100 text-green-700">CTA</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Renders */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Play className="w-4 h-4 text-orange-400" /> Renders ({renders.length})</h3>
              {renders.length === 0 ? <p className="text-slate-500 text-sm">No renders yet.</p> : (
                <div className="space-y-2">
                  {renders.map(r => (
                    <div key={r.id} className="p-2 bg-slate-800 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white">{r.provider} · {r.render_type}</span>
                        <Badge className={`text-xs ${r.render_status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.render_status}</Badge>
                      </div>
                      {r.output_url && <a href={r.output_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 mt-1 block hover:underline">View Output</a>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approvals */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Approvals ({approvals.length})</h3>
              {approvals.length === 0 ? <p className="text-slate-500 text-sm">No approvals yet.</p> : (
                <div className="space-y-2">
                  {approvals.map(a => (
                    <div key={a.id} className="p-2 bg-slate-800 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-white">{a.reviewer_type}</span>
                        <Badge className={a.approval_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>{a.approval_status}</Badge>
                      </div>
                      {a.feedback && <p className="text-slate-400 mt-1">{a.feedback}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publications */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Publications ({publications.length})</h3>
              {publications.length === 0 ? <p className="text-slate-500 text-sm">Not published anywhere yet.</p> : (
                <div className="space-y-2">
                  {publications.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-slate-800 rounded text-xs">
                      <span className="text-white">{p.destination_type?.replace(/_/g, ' ')}</span>
                      <Badge className={p.publish_status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>{p.publish_status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}