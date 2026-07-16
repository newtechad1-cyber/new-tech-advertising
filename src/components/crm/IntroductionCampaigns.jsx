import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, CirclePause, Loader2, Mail, MessageCircleReply, Play, Plus, StopCircle } from 'lucide-react';

const DAY_OFFSETS = [0, 3, 7, 12, 18, 25, 35];
const TOUCHES = [
  { type: 'introduction', title: 'A useful introduction', purpose: 'Introduce Rick and offer one practical AI lesson', subject: 'A practical AI resource for your business' },
  { type: 'practical_lesson', title: 'One useful lesson', purpose: 'Teach one immediately useful idea without a pitch', subject: 'One practical way small businesses can use AI' },
  { type: 'short_video', title: 'Short video', purpose: 'Let the prospect hear Rick explain the idea in his own voice', subject: 'A short AI explanation for busy business owners' },
  { type: 'industry_insight', title: 'Industry insight', purpose: 'Connect the lesson to the prospect’s kind of business', subject: 'What this could mean for your business' },
  { type: 'webinar_invitation', title: 'Free learning invitation', purpose: 'Invite them to a free webinar, Chamber session, or Growth Show', subject: 'Free practical AI training for small businesses' },
  { type: 'journal_sample', title: 'Best Journal issue', purpose: 'Share a complete example of the value they would receive weekly', subject: 'Here is this week’s NTA Journal' },
  { type: 'permission_question', title: 'Permission question', purpose: 'Ask clearly whether they want the weekly NTA Journal', subject: 'Should I keep sending these practical AI lessons?' },
];

const addDays = (date, days) => {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};
const today = () => new Date().toISOString().slice(0, 10);

export default function IntroductionCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [touches, setTouches] = useState({});
  const [loading, setLoading] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [starting, setStarting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [campaignData, leadData] = await Promise.all([
      base44.entities.IntroductionCampaign.list('-created_date', 200),
      base44.entities.SalesLead.list('-created_date', 500),
    ]);
    setCampaigns(campaignData || []);
    setLeads((leadData || []).filter(lead => !lead.archived && lead.email));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    active: campaigns.filter(campaign => campaign.status === 'active').length,
    due: campaigns.filter(campaign => campaign.status === 'active' && campaign.next_touch_date <= today()).length,
    replied: campaigns.filter(campaign => campaign.status === 'replied').length,
    subscribed: campaigns.filter(campaign => campaign.status === 'journal_subscriber').length,
  }), [campaigns]);

  const availableLeads = leads.filter(lead => !campaigns.some(campaign => campaign.sales_lead_id === lead.id && ['draft', 'active', 'paused'].includes(campaign.status)));

  const startCampaign = async () => {
    const lead = leads.find(item => item.id === selectedLeadId);
    if (!lead) return toast.error('Choose a prospect with a valid email');
    setStarting(true);
    const startDate = today();
    const campaign = await base44.entities.IntroductionCampaign.create({
      sales_lead_id: lead.id, business_name: lead.business_name, contact_name: lead.contact_name,
      contact_email: lead.email, industry: lead.industry, status: 'active', current_touch: 0,
      started_date: startDate, next_touch_date: startDate,
    });
    await Promise.all(TOUCHES.map((touch, index) => base44.entities.IntroductionTouch.create({
      campaign_id: campaign.id, sales_lead_id: lead.id, touch_number: index + 1, touch_type: touch.type,
      purpose: touch.purpose, subject: touch.subject, scheduled_date: addDays(startDate, DAY_OFFSETS[index]),
      status: 'draft', channel: 'email', message_body: '', content_title: '', content_url: '',
    })));
    await base44.entities.SalesLead.update(lead.id, { next_follow_up: startDate, status: lead.status === 'new' ? 'contacted' : lead.status });
    setStarting(false); setShowStart(false); setSelectedLeadId('');
    toast.success('Seven useful touches created as drafts');
    load();
  };

  const loadTouches = async campaignId => {
    if (expanded === campaignId) return setExpanded(null);
    const data = await base44.entities.IntroductionTouch.filter({ campaign_id: campaignId }, 'touch_number');
    setTouches(current => ({ ...current, [campaignId]: data || [] }));
    setExpanded(campaignId);
  };

  const markTouchSent = async (campaign, touch) => {
    const sentDate = today();
    await base44.entities.IntroductionTouch.update(touch.id, { status: 'sent', sent_date: sentDate });
    const campaignTouches = touches[campaign.id] || [];
    const next = campaignTouches.find(item => item.touch_number === touch.touch_number + 1);
    const completed = touch.touch_number === 7;
    await base44.entities.IntroductionCampaign.update(campaign.id, {
      current_touch: touch.touch_number, last_touch_date: sentDate,
      next_touch_date: next?.scheduled_date || null, status: completed ? 'completed' : 'active',
    });
    await base44.entities.SalesLead.update(campaign.sales_lead_id, { last_contacted: sentDate, next_follow_up: next?.scheduled_date || null });
    toast.success(`Touch ${touch.touch_number} recorded`);
    await load();
    const refreshed = await base44.entities.IntroductionTouch.filter({ campaign_id: campaign.id }, 'touch_number');
    setTouches(current => ({ ...current, [campaign.id]: refreshed || [] }));
  };

  const setCampaignStatus = async (campaign, status, reason) => {
    await base44.entities.IntroductionCampaign.update(campaign.id, { status, stop_reason: reason || '' });
    if (status === 'replied') await base44.entities.SalesLead.update(campaign.sales_lead_id, { status: 'replied', reply_received: true, reply_date: today() });
    if (status === 'opted_out') await base44.entities.SalesLead.update(campaign.sales_lead_id, { journal_permission_status: 'declined' });
    toast.success(status === 'replied' ? 'Reply recorded; automated touches stopped' : 'Campaign stopped');
    load();
  };

  return <div className="space-y-5">
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"><div><p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">NTA 7-Touch Introduction Campaign</p><h2 className="text-white text-xl font-bold mt-1">Keep showing up with something useful</h2><p className="text-slate-400 text-sm mt-1">Every message begins as a draft. The sequence stops when someone replies, opts out, or asks to receive the Journal.</p></div><Button onClick={() => setShowStart(true)} className="bg-cyan-600 hover:bg-cyan-700"><Plus className="w-4 h-4 mr-2" /> Start Campaign</Button></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[['Active', stats.active, 'text-cyan-400'], ['Due Now', stats.due, 'text-amber-400'], ['Replied', stats.replied, 'text-green-400'], ['Journal Subscribers', stats.subscribed, 'text-orange-400']].map(([label, value, color]) => <div key={label} className="bg-slate-800 rounded-xl p-4 text-center"><p className={`text-2xl font-black ${color}`}>{value}</p><p className="text-slate-400 text-xs mt-1">{label}</p></div>)}</div>
    {loading ? <div className="py-12 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div> : campaigns.length === 0 ? <div className="py-12 text-center text-slate-500">No introduction campaigns yet.</div> : <div className="space-y-3">{campaigns.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} expanded={expanded} touches={touches[campaign.id] || []} onExpand={loadTouches} onSent={markTouchSent} onStatus={setCampaignStatus} />)}</div>}
    <div className="bg-blue-950/30 border border-blue-900 rounded-xl p-4 flex gap-3"><BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" /><p className="text-blue-200 text-sm">This build creates and tracks the seven touches; it does not blast them automatically. Each message remains a draft until it has useful, relevant content and you approve the send.</p></div>
    <Dialog open={showStart} onOpenChange={setShowStart}><DialogContent className="bg-slate-900 border-slate-700 text-white"><DialogHeader><DialogTitle>Start a Seven-Touch Introduction</DialogTitle></DialogHeader><p className="text-slate-400 text-sm">Choose a prospect with an email address. Seven draft touches will be scheduled over 35 days.</p><Select value={selectedLeadId} onValueChange={setSelectedLeadId}><SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Choose a prospect" /></SelectTrigger><SelectContent>{availableLeads.map(lead => <SelectItem key={lead.id} value={lead.id}>{lead.business_name} — {lead.contact_name || lead.email}</SelectItem>)}</SelectContent></Select><div className="flex gap-3"><Button onClick={startCampaign} disabled={starting || !selectedLeadId} className="bg-cyan-600 hover:bg-cyan-700 flex-1">{starting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}Create Seven Draft Touches</Button><Button variant="ghost" onClick={() => setShowStart(false)} className="text-slate-400">Cancel</Button></div></DialogContent></Dialog>
  </div>;
}

