import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function AdaOnboarding() {
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    best_contact_method: 'email',
    preferred_contact_name: '',
    login_access_notes: '',
    hosting_provider: '',
    cms_platform: '',
    brand_assets_url: '',
    priority_pages: '',
    deadlines: ''
  });

  useEffect(() => {
    loadLead();
  }, []);

  const loadLead = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const leadId = urlParams.get('lead_id');

    if (!leadId) {
      toast.error('Invalid onboarding link');
      setIsLoading(false);
      return;
    }

    try {
      const leads = await base44.entities.AdaLead.filter({ id: leadId });
      if (leads.length === 0) {
        toast.error('Lead not found');
        return;
      }
      setLead(leads[0]);
      setFormData({ ...formData, preferred_contact_name: leads[0].full_name });
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save onboarding data
      await base44.entities.AdaOnboarding.create({
        lead_id: lead.id,
        ...formData
      });

      // Update lead status
      await base44.entities.AdaLead.update(lead.id, {
        status: 'onboarded'
      });

      // Track activity
      await base44.entities.LeadActivity.create({
        lead_id: lead.id,
        activity_type: 'form_submission',
        page_url: '/ada/onboarding',
        details: 'Onboarding form completed'
      });

      // Emit webhook event
      await base44.functions.invoke('adaWebhookHandler', {
        event: 'onboarding_completed',
        lead_id: lead.id,
        contact: {
          name: lead.full_name,
          email: lead.email,
          phone: lead.phone,
          business: lead.business_name
        },
        onboarding: formData,
        package: lead.package
      });

      setShowSuccess(true);
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error('Onboarding error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Onboarding not found</p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Onboarding Complete!
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Thank you for providing your information. Our team will begin work on your ADA compliance project right away.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Onboarding Information
            </h1>
            <p className="text-xl text-slate-600">
              Help us get started on your ADA compliance project
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Business: {lead.business_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="best_contact_method">Preferred Contact Method *</Label>
                    <Select value={formData.best_contact_method} onValueChange={(value) => setFormData({ ...formData, best_contact_method: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="sms">SMS/Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="preferred_contact_name">Preferred Name *</Label>
                    <Input
                      id="preferred_contact_name"
                      required
                      value={formData.preferred_contact_name}
                      onChange={(e) => setFormData({ ...formData, preferred_contact_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hosting_provider">Hosting Provider</Label>
                  <Input
                    id="hosting_provider"
                    placeholder="e.g., GoDaddy, Bluehost, AWS"
                    value={formData.hosting_provider}
                    onChange={(e) => setFormData({ ...formData, hosting_provider: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cms_platform">CMS Platform</Label>
                  <Input
                    id="cms_platform"
                    placeholder="e.g., WordPress, Wix, Squarespace, Custom"
                    value={formData.cms_platform}
                    onChange={(e) => setFormData({ ...formData, cms_platform: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="login_access_notes">Website Access Information</Label>
                  <Textarea
                    id="login_access_notes"
                    rows={3}
                    placeholder="How can we access your website for updates? (admin login, FTP, etc.)"
                    value={formData.login_access_notes}
                    onChange={(e) => setFormData({ ...formData, login_access_notes: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="priority_pages">Priority Pages</Label>
                  <Textarea
                    id="priority_pages"
                    rows={3}
                    placeholder="Which pages are most important to fix first?"
                    value={formData.priority_pages}
                    onChange={(e) => setFormData({ ...formData, priority_pages: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="deadlines">Deadlines or Time Constraints</Label>
                  <Textarea
                    id="deadlines"
                    rows={2}
                    placeholder="Any specific dates or urgency we should know about?"
                    value={formData.deadlines}
                    onChange={(e) => setFormData({ ...formData, deadlines: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Complete Onboarding'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}