import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { trackLeadSubmit } from '../analytics/trackingUtils';

export default function SignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    websiteUrl: '',
    message: '',
    selectedService: 'complete-marketing'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('SIGNUP_CLICK', { email: formData.email });

    try {
      // Create lead record
      const lead = await base44.entities.Lead.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        business_name: formData.businessName,
        website_url: formData.websiteUrl,
        message: formData.message,
        status: 'new'
      });

      // Track lead submission with analytics
      trackLeadSubmit(formData);
      console.log('SIGNUP_SUCCESS', { leadId: lead.id });

      try {
        await base44.integrations.Core.SendEmail({
          to: 'newtechad1@gmail.com',
          subject: `New Lead: ${formData.businessName || formData.name}`,
          body: `New Lead Submission

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Business Name: ${formData.businessName}
Website: ${formData.websiteUrl || 'Not provided'}
Message: ${formData.message || 'N/A'}

---
Submitted from AI Marketing Landing Page`
        });
      } catch (emailError) {
        console.log('Email notification failed (lead saved):', emailError);
      }

      // Preserve UTM parameters
      const currentParams = new URLSearchParams(window.location.search);
      const utmParams = new URLSearchParams();
      for (const [key, value] of currentParams.entries()) {
        if (key.startsWith('utm_') || key === 'source' || key === 'campaign') {
          utmParams.append(key, value);
        }
      }

      // Set onboarding URL with UTM params
      const onboardingUrl = window.location.origin + '/onboarding-start' + 
        (utmParams.toString() ? `?${utmParams.toString()}` : '');
      setCheckoutUrl(onboardingUrl);
      setShowSuccess(true);
    } catch (error) {
      console.error('SIGNUP_FAIL', error);
      toast.error(error.message || 'Something went wrong. Please call us at 641-420-8816 or email rick@newtechadvertising.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {showSuccess ? (
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h3>
                <p className="text-xl text-slate-700 mb-6">
                  Your information has been submitted successfully.
                </p>
                <p className="text-slate-600 mb-8">
                  Click below to continue to your onboarding dashboard!
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => window.location.href = checkoutUrl}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl"
                  >
                    Continue to Onboarding
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="w-full"
                  >
                    I'll Do This Later
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get Started Today
                </h3>
                <p className="text-white/90 text-sm">
                  Tell us about your business and we'll contact you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <Label htmlFor="service" className="text-slate-700 font-medium">
                    Select Service *
                  </Label>
                  <select
                    id="service"
                    required
                    value={formData.selectedService}
                    onChange={(e) => setFormData({ ...formData, selectedService: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="complete-marketing">Complete Marketing Solution - $297/mo</option>
                    <option value="dfy-social">Done For You Social Media - $197/mo</option>
                    <option value="diy-social">Do It Yourself Social Media - $97/mo</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="businessName" className="text-slate-700 font-medium">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="mt-2"
                    placeholder="Your Business LLC"
                  />
                </div>

                <div>
                  <Label htmlFor="websiteUrl" className="text-slate-700 font-medium">
                    Business Website *
                  </Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    required
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="mt-2"
                    placeholder="https://yourbusiness.com"
                  />
                  <p className="text-xs text-slate-500 mt-1">We'll scan your site so we can give you specific recommendations.</p>
                </div>

                <div>
                  <Label htmlFor="message" className="text-slate-700 font-medium">
                    Tell us about your business (optional)
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2"
                    placeholder="What services do you offer? What are your marketing goals?"
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    ✓ No contracts required<br />
                    ✓ Cancel anytime, no questions asked<br />
                    ✓ You're never locked in
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-xl shadow-lg group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send My Information
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  By submitting, you agree to receive communication about our services.
                </p>
              </form>
            </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}