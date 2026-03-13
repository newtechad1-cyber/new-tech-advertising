import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'Business Info', key: 'business_name' },
  { id: 2, title: 'Services', key: 'business_services' },
  { id: 3, title: 'Service Area', key: 'service_area' },
  { id: 4, title: 'Marketing Goals', key: 'marketing_goals' },
  { id: 5, title: 'Website & Social', key: 'website_url' },
  { id: 6, title: 'Campaign Setup', key: 'campaign_setup' },
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

      if (currentStep === 6) {
        updateData.onboarding_completed = true;
        updateData.onboarding_step = 6;
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

          {/* Step 5: Website & Social */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <label className="block mb-4">
                <span className="text-white font-semibold mb-2 block">Website URL (optional)</span>
                <Input
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </label>
              <label className="block">
                <span className="text-white font-semibold mb-2 block">Social Media Links (optional)</span>
                <Input
                  value={formData.social_links}
                  onChange={(e) => handleInputChange('social_links', e.target.value)}
                  placeholder="Facebook, Instagram, LinkedIn links"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </label>
            </div>
          )}

          {/* Step 6: Campaign Setup */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-6 border border-violet-600/20">
                <p className="text-slate-300">
                  We're setting up your first AI-powered marketing campaign based on your business info.
                  This will include:
                </p>
                <ul className="text-slate-300 space-y-2 mt-4">
                  <li>✓ Content calendar with AI-generated posts</li>
                  <li>✓ Social media strategy for your industry</li>
                  <li>✓ Initial brand voice and messaging framework</li>
                  <li>✓ Lead tracking setup</li>
                </ul>
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
              {isSaving ? 'Saving...' : currentStep === 6 ? 'Complete Setup' : 'Next'}
              {!isSaving && <ChevronRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}