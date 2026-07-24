import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2, Mail } from 'lucide-react';

function splitName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

export default function PublicationSignupForm({
  publicationTitle,
  publicationTag,
  source,
  accent = 'blue',
}) {
  const [formData, setFormData] = useState({ name: '', email: '', consent: false });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const accentClasses = accent === 'indigo'
    ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-indigo-400'
    : 'bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-400';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const { firstName, lastName } = splitName(formData.name);
      const now = new Date();
      const consentDate = now.toISOString().slice(0, 10);
      const existing = await base44.entities.Subscriber.filter({ email });
      const existingSubscriber = Array.isArray(existing) ? existing[0] : null;
      let subscriber;

      if (existingSubscriber) {
        const tags = Array.from(new Set([...(existingSubscriber.tags || []), publicationTag, 'publishing']));
        subscriber = await base44.entities.Subscriber.update(existingSubscriber.id, {
          first_name: firstName || existingSubscriber.first_name || '',
          last_name: lastName || existingSubscriber.last_name || '',
          tags,
          status: 'active',
          source,
          consent_status: 'confirmed',
          consent_date: consentDate,
          consent_method: 'website_form',
          consent_context: `Requested ${publicationTitle} and agreed to receive NTA publication updates.`,
        });
      } else {
        subscriber = await base44.entities.Subscriber.create({
          email,
          first_name: firstName,
          last_name: lastName,
          tags: [publicationTag, 'publishing'],
          status: 'active',
          source,
          consent_status: 'confirmed',
          consent_date: consentDate,
          consent_method: 'website_form',
          consent_context: `Requested ${publicationTitle} and agreed to receive NTA publication updates.`,
          description: `Interested in receiving ${publicationTitle} by email when available.`,
        });
      }

      const queuedRequests = await base44.entities.PublicationDeliveryRequest.filter({
        email,
        publication_tag: publicationTag,
        status: 'queued',
      });

      if (!Array.isArray(queuedRequests) || queuedRequests.length === 0) {
        await base44.entities.PublicationDeliveryRequest.create({
          subscriber_id: subscriber?.id || existingSubscriber?.id || '',
          email,
          first_name: firstName,
          publication_tag: publicationTag,
          publication_title: publicationTitle,
          source,
          status: 'queued',
          requested_at: now.toISOString(),
          sent_at: '',
          delivery_url: '',
          error_message: '',
          delivery_attempts: 0,
        });
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', consent: false });
    } catch (submissionError) {
      console.error('[PublicationSignupForm] Subscription failed', submissionError);
      setError('We could not save your request. Please try again or email info@newtechadvertising.com.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-7 text-left">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="mt-1 h-7 w-7 flex-shrink-0 text-emerald-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Your request is saved and queued.</h3>
            <p className="mt-2 leading-7 text-slate-300">
              We will use this email to send {publicationTitle} when its delivery link is ready and to share related NTA publication updates.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Questions can be sent to info@newtechadvertising.com.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Use another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${publicationTag}-name`} className="mb-2 block text-sm font-semibold text-slate-200">Name</label>
          <input
            id={`${publicationTag}-name`}
            type="text"
            required
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            placeholder="Your name"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-white/10"
          />
        </div>
        <div>
          <label htmlFor={`${publicationTag}-email`} className="mb-2 block text-sm font-semibold text-slate-200">Email</label>
          <input
            id={`${publicationTag}-email`}
            type="email"
            required
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-white/10"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <input
          type="checkbox"
          required
          checked={formData.consent}
          onChange={(event) => setFormData({ ...formData, consent: event.target.checked })}
          className="mt-1 h-4 w-4 rounded border-slate-600"
        />
        <span className="text-sm leading-6 text-slate-400">
          I want to receive {publicationTitle} by email when available and related NTA publication updates. I can unsubscribe at any time.
        </span>
      </label>

      {error && <p className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${accentClasses}`}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
        {loading ? 'Saving your request...' : `Request ${publicationTitle}`}
      </button>
    </form>
  );
}
