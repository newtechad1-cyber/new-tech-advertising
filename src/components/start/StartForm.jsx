import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { createAgencyLead } from '@/lib/createAgencyLead';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StartTrust from './StartTrust';

const INDUSTRIES = [
  'HVAC', 'Plumbing', 'Restaurant', 'Contractor', 'Electrician',
  'Roofing', 'Auto Repair', 'Other Local Service Business', 'Marketing / Agency / Other',
];

const GOALS = [
  { value: 'leads', label: 'Get more leads' },
  { value: 'visibility', label: 'Improve visibility online' },
  { value: 'consistency', label: 'Stay consistent with marketing' },
  { value: 'content_video', label: 'Create more content and videos' },
  { value: 'replace_marketing', label: 'Replace my current marketing approach' },
];

const SOURCES = [
  { value: 'google', label: 'Google Search' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'referral', label: 'Referral' },
  { value: 'email', label: 'Email' },
  { value: 'demo_tool', label: 'Demo / Tool Page' },
  { value: 'other', label: 'Other' },
];

const FIELD = ({ label, children, required }) => (
  <div>
    <Label className="text-slate-300 text-sm mb-1.5 block">
      {label}{required && <span className="text-violet-400 ml-0.5">*</span>}
    </Label>
    {children}
  </div>
);

const inputCls = "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20";
const selectCls = "w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500";

