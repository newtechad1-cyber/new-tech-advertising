import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function AdaIntake() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    email: '',
    phone: '',
    website_url: '',
    city: '',
    state: '',
    nonprofit: false,
    number_of_locations: '1',
    site_type: 'service business',
    approximate_pages: '1-10',
    industry: '',
    notes: '',
    package: 'Growth'
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    const nonprofitParam = urlParams.get('nonprofit');
    
    if (packageParam) {
      setFormData(prev => ({ ...prev, package: packageParam }));
    }
    if (nonprofitParam === 'true') {
      setFormData(prev => ({ ...prev, nonprofit: true }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const lead = await base44.entities.AdaLead.create({
        ...formData,
        status: 'new',
        setup_price: 0,
        monthly_price: 0,
        multiplier: 1.0
      });

      await base44.functions.invoke('adaIntakeWebhook', {
        event: 'ada_intake_submitted',
        lead_id: lead.id,
        ...formData
      });

      navigate(createPageUrl('AdaQuote') + `?lead_id=${lead.id}`);
    } catch (error) {
      console.error('Intake submission error:', error);
      toast.error('Something went wrong. Please try again or call 641-420-8816');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">ADA Intake Form</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Request Your ADA Accessibility Review
            </h1>
            <p className="text-lg text-slate-600">
              Package: <span className="font-bold text-blue-600">{formData.package}</span>
              {formData.nonprofit && <span className="ml-2 text-green-600">(Nonprofit Pricing)</span>}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-slate-200 p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website_url">Website URL *</Label>
              <Input
                id="website_url"
                type="url"
                required
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="IA"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="nonprofit"
                checked={formData.nonprofit}
                onCheckedChange={(checked) => setFormData({ ...formData, nonprofit: checked })}
              />
              <Label htmlFor="nonprofit" className="cursor-pointer">
                We are a nonprofit, church, or community organization
              </Label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="number_of_locations">Number of Locations</Label>
                <Select value={formData.number_of_locations} onValueChange={(value) => setFormData({ ...formData, number_of_locations: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2-3">2-3</SelectItem>
                    <SelectItem value="4-10">4-10</SelectItem>
                    <SelectItem value="11+">11+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="site_type">Website Type</Label>
                <Select value={formData.site_type} onValueChange={(value) => setFormData({ ...formData, site_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brochure">Brochure / Info</SelectItem>
                    <SelectItem value="service business">Service Business</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="booking/scheduling">Booking / Scheduling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="approximate_pages">Approximate Pages</Label>
                <Select value={formData.approximate_pages} onValueChange={(value) => setFormData({ ...formData, approximate_pages: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-15">11-15</SelectItem>
                    <SelectItem value="16-30">16-30</SelectItem>
                    <SelectItem value="31+">31+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home services">Home Services</SelectItem>
                    <SelectItem value="medical">Medical / Healthcare</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any specific concerns or questions?"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit ADA Request'
              )}
            </Button>

            <p className="text-sm text-slate-500 text-center">
              We'll review your site and send you a detailed quote within 1 business day.
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}