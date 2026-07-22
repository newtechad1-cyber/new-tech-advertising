import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Mail, Phone, Save, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { HANDOFF_OPTIONS, contactRequirements, validateHandoffContact } from '@/lib/growth-guide/handoff';

const ICONS = { schedule_growth_conversation: CalendarDays, request_callback: Phone, continue_by_email: Mail, receive_summary: Mail, save_and_return: Save };
const newestConfirmed = summaries => [...(summaries || [])].filter(item => item.confirmation_state === 'confirmed').sort((a, b) => b.version - a.version)[0];

export default function DiscoveryHandoff({ snapshot, invoke, refresh, onSaved, onSchedule }) {
  const confirmedSummary = newestConfirmed(snapshot?.summaries);
  const existing = snapshot?.handoffs || [];
  const [selected, setSelected] = useState(null);
  const [contact, setContact] = useState({ name: '', email: '', phone: '', best_time: '' });
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(existing.at(-1)?.handoff_type || null);
  const [journalChoice, setJournalChoice] = useState(null);
  const [journalEmail, setJournalEmail] = useState('');
  const requirements = useMemo(() => contactRequirements(selected), [selected]);

  const grantConsent = consentType => invoke('recordDiscoveryConsent', {
    consent_type: consentType, state: 'granted', notice_version: 'growth-guide-handoff-1.0', source: 'website_text', affirmative_action: true,
  });

  const submitHandoff = async event => {
    event?.preventDefault();
    const validation = validateHandoffContact(selected, contact);
    if (validation) return toast.error(validation);
    setBusy(true);
    try {
      if (selected === 'save_and_return') {
        await grantConsent('save_and_return');
        const saved = await invoke('setDiscoveryRetention', { target: 'working_discovery', action: 'save' });
        await invoke('requestDiscoveryHandoff', { handoff_type: selected, confirmed_summary_id: confirmedSummary?.id });
        onSaved(saved?.session_updates);
      } else {
        if (requirements.needsContact) await grantConsent('personal_follow_up');
        await invoke('requestDiscoveryHandoff', {
          handoff_type: selected,
          confirmed_summary_id: confirmedSummary?.id,
          ...(requirements.needsContact ? { contact: {
            preferred_channel: requirements.needsPhone ? 'phone' : 'email',
            name: contact.name.trim() || undefined,
            email: contact.email.trim() || undefined,
            phone: contact.phone.trim() || undefined,
            best_time: contact.best_time.trim() || undefined,
          } } : {}),
        });
      }
      setCompleted(selected);
      await refresh();
      if (selected === 'schedule_growth_conversation') onSchedule();
    } catch {
      toast.error('Your choice was not saved. Please try again.');
    } finally { setBusy(false); }
  };

  const decideJournal = async choice => {
    setJournalChoice(choice);
    if (choice === 'no') return;
  };

  const subscribeJournal = async event => {
    event.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(journalEmail.trim())) return toast.error('Enter a valid email address.');
    setBusy(true);
    try {
      await grantConsent('journal');
      await invoke('subscribeDiscoveryJournal', { email: journalEmail.trim(), first_name: contact.name.trim() || undefined });
      localStorage.setItem('nta_newsletter_subscribed', 'true');
      setJournalChoice('subscribed');
    } catch { toast.error('We could not complete the Journal signup. Please try again.'); }
    finally { setBusy(false); }
  };

  if (completed) {
    return <div className="flex-1 overflow-y-auto p-5">
      <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/25 p-5"><CheckCircle2 className="h-8 w-8 text-emerald-400" /><h4 className="mt-3 text-lg font-bold text-white">Your next step is saved</h4><p className="mt-2 text-sm leading-6 text-slate-300">You remain in control. NTA will use your information only for the choice you made.</p></div>
      {journalChoice === null && <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900 p-5"><h4 className="font-semibold text-white">Would you also like the free NTA Journal?</h4><p className="mt-2 text-sm leading-6 text-slate-400">Practical lessons about business growth, marketing, and AI. This is optional and separate from your discovery.</p><div className="mt-4 grid grid-cols-2 gap-2"><Button onClick={() => decideJournal('yes')} className="bg-blue-600">Yes, please</Button><Button onClick={() => decideJournal('no')} variant="outline" className="border-slate-700">No, thank you</Button></div></div>}
      {journalChoice === 'yes' && <form onSubmit={subscribeJournal} className="mt-5 rounded-2xl border border-slate-700 bg-slate-900 p-5"><Label htmlFor="journal-email" className="text-slate-200">Email for the NTA Journal</Label><Input id="journal-email" type="email" value={journalEmail} onChange={e => setJournalEmail(e.target.value)} className="mt-2 bg-slate-800 text-white" placeholder="you@yourbusiness.com" /><Button disabled={busy} className="mt-3 w-full bg-blue-600">{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Subscribe</Button><button type="button" onClick={() => setJournalChoice('no')} className="mt-3 w-full text-xs text-slate-400">No, thank you</button></form>}
      {journalChoice === 'subscribed' && <p className="mt-5 rounded-xl bg-blue-950/30 p-4 text-sm text-blue-200">You’re subscribed to the NTA Journal. You can unsubscribe at any time.</p>}
      {journalChoice === 'no' && <p className="mt-5 text-center text-sm text-slate-400">All set. Thank you for walking through your business with NTA.</p>}
    </div>;
  }

  if (!selected) return <div className="flex-1 overflow-y-auto p-5"><h4 className="text-lg font-bold text-white">What would you like to do next?</h4><p className="mt-2 text-sm leading-6 text-slate-400">Choose one. Nothing is scheduled and no message is sent until you confirm.</p><div className="mt-4 space-y-2">{HANDOFF_OPTIONS.map(option => { const Icon = ICONS[option.type]; return <button key={option.type} onClick={() => setSelected(option.type)} className="flex w-full gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 text-left hover:border-blue-600"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" /><span><span className="block text-sm font-semibold text-white">{option.title}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{option.description}</span></span></button>; })}</div></div>;

  return <form onSubmit={submitHandoff} className="flex-1 overflow-y-auto p-5"><button type="button" onClick={() => setSelected(null)} className="mb-5 flex items-center gap-1 text-xs text-slate-400"><ArrowLeft className="h-3 w-3" />Back to choices</button><h4 className="font-bold text-white">{HANDOFF_OPTIONS.find(item => item.type === selected)?.title}</h4>{requirements.needsContact && <div className="mt-5 space-y-4"><div><Label className="text-slate-200">Name (optional)</Label><Input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} className="mt-2 bg-slate-800 text-white" /></div>{requirements.needsEmail && <div><Label className="text-slate-200">Email</Label><Input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} className="mt-2 bg-slate-800 text-white" required /></div>}{requirements.needsPhone && <div><Label className="text-slate-200">Phone number</Label><Input type="tel" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} className="mt-2 bg-slate-800 text-white" required /></div>}<div><Label className="text-slate-200">Best time (optional)</Label><Input value={contact.best_time} onChange={e => setContact({ ...contact, best_time: e.target.value })} className="mt-2 bg-slate-800 text-white" placeholder="Weekday mornings, after 3 PM…" /></div><p className="text-xs leading-5 text-slate-500">By confirming, you give NTA permission to contact you only for this requested follow-up.</p></div>}<Button disabled={busy} className="mt-6 w-full bg-blue-600">{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Confirm this choice</Button></form>;
}
