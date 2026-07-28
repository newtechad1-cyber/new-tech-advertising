import { useState } from 'react';
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
  showBusinessName = false,
  successMessage,
  downloadUrl,
  downloadButtonLabel,
  extraTags = [],
  consentContext,
  consentCheckboxText,
  submitLabel,
  createDeliveryRequest = true,
}) {
  const [formData, setFormData] = useState({ name: '', email: '', businessName: '', consent: false });
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
      const consentDate = new Date().toISOString().slice(0, 10);
      const existing = await base44.entities.Subscriber.filter({ email });
      const existingSubscriber = Array.isArray(existing) ? existing[0] : null;

      let subscriberId = existingSubscriber?.id;

      const subscriberData = {
        first_name: firstName || existingSubscriber?.first_name || '',
        last_name: lastName || existingSubscriber?.last_name || '',
        status: 'active',
        source,
        consent_status: 'confirmed',
        consent_date: consentDate,
        consent_method: 'website_form',
        consent_context: consentContext || `Requested ${publicationTitle} and agreed to receive NTA publication updates.`,
      };

      if (showBusinessName && formData.businessName) {
        subscriberData.business_name = formData.businessName;
      }

      const allTags = [publicationTag, 'publishing', ...extraTags];

      if (existingSubscriber) {
        const tags = Array.from(new Set([...(existingSubscriber.tags || []), ...allTags]));
        await base44.entities.Subscriber.update(existingSubscriber.id, { ...subscriberData, tags });
      } else {
        const newSub = await base44.entities.Subscriber.create({
          ...subscriberData,
          email,
          tags: allTags,
          description: downloadUrl ? `Downloaded ${publicationTitle} from the website.` : `Interested in receiving ${publicationTitle} by email when available.`,
        });
        subscriberId = newSub.id;
      }

      // One-time publications can create a delivery request. Recurring
      // publications such as the Journal only need the Subscriber record.
      if (subscriberId && !downloadUrl && createDeliveryRequest) {
        await base44.entities.PublicationDeliveryRequest.create({
          subscriber_id: subscriberId,
          publication_title: publicationTitle,
          status: 'pending'
        });
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', businessName: '', consent: false });
    } catch (submissionError) {
      console.error('[PublicationSignupForm] Subscription failed', submissionError);
      setError('We could not save your request. Please try again or contact NTA directly.');
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
            <h3 className="text-xl font-bold text-white">Your request is saved.</h3>
            <p className="mt-2 leading-7 text-slate-300">
              {successMessage || `We will use this email to send ${publicationTitle} when it is ready and to share related NTA publication updates.`}
            </p>
            
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition ${accentClasses}`}
              >
                {downloadButtonLabel || `Download ${publicationTitle}`}
              </a>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Use another email
              </button>
            </div>
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
      
      {showBusinessName && (
        <div>
          <label htmlFor={`${publicationTag}-business`} className="mb-2 block text-sm font-semibold text-slate-200">Business Name</label>
          <input
            id={`${publicationTag}-business`}
            type="text"
            value={formData.businessName}
            onChange={(event) => setFormData({ ...formData, businessName: event.target.value })}
            placeholder="Your company name"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-white/10"
          />
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <input
          type="checkbox"
          required
          checked={formData.consent}
          onChange={(event) => setFormData({ ...formData, consent: event.target.checked })}
          className="mt-1 h-4 w-4 rounded border-slate-600"
        />
        <span className="text-sm leading-6 text-slate-400">
          {consentCheckboxText || `I want to receive ${publicationTitle} by email when available and related NTA publication updates. I can unsubscribe at any time.`}
        </span>
      </label>

      {error && <p className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${accentClasses}`}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
        {loading ? 'Saving your request...' : (submitLabel || `Request ${publicationTitle}`)}
      </button>
    </form>
  );
}
