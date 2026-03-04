import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle, Plus, X } from 'lucide-react';
import TrialHeader from '../components/trial/TrialHeader';

const TONE_OPTIONS = ['Professional', 'Friendly', 'Authoritative', 'Conversational', 'Inspiring', 'Educational', 'Bold', 'Warm'];
const CTA_STYLES = ['Call Us Today', 'Get a Free Quote', 'Book a Consultation', 'Learn More', 'Contact Us', 'Schedule Now', 'See Our Work', 'Custom'];

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) { onChange([...values, v]); }
    setInput('');
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mt-1">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={placeholder} />
        <Button type="button" variant="outline" onClick={add} size="sm" className="px-3"><Plus className="w-4 h-4" /></Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200">
              {v}<button type="button" onClick={() => onChange(values.filter(x => x !== v))}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrialOnboarding() {
  const params = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const slug = params.slug || urlParams.get('slug');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    goals: [], offers: [], differentiators: [], audience: '',
    // Step 2
    voice_tone: '', tone_words: [], do_not_use: [], content_pillars: [], cta_style: '',
    // Step 3
    facebook_url: '', instagram_url: '', linkedin_url: '', tiktok_url: '', notes: '',
  });

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  useEffect(() => {
    const load = async () => {
      try {
        const accounts = await base44.entities.TrialAccount.filter({ slug });
        if (accounts.length) setAccount(accounts[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Save BrandDNA
      const existing = await base44.entities.BrandDNA.filter({ account_id: account.id });
      const dnaPayload = {
        account_id: account.id,
        voice_tone: [form.voice_tone, ...form.tone_words].filter(Boolean).join(', '),
        audience: form.audience,
        goals: form.goals,
        offers: form.offers,
        differentiators: form.differentiators,
        content_pillars: form.content_pillars,
        do_not_use: form.do_not_use,
        cta_style: form.cta_style,
        facebook_url: form.facebook_url,
        instagram_url: form.instagram_url,
        linkedin_url: form.linkedin_url,
        tiktok_url: form.tiktok_url,
        notes: form.notes,
      };
      if (existing.length) {
        await base44.entities.BrandDNA.update(existing[0].id, dnaPayload);
      } else {
        await base44.entities.BrandDNA.create(dnaPayload);
      }
      // Update account status
      await base44.entities.TrialAccount.update(account.id, { trial_status: 'in_review' });
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (done) return (
    <div className="bg-white min-h-screen">
      <TrialHeader slug={slug} />
      <div className="pt-28 pb-20 max-w-2xl mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">You're all set.</h1>
        <p className="text-xl text-slate-600 mb-6 leading-relaxed">
          Your account will be ready within 1 business day.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-left space-y-3">
          <h3 className="font-bold text-slate-800 mb-3">Here's what happens next:</h3>
          {[
            "Our team reviews your Brand DNA submission",
            "We configure your dashboard and content pipeline",
            "We connect your social platforms if you provided links",
            "We generate your first week of content drafts",
            "You'll receive an email when your account is ready to log in",
          ].map(item => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 text-sm">{item}</p>
            </div>
          ))}
        </div>
        <Button onClick={() => navigate(`/start/${slug}`)} variant="outline" className="mx-auto">
          Back to Your Portal
        </Button>
      </div>
    </div>
  );

  const totalSteps = 3;

  return (
    <div className="bg-white min-h-screen">
      <TrialHeader slug={slug} />
      <div className="pt-28 pb-20 max-w-2xl mx-auto px-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        </div>

        {account && (
          <div className="mb-6 text-center">
            <p className="text-sm text-slate-500">Setting up account for <strong className="text-slate-800">{account.name}</strong></p>
          </div>
        )}

        {/* Step 1: Business Basics */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Tell us about your business</h2>
              <p className="text-slate-500 text-sm">This is how we build your Brand DNA. Be as specific as you'd like.</p>
            </div>
            <div>
              <Label>Who is your ideal customer? *</Label>
              <Textarea value={form.audience} onChange={e => set('audience', e.target.value)} placeholder="e.g. Homeowners in the Midwest, ages 35–65, who need HVAC service and value reliability and honest pricing" className="mt-1 h-24" />
            </div>
            <TagInput label="What are your main marketing goals?" values={form.goals} onChange={v => set('goals', v)} placeholder="e.g. Get more phone calls, type and press Enter" />
            <TagInput label="What services or products do you offer?" values={form.offers} onChange={v => set('offers', v)} placeholder="e.g. AC installation, furnace repair, type and press Enter" />
            <TagInput label="What makes your business different?" values={form.differentiators} onChange={v => set('differentiators', v)} placeholder="e.g. Family-owned since 1990, type and press Enter" />
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5"
              disabled={!form.audience}
              onClick={() => setStep(2)}
            >
              Continue to Brand Voice →
            </Button>
          </div>
        )}

        {/* Step 2: Brand Voice */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Your brand voice</h2>
              <p className="text-slate-500 text-sm">This tells our team how to write content that sounds like you.</p>
            </div>
            <div>
              <Label>Overall tone (pick one)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TONE_OPTIONS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('voice_tone', t)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${form.voice_tone === t ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-700 hover:border-blue-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <TagInput label="Words or phrases that describe your brand" values={form.tone_words} onChange={v => set('tone_words', v)} placeholder="e.g. Trustworthy, no-nonsense, type and press Enter" />
            <TagInput label="Words or phrases to avoid" values={form.do_not_use} onChange={v => set('do_not_use', v)} placeholder="e.g. Cheap, discount, complicated, type and press Enter" />
            <TagInput label="Content pillars (topics we should post about)" values={form.content_pillars} onChange={v => set('content_pillars', v)} placeholder="e.g. Home comfort tips, seasonal maintenance, type and press Enter" />
            <div>
              <Label>Preferred call-to-action style</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {CTA_STYLES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set('cta_style', c)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${form.cta_style === c ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-700 hover:border-blue-400'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5" onClick={() => setStep(3)}>
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Social + Assets */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Connect your platforms</h2>
              <p className="text-slate-500 text-sm">All optional — add what you have. We'll handle the connections.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { field: 'facebook_url', label: 'Facebook Page URL', placeholder: 'https://facebook.com/yourbusiness' },
                { field: 'instagram_url', label: 'Instagram Profile URL', placeholder: 'https://instagram.com/yourbusiness' },
                { field: 'linkedin_url', label: 'LinkedIn Page URL', placeholder: 'https://linkedin.com/company/yourbusiness' },
                { field: 'tiktok_url', label: 'TikTok Profile URL', placeholder: 'https://tiktok.com/@yourbusiness' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <Label>{label}</Label>
                  <Input value={form[field]} onChange={e => set(field, e.target.value)} placeholder={placeholder} className="mt-1" />
                </div>
              ))}
            </div>
            <div>
              <Label>Anything else we should know?</Label>
              <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Upcoming promotions, deadlines, anything important..." className="mt-1 h-24" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)} disabled={saving}>Back</Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : 'Submit My Brand Info →'}
              </Button>
            </div>
            <p className="text-xs text-center text-slate-400">Your account will be ready within 1 business day. No credit card required.</p>
          </div>
        )}
      </div>
    </div>
  );
}