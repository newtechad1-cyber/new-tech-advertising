import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle2, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const PHONE = '6414208816';
const PHONE_DISPLAY = '641-420-8816';
const SMS_BODY = encodeURIComponent("Hey, can you help me start a free Business Gap Audit?");

const AUDIT_ITEMS = [
  'What you want to change or accomplish',
  'What is happening in the business now',
  'Where time, customers, or opportunities are getting stuck',
  'The tools and processes you already use',
  'What has worked and what has not',
  'What appears to need attention first',
  'A useful first-pass summary and next step',
];

function TextMeButton() {
  return (
    <a
      href={`sms:+1${PHONE}?body=${SMS_BODY}`}
      className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold px-6 py-4 rounded-xl text-base transition-colors w-full sm:w-auto"
    >
      <MessageSquare className="w-5 h-5 text-slate-600" />
      Text Me: {PHONE_DISPLAY}
    </a>
  );
}

export default function FreeAudit() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmationStatus, setConfirmationStatus] = useState('submitted');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_name: '',
    website: '', industry: '',
  });
  const [_hp, setHp] = useState('');

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (_hp.trim()) return;
    setFormError('');
    setSubmitting(true);
    try {
      const response = await base44.functions.invoke('ntaUnifiedIntake', {
        submission_type: 'free_audit_request',
        source_system: 'website',
        source_page: '/free-audit',
        name: form.name,
        business_name: form.business_name,
        email: form.email,
        phone: form.phone,
        website: form.website,
        industry: form.industry,
        notes: 'Requested a free Business Gap Audit',
        skip_webhook: true,
        anti_spam: {
          honeypot: _hp,
        },
      });

      // The unified intake owns CRM storage and reports the provider-level email state.
      const result = response?.data || response;
      setConfirmationStatus(result?.audit_delivery_status || 'submitted');

      setStep(2);
      setForm({ name: '', email: '', phone: '', business_name: '', website: '', industry: '' });
    } catch (err) {
      const message = err?.response?.data?.error || err?.data?.error || err?.message || 'Something went wrong. Please call or text instead.';
      setFormError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <SEOHead
        title="Free Small Business Marketing and AI Gap Audit | NTA"
        description="Start a free small-business gap audit to identify what is working, what is missing, and what deserves attention next."
      />
      <MarketingNav />

      <section className="bg-slate-950 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Start Your Free Business Gap Audit
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-5 max-w-2xl mx-auto">
            Tell us what is happening in your business. We will review the starting information, identify visible gaps and priorities, and give you a useful first-pass direction.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10">
            This free audit is designed to help you decide what deserves attention first. A deeper paid diagnostic is available only when more evidence, analysis, or a detailed Growth Roadmap would be useful.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('audit-form').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Start Below
            </button>
            <a
              href={`tel:+1${PHONE}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors hover:bg-slate-700 border border-slate-700"
            >
              <Phone className="w-5 h-5" /> Call or Text: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 flex-1">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">What the Free Audit Covers</h2>
            <ul className="space-y-4 mb-8">
              {AUDIT_ITEMS.map(item => (
                <li key={item} className="flex items-start gap-3 text-slate-700 text-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-slate-700 text-base leading-relaxed">
              <strong className="text-blue-900 block mb-1">Two levels, clearly separated.</strong>
              The free audit gives you a useful first-pass assessment. It does not promise a full technical investigation, implementation plan, or complete Growth Roadmap. When deeper work would help, we will explain the optional paid deep-dive before anything begins.
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Prefer to talk?</h3>
              <p className="text-slate-600 mb-6">Call or text: {PHONE_DISPLAY}</p>
              <TextMeButton />
            </div>
          </div>

          <div id="audit-form" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            {step === 2 ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Thank You. Your Audit Request Was Received.</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
                  {confirmationStatus === 'email_accepted'
                    ? 'Your first-pass report was generated and the email service accepted the send request. Delivery to your mailbox is still being confirmed. If it does not appear within a few minutes, check Spam or contact Rick directly.'
                    : 'We have your starting information. When a website was included, the AI-assisted first-pass report is generated automatically. We will send it when the email delivery step is confirmed. While you wait, choose how you would like to continue:'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-950 text-white rounded-2xl p-6 text-left border border-slate-800 hover:border-slate-700 transition-colors group flex flex-col h-full">
                    <div className="text-3xl mb-4">📅</div>
                    <h3 className="text-xl font-bold mb-3">Talk to Rick — 15 Minutes</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      Talk through what is happening, confirm the starting information, and decide together what should be reviewed first. No pitch, no pressure.
                    </p>
                    <div className="mt-auto">
                      <a
                        href="https://calendar.app.google/p6ieYanvwhixXxZ67"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
                      >
                        Pick a Time →
                      </a>
                      <p className="text-center text-slate-500 text-xs font-medium">Available Mon–Fri</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 text-white rounded-2xl p-6 text-left border border-slate-800 hover:border-slate-700 transition-colors group flex flex-col h-full">
                    <div className="text-3xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-3">Continue by Email</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      Send Rick anything else that would help explain what is happening, what you need, or what you want to accomplish.
                    </p>
                    <div className="mt-auto">
                      <a
                        href="mailto:info@newtechadvertising.com?subject=My%20Free%20Business%20Gap%20Audit"
                        className="block w-full text-center bg-transparent hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
                      >
                        Continue by Email →
                      </a>
                      <p className="text-center text-slate-500 text-xs font-medium">Write in your own words</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-500 text-sm">
                    We will not begin a paid deep-dive or implementation work unless the scope, price, and next step are clearly agreed.
                  </p>
                  <p className="text-slate-600 font-medium">
                    Questions? Call or text Rick directly: <a href="tel:6414208816" className="text-blue-600 hover:underline">641-420-8816</a>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Request Your Free Business Gap Audit</h2>
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                  <label htmlFor="company_url">Company URL</label>
                  <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={e => setHp(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Full Name <span className="text-red-500">*</span></Label>
                  <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Business Name <span className="text-red-500">*</span></Label>
                  <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-slate-700 text-sm font-semibold">Email <span className="text-red-500">*</span></Label>
                    <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@business.com" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-700 text-sm font-semibold">Phone <span className="text-red-500">*</span></Label>
                    <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Business Website (Optional)</Label>
                  <Input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbusiness.com" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Industry (Optional)</Label>
                  <Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. HVAC, Restaurant, Law Firm" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="pt-4">
                  {formError && (
                    <p role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                      {formError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 h-auto text-lg rounded-xl shadow-lg shadow-blue-600/20"
                  >
                    {submitting ? 'Submitting...' : 'Start My Free Business Gap Audit'}
                    {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                  <p className="text-center text-slate-500 text-sm mt-4">
                    Free · No credit card · No pressure
                  </p>
                  <p className="text-center text-slate-500 text-xs mt-2 leading-relaxed">
                    By sharing your name and email, you're giving us an opportunity to begin a working relationship—not just request an audit. Our intent is to help local small businesses learn through free, practical AI and business education.
                  </p>
                  <p className="text-center text-slate-500 text-xs mt-2 leading-relaxed">
                    If you choose to receive our weekly free information, we'll keep it coming until you say stop. We won't be pushy, and we never sell your information or business details.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