function CampaignCard({ campaign, expanded, touches, onExpand, onSent, onStatus }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"><div className="p-4 flex items-center gap-4"><div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"><Mail className="w-5 h-5" /></div><div className="flex-1 min-w-0"><div className="flex gap-2 items-center flex-wrap"><p className="text-white font-bold">{campaign.business_name}</p><span className="text-xs rounded-full bg-slate-800 text-slate-400 px-2 py-0.5">{campaign.status.replaceAll('_', ' ')}</span></div><p className="text-slate-500 text-xs mt-1">{campaign.contact_name || campaign.contact_email} · Touch {campaign.current_touch || 0} of 7{campaign.next_touch_date ? ` · Next ${campaign.next_touch_date}` : ''}</p></div><div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => onStatus(campaign, 'replied', 'Prospect replied')} className="text-green-400"><MessageCircleReply className="w-4 h-4 mr-1" /> Reply</Button><Button size="sm" variant="ghost" onClick={() => onStatus(campaign, 'paused', 'Paused manually')} className="text-amber-400"><CirclePause className="w-4 h-4" /></Button><Button size="sm" variant="ghost" onClick={() => onStatus(campaign, 'opted_out', 'Prospect opted out')} className="text-red-400"><StopCircle className="w-4 h-4" /></Button><Button size="icon" variant="ghost" onClick={() => onExpand(campaign.id)} className="text-slate-400">{expanded === campaign.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</Button></div></div>{expanded === campaign.id && <div className="border-t border-slate-800 p-4 space-y-2">{touches.map(touch => { const definition = TOUCHES[touch.touch_number - 1]; return <div key={touch.id} className="bg-slate-800 rounded-lg p-3 flex items-center gap-3"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${touch.status === 'sent' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'}`}>{touch.status === 'sent' ? <CheckCircle2 className="w-4 h-4" /> : touch.touch_number}</div><div className="flex-1"><p className="text-white text-sm font-semibold">{definition?.title}</p><p className="text-slate-500 text-xs">{touch.purpose} · {touch.scheduled_date}</p></div>{touch.status !== 'sent' && <Button size="sm" onClick={() => onSent(campaign, touch)} className="bg-cyan-700 hover:bg-cyan-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Mark Sent</Button>}</div>; })}</div>}</div>;
}
