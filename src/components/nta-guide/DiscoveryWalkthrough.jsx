import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Send, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  DISCOVERY_INTRO,
  DISCOVERY_NOTICE_VERSION,
  getReassuringProgress,
  selectNextQuestion,
} from '@/lib/growth-guide/walkthrough';
import DiscoverySummaryReview from './DiscoverySummaryReview';

const askedStorageKey = sessionId => `nta_discovery_asked_${sessionId}`;
const unwrap = response => response?.data ?? response;

export default function DiscoveryWalkthrough({ credentials, onExit }) {
  const [snapshot, setSnapshot] = useState(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(true);
  const [askedCategories, setAskedCategories] = useState([]);
  const submissionRef = useRef(false);

  const invoke = (name, data) => base44.functions.invoke(name, {
    session_id: credentials.session_id,
    public_session_key: credentials.public_session_key,
    ...data,
  }).then(unwrap);

  const refresh = async () => {
    const next = await invoke('readDiscoverySession', {});
    setSnapshot(next);
    return next;
  };

  useEffect(() => {
    try {
      setAskedCategories(JSON.parse(sessionStorage.getItem(askedStorageKey(credentials.session_id))) || []);
    } catch {
      setAskedCategories([]);
    }
    refresh().catch(() => toast.error('We could not resume this discovery safely.')).finally(() => setBusy(false));
  }, [credentials.session_id]);

  const textConsent = snapshot?.consents?.find(item => item.consent_type === 'discovery_processing');
  const hasDecision = ['granted', 'declined'].includes(textConsent?.state);
  const interpretations = snapshot?.interpretation?.categories || [];
  const nextQuestion = useMemo(() => selectNextQuestion({
    interpretations,
    categories: snapshot?.categories || [],
    askedCategories,
  }), [interpretations, snapshot?.categories, askedCategories]);
  const progress = getReassuringProgress({ interpretations, categories: snapshot?.categories || [] });

  const decideConsent = async state => {
    if (submissionRef.current) return;
    submissionRef.current = true;
    setBusy(true);
    try {
      await invoke('recordDiscoveryConsent', {
        consent_type: 'discovery_processing',
        state,
        notice_version: DISCOVERY_NOTICE_VERSION,
        source: 'website_text',
        affirmative_action: state === 'granted',
      });
      await refresh();
    } catch {
      toast.error('Your choice could not be saved. Please try again.');
    } finally {
      submissionRef.current = false;
      setBusy(false);
    }
  };

  const submitAnswer = async event => {
    event.preventDefault();
    const text = answer.trim();
    if (!text || !nextQuestion || submissionRef.current) return;
    submissionRef.current = true;
    setBusy(true);
    try {
      await invoke('appendDiscoveryEntry', {
        client_request_id: crypto.randomUUID(),
        text,
        speaker: 'owner',
        source_mode: 'text',
      });
      const nextAsked = [...new Set([...askedCategories, nextQuestion.category])];
      sessionStorage.setItem(askedStorageKey(credentials.session_id), JSON.stringify(nextAsked));
      setAskedCategories(nextAsked);
      setAnswer('');
      await refresh();
    } catch {
      toast.error('Your answer was not saved. Nothing has been lost—please try again.');
    } finally {
      submissionRef.current = false;
      setBusy(false);
    }
  };

  if (busy && !snapshot) {
    return <div className="flex flex-1 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  }

  if (!hasDecision) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-2xl border border-blue-800/50 bg-blue-950/25 p-5">
          <ShieldCheck className="mb-4 h-8 w-8 text-blue-400" />
          <h4 className="text-lg font-bold text-white">{DISCOVERY_INTRO.title}</h4>
          <p className="mt-3 text-sm leading-6 text-slate-300">{DISCOVERY_INTRO.body}</p>
          <p className="mt-4 text-xs leading-5 text-slate-400">May NTA save the answers you type during this discovery so the Growth Guide can understand them and prepare your summary?</p>
          <div className="mt-5 grid gap-2">
            <Button disabled={busy} onClick={() => decideConsent('granted')} className="bg-blue-600 hover:bg-blue-500">Yes, begin my discovery</Button>
            <Button disabled={busy} onClick={() => decideConsent('declined')} variant="outline" className="border-slate-700 text-slate-300">No, return to general guidance</Button>
          </div>
        </div>
      </div>
    );
  }

  if (textConsent.state === 'declined') {
    return <div className="flex-1 p-6 text-sm leading-6 text-slate-300">That’s completely fine. Your choice was recorded, and no discovery answers will be requested.<Button onClick={onExit} variant="outline" className="mt-5 w-full border-slate-700">Return to general guidance</Button></div>;
  }

  if (!nextQuestion || snapshot?.session?.status === 'summary_ready' || snapshot?.session?.status === 'confirmed') {
    return <DiscoverySummaryReview snapshot={snapshot} invoke={invoke} refresh={refresh} />;
  }

  return (
    <>
      <div className="border-b border-slate-800 bg-slate-900/70 px-5 py-3">
        <div className="flex justify-between text-xs text-slate-300"><span>{progress.label}</span><span>{progress.percent}%</span></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${progress.percent}%` }} /></div>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex gap-3">
          <div className="mt-1 h-8 w-8 shrink-0 rounded-xl bg-slate-800 p-2"><ShieldCheck className="h-4 w-4 text-blue-400" /></div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm leading-6 text-slate-100">
            {nextQuestion.prompt}
          </div>
        </div>
        {snapshot?.entries?.filter(item => item.speaker === 'owner').slice(-3).map(entry => (
          <div key={entry.id} className="ml-auto mt-4 max-w-[85%] rounded-2xl bg-blue-600 px-4 py-3 text-sm leading-6 text-white">{entry.text}</div>
        ))}
      </div>
      <form onSubmit={submitAnswer} className="border-t border-slate-800 bg-slate-900 p-4">
          <div className="relative">
            <Input value={answer} onChange={event => setAnswer(event.target.value)} disabled={busy} placeholder="Answer in your own words…" className="bg-slate-800 py-6 pl-4 pr-14 text-white" />
            <Button type="submit" size="icon" disabled={busy || !answer.trim()} className="absolute bottom-2 right-2 top-2 h-auto w-10 bg-blue-600"><Send className="h-4 w-4" /></Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-500">One question at a time. There are no wrong answers.</p>
      </form>
    </>
  );
}
