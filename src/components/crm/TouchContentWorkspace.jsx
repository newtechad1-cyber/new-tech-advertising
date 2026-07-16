import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BookOpen, CheckCircle2, Eye, Loader2, Save, Video } from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);

export default function TouchContentWorkspace({ campaign, touch, onClose, onSaved }) {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assetKey, setAssetKey] = useState('custom');
  const [form, setForm] = useState({
    subject: touch.subject || '', message_body: touch.message_body || '', content_title: touch.content_title || '',
    content_url: touch.content_url || '', content_source_type: touch.content_source_type || 'custom',
    content_source_id: touch.content_source_id || '', personalization_notes: touch.personalization_notes || '',
  });

  useEffect(() => {
    Promise.all([
      base44.entities.PublishingArticle.list('-created_date', 300),
      base44.entities.YouTubeKnowledge.list('-created_date', 200),
    ]).then(([articleData, videoData]) => {
      setArticles((articleData || []).filter(article => ['Published', 'Approved'].includes(article.status)));
      setVideos((videoData || []).filter(video => video.publish_status === 'Published' && video.video_url));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const assets = useMemo(() => [
    ...articles.map(article => ({ key: `article:${article.id}`, type: 'publishing_article', id: article.id, title: article.title, url: article.canonical_url || (article.slug ? `/journal/${article.slug}` : ''), summary: article.summary || article.primary_question || '' })),
    ...videos.map(video => ({ key: `video:${video.id}`, type: 'youtube_video', id: video.id, title: video.video_title, url: video.video_url, summary: video.description || '' })),
  ], [articles, videos]);

  const buildDraft = asset => {
    const contact = campaign.contact_name?.split(' ')[0] || 'there';
    const industryLine = campaign.industry ? `Since you work in ${campaign.industry}, I thought this might be useful.` : `I thought this might be useful for your business.`;
    if (touch.touch_type === 'permission_question') {
      return `Hi ${contact},\n\nI have sent a few practical AI ideas because I believe small-business owners deserve useful education without all the technical language and hype.\n\nI publish one short NTA Journal lesson each week about practical AI, marketing, customer relationships, and business growth. Would you like me to keep sending it?\n\nIf the answer is yes, just reply yes and I will add you. If not, that is completely fine too.\n\nRick Hesse\nNew Tech Advertising`;
    }
    const resource = asset?.url ? `\n\n${asset.title}\n${asset.url}` : '';
    const summary = asset?.summary ? `\n\n${asset.summary.slice(0, 320)}` : '';
    return `Hi ${contact},\n\nI'm Rick Hesse with New Tech Advertising. I teach small-business owners how to use AI in practical ways without making it more complicated than it needs to be.\n\n${industryLine}${summary}${resource}\n\nThere is no pressure to buy anything. I simply wanted to introduce myself and share something useful.\n\nRick Hesse\nNew Tech Advertising\nYour Digital Growth Guide™\n\nIf you would rather not hear from me again, just reply “no thanks.”`;
  };

  const chooseAsset = key => {
    setAssetKey(key);
    if (key === 'custom') return setForm(current => ({ ...current, content_source_type: 'custom', content_source_id: '' }));
    const asset = assets.find(item => item.key === key);
    if (!asset) return;
    setForm(current => ({ ...current, content_title: asset.title, content_url: asset.url, content_source_type: asset.type, content_source_id: asset.id, message_body: buildDraft(asset) }));
  };

  const createSuggestedDraft = () => setForm(current => ({ ...current, message_body: buildDraft(assets.find(item => item.key === assetKey)) }));

  const save = async status => {
    if (!form.subject.trim() || !form.message_body.trim()) return toast.error('Subject and message are required');
    setSaving(true);
    await base44.entities.IntroductionTouch.update(touch.id, {
      ...form, status, approved_date: status === 'ready' ? today() : null,
    });
    setSaving(false);
    toast.success(status === 'ready' ? 'Touch approved and ready' : 'Draft saved');
    onSaved();
  };

  return <Dialog open onOpenChange={open => !open && onClose()}><DialogContent className="bg-slate-950 border-slate-700 text-white max-w-5xl max-h-[92vh] overflow-y-auto"><DialogHeader><DialogTitle>Touch {touch.touch_number} Content Workspace</DialogTitle></DialogHeader>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4"><p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">{touch.touch_type.replaceAll('_', ' ')}</p><p className="text-white font-semibold mt-1">{touch.purpose}</p><p className="text-slate-500 text-xs mt-1">For {campaign.business_name}{campaign.industry ? ` · ${campaign.industry}` : ''} · Scheduled {touch.scheduled_date}</p></div>
        <div><label className="text-slate-400 text-xs mb-1 block">Choose something valuable from NTA</label>{loading ? <div className="text-slate-500 text-sm"><Loader2 className="w-4 h-4 inline animate-spin mr-2" />Loading the Knowledge Library…</div> : <Select value={assetKey} onValueChange={chooseAsset}><SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="custom">Custom message or resource</SelectItem>{articles.length > 0 && <SelectItem value="article-heading" disabled>— Lessons & Journal Articles —</SelectItem>}{assets.filter(asset => asset.type === 'publishing_article').map(asset => <SelectItem key={asset.key} value={asset.key}>{asset.title}</SelectItem>)}{videos.length > 0 && <SelectItem value="video-heading" disabled>— Published Videos —</SelectItem>}{assets.filter(asset => asset.type === 'youtube_video').map(asset => <SelectItem key={asset.key} value={asset.key}>{asset.title}</SelectItem>)}</SelectContent></Select>}</div>
        <div className="grid grid-cols-2 gap-3"><div><label className="text-slate-400 text-xs mb-1 block">Resource title</label><Input value={form.content_title} onChange={event => setForm(current => ({ ...current, content_title: event.target.value }))} className="bg-slate-900 border-slate-700" /></div><div><label className="text-slate-400 text-xs mb-1 block">Resource URL</label><Input value={form.content_url} onChange={event => setForm(current => ({ ...current, content_url: event.target.value }))} className="bg-slate-900 border-slate-700" /></div></div>
        <div><label className="text-slate-400 text-xs mb-1 block">Subject</label><Input value={form.subject} onChange={event => setForm(current => ({ ...current, subject: event.target.value }))} className="bg-slate-900 border-slate-700" /></div>
        <div><div className="flex items-center justify-between mb-1"><label className="text-slate-400 text-xs">Personal message</label><button onClick={createSuggestedDraft} className="text-cyan-400 text-xs hover:text-cyan-300">Create suggested draft</button></div><textarea value={form.message_body} onChange={event => setForm(current => ({ ...current, message_body: event.target.value }))} rows={15} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm leading-relaxed" /></div>
        <div><label className="text-slate-400 text-xs mb-1 block">Private personalization notes</label><Input value={form.personalization_notes} onChange={event => setForm(current => ({ ...current, personalization_notes: event.target.value }))} placeholder="What do I know about this person or business?" className="bg-slate-900 border-slate-700" /></div>
      </div>
      <div className="lg:col-span-2">
        <div className="sticky top-0 bg-white text-slate-900 rounded-xl overflow-hidden border border-slate-300"><div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2"><Eye className="w-4 h-4" /><p className="font-bold text-sm">Email Preview</p></div><div className="p-4"><p className="text-xs text-slate-500">To: {campaign.contact_email}</p><p className="text-xs text-slate-500 mt-1">From: Rick Hesse · New Tech Advertising</p><p className="font-bold mt-4 pb-3 border-b border-slate-200">{form.subject || 'Subject line'}</p><div className="text-sm whitespace-pre-wrap leading-relaxed mt-4">{form.message_body || 'Your message preview will appear here.'}</div>{form.content_url && <div className="mt-4 bg-blue-50 rounded-lg p-3"><div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">{form.content_source_type === 'youtube_video' ? <Video className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}{form.content_title}</div><p className="text-blue-600 text-xs mt-1 break-all">{form.content_url}</p></div>}</div></div>
      </div>
    </div>
    <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-800"><Button onClick={() => save('draft')} disabled={saving} variant="outline" className="border-slate-600 text-slate-300"><Save className="w-4 h-4 mr-2" />Save Draft</Button><Button onClick={() => save('ready')} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="w-4 h-4 mr-2" />Approve as Ready</Button><Button variant="ghost" onClick={onClose} className="text-slate-400 ml-auto">Close</Button></div>
  </DialogContent></Dialog>;
}
