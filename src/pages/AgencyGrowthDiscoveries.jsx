import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import {
  BookOpenCheck, CheckCircle2, ChevronRight, CircleHelp, ClipboardList,
  Loader2, Mail, Map, Phone, RefreshCw, Save, UserRound, X
} from 'lucide-react';

const STATUSES = [
  ['new', 'New'],
  ['reviewing', 'Reviewing'],
  ['waiting_on_owner', 'Waiting on owner'],
  ['roadmap_in_progress', 'Roadmap in progress'],
  ['ready_to_follow_up', 'Ready to follow up'],
  ['completed', 'Completed']
];

const TUTORIAL = [
  ['Your discovery queue', 'New Growth Discoveries appear on the left. Use the status filter to focus your work.'],
  ['Review what the owner said', 'The Overview tab shows the owner-confirmed understanding, corrections, and requested next step.'],
  ['Check contact and permission', 'Contact details and consent are kept separate so you only follow up in the way the owner approved.'],
  ['Keep private working notes', 'Notes are for NTA only. Save observations and questions without changing the owner’s confirmed summary.'],
  ['Prepare the Growth Roadmap', 'Draft the practical priorities, phases, and next recommendation here before contacting the owner.']
];

const getData = result => result?.data || result || {};
const formatDate = value => value ? new Date(value).toLocaleString() : 'Not recorded';
const titleFor = item => item.contact?.name || item.summary?.why_owner_came || 'Anonymous discovery';

