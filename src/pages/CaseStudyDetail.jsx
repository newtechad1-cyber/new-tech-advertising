import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, CheckCircle, MapPin, TrendingUp, Users, Phone } from 'lucide-react';
import { toast } from 'sonner';

const SERVICE_LABELS = {
  'streaming-tv': 'Streaming TV Advertising',
  'local-seo': 'Local SEO',
  'ada-rebuild': 'ADA Website Rebuild',
  'ai-social-media': 'AI Social Media Marketing',
  'video-marketing': 'Video Marketing',
  'website-rebuild': 'Website Rebuild',
};

function LeadForm({ city, service }) {
  const [form, setForm] = useState({ business_name: '', city: city || '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.Lead.create({
        ...form,
        source: 'case-study',
        service_interest: service,
        status: 'new',
      });
      await base44.integrations.Core.SendEmail({
        from_name: 'NTA Case Study Lead',
        to: 'rick@newtechadvertising.com',
        subject: `Case Study Lead: ${form.business_name}`,
        body: `Business: ${form.business_name}\nCity: ${form.city}\nPhone: ${form.phone}\nEmail: ${form.email}\nService: ${service}`,
      });
      setSubmitted(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg mb-1">We'll be in touch!</h3>
        <p className="text-slate-400 text-sm">Expect a call within 2 business hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-slate-300 text-sm mb-1.5 block">Business Name *</Label>
        <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)}
          placeholder="Your Business" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
      </div>
      <div>
        <Label className="text-slate-300 text-sm mb-1.5 block">City *</Label>
        <Input required value={form.city} onChange={e => set('city', e.target.value)}
          placeholder="Your City" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
      </div>
      <div>
        <Label className="text-slate-300 text-sm mb-1.5 block">Phone *</Label>
        <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
          placeholder="(555) 123-4567" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
      </div>
      <div>
        <Label className="text-slate-300 text-sm mb-1.5 block">Email *</Label>
        <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="you@business.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
      </div>
      <Button type="submit" disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold h-11">
        {loading ? 'Sending…' : 'Get Results Like This'} <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}

export default function CaseStudyDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = window.location.pathname.split('/').pop();

  const { data: studies = [], isLoading } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: () => base44.entities.CaseStudy.filter({ slug, status: 'published' }),
  });

  const cs = studies[0];

  let metrics = [];
  try { metrics = JSON.parse(cs?.metrics || '[]'); } catch {}

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cs) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl font-bold">Case study not found</h1>
        <Link to={createPageUrl('CaseStudies')} className="text-violet-400 hover:underline">← View all case studies</Link>
      </div>
    );
  }

  const serviceLabel = SERVICE_LABELS[cs.service_used] || cs.service_used;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MarketingNav />

      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl('CaseStudies')} className="text-slate-500 hover:text-white text-sm mb-6 inline-block">
            ← All Case Studies
          </Link>
          <span className="inline-block text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full mb-4">
            {serviceLabel}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            How a {cs.industry} Company in {cs.city} Grew Using {serviceLabel}
          </h1>
          <p className="text-slate-400 text-lg mb-6">Real results from local businesses using NTA marketing technology.</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {cs.city}, {cs.state}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {cs.industry}</span>
          </div>
          <Link to={createPageUrl('Book-Call')}
            className="mt-8 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20">
            Start Your Campaign <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">

          {/* The Business */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-violet-600 text-white text-sm flex items-center justify-center font-bold">1</span>
              The Business
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg">{cs.business_name} is a {cs.industry.toLowerCase()} business located in {cs.city}, {cs.state}.</p>
          </section>

          {/* The Challenge */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-600 text-white text-sm flex items-center justify-center font-bold">2</span>
              The Challenge
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg">{cs.problem}</p>
          </section>

          {/* The Solution */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-cyan-600 text-white text-sm flex items-center justify-center font-bold">3</span>
              The Solution
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg">{cs.solution}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['AI video creation', 'Geo targeting', 'Conversion tracking'].map(item => (
                <div key={item} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* The Results */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-600 text-white text-sm flex items-center justify-center font-bold">4</span>
              The Results
            </h2>
            {metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {metrics.map((m, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                    <div className="text-2xl font-extrabold text-white mb-1">{m.value}</div>
                    <div className="text-slate-400 text-sm">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-slate-300 leading-relaxed text-lg">{cs.results}</p>
          </section>

          {/* What This Means */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              <TrendingUp className="w-6 h-6 inline mr-2 text-violet-400" />
              What This Means for Businesses in {cs.city}
            </h2>
            <p className="text-slate-300 leading-relaxed">
              If you're a {cs.industry.toLowerCase()} business in {cs.city} or the surrounding area, the same results are possible for you. Local competition is real, but so is the opportunity. Businesses that invest in {serviceLabel} right now are capturing the market while others wait.
            </p>
            <p className="text-slate-300 leading-relaxed mt-3">
              NTA's platform is built specifically for local businesses — giving you enterprise-level marketing tools at small business pricing. You don't need a big agency budget to compete.
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-2">Get Your Business Results Like This</h3>
            <p className="text-slate-400 text-sm mb-6">Tell us about your business and we'll show you what's possible.</p>
            <LeadForm city={cs.city} service={cs.service_used} />
            <p className="text-slate-600 text-xs text-center mt-4">Free consultation · No commitment</p>
            <p className="text-slate-600 text-xs text-center mt-1">
              Or call: <a href="tel:6414208816" className="text-violet-400">641-420-8816</a>
            </p>
          </div>

          {/* Quick Stats */}
          {metrics.length > 0 && (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Campaign Highlights</h4>
              <div className="space-y-3">
                {metrics.map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{m.label}</span>
                    <span className="text-white font-bold">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}