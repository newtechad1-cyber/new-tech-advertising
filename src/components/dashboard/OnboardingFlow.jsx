import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Target, Building2, BookOpen, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ONBOARDING_STEPS, getNextIncompleteStep, validateStepData } from '../onboarding/onboardingConfig';
import { toast } from 'sonner';
import { trackOnboardingStep, trackOnboardingComplete, saveUTMsToRecord } from '../analytics/trackingUtils';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function OnboardingFlow({ onComplete, initialProfile }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [profile, setProfile] = useState(initialProfile);
  const [validationError, setValidationError] = useState(null);
  const [formData, setFormData] = useState({
    business_name: initialProfile?.business_name || '',
    industry: initialProfile?.industry || '',
    target_audience: initialProfile?.target_audience || '',
    unique_selling_propositions: initialProfile?.unique_selling_propositions || '',
    marketing_goals: initialProfile?.marketing_goals || []
  });
  
  // CRITICAL: Track when user-initiated navigation is in progress
  // Profile sync must NEVER override user actions
  const navigationInProgressRef = React.useRef(false);

  // Dev logging helper
  const devLog = (message, data) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`[Onboarding] ${message}`, data || '');
    }
  };

  // Centralized step navigation - single source of truth
  const navigateToStep = (targetStep) => {
    if (targetStep < 1 || targetStep > 3) {
      devLog('NAV_TARGET_INVALID', { targetStep });
      return;
    }
    devLog('NAV_TARGET', { from: step, to: targetStep });
    setStep(targetStep);
  };

  // Go to the next logical step after save
  const goToNextStep = () => {
    const nextStep = step + 1;
    if (nextStep > 3) {
      devLog('NAV_TARGET_COMPLETE', { completedStep: step });
      // User completed all steps, handled by handleComplete
      return;
    }
    navigateToStep(nextStep);
  };

  useEffect(() => {
    devLog('Component mounted, loading profile...');
    loadProfile();
  }, []);

  useEffect(() => {
    // CRITICAL: Sync step with persisted onboarding state ONLY when not navigating
    // User clicks must always win over background sync
    if (navigationInProgressRef.current) {
      devLog('SYNC_SKIPPED_DUE_TO_NAV', { step });
      return;
    }

    if (!profile) return;

    const nextStep = getNextIncompleteStep(profile);
    devLog('SYNC_CHECKING', { 
      currentStep: step, 
      calculatedStep: nextStep,
      flags: {
        step1: profile.step1_completed,
        step2: profile.step2_completed,
        step3: profile.step3_completed,
        complete: profile.onboarding_completed
      }
    });
    
    // Guard: If onboarding is complete, redirect to dashboard
    if (profile.onboarding_completed) {
      devLog('SYNC_ONBOARDING_COMPLETE');
      navigate(createPageUrl('SetupComplete'));
      return;
    }

    // Only update step if we have a valid calculated step and it differs
    if (nextStep && nextStep !== step && nextStep >= 1 && nextStep <= 3) {
      devLog('SYNC_REDIRECT', { from: step, to: nextStep });
      setStep(nextStep);
    } else if (!nextStep || nextStep < 1 || nextStep > 3) {
      // Guard: invalid step calculation, reset to step 1
      devLog('SYNC_RESET_TO_1', { invalidStep: nextStep });
      setStep(1);
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      setLoadError(null);
      devLog('Fetching authenticated user...');
      
      const user = await base44.auth.me();
      devLog('User authenticated', { email: user.email });
      
      const profiles = await base44.entities.ClientProfile.filter({ created_by: user.email });
      devLog('Profile query complete', { count: profiles?.length || 0 });
      
      if (profiles && profiles.length > 0) {
        const userProfile = profiles[0];
        setProfile(userProfile);
        setFormData({
          business_name: userProfile.business_name || '',
          industry: userProfile.industry || '',
          target_audience: userProfile.target_audience || '',
          unique_selling_propositions: userProfile.unique_selling_propositions || '',
          marketing_goals: userProfile.marketing_goals || []
        });
        devLog('Profile loaded successfully', { profileId: userProfile.id });
      } else {
        devLog('No existing profile found, user will create one');
      }
    } catch (error) {
      console.error('[OnboardingFlow] Failed to load profile:', error);
      setLoadError(error.message || 'Failed to load your profile. Please try again.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleNext = async () => {
    devLog('NEXT_CLICK', { step });
    
    // Guard: validate step bounds
    if (step < 1 || step > 3) {
      devLog('NEXT_INVALID_STEP', { step });
      toast.error('Invalid step');
      return;
    }

    // Validate current step data
    const validation = validateStepData(step, formData);
    if (!validation.isValid) {
      const message = `Please fill in: ${validation.missingFields.join(', ').replace(/_/g, ' ')}`;
      setValidationError(message);
      devLog('NEXT_VALIDATION_FAIL', { step, missing: validation.missingFields });
      return;
    }
    
    setValidationError(null);
    setLoading(true);
    
    // CRITICAL: Block profile sync from overriding navigation
    navigationInProgressRef.current = true;
    devLog('SAVE_START', { step });
    
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.ClientProfile.filter({ created_by: user.email });
      
      let profileId = profile?.id || profiles?.[0]?.id;
      const currentStep = ONBOARDING_STEPS[step - 1];
      
      if (step === 1) {
        const updateData = {
          business_name: formData.business_name,
          industry: formData.industry,
          target_audience: formData.target_audience,
          unique_selling_propositions: formData.unique_selling_propositions,
          [currentStep.completionFlag]: true
        };
        
        if (profileId) {
          await base44.entities.ClientProfile.update(profileId, updateData);
        } else {
          const newProfile = await base44.entities.ClientProfile.create({
            ...updateData,
            marketing_goals: []
          });
          profileId = newProfile.id;
          setProfile(newProfile);
        }
      } else if (step === 2) {
        if (profileId) {
          await base44.entities.ClientProfile.update(profileId, {
            marketing_goals: formData.marketing_goals,
            [currentStep.completionFlag]: true
          });
        }
      }
      
      devLog('SAVE_SUCCESS', { step });
      
      // Reload profile to ensure we have latest state
      const updatedProfiles = await base44.entities.ClientProfile.filter({ created_by: user.email });
      if (updatedProfiles && updatedProfiles.length > 0) {
        setProfile(updatedProfiles[0]);
      }
      
      // Track step completion
      trackOnboardingStep(step, currentStep.name);
      
      // Navigate to next step - user click wins
      goToNextStep();
      toast.success('Progress saved!');
    } catch (error) {
      console.error('[Onboarding] Save error:', error);
      devLog('SAVE_FAIL', { step, error: error.message });
      toast.error(error.message || 'Failed to save');
    } finally {
      setLoading(false);
      // Clear navigation lock after a short delay to allow step change to settle
      setTimeout(() => {
        navigationInProgressRef.current = false;
        devLog('NAV_LOCK_CLEARED');
      }, 500);
    }
  };

  const handleBack = () => {
    devLog('BACK_CLICK', { step });
    
    // Guard: prevent going below step 1
    if (step <= 1) {
      devLog('BACK_BLOCKED_STEP1');
      return;
    }
    
    setValidationError(null);
    navigationInProgressRef.current = true;
    navigateToStep(step - 1);
    
    // Clear lock after navigation
    setTimeout(() => {
      navigationInProgressRef.current = false;
      devLog('NAV_LOCK_CLEARED');
    }, 500);
  };

  const handleComplete = async () => {
    setLoading(true);
    navigationInProgressRef.current = true;
    devLog('COMPLETE_CLICK');
    
    try {
      const user = await base44.auth.me();
      const profiles = await base44.entities.ClientProfile.filter({ created_by: user.email });
      
      if (!profiles || profiles.length === 0) {
        throw new Error('No profile found');
      }
      
      const profileId = profiles[0].id;
      devLog('COMPLETE_SAVE_START', { profileId });
      
      // Mark onboarding complete
      await base44.entities.ClientProfile.update(profileId, {
        onboarding_completed: true,
        step3_completed: true,
        completed_checklist_items: []
      });
      
      // Save UTM parameters
      await saveUTMsToRecord('ClientProfile', profileId);
      
      // Track completion
      trackOnboardingComplete(profiles[0]);
      devLog('COMPLETE_SAVE_SUCCESS');
      
      // Send notifications (non-blocking)
      try {
        await base44.functions.invoke('notifyOnboardingComplete', {
          profileId: profileId,
          userEmail: user.email
        });
      } catch (notifyError) {
        console.error('[Onboarding] Notification failed:', notifyError);
      }
      
      // Navigate to completion page
      devLog('COMPLETE_REDIRECT');
      navigate(createPageUrl('SetupComplete'));
    } catch (error) {
      console.error('[Onboarding] Complete error:', error);
      devLog('COMPLETE_FAIL', { error: error.message });
      toast.error(error.message || 'Failed to complete setup');
      navigationInProgressRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goal) => {
    const currentGoals = formData.marketing_goals || [];
    if (currentGoals.includes(goal)) {
      setFormData({ ...formData, marketing_goals: currentGoals.filter(g => g !== goal) });
    } else {
      setFormData({ ...formData, marketing_goals: [...currentGoals, goal] });
    }
  };

  const marketingGoalsOptions = [
    "Increase Brand Awareness",
    "Generate More Leads",
    "Improve Website Traffic",
    "Boost Social Media Engagement",
    "Enhance Customer Retention",
    "Launch New Product/Service"
  ];

  const checklistItems = [
    { id: 'profile', label: 'Complete Business Profile', desc: 'Fill in your core business details' },
    { id: 'goals', label: 'Define Marketing Goals', desc: 'Set clear objectives for your campaign' },
    { id: 'resources', label: 'Review Training Materials', desc: 'Watch the welcome video in Resources' },
    { id: 'connect', label: 'Connect Social Accounts', desc: 'Link your social media profiles' }
  ];

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <CardTitle>Unable to Load Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">{loadError}</p>
            <Button onClick={loadProfile} className="w-full" disabled={loadingProfile}>
              {loadingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                'Retry'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome to Your Marketing Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Let's get your account set up in just a few steps
          </p>
        </motion.div>

        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors
                ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}
              `}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><Building2 className="h-5 w-5" /> Business Information</>}
              {step === 2 && <><Target className="h-5 w-5" /> Marketing Goals</>}
              {step === 3 && <><BookOpen className="h-5 w-5" /> Getting Started Checklist</>}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us a bit about your business so we can tailor our services."}
              {step === 2 && "What do you hope to achieve with our marketing solutions?"}
              {step === 3 && "Review these steps to kickstart your growth journey."}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input 
                      id="business_name" 
                      placeholder="e.g. Acme Corp" 
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input 
                      id="industry" 
                      placeholder="e.g. Retail, Healthcare, Technology" 
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Textarea 
                      id="target_audience" 
                      placeholder="Who are your ideal customers?" 
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usp">Unique Selling Propositions</Label>
                    <Textarea 
                      id="usp" 
                      placeholder="What makes your business unique?" 
                      value={formData.unique_selling_propositions}
                      onChange={(e) => setFormData({ ...formData, unique_selling_propositions: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <p className="text-sm text-slate-600 mb-4">Select at least one goal to continue</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketingGoalsOptions.map((goal) => (
                      <div 
                        key={goal}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3
                          ${(formData.marketing_goals || []).includes(goal) 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'}
                        `}
                        onClick={() => toggleGoal(goal)}
                      >
                        <Checkbox 
                          checked={(formData.marketing_goals || []).includes(goal)}
                          onCheckedChange={() => toggleGoal(goal)}
                        />
                        <span className="font-medium text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">You're almost there!</h4>
                    </div>
                    <p className="text-green-700 text-sm">
                      Here is your personalized checklist to get started.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`
                            h-8 w-8 rounded-full flex items-center justify-center
                            ${item.id === 'profile' || item.id === 'goals' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}
                          `}>
                            {item.id === 'profile' || item.id === 'goals' ? 
                              <CheckCircle2 className="h-5 w-5" /> : 
                              <div className="h-2 w-2 bg-slate-400 rounded-full" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col items-end gap-3 border-t p-6 bg-slate-50 rounded-b-xl">
            {validationError && (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 font-medium">{validationError}</p>
              </div>
            )}
            
            <div className="flex justify-between w-full">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 1 || loading}
                className="min-h-[44px]"
                title={step === 1 ? "You're on the first step" : "Go back to previous step"}
              >
                Back
              </Button>
              
              {step < 3 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 min-h-[44px] min-w-[120px]"
                  disabled={loading}
                  title={loading ? "Saving your progress..." : "Continue to next step"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 min-h-[44px] min-w-[160px]"
                  title={loading ? "Completing your setup..." : "Finish onboarding and access your dashboard"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}