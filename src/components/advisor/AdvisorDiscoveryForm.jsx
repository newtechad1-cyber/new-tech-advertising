import { useRef, useState } from 'react';
import { invokeVerifiedPublicFunction } from '@/lib/publicVerification';
import { RELATIONSHIP_METHODS, PUBLIC_SITE } from '@/data/digitalGrowthAdvisor';

const initial = {
  full_name: '',
  email: '',
  phone: '',
  city: '',
  current_role: '',
  interest_reason: '',
  ai_business_interest: '',
  learning_goals: '',
  exploration_discovery: '',
  relationship_methods: [],
  contact_preference: 'email',
  contact_consent: false,
  website: '',
};
const control = 'mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300';

export default function AdvisorDiscoveryForm() {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const started = useRef(Date.now());
  const sending = useRef(false);

  const change = event => setForm(current => ({
    ...current,
    [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
  }));
  const toggle = value => setForm(current => ({
    ...current,
    relationship_methods: current.relationship_methods.includes(value)
      ? current.relationship_methods.filter(item => item !== value)
      : [...current.relationship_methods, value],
  }));

  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    if (!form.relationship_methods.length) {
      setError('Choose at least one way you like connecting with people.');
      return;
    }
    if (form.contact_preference === 'phone' && !form.phone.trim()) {
      setError('Please add your phone number so Rick can call you.');
      return;
    }

    sending.current = true;
    setBusy(true);
    setError('');
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await invokeVerifiedPublicFunction('submitRecruitingApplication', {
        ...form,
        program: 'digital_growth_advisor',
        territory: 'United States — discuss your market with Rick',
        campaign_source: params.get('utm_source') || 'nta_website',
        campaign_medium: params.get('utm_medium') || 'website',
        campaign_name: params.get('utm_campaign') || 'digital_growth_advisor',
        landing_path: window.location.pathname,
        anti_spam: {
          honeypot: form.website,
          form_started_at: started.current,
        },
      });
      const data = response?.data ?? response;
      if (data?.success !== true || data?.accepted !== true) {
        throw new Error('Your information was not saved. Please try again or call or text 641-420-8816.');
      }
      setResult(data);
    } catch (submitError) {
      setError(submitError?.response?.data?.error || submitError?.message || 'We could not save your information. Please try again or call or text 641-420-8816.');
    } finally {
      setBusy(false);
      sending.current = false;
    }
  }

  if (result) {
    const firstName = form.full_name.trim().split(/\s+/)[0] || 'there';
    return <div role="status" className="rounded-3xl border border-emerald-400/40 bg-emerald-950/40 p-7">
      <h3 className="text-2xl font-bold">Thank you, {firstName}.</h3>
      <p className="mt-4 text-slate-200">Your discovery answers are saved for Rick to review. The next step is a conversation about what you would like to learn and how you could work together.</p>
      <p className="mt-4 text-slate-300">{result.email_delivery?.applicant === 'accepted' ? 'A confirmation email has been requested. Check your inbox and spam folder.' : 'Your answers are saved, but we could not confirm that a confirmation email was requested.'}</p>
      <a className="mt-5 inline-block font-semibold text-cyan-300 underline" href={PUBLIC_SITE + '/knowledge'}>Keep exploring NTA</a>
    </div>;
  }

  return <form onSubmit={submit} className="rounded-3xl border border-slate-700 bg-slate-900 p-5 sm:p-8">
    <p className="mb-6 text-slate-300">A few sentences are enough. Share what interests you and what you hope to learn. Fields marked * are required.</p>
    <fieldset disabled={busy} className="space-y-5">
      <legend className="sr-only">Tell us about yourself</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          ['full_name', 'Your name', 'text', 'name'],
          ['email', 'Email', 'email', 'email'],
          ['city', 'City and state', 'text', 'address-level2'],
          ['phone', 'Phone (optional unless you prefer a call)', 'tel', 'tel'],
        ].map(([name, label, type, autoComplete]) => <label key={name} className="block text-sm font-semibold">
          {label}{name !== 'phone' ? ' *' : ''}
          <input
            className={control}
            name={name}
            type={type}
            autoComplete={autoComplete}
            maxLength={name === 'email' ? 320 : 200}
            required={name !== 'phone' || form.contact_preference === 'phone'}
            value={form[name]}
            onChange={change}
          />
        </label>)}
      </div>

      <label className="block text-sm font-semibold">Your background (optional)
        <input className={control} name="current_role" value={form.current_role} onChange={change} maxLength={300} placeholder="Work, study, business, community, or life experience" />
      </label>
      <label className="block text-sm font-semibold">What caught your attention about this opportunity? *
        <textarea className={control} name="interest_reason" rows={3} required maxLength={2000} value={form.interest_reason} onChange={change} />
      </label>
      <label className="block text-sm font-semibold">What interests you about AI and business? *
        <textarea className={control} name="ai_business_interest" rows={3} required maxLength={2000} value={form.ai_business_interest} onChange={change} />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">How do you naturally prefer connecting with people? *</legend>
        <p className="mt-1 text-sm text-slate-400">Choose any that fit.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {RELATIONSHIP_METHODS.map(([value, label]) => <label key={value} className="flex items-center gap-3 rounded-xl border border-slate-600 p-3">
            <input type="checkbox" checked={form.relationship_methods.includes(value)} onChange={() => toggle(value)} className="h-5 w-5 accent-cyan-400" />
            {label}
          </label>)}
        </div>
      </fieldset>

      <label className="block text-sm font-semibold">What would you like to learn? *
        <textarea className={control} name="learning_goals" rows={3} required maxLength={2000} value={form.learning_goals} onChange={change} />
      </label>
      <label className="block text-sm font-semibold">What did you discover while exploring NTA that interested you? *
        <span className="mt-1 block font-normal text-slate-400">It could be a page, lesson, Growth Show conversation, or something you asked Your Digital Growth Guide™.</span>
        <textarea className={control} name="exploration_discovery" rows={3} required maxLength={2000} value={form.exploration_discovery} onChange={change} />
      </label>
      <label className="block text-sm font-semibold">How would you like Rick to follow up?
        <select className={control} name="contact_preference" value={form.contact_preference} onChange={change}>
          <option value="email">Email</option>
          <option value="phone">Phone call</option>
        </select>
      </label>
      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input type="checkbox" name="contact_consent" checked={form.contact_consent} onChange={change} required className="mt-1 h-5 w-5 shrink-0 accent-cyan-400" />
        I agree that Rick and NTA may contact me about this opportunity using the details I provide. *
      </label>
      <div className="hidden" aria-hidden="true">
        <label>Website<input name="website" value={form.website} onChange={change} tabIndex={-1} autoComplete="off" /></label>
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-400 p-4 text-red-100">{error}</p>}
      <button className="w-full rounded-xl bg-cyan-300 px-5 py-4 font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-60" type="submit">
        {busy ? 'Saving your answers…' : 'Tell Rick about yourself'}
      </button>
      <p className="text-sm leading-relaxed text-slate-400">We use your answers for this opportunity conversation. Rick discusses fit and next steps with you before any workspace access. <a href={PUBLIC_SITE + '/privacy-policy'} className="text-cyan-300 underline">Privacy policy</a></p>
    </fieldset>
  </form>;
}
