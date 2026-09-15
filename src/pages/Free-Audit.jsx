import { invokeVerifiedPublicFunction } from '@/lib/publicVerification';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle2, Phone, MessageSquare, ArrowRight, BookOpen } from 'lucide-react';
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
  const [submittedBusinessName, setSubmittedBusinessName] = useState('');
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
      const response = await invokeVerifiedPublicFunction('ntaUnifiedIntake', {
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
      setSubmittedBusinessName(form.business_name.trim());

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

  const openGrowthGuide = () => {
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { source: 'free_audit_success' },
    }));
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
              <Phone className="w-5 h-5" /> Call Rick: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 flex-1">
        <div className={step === 2 ? 'max-w-6xl mx-auto' : 'max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-start'}>
          {step !== 2 && (
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
              <p className="text-slate-600 mb-6">Call <a href={`tel:+1${PHONE}`} className="font-semibold text-blue-700 hover:underline">{PHONE_DISPLAY}</a> or send Rick a text—whichever is easier.</p>
              <TextMeButton />
            </div>
          </div>
          )}

          <div
            id="audit-form"
            className={step === 2
              ? 'bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl'
              : 'bg-white border border-slate-200 rounded-3xl p-8 shadow-xl'}
          >
            {step === 2 ? (
              <div className="text-center py-2 md:py-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Thank You. We Received Your Audit Request.</h2>
                <p className="text-slate-600 text-lg mb-5 max-w-2xl mx-auto">
                  {confirmationStatus === 'email_accepted'
                    ? 'Your first-pass report was generated and the email service accepted the send request. Delivery to your mailbox is still being confirmed. If it does not appear within a few minutes, check Spam or choose one of the paths below.'
                    : 'We have your starting information and will prepare the first-pass review from the website you provided. While you wait, choose the next step that feels useful to you:'}
                </p>
                <p className="text-slate-500 text-base mb-10 max-w-2xl mx-auto">
                  Choose the next step that feels useful to you. You do not need to do all three.
                </p>

                <div className="space-y-4 mb-8 text-left">
                  <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-7 text-left border border-slate-800 hover:border-slate-700 transition-colors flex flex-col h-full">
                    <BookOpen className="w-7 h-7 text-cyan-300 mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-3">1. Understand Your Results</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      Keep learning through the questions and Knowledge Library material that connect to what you saw in the audit.
                    </p>
                    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <Link
                        to="/knowledge/questions"
                        className="inline-flex w-full sm:w-auto items-center justify-center text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        Continue Learning →
                      </Link>
                      <button
                        type="button"
                        onClick={openGrowthGuide}
                        className="inline-flex w-full sm:w-auto items-center justify-center text-center border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        Ask Your Digital Growth Guide™
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-7 text-left border border-slate-800 hover:border-slate-700 transition-colors flex flex-col h-full">
                    <MessageSquare className="w-7 h-7 text-cyan-300 mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-3">2. Talk Through Your Results</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      Call, text, email, or start a conversation—whichever is easiest for you.
                    </p>
                    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <button
                        type="button"
                        onClick={openGrowthGuide}
                        className="inline-flex w-full sm:w-auto items-center justify-center text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        Talk to My Office™
                      </button>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <a href={`tel:+1${PHONE}`} className="rounded-lg border border-slate-700 px-3 py-2 hover:border-slate-500 hover:bg-slate-800">Call</a>
                        <a href={`sms:+1${PHONE}?body=${SMS_BODY}`} className="rounded-lg border border-slate-700 px-3 py-2 hover:border-slate-500 hover:bg-slate-800">Text</a>
                        <a href="mailto:info@newtechadvertising.com?subject=My%20Free%20Business%20Gap%20Audit" className="rounded-lg border border-slate-700 px-3 py-2 hover:border-slate-500 hover:bg-slate-800">Email</a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-7 text-left border border-slate-800 hover:border-slate-700 transition-colors flex flex-col h-full">
                    <ArrowRight className="w-7 h-7 text-cyan-300 mb-4" />
                    <h3 className="text-xl md:text-2xl font-bold mb-3">3. Decide What to Do Next</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      Start a Growth Conversation so Rick can understand the situation, or choose a time when a direct conversation is the best next step.
                    </p>
                    <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <Link
                        to="/growth-conversation"
                        className="inline-flex w-full sm:w-auto items-center justify-center text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        Start the Growth Conversation →
                      </Link>
                      <a
                        href="https://calendar.app.google/p6ieYanvwhixXxZ67"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center text-center border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        Choose a Time with Rick
                      </a>
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
                  <Label htmlFor="audit-name" className="text-slate-700 text-sm font-semibold">Full Name <span className="text-red-500">*</span></Label>
                  <Input required id="audit-name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="audit-business_name" className="text-slate-700 text-sm font-semibold">Business Name <span className="text-red-500">*</span></Label>
                  <Input required id="audit-business_name" value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="audit-email" className="text-slate-700 text-sm font-semibold">Email <span className="text-red-500">*</span></Label>
                    <Input required type="email" id="audit-email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@business.com" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="audit-phone" className="text-slate-700 text-sm font-semibold">Phone <span className="text-red-500">*</span></Label>
                    <Input required type="tel" id="audit-phone" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="audit-website" className="text-slate-700 text-sm font-semibold">Business Website <span className="text-red-500">*</span></Label>
                  <Input required type="url" id="audit-website" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbusiness.com" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="audit-industry" className="text-slate-700 text-sm font-semibold">Industry (Optional)</Label>
                  <Input id="audit-industry" value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. HVAC, Restaurant, Law Firm" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
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
                    We use these details to prepare your audit and respond to your request. You can keep learning on the site without opening an account, and paid work only begins after scope and price are clearly agreed.
                  </p>
                  <p className="text-center text-slate-500 text-xs mt-2 leading-relaxed">
                    If you choose to receive NTA’s free weekly information, you can stop anytime. We do not sell your information or business details.
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
