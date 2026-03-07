import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { ArrowRight, CheckCircle, Building2, Mail, Phone, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const SERVICE_OPTIONS = [
  { value: 'diy_saas', label: 'DIY — I\'ll run it myself ($99/mo)' },
  { value: 'dfy_managed', label: 'Done-For-You — manage it for me ($399/mo)' },
  { value: 'ada_rebuild', label: 'ADA Compliance / Website Rebuild' },
  { value: 'streaming_tv', label: 'Streaming TV Advertising' },
  { value: 'not_sure', label: 'Not sure yet — help me decide' },
];

export default function GetStarted() {
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_name: '',
    industry: '', service_interest: 'not_sure', message: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Create or find Company
      const company = await base44.entities.Company.create({
        business_name: form.business_name,
        industry: form.industry,
        email: form.email,
        phone: form.phone,
        status: 'lead',
        source: 'website',
        service_tracks: [form.service_interest].filter(s => s !== 'not_sure'),
      });

      // 2. Create Lead
      await base44.entities.Lead.create({
        company_id: company.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        business_name: form.business_name,
        industry: form.industry,
        service_interest: form.service_interest,
        message: form.message,
        status: 'new',
        source: 'website',
      });

      // 3. Send notification email
      await base44.integrations.Core.SendEmail({
        from_name: 'NTA — New Trial Signup',
        to: 'rick@newtechadvertising.com',
        subject: `New Trial Signup: ${form.business_name}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.business_name}\nIndustry: ${form.industry}\nService: ${form.service_interest}\nMessage: ${form.message}`,
      });

      setStep(2);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-3">You're in!</h1>
          <p className="text-slate-400 mb-6">
            We've received your info and will reach out within a few hours to get your account set up.
          </p>
          <div className="space-y-3">
            <Link
              to={createPageUrl('ClientOnboarding')}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              Set Up My Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={createPageUrl('Book-Call')}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Book a strategy call instead
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-5">
            Questions? Call <a href="tel:6414208816" className="text-violet-400">641-420-8816</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 py-4 px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <img src={LOGO_URL} alt="NTA" className="h-9 w-auto" />
          </Link>
          <Link to={createPageUrl('Book-Call')} className="text-slate-400 hover:text-white text-sm transition-colors">
            Prefer a call? →
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5" /> Start your free 14-day trial
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Start Free Trial</h1>
            <p className="text-slate-400">No credit card required. We'll set everything up for you.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name *</Label>
                <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Business Name *</Label>
                <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email *</Label>
                <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@smithplumbing.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone *</Label>
                <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">Industry</Label>
              <Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. HVAC, Restaurant, Law Firm" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">What are you most interested in? *</Label>
              <select
                required
                value={form.service_interest}
                onChange={e => set('service_interest', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {SERVICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">Anything else? (optional)</Label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={3}
                placeholder="Tell us your biggest marketing challenge..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-violet-600/30"
            >
              {submitting ? 'Submitting…' : 'Start My Free Trial'}
              {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            <p className="text-center text-slate-600 text-xs">
              14-day free trial · No credit card · Cancel anytime
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}