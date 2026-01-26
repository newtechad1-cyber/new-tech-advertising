import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OnboardingStart() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    email: '',
    phone: '',
    current_website_url: '',
    city: '',
    state: '',
    goals: '',
    must_keep: '',
    notes: ''
  });

  useEffect(() => {
    // Preserve UTM parameters
    const currentParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of currentParams.entries()) {
      if (key.startsWith('utm_') || key === 'source' || key === 'campaign') {
        utmParams[key] = value;
      }
    }
    if (Object.keys(utmParams).length > 0) {
      sessionStorage.setItem('onboarding_utm', JSON.stringify(utmParams));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.ClientIntake.create({
        ...formData,
        service_type: 'Full Onboarding',
        status: 'submitted'
      });

      await base44.entities.ActivityLog.create({
        event_type: 'onboarding_submission',
        summary: `${formData.business_name} submitted onboarding form`,
        metadata: { full_name: formData.full_name, email: formData.email }
      });

      toast.success('Your information has been submitted!');
      navigate(createPageUrl('OnboardThankYou'));
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {currentStep} of 3</span>
            <span className="text-sm text-slate-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Contact & Business Info */}
        {currentStep === 1 && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tell Us About Your Business</h1>
            <p className="text-slate-600 mb-6">We'll use this to create a custom marketing plan</p>
            
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  required
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder="Smith Plumbing"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@business.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Step 2: Location & Website */}
        {currentStep === 2 && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Where Are You Located?</h1>
            <p className="text-slate-600 mb-6">Help us understand your market</p>
            
            <form onSubmit={handleNext} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Mason City"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="IA"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="current_website_url">Current Website (if any)</Label>
                <Input
                  id="current_website_url"
                  type="url"
                  value={formData.current_website_url}
                  onChange={(e) => handleInputChange('current_website_url', e.target.value)}
                  placeholder="https://yourbusiness.com"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Step 3: Goals & Notes */}
        {currentStep === 3 && (
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">What Are Your Goals?</h1>
            <p className="text-slate-600 mb-6">Tell us what you want to achieve</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="goals">What do you want to accomplish? *</Label>
                <Textarea
                  id="goals"
                  required
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="e.g., Get more customers, improve my website, increase visibility..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="must_keep">What's working well that you want to keep?</Label>
                <Textarea
                  id="must_keep"
                  value={formData.must_keep}
                  onChange={(e) => handleInputChange('must_keep', e.target.value)}
                  placeholder="e.g., My logo, specific features, existing content..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Anything else we should know?</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Budget range, timeline, special requirements..."
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit <CheckCircle2 className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}