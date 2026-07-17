import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, BookOpen, Check, Loader2, Mail, Plus, Repeat2, UserRoundSearch, WandSparkles } from 'lucide-react';
import TouchContentWorkspace from './TouchContentWorkspace';

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

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (date, days) => {
  const value = new Date(`${date}T12:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};

const EMPTY_PROSPECT = {
  business_name: '', contact_name: '', email: '', industry: '', lead_source: 'manual',
  first_contact_method: 'not_contacted', relationship_origin: '', status: 'new', priority: 'medium',
};

const STEPS = [
  { number: 1, label: 'Prospect', icon: UserRoundSearch },
  { number: 2, label: 'Introduction', icon: Mail },
  { number: 3, label: 'Prepare touch', icon: BookOpen },
  { number: 4, label: 'Keep going', icon: Repeat2 },
];

export default function ProspectingWizard({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [leads, setLeads] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [lead, setLead] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [nextTouch, setNextTouch] = useState(null);
  const [form, setForm] = useState(EMPTY_PROSPECT);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const [leadData, campaignData] = await Promise.all([
      base44.entities.SalesLead.list('-created_date', 500),
      base44.entities.IntroductionCampaign.list('-created_date', 300),
    ]);
    setLeads((leadData || []).filter(item => !item.archived));
    setCampaigns(campaignData || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const activeCampaign = useMemo(() => campaigns.find(item => item.sales_lead_id === lead?.id && ['draft', 'active', 'paused'].includes(item.status)), [campaigns, lead]);

  const chooseLead = id => {
    const selected = leads.find(item => item.id === id);
    setSelectedLeadId(id);
    setLead(selected || null);
  };

  const createProspect = async () => {
    if (!form.business_name.trim() || !form.email.trim()) return toast.error('Business name and email are required');
    setSaving(true);
    try {
      const created = await base44.entities.SalesLead.create(form);
      setLeads(current => [created, ...current]);
      setLead(created);
      setSelectedLeadId(created.id);
      setAdding(false);
      setStep(2);
      toast.success('Prospect saved. Now confirm the introduction plan.');
    } finally { setSaving(false); }
  };

  const continueWithProspect = () => {
    if (!lead) return toast.error('Choose a prospect or add a new one');
    if (!lead.email) return toast.error('This prospect needs an email address before starting');
    setStep(2);
  };

  const loadNextTouch = async selectedCampaign => {
    const data = await base44.entities.IntroductionTouch.filter({ campaign_id: selectedCampaign.id }, 'touch_number');
    const next = (data || []).find(item => !['sent', 'skipped'].includes(item.status)) || null;
    setNextTouch(next);
    return next;
  };

  const startOrResume = async () => {
    setSaving(true);
    try {
      if (activeCampaign) {
        setCampaign(activeCampaign);
        await loadNextTouch(activeCampaign);
        setStep(3);
        return;
      }
      const startDate = today();
      const created = await base44.entities.IntroductionCampaign.create({
        sales_lead_id: lead.id, business_name: lead.business_name, contact_name: lead.contact_name,
        contact_email: lead.email, industry: lead.industry, status: 'active', current_touch: 0,
        started_date: startDate, next_touch_date: startDate,
      });
      const createdTouches = await Promise.all(TOUCHES.map((touch, index) => base44.entities.IntroductionTouch.create({
        campaign_id: created.id, sales_lead_id: lead.id, touch_number: index + 1, touch_type: touch.type,
        purpose: touch.purpose, subject: touch.subject, scheduled_date: addDays(startDate, DAY_OFFSETS[index]),
        status: 'draft', channel: 'email', message_body: '', content_title: '', content_url: '',
      })));
      await base44.entities.SalesLead.update(lead.id, {
        next_follow_up: startDate, status: lead.status === 'new' ? 'contacted' : lead.status,
      });
      setCampaign(created);
      setNextTouch(createdTouches[0]);
      setCampaigns(current => [created, ...current]);
      setStep(3);
      toast.success('Seven draft touches are scheduled. Nothing has been sent.');
    } finally { setSaving(false); }
  };

  const handleWorkspaceSaved = async () => {
    setWorkspaceOpen(false);
    await loadNextTouch(campaign);
    setStep(4);
  };

  const reset = () => {
    setStep(1); setLead(null); setCampaign(null); setNextTouch(null); setSelectedLeadId('');
    setForm(EMPTY_PROSPECT); setAdding(false);
    load();
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-violet-800/60 bg-gradient-to-br from-violet-950/70 to-slate-900 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div><div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-widest"><WandSparkles className="w-4 h-4" /> Start Here</div><h2 className="text-2xl font-black text-white mt-2">Guided Prospecting & Follow-Up</h2><p className="text-slate-300 mt-2 max-w-2xl">One guided path from a person you want to meet to a useful, personal first message. The system schedules the follow-up; you stay in control of every send.</p></div>
        <Button variant="outline" onClick={() => onNavigate('journey')} className="border-violet-600 text-violet-200">See the whole process</Button>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {STEPS.map(item => { const Icon = item.icon; const active = step === item.number; const complete = step > item.number; return <div key={item.number} className={`rounded-xl border p-3 flex items-center gap-3 ${active ? 'bg-violet-950/60 border-violet-600' : complete ? 'bg-emerald-950/30 border-emerald-900' : 'bg-slate-900 border-slate-800'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center ${complete ? 'bg-emerald-600' : active ? 'bg-violet-600' : 'bg-slate-800'}`}>{complete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}</div><div><p className="text-slate-500 text-[10px] uppercase">Step {item.number}</p><p className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-400'}`}>{item.label}</p></div></div>; })}
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[350px]">
      {loading ? <div className="py-20 text-center text-slate-500"><Loader2 className="w-7 h-7 animate-spin mx-auto mb-3" />Loading your prospects…</div> : step === 1 ? <div className="max-w-3xl mx-auto">
        <p className="text-violet-400 text-xs font-bold uppercase tracking-wider">Step 1 · Who do you want to introduce yourself to?</p><h3 className="text-white text-xl font-bold mt-1">Choose an existing prospect or add one now</h3><p className="text-slate-400 text-sm mt-2">This is your online version of walking into a business and learning who is there.</p>
        {!adding ? <div className="mt-6 space-y-4"><Select value={selectedLeadId} onValueChange={chooseLead}><SelectTrigger className="bg-slate-950 border-slate-700 h-12"><SelectValue placeholder="Choose a prospect" /></SelectTrigger><SelectContent>{leads.map(item => <SelectItem key={item.id} value={item.id}>{item.business_name} — {item.contact_name || item.email || 'No contact yet'}</SelectItem>)}</SelectContent></Select><div className="flex flex-wrap gap-3"><Button onClick={continueWithProspect} disabled={!lead} className="bg-violet-600 hover:bg-violet-700">Use This Prospect <ArrowRight className="w-4 h-4 ml-2" /></Button><Button variant="outline" onClick={() => setAdding(true)} className="border-slate-600 text-slate-300"><Plus className="w-4 h-4 mr-2" />Add a New Prospect</Button></div></div> : <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Business name *"><Input value={form.business_name} onChange={e => setForm(current => ({ ...current, business_name: e.target.value }))} className="bg-slate-950 border-slate-700" /></Field><Field label="Contact name"><Input value={form.contact_name} onChange={e => setForm(current => ({ ...current, contact_name: e.target.value }))} className="bg-slate-950 border-slate-700" /></Field><Field label="Email *"><Input type="email" value={form.email} onChange={e => setForm(current => ({ ...current, email: e.target.value }))} className="bg-slate-950 border-slate-700" /></Field><Field label="Industry"><Input value={form.industry} onChange={e => setForm(current => ({ ...current, industry: e.target.value }))} placeholder="Restaurant, retail, chamber…" className="bg-slate-950 border-slate-700" /></Field><Field label="Where did you find them?"><Select value={form.lead_source} onValueChange={value => setForm(current => ({ ...current, lead_source: value }))}><SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{['manual','chamber','event','referral','website','facebook','linkedin','google_maps','cold_email','phone_call','other'].map(value => <SelectItem key={value} value={value}>{value.replaceAll('_', ' ')}</SelectItem>)}</SelectContent></Select></Field><Field label="How did you first connect?"><Select value={form.first_contact_method} onValueChange={value => setForm(current => ({ ...current, first_contact_method: value }))}><SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger><SelectContent>{['not_contacted','email','phone','linkedin','facebook','in_person','website','referral','event','other'].map(value => <SelectItem key={value} value={value}>{value.replaceAll('_', ' ')}</SelectItem>)}</SelectContent></Select></Field><div className="md:col-span-2"><Field label="What is the human story of this contact?"><Input value={form.relationship_origin} onChange={e => setForm(current => ({ ...current, relationship_origin: e.target.value }))} placeholder="Met at a Chamber event; spoke briefly about employee training…" className="bg-slate-950 border-slate-700" /></Field></div><div className="md:col-span-2 flex gap-3"><Button onClick={createProspect} disabled={saving} className="bg-violet-600 hover:bg-violet-700">{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Save & Continue</Button><Button variant="ghost" onClick={() => setAdding(false)} className="text-slate-400">Cancel</Button></div>
        </div>}
      </div> : step === 2 ? <div className="max-w-3xl mx-auto">
        <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Step 2 · Plan the introduction</p><h3 className="text-white text-xl font-bold mt-1">Start with value, not a sales pitch</h3><div className="mt-5 bg-slate-950 border border-slate-800 rounded-xl p-5"><p className="text-white font-bold text-lg">{lead.business_name}</p><p className="text-slate-400 text-sm">{lead.contact_name || 'Contact name not recorded'} · {lead.email}</p>{lead.industry && <p className="text-slate-500 text-sm mt-1">Industry: {lead.industry}</p>}{lead.relationship_origin && <p className="text-slate-300 text-sm mt-4 border-l-2 border-cyan-600 pl-3">{lead.relationship_origin}</p>}</div><div className="mt-5 bg-cyan-950/30 border border-cyan-900 rounded-xl p-4"><p className="text-cyan-200 font-semibold">What happens next</p><p className="text-slate-300 text-sm mt-1">Seven draft follow-ups are scheduled across 35 days. Nothing is emailed automatically. You prepare each touch with a useful lesson or video, review it, and decide when it is ready.</p></div><div className="flex flex-wrap gap-3 mt-6"><Button onClick={startOrResume} disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">{saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Repeat2 className="w-4 h-4 mr-2" />}{activeCampaign ? 'Resume Existing Campaign' : 'Create the 7 Draft Touches'}</Button><Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></div>
      </div> : step === 3 ? <div className="max-w-3xl mx-auto">
        <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Step 3 · Prepare the next touch</p><h3 className="text-white text-xl font-bold mt-1">Choose the knowledge that will help this person</h3>{nextTouch ? <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"><div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">{nextTouch.touch_number}</div><div className="flex-1"><p className="text-white font-bold">{TOUCHES[nextTouch.touch_number - 1]?.title}</p><p className="text-slate-400 text-sm mt-1">{nextTouch.purpose}</p><p className="text-slate-500 text-xs mt-2">Scheduled {nextTouch.scheduled_date} · Currently {nextTouch.status}</p></div><Button onClick={() => setWorkspaceOpen(true)} className="bg-amber-600 hover:bg-amber-700"><BookOpen className="w-4 h-4 mr-2" />Choose Lesson or Video</Button></div> : <div className="mt-6 text-slate-400">All seven touches have already been handled.</div>}<div className="mt-5 text-slate-400 text-sm"><p>The content workspace will show:</p><ul className="list-disc ml-5 mt-2 space-y-1"><li>approved NTA Journal lessons</li><li>published videos from the Knowledge Library</li><li>a suggested personal message you can edit</li><li>a preview before anything is marked ready</li></ul></div><Button variant="ghost" onClick={() => setStep(2)} className="text-slate-400 mt-5"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
      </div> : <div className="max-w-3xl mx-auto text-center py-4">
        <div className="w-14 h-14 rounded-full bg-emerald-600 mx-auto flex items-center justify-center"><Check className="w-7 h-7" /></div><p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mt-4">The system is working</p><h3 className="text-white text-2xl font-bold mt-1">Your prospect and follow-up plan are connected</h3><p className="text-slate-300 mt-3">Use the 7-Touch Campaign screen as your daily follow-up list. It shows what is due, what still needs content, and what is ready for you to send.</p><div className="flex flex-wrap justify-center gap-3 mt-7"><Button onClick={() => onNavigate('introduction')} className="bg-emerald-600 hover:bg-emerald-700"><Repeat2 className="w-4 h-4 mr-2" />Open Scheduled Touches</Button><Button variant="outline" onClick={reset} className="border-slate-600 text-slate-300"><Plus className="w-4 h-4 mr-2" />Start Another Prospect</Button></div>
      </div>}
    </div>
    {workspaceOpen && campaign && nextTouch && <TouchContentWorkspace campaign={campaign} touch={nextTouch} onClose={() => setWorkspaceOpen(false)} onSaved={handleWorkspaceSaved} />}
  </div>;
}

function Field({ label, children }) {
  return <label className="block"><span className="text-slate-400 text-xs mb-1 block">{label}</span>{children}</label>;
}
