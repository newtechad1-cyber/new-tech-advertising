import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Loader2, Mic, MicOff, Send, ShieldCheck } from 'lucide-react';
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
import DiscoveryHandoff from './DiscoveryHandoff';

const askedStorageKey = sessionId => `nta_discovery_asked_${sessionId}`;
const unwrap = response => response?.data ?? response;

export default function DiscoveryWalkthrough({ credentials, onExit, onSaved, onSchedule }) {
  const [snapshot, setSnapshot] = useState(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(true);
  const [askedCategories, setAskedCategories] = useState([]);
  const [answerMode, setAnswerMode] = useState(null);
  const [listening, setListening] = useState(false);
  const submissionRef = useRef(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

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

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const textConsent = snapshot?.consents?.find(item => item.consent_type === 'discovery_processing');
  const microphoneConsent = snapshot?.consents?.find(item => item.consent_type === 'microphone');
  const transcriptionConsent = snapshot?.consents?.find(item => item.consent_type === 'transcription');
  const hasDecision = ['granted', 'declined'].includes(textConsent?.state);
  const voiceReady = microphoneConsent?.state === 'granted' && transcriptionConsent?.state === 'granted';
  const interpretations = snapshot?.interpretation?.categories || [];
  const nextQuestion = useMemo(() => selectNextQuestion({
    interpretations,
    categories: snapshot?.categories || [],
    askedCategories,
  }), [interpretations, snapshot?.categories, askedCategories]);
  const progress = getReassuringProgress({ interpretations, categories: snapshot?.categories || [] });
  const confirmedSummary = snapshot?.summaries?.some(item => item.confirmation_state === 'confirmed');

  useEffect(() => {
    if (hasDecision && textConsent?.state === 'granted' && !answerMode) {
      setAnswerMode(voiceReady ? 'voice' : 'text');
    }
  }, [answerMode, hasDecision, textConsent?.state, voiceReady]);

  const recordConsent = (consent_type, state, source) => invoke('recordDiscoveryConsent', {
    consent_type,
    state,
    notice_version: DISCOVERY_NOTICE_VERSION,
    source,
    affirmative_action: state === 'granted',
  });

  const chooseMode = async mode => {
    if (submissionRef.current) return;
    submissionRef.current = true;
    setBusy(true);
    try {
      const source = mode === 'voice' ? 'website_voice' : 'website_text';
      await recordConsent('discovery_processing', 'granted', source);
      if (mode === 'voice') {
        await recordConsent('microphone', 'granted', source);
        await recordConsent('transcription', 'granted', source);
        // This flow stores the transcript, never the audio recording.
        await recordConsent('raw_audio_retention', 'declined', source);
      }
      setAnswerMode(mode);
      await refresh();
    } catch {
      toast.error('Your choice could not be saved. Please try again.');
    } finally {
      submissionRef.current = false;
      setBusy(false);
    }
  };

  const declineDiscovery = async () => {
    if (submissionRef.current) return;
    submissionRef.current = true;
    setBusy(true);
    try {
      await recordConsent('discovery_processing', 'declined', 'website_text');
      await refresh();
    } catch {
      toast.error('Your choice could not be saved. Please try again.');
    } finally {
      submissionRef.current = false;
      setBusy(false);
    }
  };

  const toggleListening = () => {
    if (!SpeechRecognition) {
      toast.error('Voice answers are not supported by this browser. You can still type your answer.');
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = event => {
      const transcript = Array.from(event.results).map(result => result[0].transcript).join(' ');
      setAnswer(transcript.trim());
    };
    recognition.onerror = () => {
      setListening(false);
      toast.error('I could not hear that clearly. You can try again or type your answer.');
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
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
        source_mode: answerMode === 'voice' ? 'voice_transcript' : 'text',
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
          <p className="mt-4 text-xs leading-5 text-slate-400">Choose how you would like to answer. NTA will save your words—not a voice recording—so the Growth Guide can understand them and prepare your summary.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button disabled={busy || !SpeechRecognition} onClick={() => chooseMode('voice')} className="h-auto flex-col gap-2 bg-blue-600 py-4 hover:bg-blue-500"><Mic className="h-5 w-5" />Talk it through</Button>
            <Button disabled={busy} onClick={() => chooseMode('text')} variant="outline" className="h-auto flex-col gap-2 border-slate-700 py-4 text-slate-200"><Keyboard className="h-5 w-5" />Type my answers</Button>
          </div>
          {!SpeechRecognition && <p className="mt-3 text-xs text-amber-300">Voice is not available in this browser. Typing is still available.</p>}
          <Button disabled={busy} onClick={declineDiscovery} variant="ghost" className="mt-3 w-full text-slate-400">No, return to general guidance</Button>
        </div>
      </div>
    );
  }

  if (textConsent.state === 'declined') {
    return <div className="flex-1 p-6 text-sm leading-6 text-slate-300">That’s completely fine. Your choice was recorded, and no discovery answers will be requested.<Button onClick={onExit} variant="outline" className="mt-5 w-full border-slate-700">Return to general guidance</Button></div>;
  }

  if (confirmedSummary) {
    return <DiscoveryHandoff snapshot={snapshot} invoke={invoke} refresh={refresh} onSaved={onSaved} onSchedule={onSchedule} />;
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
            <Input value={answer} onChange={event => setAnswer(event.target.value)} disabled={busy} placeholder={listening ? 'Listening…' : 'Answer in your own words…'} className="bg-slate-800 py-6 pl-4 pr-24 text-white" />
            {answerMode === 'voice' && <Button type="button" size="icon" onClick={toggleListening} disabled={busy} aria-label={listening ? 'Stop listening' : 'Start voice answer'} className={`absolute bottom-2 right-12 top-2 h-auto w-10 ${listening ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-700 hover:bg-slate-600'}`}>{listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}</Button>}
            <Button type="submit" size="icon" disabled={busy || !answer.trim()} className="absolute bottom-2 right-2 top-2 h-auto w-10 bg-blue-600"><Send className="h-4 w-4" /></Button>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500"><span>One question at a time. There are no wrong answers.</span>{(answerMode === 'voice' || SpeechRecognition) && <button type="button" className="text-blue-400 hover:text-blue-300" onClick={() => { recognitionRef.current?.abort(); setListening(false); if (answerMode === 'voice') setAnswerMode('text'); else chooseMode('voice'); }}>{answerMode === 'voice' ? 'Use typing' : 'Use voice'}</button>}</div>
      </form>
    </>
  );
}
