import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Globe } from 'lucide-react';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import TestModeBanner from '../components/TestModeBanner';

export default function RebuildIntake() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
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
    brand_assets: '',
    notes: ''
  });

  useEffect(() => {
    checkTestMode();
  }, []);

  const checkTestMode = async () => {
    try {
      const settings = await base44.entities.AppSettings.list();
      if (settings.length > 0 && settings[0].test_mode_enabled) {
        setIsTestMode(true);
      }
    } catch (error) {
      console.log('Error checking test mode:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const intake = await base44.entities.ClientIntake.create({
        ...formData,
        service_type: 'website_rebuild',
        services_requested: ['website_rebuild'],
        delivery_preference: 'HYBRID',
        status: 'submitted'
      });

      await base44.asServiceRole.entities.ActivityLog.create({
        event_type: 'clientintake_created',
        summary: 'Website rebuild intake submitted',
        user_email: formData.email,
        metadata: {
          intake_id: intake.id,
          business_name: formData.business_name,
          service_type: 'website_rebuild',
          test_mode: isTestMode
        }
      });

      await base44.integrations.Core.SendEmail({
        to: formData.email,
        from_name: 'New Tech Advertising',
        subject: 'Your Website Rebuild Request - Received',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1e40af; margin-bottom: 20px;">Thank You, ${formData.full_name}!</h1>
            
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">
              We've received your website rebuild request for <strong>${formData.business_name}</strong>.
            </p>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #475569; font-size: 18px; margin-bottom: 10px;">What Happens Next:</h2>
              <ol style="color: #64748b; line-height: 1.8;">
                <li>Our team will review your request within 1 business day</li>
                <li>We'll reach out to discuss your goals and timeline</li>
                <li>You'll receive a custom proposal with pricing</li>
              </ol>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #475569; font-size: 16px; margin-bottom: 10px;">Your Request Details:</h3>
              <p style="color: #64748b; margin: 5px 0;"><strong>Business:</strong> ${formData.business_name}</p>
              ${formData.current_website_url ? `<p style="color: #64748b; margin: 5px 0;"><strong>Current Website:</strong> ${formData.current_website_url}</p>` : ''}
              <p style="color: #64748b; margin: 5px 0;"><strong>Goals:</strong> ${formData.goals}</p>
            </div>

            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">
              Questions? Call us at <strong>641-420-8816</strong> or reply to this email.
            </p>

            <p style="font-size: 14px; color: #94a3b8;">
              — The Team at New Tech Advertising
            </p>
          </div>
        `
      });

      navigate(createPageUrl('OnboardThankYou'));
    } catch (error) {
      console.error('Error submitting intake:', error);
      alert('There was an error submitting your request. Please try again or call 641-420-8816.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TestModeBanner />
      <Header onCTAClick={() => {}} />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Website Rebuild</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Request an ADA-Friendly Website Rebuild
            </h1>
            <p className="text-xl text-slate-600">
              This is different from an accessibility audit. A rebuild is a new website built with accessibility best practices baked in.
            </p>
          </div>

          <Card className="p-8 mb-8 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-bold text-slate-900 mb-3">What's the Difference?</h2>
            <p className="text-slate-700">
              This is different from an accessibility audit. A rebuild is a <strong>new website build</strong> with accessibility best practices baked in from the ground up—along with modern design, faster performance, and better conversion.
            </p>
          </Card>

          <Card className="p-8 bg-white shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="text"
                    name="business_name"
                    required
                    value={formData.business_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Website URL
                </label>
                <Input
                  type="url"
                  name="current_website_url"
                  value={formData.current_website_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="IA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What do you want the new website to accomplish? <span className="text-red-600">*</span>
                </label>
                <Textarea
                  name="goals"
                  required
                  value={formData.goals}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Generate more leads, improve credibility, rank better on Google, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pages/features you must keep (if any)
                </label>
                <Textarea
                  name="must_keep"
                  value={formData.must_keep}
                  onChange={handleChange}
                  rows={4}
                  placeholder="E.g., booking system, blog, product catalog..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Links to logo/photos/brand kit (if available)
                </label>
                <Textarea
                  name="brand_assets"
                  value={formData.brand_assets}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Google Drive link, Dropbox, or any URL where we can access your brand assets"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes
                </label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Timeline, budget considerations, or anything else we should know"
                />
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6 h-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Rebuild Request'
                  )}
                </Button>
              </div>

              <p className="text-sm text-slate-500 text-center">
                We'll review your request and reach out within 1 business day
              </p>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}