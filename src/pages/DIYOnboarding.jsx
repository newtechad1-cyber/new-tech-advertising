import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import NTAPricingLadder from '@/components/pricing/NTAPricingLadder';

const STEPS = [
  { id: 1, title: 'Business Info', key: 'business_name' },
  { id: 2, title: 'Services', key: 'business_services' },
  { id: 3, title: 'Service Area', key: 'service_area' },
  { id: 4, title: 'Marketing Goals', key: 'marketing_goals' },
  { id: 5, title: 'Current Frustrations', key: 'current_frustrations' },
  { id: 6, title: 'Your Preference', key: 'upsell_intent' },
  { id: 7, title: 'Campaign Setup', key: 'campaign_setup' },
];

export default function DIYOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_services: '',
    service_area: '',
    marketing_goals: '',
    current_frustrations: '',
    upsell_intent: 'diy_only',
    website_url: '',
    social_links: '',
  });

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          navigate('/');
          return;
        }
        const subs = await base44.entities.DIYSubscription.filter(
          { user_email: user.email },
          '-created_date',
          1
        );
        if (subs.length === 0) {
          navigate('/nta/diy-growth-system');
          return;
        }
        setSubscription(subs[0]);
        setCurrentStep(subs[0].onboarding_step || 1);
        setFormData({
          business_name: subs[0].business_name || '',
          business_services: subs[0].business_services || '',
          service_area: subs[0].service_area || '',
          marketing_goals: subs[0].marketing_goals || '',
          current_frustrations: subs[0].current_frustrations || '',
          upsell_intent: subs[0].upsell_intent || 'diy_only',
          website_url: subs[0].website_url || '',
          social_links: subs[0].social_links || '',
        });
      } catch (error) {
        console.error('Error loading subscription:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    loadSubscription();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        [STEPS[currentStep - 1].key]: formData[STEPS[currentStep - 1].key],
        onboarding_step: currentStep + 1,
      };

      if (currentStep === 7) {
        updateData.onboarding_completed = true;
        updateData.onboarding_step = 7;
        updateData.onboarding_completion_percent = 100;
      } else {
        updateData.onboarding_completion_percent = Math.round((currentStep / 7) * 100);
      }

      await base44.entities.DIYSubscription.update(subscription.id, updateData);

      if (currentStep === 6) {
        navigate('/client/diy-dashboard');
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const step = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Progress Bar */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    s.id <= currentStep
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s.id <= currentStep - 1 ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-1 w-8 ${
                      s.id < currentStep ? 'bg-violet-600' : 'bg-slate-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm">
            Step {currentStep} of {STEPS.length}: {step.title}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">{step.title}</h2>

          {/* Step 1: Business Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">Business Name</span>
                <Input
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder="e.g., John's HVAC Services"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </label>
            </div>
          )}

          {/* Step 2: Services */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">What services do you offer?</span>
                <Input
                  value={formData.business_services}
                  onChange={(e) => handleInputChange('business_services', e.target.value)}
                  placeholder="e.g., HVAC repair, installation, maintenance"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </label>
            </div>
          )}

          {/* Step 3: Service Area */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">Service Area / City</span>
                <Input
                  value={formData.service_area}
                  onChange={(e) => handleInputChange('service_area', e.target.value)}
                  placeholder="e.g., Chicago, IL"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </label>
            </div>
          )}

          {/* Step 4: Marketing Goals */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">Primary Marketing Goal</span>
                <Input
                  value={formData.marketing_goals}
                  onChange={(e) => handleInputChange('marketing_goals', e.target.value)}
                  placeholder="e.g., Generate more leads, build brand authority"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </label>
            </div>
          )}

          {/* Step 5: Current Frustrations */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">What's your biggest frustration with marketing right now?</span>
                <Input
                  value={formData.current_frustrations}
                  onChange={(e) => handleInputChange('current_frustrations', e.target.value)}
                  placeholder="e.g., not enough leads, inconsistent social media, no time for marketing"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </label>
            </div>
          )}

          {/* Step 6: Upsell Intent */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">How do you want to approach marketing?</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'diy_only', label: 'DIY Only', desc: 'I want to do everything myself with AI tools' },
                  { value: 'wants_guidance', label: 'DIY + Guidance', desc: 'I want tools + monthly strategy help' },
                  { value: 'wants_full_service', label: 'Full Service', desc: 'I want you to handle everything' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.upsell_intent === option.value
                        ? 'bg-violet-600/20 border-violet-600'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preference"
                      value={option.value}
                      checked={formData.upsell_intent === option.value}
                      onChange={(e) => handleInputChange('upsell_intent', e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-white font-semibold">{option.label}</p>
                      <p className="text-slate-400 text-sm">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Upgrade Path */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Zap className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold text-lg">You're All Set!</h3>
                    <p className="text-slate-300 text-sm mt-1">
                      Your onboarding is complete. Now, let's explore what's possible with each plan.
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">
                  You can stay on DIY and manage everything yourself, or upgrade for expert guidance and execution support.
                </p>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <NTAPricingLadder
                  currentPlan="diy"
                  onSelectPlan={() => {}}
                  showPhases={true}
                  compact={false}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isSaving}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              {isSaving ? 'Saving...' : currentStep === 7 ? 'Go to Dashboard' : 'Next'}
              {!isSaving && <ChevronRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}