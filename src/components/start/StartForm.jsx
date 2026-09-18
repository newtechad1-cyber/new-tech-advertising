import { invokeVerifiedPublicFunction } from '@/lib/publicVerification';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StartTrust from './StartTrust';

const inputCls = 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20';

export default function StartForm({ sourceData = {}, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  // Anti-spam: honeypot
  const [_hp, setHp] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    business_name: '',
    website: '',
    email: '',
    phone: '',
    notes: '',
    ...sourceData,
  });

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = "Please share your name so Rick knows who he is talking with.";
    const hasEmail = form.email.trim() && /\S+@\S+\.\S+/.test(form.email);
    const hasPhone = form.phone.trim();
    if (!hasEmail && !hasPhone) {
      errs.contact = 'Add an email or a phone number so Rick can reach you.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (_hp.trim()) return; // honeypot tripped — silently ignore
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    try {
      await invokeVerifiedPublicFunction('ntaUnifiedIntake', {
        submission_type: 'growth_conversation_request',
        source_system: 'website',
        source_page: sourceData.source_page || '/start',
        name: form.full_name,
        business_name: form.business_name,
        website: form.website,
        email: form.email,
        phone: form.phone,
        notes: form.notes || 'Requested a free growth conversation',
        skip_webhook: true,
        anti_spam: { honeypot: _hp },
      });
      onSuccess({ name: form.full_name.trim() });
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.data?.error ||
        err?.message ||
        'We could not save your request. Please call or text 641-420-8816 instead.';
      setSubmitError(message);
      setSubmitting(false);
    }
  };

  const errMsg = (field) =>
    errors[field] ? <p className="text-red-400 text-xs mt-1">{errors[field]}</p> : null;

  return (
    <div id="start-form" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-white mb-2">Start a Free Growth Conversation</h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        Just enough to begin the conversation. Rick will reach out, listen, and help you sort through what's on your mind. There's no package to choose and nothing to buy just to talk.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {submitError && (
          <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200">
            {submitError}
          </p>
        )}

        {/* Anti-spam honeypot — hidden from real users */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
          <label htmlFor="company_url">Company URL</label>
          <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={(e) => setHp(e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Label className="block">
            <span className="text-slate-300 text-sm mb-1.5 block">
              Your Name <span className="text-blue-400">*</span>
            </span>
            <Input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Jane Smith" className={inputCls} />
            {errMsg('full_name')}
          </Label>
          <Label className="block">
            <span className="text-slate-300 text-sm mb-1.5 block">Business Name</span>
            <Input value={form.business_name} onChange={(e) => set('business_name', e.target.value)} placeholder="Smith Plumbing" className={inputCls} />
          </Label>
          <Label className="block">
            <span className="text-slate-300 text-sm mb-1.5 block">Email</span>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@smithplumbing.com" className={inputCls} />
          </Label>
          <Label className="block">
            <span className="text-slate-300 text-sm mb-1.5 block">Phone</span>
            <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 123-4567" className={inputCls} />
          </Label>
        </div>

        {errMsg('contact')}

        <Label className="block">
          <span className="text-slate-300 text-sm mb-1.5 block">Business Website <span className="text-slate-500 font-normal">(optional)</span></span>
          <Input
            type="url"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
            placeholder="Enter your website address if you have one. If you don't have a website yet, that's okay."
            className={inputCls}
            autoComplete="url"
          />
        </Label>

        <Label className="block">
          <span className="text-slate-300 text-sm mb-1.5 block">What's on your mind? (optional)</span>
          <textarea
            aria-label="What's on your mind"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={4}
            placeholder="Share as much or as little as you'd like. A question, something that isn't working as well as you'd like, or what you'd like to understand better."
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          />
        </Label>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-blue-600/30"
        >
          {submitting ? 'Sending your request…' : 'Start a Free Growth Conversation'}
          {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>

        <p className="text-center text-slate-500 text-xs">
          The conversation is free · No package to choose · Nothing to buy just to talk
        </p>
      </form>

      <StartTrust />
    </div>
  );
}