import React from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { 
  Search, Share2, Globe, Video, Shield, BarChart3, 
  ArrowRight, MapPin, Smartphone, Star 
} from 'lucide-react';
import AuditFormSection from '@/components/audit/AuditFormSection';

const SERVICES = [
  {
    icon: Search,
    title: 'AI Search Optimization',
    desc: 'Get found in Google, Bing, and AI search engines. We optimize your online presence so local customers find you first — not your competitors.',
    link: '/AiSeo',
    features: ['Google Business Profile management', 'Local SEO optimization', 'AI search visibility'],
  },
  {
    icon: Share2,
    title: 'Social Media Management',
    desc: 'Consistent, professional social media content across Facebook, Instagram, and LinkedIn — created and scheduled by AI, reviewed by humans.',
    link: '/services/social-media-management',
    features: ['AI-generated content', 'Multi-platform publishing', 'Monthly performance reports'],
  },
  {
    icon: Globe,
    title: 'Website Design & Rebuilds',
    desc: 'Modern, mobile-responsive websites built for speed, SEO, and conversions. Your website should be your hardest-working salesperson.',
    link: '/services/website-rebuilds',
    features: ['Mobile-first design', 'SEO-optimized structure', 'Conversion-focused layout'],
  },
  {
    icon: Video,
    title: 'AI Video Production',
    desc: 'Professional video content without the production costs. AI-powered video creation for social media, websites, and advertising.',
    link: '/AiVideos',
    features: ['AI avatar presentations', 'Social media video', 'Brand storytelling'],
  },
  {
    icon: BarChart3,
    title: 'AI Advertising',
    desc: 'Targeted digital advertising across Google, Facebook, Instagram, and streaming TV. Data-driven campaigns that deliver measurable ROI.',
    link: '/AiAdvertising',
    features: ['Google & Meta Ads', 'Streaming TV (CTV)', 'Performance tracking'],
  },
  {
    icon: Shield,
    title: 'Website Accessibility (ADA)',
    desc: 'Protect your business from ADA lawsuits and serve all customers. Full accessibility audits, remediation, and ongoing compliance.',
    link: '/accessible-websites',
    features: ['ADA compliance audits', 'Remediation services', 'Ongoing monitoring'],
  },
];

const INDUSTRIES = [
  { name: 'HVAC Companies', link: '/HvacMarketing', icon: '🔧' },
  { name: 'Plumbing Businesses', link: '/PlumbingMarketing', icon: '🔧' },
  { name: 'Restaurants', link: '/RestaurantMarketing', icon: '🍽️' },
  { name: 'Dentists', link: '/DentistMarketing', icon: '🦷' },
  { name: 'Med Spas', link: '/MedSpaMarketing', icon: '💆' },
  { name: 'Roofing Companies', link: '/RoofingMarketing', icon: '🏠' },
  { name: 'Contractors', link: '/contractor-marketing-north-iowa', icon: '🏗️' },
  { name: 'Local Businesses', link: '/LocalBusinessMarketing', icon: '📍' },
];

const SERVICE_AREAS = [
  { name: 'Mason City, IA', smLink: '/social-media/mason-city-ia', webLink: '/website-rebuilds/mason-city-ia' },
  { name: 'Rochester, MN', smLink: '/social-media/rochester-mn', webLink: '/website-rebuilds/rochester-mn' },
  { name: 'Austin, MN', smLink: '/social-media/austin-mn', webLink: '/website-rebuilds/austin-mn' },
  { name: 'Albert Lea, MN', smLink: '/social-media/albert-lea-mn', webLink: '/website-rebuilds/albert-lea-mn' },
];

export default function Services() {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <SEOHead
        title="AI Marketing Services for Small Business | New Tech Advertising"
        description="AI-driven marketing services: AI search optimization (AISO), social media management, Google Business Profile, website rebuilds, video production, and ADA compliance. North Iowa & Southern Minnesota."
      />
      <MarketingNav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-4">
            AI-Powered Marketing
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Marketing Services That{' '}
            <span className="text-cyan-400">Actually Work</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Everything your small business needs to get found online, build trust, and grow consistently. 
            AI-powered. Locally focused. Results you can measure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/Free-Audit" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors text-lg">
              Get a Free Visibility Audit
            </Link>
            <Link to="/book-call" className="px-8 py-4 border border-slate-600 hover:border-cyan-400 text-white rounded-lg transition-colors text-lg">
              Schedule a Discovery Call
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Six core services, one integrated system. Each service strengthens the others —
            your website feeds your SEO, your SEO drives your social, and your social builds your reputation.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <Link 
                key={svc.title} 
                to={svc.link}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-400/40 transition-all group"
              >
                <svc.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{svc.desc}</p>
                <ul className="space-y-1.5">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Star className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-1 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Industries We Serve</h2>
          <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            We specialize in marketing for local service businesses. Our AI understands seasonal patterns, 
            local search behavior, and content needs unique to each industry.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.name}
                to={ind.link}
                className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 text-center hover:border-cyan-400/40 transition-all group"
              >
                <span className="text-2xl block mb-2">{ind.icon}</span>
                <span className="text-sm font-medium group-hover:text-cyan-400 transition-colors">{ind.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            <MapPin className="inline w-8 h-8 text-cyan-400 mr-2" />
            Service Areas
          </h2>
          <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            Based in Mason City, Iowa. Serving businesses across North Iowa and Southern Minnesota.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_AREAS.map((area) => (
              <div key={area.name} className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-3">{area.name}</h3>
                <div className="space-y-2">
                  <Link to={area.smLink} className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Social Media
                  </Link>
                  <Link to={area.webLink} className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                    <Globe className="w-3.5 h-3.5" /> Website Rebuilds
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Audit CTA Section */}
      <section className="border-t border-slate-800">
        <AuditFormSection
          heading="Not Sure Where to Start? Get a Free Audit"
          subheading="We'll analyze your online presence and show you exactly which services would have the biggest impact for your business."
        />
      </section>

      <SiteFooter />
    </div>
  );
}
