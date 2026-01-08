import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ShieldCheck } from 'lucide-react';
import { createPageUrl } from '../utils';
import { toast } from 'sonner';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function Ada() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    website_url: '',
    city: '',
    state: '',
    nonprofit: false,
    locations: '1',
    site_type: '',
    pages: '',
    industry: '',
    notes: '',
    selected_package: 'Starter'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await base44.functions.invoke('adaIntake', formData);
      toast.success('Form submitted successfully!');
      navigate(createPageUrl('AdaQuote') + '?lead_id=' + response.data.lead_id);
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error('Intake error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-4">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-semibold">ADA Compliance Review</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Get Your Website ADA Compliant
            </h1>
            <p className="text-xl text-slate-600">
              Tell us about your business and get a personalized quote in minutes
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Help us understand your ADA compliance needs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="business">Business Name *</Label>
                    <Input
                      id="business"
                      required
                      value={formData.business}
                      onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    placeholder="https://example.com"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="nonprofit"
                    checked={formData.nonprofit}
                    onCheckedChange={(checked) => setFormData({ ...formData, nonprofit: checked })}
                  />
                  <Label htmlFor="nonprofit" className="cursor-pointer">
                    This is a nonprofit organization
                  </Label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="locations">Number of Locations *</Label>
                    <Select value={formData.locations} onValueChange={(value) => setFormData({ ...formData, locations: value })}>
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
                    <Label htmlFor="site_type">Website Type *</Label>
                    <Select value={formData.site_type} onValueChange={(value) => setFormData({ ...formData, site_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informational">Informational</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="booking">Booking/Scheduling</SelectItem>
                        <SelectItem value="portal">Customer Portal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pages">Approximate Pages *</Label>
                    <Select value={formData.pages} onValueChange={(value) => setFormData({ ...formData, pages: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-15">1-15</SelectItem>
                        <SelectItem value="16-30">16-30</SelectItem>
                        <SelectItem value="31+">31+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      required
                      placeholder="e.g., Healthcare, Retail"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="selected_package">Select Package *</Label>
                  <Select value={formData.selected_package} onValueChange={(value) => setFormData({ ...formData, selected_package: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Starter">Starter - One-time compliance</SelectItem>
                      <SelectItem value="Growth">Growth - Setup + Monthly monitoring</SelectItem>
                      <SelectItem value="Authority">Authority - Premium support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="Any specific concerns or questions?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                      Processing...
                    </>
                  ) : (
                    'Get My Quote'
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