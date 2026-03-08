import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { ArrowRight, CheckCircle, Building2, Mail, Phone, User, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const SERVICE_OPTIONS = [
  { value: 'dfy_managed', label: 'Done-For-You Social Media Management' },
  { value: 'diy_saas', label: 'DIY Platform — I want a demo' },
  { value: 'ada_rebuild', label: 'ADA Compliance / Website Rebuild' },
  { value: 'streaming_tv', label: 'Streaming TV Advertising' },
  { value: 'not_sure', label: 'Not sure — I want advice' },
];

const BEST_TIMES = [
  'Morning (9am–12pm)', 'Afternoon (12pm–3pm)', 'Late Afternoon (3pm–5pm)',
];

export default function BookCall() {
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_name: '', website_url: '',
    service_interest: 'not_sure', best_time: '', message: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Create Company record
      const company = await base44.entities.Company.create({
        business_name: form.business_name,
        email: form.email,
        phone: form.phone,
        website_url: form.website_url,
        status: 'lead',
        source: 'website',
      });

      // Create Lead
      await base44.entities.Lead.create({
        company_id: company.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        business_name: form.business_name,
        website_url: form.website_url,
        service_interest: form.service_interest,
        message: `Best time to call: ${form.best_time}\n\n${form.message}`,
        status: 'new',
        source: 'website',
      });

      // Notify team
      await base44.integrations.Core.SendEmail({
        from_name: 'NTA — Strategy Call Request',
        to: 'rick@newtechadvertising.com',
        subject: `Strategy Call Request: ${form.business_name}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.business_name}\nWebsite: ${form.website_url || 'Not provided'}\nService: ${form.service_interest}\nBest Time: ${form.best_time}\nMessage: ${form.message}`,
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
          <h1 className="text-2xl font-extrabold text-white mb-3">Call Requested!</h1>
          <p className="text-slate-400 mb-2">
            We'll reach out within <strong className="text-white">2 business hours</strong> to confirm your strategy call.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            We'll call <span className="text-white">{form.phone}</span> during {form.best_time || 'your preferred time'}.
          </p>
          <div className="space-y-3">
            <Link
              to={createPageUrl('Get-Started')}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all text-sm"
            >
              Start free trial while you wait <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={createPageUrl('Home')}
              className="w-full flex items-center justify-center text-slate-500 hover:text-white text-sm transition-colors py-2"
            >
              ← Back to home
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-5">
            Urgent? Call directly: <a href="tel:6414208816" className="text-violet-400">641-420-8816</a>
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
          <Link to={createPageUrl('Get-Started')} className="text-slate-400 hover:text-white text-sm transition-colors">
            Prefer self-service? →
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium px-4 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5" /> Free 30-minute strategy call
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Book a Strategy Call</h1>
            <p className="text-slate-400">Talk to our team. No pitch, no pressure — just a real conversation about your marketing.</p>
          </div>

          {/* What to expect */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-6 space-y-2">
            {[
              'We\'ll audit your current online presence',
              'Identify your biggest growth opportunity',
              'Recommend the right NTA plan for your budget',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                {item}
              </div>
            ))}
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
                <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@business.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone *</Label>
                <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Business Website *</Label>
              <Input required type="url" value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://yourbusiness.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              <p className="text-slate-500 text-xs mt-1">We'll scan your site before the call so we can give you specific recommendations.</p>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">What service are you interested in? *</Label>
              <select
                required
                value={form.service_interest}
                onChange={e => set('service_interest', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {SERVICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">Best time to call *</Label>
              <div className="grid grid-cols-3 gap-2">
                {BEST_TIMES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('best_time', t)}
                    className={`text-xs py-2 px-3 rounded-lg border transition-all ${
                      form.best_time === t
                        ? 'bg-cyan-600 border-cyan-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">What's your biggest marketing challenge? (optional)</Label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                rows={3}
                placeholder="e.g. I'm not getting enough leads from social media..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || !form.best_time}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-cyan-600/30"
            >
              {submitting ? 'Booking…' : 'Request My Strategy Call'}
              {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            <p className="text-center text-slate-600 text-xs">
              Free consultation · No commitment · We'll call within 2 business hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}