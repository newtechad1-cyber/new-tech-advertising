import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import SchoolNavAdmin from '@/components/school-tv/SchoolNavAdmin';
import StatusBadge from '@/components/school-tv/StatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2, Play, Film, Globe, CheckCircle, Loader2, RefreshCw, Music } from 'lucide-react';

const TABS = ['Overview', 'Assets', 'Script', 'Render', 'Publish'];

export default function AdminSchoolProjectDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const [project, setProject] = useState(null);
  const [clips, setClips] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [renders, setRenders] = useState([]);
  const [publishing, setPublishing] = useState([]);
  const [tab, setTab] = useState('Overview');
  const [generating, setGenerating] = useState(false);
  const [queuingRender, setQueuingRender] = useState(false);
  const [publishingAction, setPublishingAction] = useState(false);

  const loadAll = async () => {
    if (!projectId) return;
    const [proj, cls, scr, ren, pub] = await Promise.all([
      base44.entities.SchoolVideoProjects.filter({ id: projectId }).then(r => r[0]),
      base44.entities.SchoolVideoClips.filter({ project_id: projectId }, 'recommended_order'),
      base44.entities.SchoolVideoScripts.filter({ project_id: projectId }, '-created_date'),
      base44.entities.SchoolVideoRenders.filter({ project_id: projectId }, '-created_date'),
      base44.entities.SchoolVideoPublishing.filter({ project_id: projectId }),
    ]);
    setProject(proj); setClips(cls); setScripts(scr); setRenders(ren); setPublishing(pub);
  };

  useEffect(() => { loadAll(); }, [projectId]);

  const generateScript = async () => {
    setGenerating(true);
    setTab('Script');
    try {
      await base44.functions.invoke('generateSchoolVideoScript', { project_id: projectId });
      await loadAll();
    } catch (e) { console.error(e); }
    setGenerating(false);
  };

  const queueRender = async () => {
    setQueuingRender(true);
    const render = await base44.entities.SchoolVideoRenders.create({
      project_id: projectId,
      script_id: scripts[0]?.id || null,
      render_name: `${project.title} — ${project.format_type}`,
      render_engine: 'internal',
      output_format: 'mp4',
      resolution: project.format_type === 'vertical' ? '1080x1920' : '1920x1080',
      aspect_ratio: project.format_type === 'vertical' ? '9:16' : '16:9',
      estimated_duration: project.duration_target,
      status: 'queued',
      queue_position: renders.length + 1,
    });
    await base44.entities.SchoolVideoProjects.update(projectId, { status: 'queued_for_render' });
    setRenders(prev => [render, ...prev]);
    setProject(p => ({ ...p, status: 'queued_for_render' }));
    setQueuingRender(false);
    setTab('Render');
  };

  const publishToGallery = async () => {
    setPublishingAction(true);
    const pub = await base44.entities.SchoolVideoPublishing.create({
      project_id: projectId,
      destination: 'gallery',
      destination_status: 'published',
      published_at: new Date().toISOString(),
    });
    await base44.entities.SchoolVideoProjects.update(projectId, {
      status: 'published',
      publish_status: 'published',
      publish_to_gallery: true,
      published_date: new Date().toISOString(),
    });
    setPublishing(prev => [...prev, pub]);
    setProject(p => ({ ...p, status: 'published', publish_status: 'published' }));
    setPublishingAction(false);
  };

  const toggleClip = async (clip) => {
    const updated = await base44.entities.SchoolVideoClips.update(clip.id, { is_selected: !clip.is_selected });
    setClips(prev => prev.map(c => c.id === clip.id ? updated : c));
  };

  if (!project) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  const script = scripts[0];
  const latestRender = renders[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <SchoolNavAdmin currentPage="AdminSchoolProjects" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl('AdminSchoolProjects')}><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div className="flex-1"><h1 className="text-xl font-bold text-slate-900">{project.title}</h1><div className="flex items-center gap-2 mt-1"><StatusBadge status={project.status} /><span className="text-xs text-slate-400 capitalize">{project.project_type?.replace(/_/g,' ')}</span><span className="text-slate-300">·</span><span className="text-xs text-slate-400">{project.tone}</span></div></div>
          <div className="flex gap-2">
            <Button onClick={generateScript} disabled={generating} variant="outline" className="gap-1.5">
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Wand2 className="w-4 h-4" />Generate Script</>}
            </Button>
            {['script_generated','review_ready','approved'].includes(project.status) && (
              <Button onClick={queueRender} disabled={queuingRender} className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5">
                {queuingRender ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />} Queue Render
              </Button>
            )}
            {['review_ready','approved'].includes(project.status) && (
              <Button onClick={publishToGallery} disabled={publishingAction} className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                {publishingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} Publish to Gallery
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}{t === 'Assets' && clips.length > 0 ? ` (${clips.length})` : ''}{t === 'Script' && scripts.length > 0 ? ` ✓` : ''}</button>)}
        </div>

        {tab === 'Overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h3 className="font-semibold text-slate-800">Project Details</h3>
              {[['School', project.school], ['Activity', project.activity_type], ['Event', project.event_name || '—'], ['Tone', project.tone], ['Duration', project.duration_target], ['Format', project.format_type]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm"><span className="text-slate-400">{k}</span><span className="text-slate-800 font-medium capitalize">{v}</span></div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3">AI Story Summary</h3>
              {project.ai_story_summary ? (
                <p className="text-sm text-slate-600 leading-relaxed">{project.ai_story_summary}</p>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm mb-3">No story generated yet</p>
                  <Button onClick={generateScript} disabled={generating} size="sm" className="gap-1.5">
                    <Wand2 className="w-3.5 h-3.5" /> Generate Story
                  </Button>
                </div>
              )}
              {project.generated_title && <div className="mt-3 p-2 bg-blue-50 rounded-lg text-sm"><strong>Suggested Title:</strong> {project.generated_title}</div>}
            </div>
          </div>
        )}

        {tab === 'Assets' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">{clips.length} clips/photos attached</h3>
              <p className="text-xs text-slate-400">{clips.filter(c => c.is_selected).length} selected for video</p>
            </div>
            {clips.length === 0 ? (
              <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">No clips attached yet. Assign approved submissions to add media.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {clips.map(c => (
                  <div key={c.id} className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${c.is_selected ? 'border-blue-500' : 'border-slate-200 opacity-60'}`} onClick={() => toggleClip(c)}>
                    <div className="aspect-video bg-slate-100 relative">
                      {c.media_type === 'photo' ? <img src={c.media_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-800"><Play className="w-6 h-6 text-white" /></div>}
                      {c.is_selected && <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>}
                    </div>
                    <div className="p-2 bg-white">
                      <p className="text-xs font-medium text-slate-700 truncate">{c.clip_title || 'Clip'}</p>
                      {c.ai_tags && <p className="text-xs text-slate-400 truncate">{c.ai_tags}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'Script' && (
          <div>
            {!script ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Wand2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No script generated yet</p>
                <Button onClick={generateScript} disabled={generating} className="gap-1.5">
                  {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating Script...</> : <><Wand2 className="w-4 h-4" />Generate AI Script</>}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-slate-900 text-lg">{script.title}</h3><p className="text-xs text-slate-400">Version {script.script_version} · <StatusBadge status={script.generation_status} /></p></div>
                  <Button onClick={generateScript} disabled={generating} variant="outline" size="sm" className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</Button>
                </div>
                {[{ label: 'Hook Line', content: script.hook_line }, { label: 'Story Summary', content: script.story_summary }, { label: 'Voiceover Script', content: script.full_voiceover_script }, { label: 'Scene Structure', content: script.scene_structure }, { label: 'On-Screen Text', content: script.on_screen_text }, { label: 'Caption Text', content: script.caption_text }, { label: 'Music Direction', content: script.music_direction }].map(({ label, content }) => content && (
                  <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</h4>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'Render' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Render Queue</h3>
              <Button onClick={queueRender} disabled={queuingRender || !script} className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5">
                {queuingRender ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />} Queue New Render
              </Button>
            </div>
            {renders.length === 0 ? <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">No renders yet. Generate a script first, then queue a render.</div> : (
              <div className="space-y-3">
                {renders.map(r => (
                  <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4">
                    <div><div className="font-medium text-slate-800">{r.render_name}</div><div className="text-xs text-slate-400 mt-0.5">{r.resolution} · {r.output_format?.toUpperCase()} · {r.aspect_ratio}</div></div>
                    <div className="flex items-center gap-3"><StatusBadge status={r.status} />{r.output_url && <a href={r.output_url} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Play className="w-3 h-3" />Preview</a>}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'Publish' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Publishing</h3>
              {project.status !== 'published' && <Button onClick={publishToGallery} disabled={publishingAction} className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                {publishingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} Publish to Gallery
              </Button>}
            </div>
            {publishing.length === 0 ? <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">Not published yet.</div> : (
              <div className="space-y-3">
                {publishing.map(pub => (
                  <div key={pub.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-slate-400" /><div><div className="font-medium text-slate-800 capitalize">{pub.destination}</div>{pub.published_at && <div className="text-xs text-slate-400">{new Date(pub.published_at).toLocaleString()}</div>}</div></div>
                    <StatusBadge status={pub.destination_status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}