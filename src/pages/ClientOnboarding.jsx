import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, CheckCircle, Loader2 } from 'lucide-react';
import OnboardingStep1 from '@/components/onboarding/OnboardingStep1';
import OnboardingStep2 from '@/components/onboarding/OnboardingStep2';
import OnboardingStep3 from '@/components/onboarding/OnboardingStep3';
import OnboardingStep4 from '@/components/onboarding/OnboardingStep4';
import OnboardingStep5 from '@/components/onboarding/OnboardingStep5';
import OnboardingStep6 from '@/components/onboarding/OnboardingStep6';

const STEPS = [
  { label: 'Business Basics' },
  { label: 'Service Area' },
  { label: 'Marketing Goals' },
  { label: 'Brand Voice' },
  { label: 'Social Platforms' },
  { label: 'Posting Plan' },
];

const REQUIRED_BY_STEP = {
  0: ['business_name', 'email'],
  1: ['city', 'state'],
  2: ['primary_goal', 'target_audience'],
  3: ['brand_voice'],
  4: [],
  5: ['posting_frequency'],
};

export default function ClientOnboarding() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ posting_frequency: '10', status: 'in_progress' });
  const [profileId, setProfileId] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [metaConnected, setMetaConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      const user = await base44.auth.me();
      if (!user) { base44.auth.redirectToLogin(window.location.pathname); return; }

      // Get or create TrialAccount
      let accounts = await base44.entities.TrialAccount.filter({ email: user.email });
      let acct = accounts?.[0];
      if (!acct) {
        acct = await base44.entities.TrialAccount.create({
          name: user.full_name || user.email,
          slug: user.email.split('@')[0].replace(/[^a-z0-9]/g, '-'),
          email: user.email,
          industry: '',
          location_city: '',
          location_state: '',
        });
      }
      setAccountId(acct.id);

      // Load existing onboarding profile
      let profs = await base44.entities.OnboardingProfile.filter({ account_id: acct.id });
      if (profs?.[0]) {
        const p = profs[0];
        setProfileId(p.id);
        setProfile({ ...p });
        if (p.status === 'complete') { setDone(true); return; }
      } else {
        // Pre-fill from account
        setProfile(prev => ({ ...prev, email: acct.email, business_name: acct.name }));
      }

      // Check MetaConnection
      const metaConns = await base44.entities.MetaConnection.filter({ account_id: acct.id });
      setMetaConnected(metaConns?.[0]?.status === 'connected');
    };
    init();
  }, []);

  const validate = () => {
    const required = REQUIRED_BY_STEP[step] || [];
    return required.every(k => profile[k]);
  };

  const saveProgress = async (data) => {
    const payload = { ...data, account_id: accountId, status: data.status || 'in_progress' };
    if (profileId) {
      await base44.entities.OnboardingProfile.update(profileId, payload);
    } else {
      const created = await base44.entities.OnboardingProfile.create(payload);
      setProfileId(created.id);
    }
  };

  const handleNext = async () => {
    if (!validate()) { setError('Please fill in all required fields.'); return; }
    setError('');
    setSaving(true);
    await saveProgress(profile);
    setSaving(false);
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => { setError(''); setStep(s => s - 1); };

  const handleComplete = async () => {
    setError('');
    setCompleting(true);
    await saveProgress({ ...profile, status: 'complete' });
    const res = await base44.functions.invoke('completeOnboarding', { profileId, accountId });
    setCompleting(false);
    if (res.data?.success) {
      setDone(true);
    } else {
      setError(res.data?.error || 'Something went wrong. Please try again.');
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">You're all set! 🎉</h2>
          <p className="text-slate-500 text-sm">Your profile is complete. Your first month of content is being generated now.</p>
          <a href={createPageUrl('Dashboard')}>
            <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white">Go to My Dashboard →</Button>
          </a>
        </div>
      </div>
    );
  }

  const progress = ((step) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png" alt="NTA" className="h-8 w-auto" />
        <span className="font-semibold text-slate-700">Account Setup</span>
        <span className="ml-auto text-sm text-slate-400">Step {step + 1} of {STEPS.length}</span>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-100">
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 py-4">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex flex-col items-center`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i < step ? 'bg-blue-600 border-blue-600 text-white' : i === step ? 'border-blue-600 text-blue-600 bg-white' : 'border-slate-200 text-slate-400 bg-white'}`}>
              {i < step ? '✓' : i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center p-4 pt-0">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 mt-2">
          <h2 className="text-xl font-bold text-slate-800 mb-1">{STEPS[step].label}</h2>
          <p className="text-slate-400 text-sm mb-6">Step {step + 1} of {STEPS.length}</p>

          {step === 0 && <OnboardingStep1 data={profile} onChange={setProfile} />}
          {step === 1 && <OnboardingStep2 data={profile} onChange={setProfile} />}
          {step === 2 && <OnboardingStep3 data={profile} onChange={setProfile} />}
          {step === 3 && <OnboardingStep4 data={profile} onChange={setProfile} />}
          {step === 4 && <OnboardingStep5 data={profile} accountId={accountId} metaConnected={metaConnected} />}
          {step === 5 && <OnboardingStep6 data={profile} onChange={setProfile} />}

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-4 border border-red-200">{error}</p>}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack} disabled={saving || completing} className="flex-1 sm:flex-none">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={handleNext} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={completing} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                {completing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Complete Setup 🚀
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}