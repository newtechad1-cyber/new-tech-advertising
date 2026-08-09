import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import NTAPricingLadder from '@/components/pricing/NTAPricingLadder';
import DIYOnboardingRecommendationPanel from '@/components/diy/DIYOnboardingRecommendationPanel';
import { calculateUpgradeReadinessScore, getRecommendedNextPlan, getUpgradeRecommendation, getProfileInsight } from '@/components/diy/DIYUpgradeReadinessLogic';

const STEPS = [
  { id: 1, title: 'Business Info', key: 'business_name' },
  { id: 2, title: 'Services', key: 'business_services' },
  { id: 3, title: 'Service Area', key: 'service_area' },
  { id: 4, title: 'Primary Goal', key: 'primary_growth_goal' },
  { id: 5, title: 'Revenue Target', key: 'revenue_growth_target' },
  { id: 6, title: 'Time Available', key: 'time_commitment_level' },
  { id: 7, title: 'Main Frustration', key: 'marketing_frustration' },
  { id: 8, title: 'Growth Speed', key: 'growth_speed_intent' },
  { id: 9, title: 'Your Preference', key: 'upsell_intent' },
  { id: 10, title: 'Campaign Setup', key: 'campaign_setup' },
  { id: 11, title: 'Your Recommendation', key: 'recommendation' },
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
    primary_growth_goal: '',
    revenue_growth_target: '',
    time_commitment_level: '',
    marketing_frustration: '',
    growth_speed_intent: '',
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
          primary_growth_goal: subs[0].primary_growth_goal || '',
          revenue_growth_target: subs[0].revenue_growth_target || '',
          time_commitment_level: subs[0].time_commitment_level || '',
          marketing_frustration: subs[0].marketing_frustration || '',
          growth_speed_intent: subs[0].growth_speed_intent || '',
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

      // Calculate scores when reaching recommendation step
      if (currentStep === 10) {
        const readinessScore = calculateUpgradeReadinessScore(formData);
        const nextPlan = getRecommendedNextPlan(formData);
        updateData.upgrade_readiness_score = readinessScore;
        updateData.recommended_next_plan = nextPlan;
      }

      if (currentStep === 11) {
        updateData.onboarding_completed = true;
        updateData.onboarding_completion_percent = 100;
      } else {
        updateData.onboarding_completion_percent = Math.round((currentStep / 11) * 100);
      }

      await base44.entities.DIYSubscription.update(subscription.id, updateData);

      if (currentStep === 11) {
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

          {/* Step 4: Primary Growth Goal */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">What is your biggest growth priority?</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'more_leads', label: 'Generate More Leads' },
                  { value: 'higher_ticket_sales', label: 'Higher Ticket Sales' },
                  { value: 'brand_authority', label: 'Build Brand Authority' },
                  { value: 'beat_competitors', label: 'Beat Competitors' },
                  { value: 'expand_locations', label: 'Expand to New Locations' },
                  { value: 'faster_growth', label: 'Faster Overall Growth' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.primary_growth_goal === option.value
                        ? 'bg-violet-600/20 border-violet-600'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="growth_goal"
                      value={option.value}
                      checked={formData.primary_growth_goal === option.value}
                      onChange={(e) => handleInputChange('primary_growth_goal', e.target.value)}
                    />
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Revenue Growth Target */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">What monthly revenue growth would you like to achieve?</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'under_5k', label: 'Under $5K' },
                  { value: '5k_10k', label: '$5K - $10K' },
                  { value: '10k_25k', label: '$10K - $25K' },
                  { value: '25k_50k', label: '$25K - $50K' },
                  { value: '50k_plus', label: '$50K+' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.revenue_growth_target === option.value
                        ? 'bg-violet-600/20 border-violet-600'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="revenue"
                      value={option.value}
                      checked={formData.revenue_growth_target === option.value}
                      onChange={(e) => handleInputChange('revenue_growth_target', e.target.value)}
                    />
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Time Commitment */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">How much time can you invest in marketing weekly?</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'minimal', label: 'Minimal (Less than 5 hours)' },
                  { value: '5_10_hours', label: '5-10 hours' },
                  { value: '10_15_hours', label: '10-15 hours' },
                  { value: '15_20_hours', label: '15-20 hours' },
                  { value: '20_plus_hours', label: 'More than 20 hours' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.time_commitment_level === option.value
                        ? 'bg-violet-600/20 border-violet-600'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="time"
                      value={option.value}
                      checked={formData.time_commitment_level === option.value}
                      onChange={(e) => handleInputChange('time_commitment_level', e.target.value)}
                    />
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Marketing Frustration */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">What frustrates you most about marketing today?</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'no_consistency', label: 'No Consistency in Posting/Content' },
                  { value: 'no_leads', label: 'Not Getting Enough Leads' },
                  { value: 'low_roi', label: 'Low ROI on Marketing Spend' },
                  { value: 'too_much_work', label: 'Too Much Work, Not Enough Time' },
                  { value: 'execution_gaps', label: 'Ideas But Poor Execution' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.marketing_frustration === option.value
                        ? 'bg-violet-600/20 border-violet-600'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="frustration"
                      value={option.value}
                      checked={formData.marketing_frustration === option.value}
                      onChange={(e) => handleInputChange('marketing_frustration', e.target.value)}
                    />
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: Growth Speed Intent */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">How fast do you want to grow?</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'slow_steady', label: 'Slow & Steady', desc: 'Sustainable growth over time' },
                  { value: 'moderate', label: 'Moderate Growth', desc: 'Consistent progress' },
                  { value: 'aggressive', label: 'Aggressive Growth', desc: 'Significant expansion quickly' },
                  { value: 'very_aggressive', label: 'Very Aggressive', desc: 'Maximum growth, all out' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.growth_speed_intent === option.value
                        ? 'bg-violet-600/20 border-violet-600'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="speed"
                      value={option.value}
                      checked={formData.growth_speed_intent === option.value}
                      onChange={(e) => handleInputChange('growth_speed_intent', e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-white font-semibold">{option.label}</p>
                      <p className="text-slate-400 text-sm">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 9: Upsell Intent */}
          {currentStep === 9 && (
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

          {/* Step 10: Campaign Setup */}
          {currentStep === 10 && (
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

          {/* Step 11: Recommendation */}
          {currentStep === 11 && (
            <div className="space-y-6">
              <DIYOnboardingRecommendationPanel
                recommendation={getUpgradeRecommendation(formData)}
                insight={getProfileInsight(formData)}
                onContinue={() => {
                  handleNext();
                }}
              />
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
              {isSaving ? 'Saving...' : currentStep === 11 ? 'Go to Dashboard' : 'Next'}
              {!isSaving && <ChevronRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}