export default function AgencyGrowthDiscoveries() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [tutorial, setTutorial] = useState(null);

  const load = async () => {
    setLoading(true); setMessage('');
    try {
      const response = await base44.functions.invoke('manageDiscoveryAdmin', { action: 'list' });
      const discoveries = getData(response).discoveries || [];
      setItems(discoveries);
      setSelectedId(current => current && discoveries.some(x => x.session.id === current)
        ? current : discoveries[0]?.session.id || null);
    } catch (error) {
      setMessage(error?.message || 'Growth Discoveries could not be loaded.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter(item =>
    filter === 'all' || item.workspace.workflow_status === filter
  ), [items, filter]);
  const selected = items.find(item => item.session.id === selectedId) || null;

  const patchWorkspace = patch => {
    setItems(current => current.map(item => item.session.id === selectedId
      ? { ...item, workspace: { ...item.workspace, ...patch } } : item));
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true); setMessage('');
    try {
      const payload = { action: 'save', session_id: selected.session.id, ...selected.workspace };
      const response = await base44.functions.invoke('manageDiscoveryAdmin', payload);
      patchWorkspace(getData(response).workspace || selected.workspace);
      setMessage('Workspace saved.');
    } catch (error) {
      setMessage(error?.message || 'The workspace could not be saved.');
    } finally { setSaving(false); }
  };

  return (
    <AgencyLayout>
      <div className="min-h-full p-4 md:p-6 text-slate-100">
        <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Growth Guide</p>
            <h1 className="text-2xl font-black mt-1">Growth Discoveries</h1>
            <p className="text-sm text-slate-400 mt-1">Review what each owner shared and prepare the next useful step.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTutorial(0)} className="btn-secondary"><CircleHelp className="w-4 h-4" /> Help me use this page</button>
            <button onClick={load} className="btn-secondary"><RefreshCw className="w-4 h-4" /> Refresh</button>
          </div>
        </header>

        {message && <div className="mb-4 rounded-lg border border-blue-800 bg-blue-950/50 px-4 py-3 text-sm text-blue-200">{message}</div>}

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-5">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <label className="text-xs text-slate-500 font-bold uppercase">Work status</label>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="field mt-2">
                <option value="all">All discoveries</option>
                {STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
              {loading && <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" /></div>}
              {!loading && filtered.length === 0 && <p className="p-6 text-sm text-slate-500">No discoveries match this status yet.</p>}
              {filtered.map(item => (
                <button key={item.session.id} onClick={() => { setSelectedId(item.session.id); setTab('overview'); }}
                  className={`w-full text-left p-4 border-b border-slate-800 hover:bg-slate-800/70 transition-colors ${selectedId === item.session.id ? 'bg-blue-950/50 border-l-2 border-l-blue-500' : ''}`}>
                  <div className="flex gap-2 justify-between">
                    <p className="text-sm font-semibold text-white line-clamp-2">{titleFor(item)}</p>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{formatDate(item.session.last_activity_at)}</p>
                  <p className="text-xs text-blue-300 mt-1">{STATUSES.find(x => x[0] === item.workspace.workflow_status)?.[1] || 'New'}</p>
                </button>
              ))}
            </div>
          </aside>

          <main className="rounded-2xl border border-slate-800 bg-slate-900 min-h-[600px]">
            {!selected && !loading && <div className="p-12 text-center text-slate-500">Select a Growth Discovery to begin.</div>}
            {selected && <>
              <div className="p-5 border-b border-slate-800 flex flex-wrap gap-4 justify-between">
                <div>
                  <h2 className="text-xl font-bold">{titleFor(selected)}</h2>
                  <p className="text-xs text-slate-500 mt-1">Visitor status: {selected.session.status?.replaceAll('_', ' ')} · {selected.session.mode || 'text'}</p>
                </div>
                <div className="flex items-end gap-2">
                  <label className="text-xs text-slate-500">NTA work status
                    <select value={selected.workspace.workflow_status} onChange={e => patchWorkspace({ workflow_status: e.target.value })} className="field mt-1 min-w-44">
                      {STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <button onClick={save} disabled={saving} className="btn-primary">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </button>
                </div>
              </div>

              <nav className="flex gap-1 px-5 pt-4 overflow-x-auto">
                {[['overview','Overview',ClipboardList],['contact','Contact & consent',UserRound],['notes','Internal notes',BookOpenCheck],['roadmap','Growth Roadmap',Map]].map(([key,label,Icon]) => (
                  <button key={key} onClick={() => setTab(key)} className={`tab ${tab === key ? 'tab-active' : ''}`}><Icon className="w-4 h-4" />{label}</button>
                ))}
              </nav>

              <div className="p-5">
                {tab === 'overview' && <Overview item={selected} />}
                {tab === 'contact' && <Contact item={selected} />}
                {tab === 'notes' && <Editor title="Private NTA notes" hint="Record observations, questions, and follow-up preparation. These notes are never shown to the visitor." value={selected.workspace.internal_notes || ''} onChange={value => patchWorkspace({ internal_notes: value })} />}
                {tab === 'roadmap' && <Editor title="Growth Roadmap draft" hint="Turn the confirmed discovery into priorities, phases, responsibilities, and the recommended next step." value={selected.workspace.roadmap_draft || ''} onChange={value => patchWorkspace({ roadmap_draft: value })} large />}
              </div>
            </>}
          </main>
        </div>

        {tutorial !== null && <Tutorial step={tutorial} setStep={setTutorial} />}
        <style>{`
          .btn-secondary{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem .75rem;border:1px solid rgb(51 65 85);border-radius:.6rem;color:rgb(203 213 225);font-size:.75rem;font-weight:700}
          .btn-secondary:hover{background:rgb(30 41 59)} .btn-primary{display:inline-flex;align-items:center;gap:.4rem;padding:.6rem .9rem;background:rgb(37 99 235);border-radius:.6rem;font-size:.8rem;font-weight:700}
          .btn-primary:disabled{opacity:.6}.field{display:block;width:100%;background:rgb(15 23 42);border:1px solid rgb(51 65 85);border-radius:.55rem;padding:.55rem .7rem;color:white;font-size:.8rem}
          .tab{display:inline-flex;align-items:center;gap:.4rem;padding:.65rem .8rem;border-radius:.55rem .55rem 0 0;color:rgb(148 163 184);font-size:.8rem;font-weight:700;white-space:nowrap}
          .tab-active{background:rgb(30 41 59);color:white}.panel{border:1px solid rgb(51 65 85);background:rgb(15 23 42 / .65);border-radius:.75rem;padding:1rem}
        `}</style>
      </div>
    </AgencyLayout>
  );
}

function Overview({ item }) {
  const summary = item.summary;
  const handoff = item.handoff;
  if (!summary) return <div className="panel text-sm text-slate-400">This discovery has not reached a confirmed summary yet. It remains visible so you can see where the visitor stopped.</div>;
  const fields = [
    ['Why they came', summary.why_owner_came], ['What they want', summary.owner_goal],
    ['Greatest difficulty', summary.greatest_difficulty], ['What happens now', summary.present_process],
    ['What is working', summary.what_is_working], ['What may be missing', summary.possibly_missing_or_disconnected],
    ['Desired improvement', summary.desired_improvement], ['Readiness', summary.readiness],
    ['Still needed', summary.information_still_needed]
  ];
  return <div className="space-y-4">
    {handoff && <div className="panel border-blue-800"><p className="text-xs uppercase font-bold text-blue-400">Requested next step</p><p className="mt-1 font-semibold">{handoff.handoff_type?.replaceAll('_',' ')}</p></div>}
    <div className="grid md:grid-cols-2 gap-3">{fields.map(([label,value]) => value && <div key={label} className="panel"><p className="text-xs uppercase font-bold text-slate-500">{label}</p><p className="text-sm text-slate-200 mt-2 whitespace-pre-wrap">{value}</p></div>)}</div>
    {!!summary.owner_corrections?.length && <div className="panel"><p className="text-xs uppercase font-bold text-amber-400">Owner corrections</p><ul className="mt-2 text-sm list-disc pl-5">{summary.owner_corrections.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
  </div>;
}

function Contact({ item }) {
  const contact = item.contact;
  const granted = item.consents.filter(x => x.state === 'granted');
  return <div className="grid md:grid-cols-2 gap-4">
    <div className="panel space-y-3"><h3 className="font-bold">Contact preference</h3>
      {!contact && <p className="text-sm text-slate-500">No contact information was provided.</p>}
      {contact && <>
        <p className="flex gap-2 text-sm"><UserRound className="w-4 h-4 text-slate-500"/>{contact.name || 'Name not provided'}</p>
        <p className="flex gap-2 text-sm"><Mail className="w-4 h-4 text-slate-500"/>{contact.email || 'Email not provided'}</p>
        <p className="flex gap-2 text-sm"><Phone className="w-4 h-4 text-slate-500"/>{contact.phone || 'Phone not provided'}</p>
        <p className="text-xs text-slate-500">Preferred: {contact.preferred_channel?.replaceAll('_',' ') || 'Not specified'}{contact.best_time ? ` · ${contact.best_time}` : ''}</p>
      </>}
    </div>
    <div className="panel"><h3 className="font-bold">Granted permissions</h3>
      {granted.length === 0 ? <p className="text-sm text-slate-500 mt-3">No optional permissions granted.</p> :
      <ul className="mt-3 space-y-2">{granted.map(x => <li key={x.consent_type} className="flex gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400"/>{x.consent_type.replaceAll('_',' ')}</li>)}</ul>}
      <p className="text-xs text-slate-600 mt-4">Journal permission stays separate from personal follow-up permission.</p>
    </div>
  </div>;
}

function Editor({ title, hint, value, onChange, large }) {
  return <div><h3 className="font-bold">{title}</h3><p className="text-sm text-slate-500 mt-1 mb-4">{hint}</p>
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={large ? 18 : 12} className="field resize-y leading-6" placeholder="Begin writing here…" />
    <p className="text-xs text-slate-600 mt-2">Use the Save button above when you are finished.</p>
  </div>;
}

function Tutorial({ step, setStep }) {
  const [title, text] = TUTORIAL[step];
  return <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-lg rounded-2xl border border-blue-700 bg-slate-900 p-6 shadow-2xl">
      <div className="flex justify-between gap-4"><p className="text-xs font-bold uppercase tracking-widest text-blue-400">Step {step + 1} of {TUTORIAL.length}</p><button onClick={() => setStep(null)} aria-label="Close tutorial"><X className="w-5 h-5 text-slate-500"/></button></div>
      <h2 className="text-xl font-black mt-3">{title}</h2><p className="text-slate-300 mt-3 leading-6">{text}</p>
      <div className="h-1.5 bg-slate-800 rounded-full mt-6"><div className="h-full bg-blue-500 rounded-full" style={{width:`${((step+1)/TUTORIAL.length)*100}%`}} /></div>
      <div className="flex justify-between mt-6"><button onClick={() => step ? setStep(step-1) : setStep(null)} className="btn-secondary">{step ? 'Back' : 'Close'}</button>
        <button onClick={() => step === TUTORIAL.length-1 ? setStep(null) : setStep(step+1)} className="btn-primary">{step === TUTORIAL.length-1 ? 'Finish' : 'Next'}</button></div>
    </div>
  </div>;
}
