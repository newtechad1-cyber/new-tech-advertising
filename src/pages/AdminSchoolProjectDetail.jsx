import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminShell from '@/components/school-tv/AdminShell';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wand2, Play, Film, Globe, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

const TABS = ['Overview', 'Assets', 'Script', 'Publishing'];

export default function AdminSchoolProjectDetail() {
  const { schoolSlug: paramSlug, projectId: paramProjectId } = useParams() || {};
  const searchParams = new URLSearchParams(window.location.search);
  const schoolSlug = paramSlug || searchParams.get('schoolSlug') || 'hampton-dumont';
  const projectId = paramProjectId || searchParams.get('id');
  
  if (!schoolSlug || !projectId) {
    return <div className="text-center py-12">Invalid project</div>;
  }

  const [project, setProject] = useState(null);
  const [clips, setClips] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [renders, setRenders] = useState([]);
  const [publishing, setPublishing] = useState([]);
  const [tab, setTab] = useState('Overview');
  const [generating, setGenerating] = useState(false);
  const [queuingRender, setQueuingRender] = useState(false);
  const [publishingAction, setPublishingAction] = useState(false);
  const [lastSave, setLastSave] = useState(null);

  const loadAll = async () => {
    if (!projectId) return;
    const [proj, cls, scr, ren, pub] = await Promise.all([
      base44.entities.VideoProjects.filter({ id: projectId }).then(r => r[0]),
      base44.entities.VideoClips.filter({ project_id: projectId }),
      base44.entities.VideoScripts.filter({ project_id: projectId }, '-created_date'),
      base44.entities.VideoRenderJobs.filter({ project_id: projectId }, '-created_date'),
      base44.entities.VideoPublishingJobs.filter({ project_id: projectId }),
    ]);
    setProject(proj); setClips(cls || []); setScripts(scr || []); setRenders(ren || []); setPublishing(pub || []);
  };

  useEffect(() => { loadAll(); }, [projectId]);

  const generateScript = async () => {
    setGenerating(true);
    setTab('Script');
    try {
      await base44.functions.invoke('generateSchoolVideoScript', { project_id: projectId });
      setTimeout(() => loadAll(), 500); // Allow time for job to process
    } catch (e) { 
      console.error('Error generating script:', e);
      alert('Error generating script');
    }
    setGenerating(false);
  };

  const queueRender = async () => {
    if (!scripts.length) {
      alert('Please generate a script first before rendering');
      return;
    }
    setQueuingRender(true);
    try {
      const render = await base44.entities.VideoRenderJobs.create({
        school_slug: schoolSlug,
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
      await base44.entities.VideoProjects.update(projectId, { status: 'queued_for_render' });
      setRenders(prev => [render, ...prev]);
      setProject(p => ({ ...p, status: 'queued_for_render' }));
      setLastSave(new Date());
    } catch (e) {
      console.error('Error queueing render:', e);
      alert('Error queueing render. Please try again.');
    } finally {
      setQueuingRender(false);
    }
  };

  const publishToGallery = async () => {
    if (!renders[0]?.output_url) {
      alert('Please complete rendering before publishing');
      return;
    }
    setPublishingAction(true);
    try {
      const pub = await base44.entities.VideoPublishingJobs.create({
        school_slug: schoolSlug,
        project_id: projectId,
        render_job_id: renders[0]?.id || null,
        video_url: renders[0]?.output_url || null,
        destination: 'bulldog_tv',
        destination_status: 'published',
        published_at: new Date().toISOString(),
      });
      await base44.entities.VideoProjects.update(projectId, {
        status: 'published',
        publish_status: 'published',
        publish_to_gallery: true,
        published_date: new Date().toISOString(),
      });
      setPublishing(prev => [...prev, pub]);
      setProject(p => ({ ...p, status: 'published', publish_status: 'published' }));
      setLastSave(new Date());
    } catch (e) {
      console.error('Error publishing:', e);
      alert('Error publishing video. Please try again.');
    } finally {
      setPublishingAction(false);
    }
  };

  const toggleClip = async (clip) => {
    try {
      const updated = await base44.entities.VideoClips.update(clip.id, { is_selected: !clip.is_selected });
      setClips(prev => prev.map(c => c.id === clip.id ? updated : c));
    } catch (e) {
      console.error('Error toggling clip:', e);
    }
  };

  if (!project) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  const script = scripts[0];
  const latestRender = renders[0];

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to={`${createPageUrl('AdminSchoolProjects')}?schoolSlug=${schoolSlug}`}><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div className="flex-1"><h1 className="text-xl font-bold text-slate-900">{project.title}</h1><div className="flex items-center gap-2 mt-1"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">{project.status}</span><span className="text-xs text-slate-400 capitalize">{project.project_type?.replace(/_/g,' ')}</span><span className="text-slate-300">·</span><span className="text-xs text-slate-400">{project.tone}</span></div></div>
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
         <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
           {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>{t}{t === 'Assets' && clips.length > 0 ? ` (${clips.length})` : ''}{t === 'Script' && scripts.length > 0 ? ` ✓` : ''}</button>)}
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
                  <div><h3 className="font-bold text-slate-900 text-lg">{script.title}</h3><p className="text-xs text-slate-400">Generated script ready for review</p></div>
                  <Button onClick={generateScript} disabled={generating} variant="outline" size="sm" className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Regenerate</Button>
                </div>
                {[
                  { label: 'Title', content: script.title },
                  { label: 'Script', content: script.script_text },
                ].map(({ label, content }) => content && (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{content}</p>
                    </div>
                    ))}
              </div>
            )}
          </div>
        )}

        {tab === 'Publishing' && (
           <div>
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-800">Publishing Status</h3>
               {project.status !== 'published' && renders.length > 0 && (
                 <Button onClick={publishToGallery} disabled={publishingAction} className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                   {publishingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} Publish to Bulldog TV
                 </Button>
               )}
             </div>
             {project.status === 'published' ? (
               <div className="bg-white rounded-xl border border-green-200 p-6 text-center">
                 <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                 <p className="font-semibold text-slate-900">Video Published</p>
                 <p className="text-sm text-slate-600 mt-1">This video is now visible on Bulldog TV</p>
                 {project.public_video_url && (
                   <a href={project.public_video_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-600 hover:underline text-sm font-semibold">
                     View Published Video →
                   </a>
                 )}
               </div>
             ) : (
               <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
                 Queue a render first, then publish to Bulldog TV.
               </div>
             )}
           </div>
        )}


      </div>
      </AdminShell>
      );
      }