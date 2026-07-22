import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, PencilLine, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  SUMMARY_SECTIONS,
  buildSummaryFromInterpretation,
  describeOwnerCorrections,
  hasUsefulSummary,
} from '@/lib/growth-guide/summaryReview';

const newestSummary = summaries => [...(summaries || [])].sort((a, b) => b.version - a.version)[0];

export default function DiscoverySummaryReview({ snapshot, invoke, refresh }) {
  const savedSummary = newestSummary(snapshot?.summaries);
  const interpretedDraft = useMemo(
    () => buildSummaryFromInterpretation(snapshot?.interpretation?.categories || []),
    [snapshot?.interpretation?.active_version, snapshot?.interpretation?.categories],
  );
  const original = savedSummary || interpretedDraft;
  const [edited, setEdited] = useState(original);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!savedSummary && !hasUsefulSummary(edited) && hasUsefulSummary(interpretedDraft)) {
      setEdited(interpretedDraft);
    }
  }, [edited, interpretedDraft, savedSummary]);

  const update = (key, value) => setEdited(current => ({ ...current, [key]: value }));

  const saveAndConfirm = async () => {
    if (busy || !hasUsefulSummary(edited)) return;
    setBusy(true);
    try {
      let draft = savedSummary;
      if (!draft) {
        draft = await invoke('createConfirmedSummary', {
          action: 'create_draft',
          summary_data: {
            ...edited,
            owner_corrections: describeOwnerCorrections(interpretedDraft, edited),
          },
        });
      }
      if (draft.confirmation_state === 'draft') {
        await invoke('createConfirmedSummary', { action: 'confirm_draft', summary_id: draft.id });
      }
      await refresh();
      toast.success('Your understanding summary is confirmed.');
    } catch {
      toast.error('Your summary was not confirmed. Please review it and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (savedSummary?.confirmation_state === 'confirmed') {
    return (
      <div className="flex-1 overflow-y-auto p-5">
        <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/25 p-5">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          <h4 className="mt-3 text-lg font-bold text-white">You confirmed what NTA understood</h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">This is now the foundation for your next step and, if you choose, a Growth Roadmap prepared by Rick.</p>
        </div>
        <div className="mt-4 space-y-3">
          {SUMMARY_SECTIONS.filter(section => savedSummary[section.key]).map(section => (
            <div key={section.key} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">{section.label}</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-200">{savedSummary[section.key]}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasUsefulSummary(interpretedDraft) && !savedSummary) {
    return (
      <div className="flex-1 p-6 text-center">
        <RefreshCw className="mx-auto h-8 w-8 text-blue-400" />
        <h4 className="mt-4 font-semibold text-white">Preparing what we understood</h4>
        <p className="mt-2 text-sm leading-6 text-slate-400">Your answers are saved. The Growth Guide is organizing them for your review.</p>
        <Button onClick={refresh} variant="outline" className="mt-5 border-slate-700" disabled={busy}>Check again</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex items-start gap-3 rounded-2xl border border-blue-800/50 bg-blue-950/20 p-4">
        <PencilLine className="mt-1 h-5 w-5 shrink-0 text-blue-400" />
        <div><h4 className="font-semibold text-white">Please review what NTA understood</h4><p className="mt-1 text-xs leading-5 text-slate-400">Correct anything that is incomplete or not quite right. Your wording controls the confirmed summary.</p></div>
      </div>
      <div className="mt-5 space-y-5">
        {SUMMARY_SECTIONS.map(section => (
          <div key={section.key}>
            <Label htmlFor={section.key} className="text-sm text-slate-200">{section.label}</Label>
            <Textarea id={section.key} value={edited[section.key] || ''} onChange={event => update(section.key, event.target.value)} placeholder="Nothing understood yet—add your own words if this matters." className="mt-2 min-h-24 border-slate-700 bg-slate-900 text-slate-100" disabled={busy || Boolean(savedSummary)} />
          </div>
        ))}
      </div>
      <Button onClick={saveAndConfirm} disabled={busy || !hasUsefulSummary(edited)} className="mt-6 w-full bg-blue-600 hover:bg-blue-500">
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {savedSummary ? 'Confirm this summary' : 'This is accurate — confirm it'}
      </Button>
      <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">Confirmation does not automatically schedule a call or sign you up for the NTA Journal.</p>
    </div>
  );
}
