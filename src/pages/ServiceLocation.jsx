import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { ChevronRight, CheckCircle, AlertCircle, Tv, MapPin, TrendingUp, DollarSign, Target } from 'lucide-react';

const SERVICE_BENEFITS = {
  'streaming-tv-advertising': [
    { icon: Target, label: 'ZIP Code Targeting', desc: 'Ads only reach households in your service area' },
    { icon: TrendingUp, label: 'Measurable ROI', desc: 'Track impressions, completions, and website visits' },
    { icon: DollarSign, label: 'Affordable Budgets', desc: 'Start from $500/month — fraction of cable TV cost' },
    { icon: Tv, label: '30+ Platforms', desc: 'Roku, Hulu, YouTube TV, and more simultaneously' },
  ],
  'ada-website-compliance': [
    { icon: CheckCircle, label: 'Legal Protection', desc: 'Reduce ADA lawsuit risk with WCAG 2.1 AA compliance' },
    { icon: TrendingUp, label: 'Better SEO', desc: 'Accessibility improvements boost search rankings' },
    { icon: Target, label: 'More Customers', desc: 'Reach the 26% of US adults with a disability' },
    { icon: DollarSign, label: 'Avoid Costly Fines', desc: 'Settle before a lawsuit costs $5,000–$25,000+' },
  ],
};

const DEFAULT_BENEFITS = [
  { icon: Target, label: 'Local Targeting', desc: 'Reach customers exactly where your business operates' },
  { icon: TrendingUp, label: 'Measurable Results', desc: 'Track every lead, click, and conversion' },
  { icon: DollarSign, label: 'Affordable Budgets', desc: 'Marketing plans built for small business budgets' },
  { icon: CheckCircle, label: 'Done For You', desc: 'NTA handles everything from strategy to execution' },
];

function LeadForm({ city, service }) {
  const [form, setForm] = useState({ business_name: '', city: city || '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.Lead.create({
        name: form.business_name,
        email: form.email,
        phone: form.phone,
        location_city: form.city,
        source_page: `service-location:${service}:${city}`,
        status: 'new',
        lead_type: 'inbound',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">We'll be in touch!</h3>
        <p className="text-slate-300">Thanks — a member of our team will reach out within 1 business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Business Name *"
        required
        value={form.business_name}
        onChange={e => setForm({ ...form, business_name: e.target.value })}
        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
      />
      <input
        type="text"
        placeholder="Your City *"
        required
        value={form.city}
        onChange={e => setForm({ ...form, city: e.target.value })}
        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
      />
      <input
        type="email"
        placeholder="Email Address *"
        required
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
      >
        {submitting ? 'Sending...' : 'Get Started →'}
      </button>
      <p className="text-slate-500 text-xs text-center">No credit card required. Free consultation.</p>
    </form>
  );
}

export default function ServiceLocation() {
  const { service, location } = useParams();
  const [page, setPage] = useState(null);
  const [relatedPages, setRelatedPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true);
        const cityName = location
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const [pages, related] = await Promise.all([
          base44.entities.LocationPage.filter({ service_slug: service, city: cityName }),
          base44.entities.Page.filter({ section: 'learn', status: 'published' }, '-publish_date', 4),
        ]);

        if (pages.length === 0) {
          setError(`No page found for ${service} in ${cityName}`);
          return;
        }

        setPage(pages[0]);
        setRelatedPages(related);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPage();
  }, [service, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <MarketingNav />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
            <p className="text-slate-300 mb-6">{error}</p>
            <Link to={createPageUrl('Home')} className="text-violet-400 hover:text-violet-300 font-semibold">
              Return to Home
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const faq = page.faq ? (typeof page.faq === 'string' ? JSON.parse(page.faq) : page.faq) : [];
  const benefits = SERVICE_BENEFITS[service] || DEFAULT_BENEFITS;
  const serviceLabel = service.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MarketingNav />

      {/* Hero + Lead Form */}
      <section className="py-20 px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-slate-400 text-sm flex-wrap">
              <Link to={createPageUrl('Home')} className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{serviceLabel}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{page.city}</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-violet-400" />
              <span className="text-violet-400 font-semibold text-sm">{page.city}, {page.state}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">{page.h1}</h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">{page.intro_paragraph}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={page.cta_primary_url}
                className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                {page.cta_primary} <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href={page.cta_secondary_url}
                className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                {page.cta_secondary}
              </a>
            </div>
          </div>

          {/* Lead Form */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h3 className="text-white font-bold text-xl mb-2">Get Started in {page.city}</h3>
            <p className="text-slate-400 text-sm mb-6">Free consultation — no commitment required.</p>
            <LeadForm city={page.city} service={service} />
          </div>
        </div>
      </section>

      {/* Why This Service in This City */}
      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why {page.city} Businesses Need {serviceLabel}
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">{page.service_overview}</p>
          <p className="text-lg text-slate-300 leading-relaxed">{page.why_this_service_matters}</p>
        </div>
      </section>

      {/* Local Market Context */}
      <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            The {page.city} Market
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-8">{page.local_market_context}</p>

          {page.local_examples?.length > 0 && (
            <div>
              <p className="text-slate-300 font-semibold mb-4">Industries Using {serviceLabel} in {page.city}:</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {page.local_examples.map((example, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10">
            Why It Works for {page.city} Businesses
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex gap-4 p-6 bg-slate-900 border border-slate-800 rounded-xl">
                <div className="bg-violet-600/20 p-2.5 rounded-lg h-fit">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">{label}</p>
                  <p className="text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study / Example Campaign */}
      {page.case_study_section && (
        <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Example Campaign in {page.city}</h2>
            <div className="bg-gradient-to-br from-violet-900/30 to-slate-900 border border-violet-700/40 rounded-2xl p-8">
              <p className="text-slate-300 leading-relaxed text-lg">{page.case_study_section}</p>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 px-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">How NTA Works in {page.city}</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-10">{page.how_it_works}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Discovery & Strategy', 'Campaign Setup', 'Launch & Distribute', 'Track & Optimize'].map((step, i) => (
              <div key={step} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
                <div className="text-3xl font-extrabold text-violet-500/30 mb-3">0{i + 1}</div>
                <p className="text-white font-semibold text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-16 px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              {page.city} Business FAQs
            </h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="bg-slate-900 border border-slate-700 rounded-xl p-6 cursor-pointer group">
                  <summary className="text-white font-semibold flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <p className="text-slate-300 mt-4 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles + Internal Links */}
      {relatedPages.length > 0 && (
        <section className="py-16 px-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Learn More About {serviceLabel}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPages.map((p) => (
                <a
                  key={p.id}
                  href={p.full_url}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-violet-500/50 transition-colors group"
                >
                  <p className="text-white font-semibold group-hover:text-violet-400 transition-colors mb-2">{p.title}</p>
                  <p className="text-slate-400 text-sm line-clamp-2">{p.hero_subheading}</p>
                  <span className="text-violet-400 text-xs mt-3 inline-flex items-center gap-1">
                    Read more <ChevronRight className="w-3 h-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started in {page.city}?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Let NTA help your {page.city} business grow with {serviceLabel}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={page.cta_primary_url}
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg"
            >
              {page.cta_primary} <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="/book-call"
              className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-500 text-white font-semibold px-10 py-4 rounded-xl transition-colors"
            >
              Book a Call
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-6">No credit card required.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}