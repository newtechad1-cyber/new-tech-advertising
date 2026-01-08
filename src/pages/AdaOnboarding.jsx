import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function AdaOnboarding() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lead, setLead] = useState(null);
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
    const urlParams = new URLSearchParams(window.location.search);
    const leadId = urlParams.get('lead_id');
    
    if (!leadId) {
      navigate(createPageUrl('AdaAccessibility'));
      return;
    }

    loadLead(leadId);
  }, []);

  const loadLead = async (leadId) => {
    try {
      const leads = await base44.entities.AdaLead.filter({ id: leadId });
      if (leads.length > 0) {
        const leadData = leads[0];
        setLead(leadData);
        setFormData(prev => ({
          ...prev,
          preferred_contact_name: leadData.full_name
        }));
      }
    } catch (error) {
      console.error('Error loading lead:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, brand_assets_url: file_url });
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('File upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.AdaOnboarding.create({
        ...formData,
        lead_id: lead.id
      });

      await base44.entities.AdaLead.update(lead.id, {
        status: 'onboarded'
      });

      await base44.functions.invoke('adaOnboardingComplete', {
        lead_id: lead.id
      });

      navigate(createPageUrl('AdaThankYou'));
    } catch (error) {
      console.error('Onboarding submission error:', error);
      toast.error('Something went wrong. Please try again or call 641-420-8816');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Payment Received</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Complete Your Onboarding
            </h1>
            <p className="text-lg text-slate-600">
              {lead.business_name} — {lead.package} Package
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-6">
            <div>
              <Label htmlFor="best_contact_method">Preferred Contact Method *</Label>
              <Select value={formData.best_contact_method} onValueChange={(value) => setFormData({ ...formData, best_contact_method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">Text / SMS</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferred_contact_name">Preferred Contact Name</Label>
              <Input
                id="preferred_contact_name"
                value={formData.preferred_contact_name}
                onChange={(e) => setFormData({ ...formData, preferred_contact_name: e.target.value })}
                placeholder="What should we call you?"
              />
            </div>

            <div>
              <Label htmlFor="login_access_notes">Website Login Access</Label>
              <Textarea
                id="login_access_notes"
                value={formData.login_access_notes}
                onChange={(e) => setFormData({ ...formData, login_access_notes: e.target.value })}
                placeholder="WordPress admin, hosting panel, etc. (We'll send you a secure form for credentials)"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="hosting_provider">Hosting Provider</Label>
                <Input
                  id="hosting_provider"
                  value={formData.hosting_provider}
                  onChange={(e) => setFormData({ ...formData, hosting_provider: e.target.value })}
                  placeholder="GoDaddy, Bluehost, etc."
                />
              </div>
              <div>
                <Label htmlFor="cms_platform">CMS Platform</Label>
                <Input
                  id="cms_platform"
                  value={formData.cms_platform}
                  onChange={(e) => setFormData({ ...formData, cms_platform: e.target.value })}
                  placeholder="WordPress, Wix, Squarespace, etc."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="brand_assets">Brand Assets (Optional)</Label>
              <Input
                id="brand_assets"
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.zip,.jpg,.png"
              />
              <p className="text-sm text-slate-500 mt-1">
                Logo, brand guidelines, style documents
              </p>
              {formData.brand_assets_url && (
                <p className="text-sm text-green-600 mt-2">✓ File uploaded</p>
              )}
            </div>

            <div>
              <Label htmlFor="priority_pages">Priority Pages to Fix</Label>
              <Textarea
                id="priority_pages"
                value={formData.priority_pages}
                onChange={(e) => setFormData({ ...formData, priority_pages: e.target.value })}
                placeholder="Homepage, Contact page, Services page..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="deadlines">Deadlines or Time Constraints</Label>
              <Textarea
                id="deadlines"
                value={formData.deadlines}
                onChange={(e) => setFormData({ ...formData, deadlines: e.target.value })}
                placeholder="Any specific dates we should know about?"
                rows={2}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
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

            <p className="text-sm text-slate-500 text-center">
              After submission, we'll start your accessibility remediation within 24 hours.
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}