export default function StartForm({ sourceData = {}, onSuccess }) {
  const [step, setStep] = useState(1);
  const [showExtra, setShowExtra] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1
    business_name: '',
    full_name: '',
    email: '',
    phone: '',
    industry: '',
    city: '',
    state: '',
    primary_goal: '',
    // Step 2 / extras
    website_url: '',
    how_did_you_find_us: '',
    notes: '',
    ...sourceData,
  });

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.business_name.trim()) errs.business_name = 'Required';
    if (!form.full_name.trim()) errs.full_name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.industry) errs.industry = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.state.trim()) errs.state = 'Required';
    if (!form.primary_goal) errs.primary_goal = 'Required';
    return errs;
  };

  const handleStep1 = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
    window.scrollTo({ top: document.getElementById('start-form')?.offsetTop - 80, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { base44 } = await import('@/api/base44Client');

      // STEP 1 — Create SalesLead + SalesDeal FIRST (canonical intake path)
      const { salesLead, salesDeal } = await createAgencyLead({
        business_name: form.business_name,
        contact_name:  form.full_name,
        email:         form.email,
        phone:         form.phone,
        website:       form.website_url,
        city:          form.city,
        state:         form.state,
        industry:      form.industry,
        lead_source:   'website',
        notes:         `Goal: ${form.primary_goal}${form.notes ? ' | ' + form.notes : ''}`,
      });
      console.log('[StartForm] Lead created', salesLead.id, salesDeal.id);

      // STEP 2 — Mirror to NTA Unified Intake (non-blocking)
      base44.functions.invoke('ntaUnifiedIntake', {
        submission_type: 'trial_signup',
        offer_type: 'trial_onboarding',
        mapping_confidence: 'hardcoded',
        mapping_notes: 'StartForm.jsx /start hardcoded',
        detected_route: sourceData.source_page || '/start',
        detected_component: 'StartForm',
        source_system: 'website',
        source_page: sourceData.source_page || '/start',
        source_campaign: sourceData.source_campaign || '',
        name: form.full_name,
        business_name: form.business_name,
        email: form.email,
        phone: form.phone,
        website: form.website_url,
        city: form.city,
        state: form.state,
        notes: `Industry: ${form.industry} | Goal: ${form.primary_goal}${form.notes ? ' | ' + form.notes : ''}`,
        priority: 'high',
        is_high_intent: true,
      }).catch(err => console.warn('[StartForm] NTA mirror failed:', err.message));

      // STEP 3 — Create TrialAccount record
      const slug = form.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
      const trialData = {
        name: form.business_name,
        slug,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        industry: form.industry,
        location_city: form.city,
        location_state: form.state,
        website_url: form.website_url,
        primary_goal: form.primary_goal,
        how_did_you_find_us: form.how_did_you_find_us || 'other',
        source_page: sourceData.source_page || 'start',
        source_tool: sourceData.source_tool || '',
        source_campaign: sourceData.source_campaign || '',
        notes: form.notes,
        trial_status: 'submitted',
        trial_start_at: new Date().toISOString(),
        trial_end_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      };
      const trial = await base44.entities.TrialAccount.create(trialData);

      // 3b. Create Lead record for CRM
      await base44.entities.Lead.create({
        name: form.full_name,
        email: form.email,
        phone: form.phone,
        business_name: form.business_name,
        website: form.website_url,
        industry: form.industry,
        city: form.city,
        state: form.state,
        service_interest: 'diy_saas',
        message: form.notes || '',
        status: 'new',
        source: 'website',
      });

      // 3. Create BusinessProfile
      const bp = await base44.entities.BusinessProfile.create({
        business_name: form.business_name,
        business_slug: slug,
        website_url: form.website_url,
        industry_slug: form.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        city: form.city,
        state: form.state,
        primary_goal: form.primary_goal === 'leads' ? 'leads'
          : form.primary_goal === 'visibility' ? 'visibility'
          : form.primary_goal === 'consistency' ? 'retention'
          : 'traffic',
        status: 'active',
      });

      // 4. Update TrialAccount with BusinessProfile ID
      await base44.entities.TrialAccount.update(trial.id, { business_profile_id: bp.id });

      // 5. Send internal notification email
      await base44.integrations.Core.SendEmail({
        from_name: 'NTA — New Trial Signup',
        to: 'rick@newtechadvertising.com',
        subject: `🚀 New Trial: ${form.business_name} (${form.industry})`,
        body: `New trial started!\n\nBusiness: ${form.business_name}\nContact: ${form.full_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nIndustry: ${form.industry}\nLocation: ${form.city}, ${form.state}\nGoal: ${form.primary_goal}\nWebsite: ${form.website_url}\nSource: ${sourceData.source_page || 'start'}\nNotes: ${form.notes}`,
      });

      // 6. Kick off the intelligence + provisioning pipeline
      base44.functions.invoke('onTrialSubmitted', { trial_id: trial.id }).catch(err =>
        console.warn('[StartForm] onTrialSubmitted background call failed:', err.message)
      );

      // Add the requested webhook call
      fetch('https://grateful-lynx-44.convex.site/api/webhook/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: 'Y24RdJ7OjvX8lrcjPRDCYcusOnAspC9DbYkqJtY1Zb0',
          source: 'nta-website',
          form: sourceData.source_page || '/start',
          name: form.full_name,
          business_name: form.business_name,
          email: form.email,
          phone: form.phone,
          website: form.website_url,
          industry: form.industry,
          service_interest: form.primary_goal,
          notes: form.notes,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.log('Webhook failed:', err));

      onSuccess({ trialId: trial.id, businessProfileId: bp.id, provisioningStatus: 'queued' });
    } catch (err) {
      console.error('Trial submission error:', err);
      setSubmitting(false);
    }
  };

  const errMsg = (field) => errors[field] ? (
    <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
  ) : null;

  return (
    <div id="start-form" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-7">
        {[1, 2].map(n => (
          <React.Fragment key={n}>
            <div className={`flex items-center gap-2 ${step >= n ? 'text-white' : 'text-slate-600'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step >= n ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-700 text-slate-600'}`}>
                {n}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {n === 1 ? 'Your Business' : 'A Few More Details'}
              </span>
            </div>
            {n < 2 && <div className={`flex-1 h-px ${step > 1 ? 'bg-violet-600' : 'bg-slate-800'}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── STEP 1 ─────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <FIELD label="Business Name" required>
                <Input value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className={inputCls} />
                {errMsg('business_name')}
              </FIELD>
              <FIELD label="Your Name" required>
                <Input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Jane Smith" className={inputCls} />
                {errMsg('full_name')}
              </FIELD>
              <FIELD label="Email" required>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@smithplumbing.com" className={inputCls} />
                {errMsg('email')}
              </FIELD>
              <FIELD label="Phone">
                <Input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className={inputCls} />
              </FIELD>
            </div>

            <FIELD label="Industry" required>
              <select value={form.industry} onChange={e => set('industry', e.target.value)} className={selectCls}>
                <option value="">Select your industry…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              {errMsg('industry')}
            </FIELD>

            <div className="grid sm:grid-cols-2 gap-5">
              <FIELD label="City" required>
                <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Des Moines" className={inputCls} />
                {errMsg('city')}
              </FIELD>
              <FIELD label="State" required>
                <Input value={form.state} onChange={e => set('state', e.target.value)} placeholder="IA" className={inputCls} />
                {errMsg('state')}
              </FIELD>
            </div>

            <FIELD label="What's your primary marketing goal?" required>
              <select value={form.primary_goal} onChange={e => set('primary_goal', e.target.value)} className={selectCls}>
                <option value="">Select your goal…</option>
                {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
              {errMsg('primary_goal')}
            </FIELD>

            <Button
              type="button"
              onClick={handleStep1}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-violet-600/30"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* ── STEP 2 ─────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <FIELD label="Business Website">
              <Input type="url" value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://smithplumbing.com" className={inputCls} />
            </FIELD>

            <FIELD label="How did you find us?">
              <select value={form.how_did_you_find_us} onChange={e => set('how_did_you_find_us', e.target.value)} className={selectCls}>
                <option value="">Select…</option>
                {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FIELD>

            {/* Optional extras */}
            <button
              type="button"
              onClick={() => setShowExtra(!showExtra)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              {showExtra ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Add a note about your business (optional)
            </button>

            {showExtra && (
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={3}
                placeholder="Tell us anything that would help us set up your marketing system better…"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
              />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl text-sm font-medium transition-colors"
              >
                ← Back
              </button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-violet-600/30"
              >
                {submitting ? 'Building your system…' : 'Build My Marketing System'}
                {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>

            <p className="text-center text-slate-600 text-xs">
              No agency sales pitch · Built for small businesses · Guided setup
            </p>
          </div>
        )}
      </form>

      <StartTrust />
    </div>
  );
}