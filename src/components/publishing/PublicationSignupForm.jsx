import { useRef, useState } from 'react';
import { BookOpen, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const accentClasses = {
  blue: 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-400',
  indigo: 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400',
};

export default function PublicationSignupForm({
  publicationTitle,
  publicationTag,
  source,
  accent = 'indigo',
  submitLabel = 'Get the free guide',
  showBusinessName = false,
  extraTags = [],
  createDeliveryRequest = true,
  successMessage = 'Thanks. Your request has been saved.',
  consentContext = '',
  consentCheckboxText,
  downloadUrl,
  viewerUrl,
  downloadButtonLabel = 'Download now',
  readOnlineLabel = 'Read online instead',
}) {
  const [form, setForm] = useState({ name: '', email: '', business_name: '', consent: false, website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const startedAt = useRef(Date.now());

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

  async function trackBookEvent(eventType) {
    try {
      await base44.functions.invoke('trackBookEvent', {
        book_key: publicationTag,
        event_type: eventType,
      });
    } catch (trackingError) {
      console.warn('[book tracking] Event could not be recorded.', trackingError);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.consent) {
      setError('Please confirm that you want to receive this publication and the related updates.');
      return;
    }

    setSubmitting(true);
    try {
      const route = window.location.pathname;
      const sourceUrl = window.location.href;
      const sharedPayload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        business_name: form.business_name.trim(),
        source,
        source_page: route,
        source_url: sourceUrl,
        publication_title: publicationTitle,
        publication_tag: publicationTag,
        consent_context: consentContext,
        anti_spam: { honeypot: form.website, form_started_at: startedAt.current },
      };

      const intake = await base44.functions.invoke('ntaUnifiedIntake', {
        ...sharedPayload,
        submission_type: 'publication_request',
        offer_type: 'business_education',
        mapping_confidence: 'hardcoded',
        mapping_notes: `Public publication signup for ${publicationTitle}`,
        detected_route: route,
        detected_component: 'PublicationSignupForm',
        source_system: 'website',
        priority: 'low',
        notes: `Requested ${publicationTitle}`,
      });

      if (intake?.data?.success === false) throw new Error(intake.data.error || 'We could not save your request.');

      const registration = await base44.functions.invoke('publicationSignup', {
        ...sharedPayload,
        tags: ['nta-publications', publicationTag, ...extraTags],
        create_delivery_request: createDeliveryRequest,
        delivery_url: downloadUrl || '',
      });

      if (registration?.data?.success === false) throw new Error(registration.data.error || 'We could not complete your request.');
      setSuccess(true);
    } catch (submissionError) {
      setError(submissionError?.message || 'Something went wrong. Please call or text NTA at 641-420-8816.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-left">
        <CheckCircle2 className="h-8 w-8 text-emerald-300" />
        <p className="mt-3 font-semibold text-white">{successMessage}</p>
        {(downloadUrl || viewerUrl) && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => { void trackBookEvent('download_click'); }}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100"
              >
                <Download className="h-4 w-4" /> {downloadButtonLabel}
              </a>
            )}
            {viewerUrl && (
              <a
                href={viewerUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => { void trackBookEvent('read_online_click'); }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-bold text-white hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4" /> {readOnlineLabel}
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-200">Name
          <input required value={form.name} onChange={update('name')} autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-400" />
        </label>
        <label className="text-sm font-semibold text-slate-200">Email
          <input required type="email" value={form.email} onChange={update('email')} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-400" />
        </label>
      </div>
      {showBusinessName && (
        <label className="block text-sm font-semibold text-slate-200">Business name <span className="font-normal text-slate-500">(optional)</span>
          <input value={form.business_name} onChange={update('business_name')} autoComplete="organization" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-400" />
        </label>
      )}
      <input value={form.website} onChange={update('website')} tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-300">
        <input required type="checkbox" checked={form.consent} onChange={update('consent')} className="mt-1 h-4 w-4 rounded border-slate-600" />
        <span>{consentCheckboxText || 'I agree to receive this publication and related NTA updates. I can unsubscribe at any time.'}</span>
      </label>
      {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p>}
      <button disabled={submitting} className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${accentClasses[accent] || accentClasses.indigo}`}>
        {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving your request…</> : submitLabel}
      </button>
    </form>
  );
}
