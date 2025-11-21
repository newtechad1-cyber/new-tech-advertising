import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, CheckCircle, Building2, Globe, Mail, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    currentWebsite: '',
    websiteNeeds: '',
    socialChannels: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      tiktok: '',
      youtube: ''
    },
    additionalInfo: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialChannels: {
        ...prev.socialChannels,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format social channels
      const activeSocials = Object.entries(formData.socialChannels)
        .filter(([_, url]) => url)
        .map(([platform, url]) => `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}`)
        .join('\n');

      // Create email body
      const emailBody = `
New Client Onboarding Information
================================

CONTACT INFORMATION
-------------------
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

BUSINESS INFORMATION
--------------------
Business Name: ${formData.businessName}
Business Type: ${formData.businessType}
Current Website: ${formData.currentWebsite || 'None'}
Website Needs: ${formData.websiteNeeds}

SOCIAL MEDIA CHANNELS
---------------------
${activeSocials || 'No social channels provided'}

ADDITIONAL INFORMATION
----------------------
${formData.additionalInfo || 'None provided'}

---
Submitted: ${new Date().toLocaleString()}
      `;

      await base44.integrations.Core.SendEmail({
        from_name: 'New Tech Advertising Onboarding',
        to: 'rick@newtechadvertising.com',
        subject: `New Client Onboarding: ${formData.businessName}`,
        body: emailBody
      });

      setStep(3);
      toast.success('Your information has been submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">NT</span>
            </div>
            <span className="text-white font-bold text-xl">New Tech Advertising</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-all ${
                  s === step ? 'bg-blue-500 w-6' : s < step ? 'bg-green-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Step 1: Contact & Business Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Let's Get Started
              </h1>
              <p className="text-slate-600 text-lg">
                Tell us about you and your business so we can create the perfect marketing solution.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
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
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="businessName" className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" />
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Smith Plumbing"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="businessType" className="mb-2">
                  Type of Business *
                </Label>
                <Input
                  id="businessType"
                  required
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  placeholder="e.g., Restaurant, Plumbing, Law Firm, Retail Store"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Website & Social Media */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Your Online Presence
              </h1>
              <p className="text-slate-600 text-lg">
                Help us understand your current digital footprint and what you need.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="currentWebsite" className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" />
                  Current Website (if any)
                </Label>
                <Input
                  id="currentWebsite"
                  type="url"
                  value={formData.currentWebsite}
                  onChange={(e) => handleInputChange('currentWebsite', e.target.value)}
                  placeholder="https://yourbusiness.com"
                />
              </div>

              <div>
                <Label htmlFor="websiteNeeds" className="mb-2">
                  What do you need for your website? *
                </Label>
                <Textarea
                  id="websiteNeeds"
                  required
                  value={formData.websiteNeeds}
                  onChange={(e) => handleInputChange('websiteNeeds', e.target.value)}
                  placeholder="e.g., New website from scratch, redesign existing site, improve SEO, add online booking..."
                  rows={4}
                />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-semibold text-lg mb-4">Social Media Channels</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Enter the URLs for any social media profiles you currently have
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.keys(formData.socialChannels).map((platform) => (
                    <div key={platform}>
                      <Label htmlFor={platform} className="mb-2 capitalize">
                        {platform}
                      </Label>
                      <Input
                        id={platform}
                        type="url"
                        value={formData.socialChannels[platform]}
                        onChange={(e) => handleSocialChange(platform, e.target.value)}
                        placeholder={`https://${platform}.com/yourpage`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="additionalInfo" className="mb-2">
                  Anything Else We Should Know?
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="Tell us about your goals, target audience, competitors, or anything else that might help us serve you better..."
                  rows={4}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                  {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              You're All Set!
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Thank you, {formData.fullName}! We've received your information and will be in touch within 24 hours to get your AI-powered marketing up and running.
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 max-w-xl mx-auto mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">What Happens Next?</h3>
              <ul className="text-left space-y-2 text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Rick will personally review your information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>We'll schedule a strategy call to discuss your goals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your AI marketing system will be live within 48 hours</span>
                </li>
              </ul>
            </div>

            <div className="text-sm text-slate-600">
              <p>Questions? Call us at <a href="tel:641-420-8816" className="text-blue-600 font-semibold">641-420-8816</a></p>
              <p>or email <a href="mailto:rick@newtechadvertising.com" className="text-blue-600 font-semibold">rick@newtechadvertising.com</a></p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}