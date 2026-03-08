import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, MapPin, Briefcase } from 'lucide-react';

const SERVICE_LABELS = {
  'streaming-tv': 'Streaming TV Ads',
  'local-seo': 'Local SEO',
  'ada-rebuild': 'ADA Website Rebuild',
  'ai-social-media': 'AI Social Media',
  'video-marketing': 'Video Marketing',
  'website-rebuild': 'Website Rebuild',
};

const SERVICE_COLORS = {
  'streaming-tv': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'local-seo': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'ada-rebuild': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'ai-social-media': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'video-marketing': 'bg-red-500/20 text-red-300 border-red-500/30',
  'website-rebuild': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};

export default function CaseStudiesPage() {
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const { data: studies = [] } = useQuery({
    queryKey: ['case-studies-public'],
    queryFn: () => base44.entities.CaseStudy.filter({ status: 'published' }, '-created_date', 50),
  });

  const industries = [...new Set(studies.map(s => s.industry).filter(Boolean))];
  const cities = [...new Set(studies.map(s => s.city).filter(Boolean))];

  const filtered = studies.filter(s => {
    if (filterIndustry && s.industry !== filterIndustry) return false;
    if (filterService && s.service_used !== filterService) return false;
    if (filterCity && s.city !== filterCity) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MarketingNav />

      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <TrendingUp className="w-3.5 h-3.5" /> Real Results from Real Businesses
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Client Case Studies
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            See how local businesses across the country are growing with NTA's marketing technology.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <span className="text-slate-400 text-sm font-medium">Filter by:</span>
          <select
            value={filterService}
            onChange={e => setFilterService(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Services</option>
            {Object.entries(SERVICE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={filterIndustry}
            onChange={e => setFilterIndustry(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Industries</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {(filterService || filterIndustry || filterCity) && (
            <button onClick={() => { setFilterService(''); setFilterIndustry(''); setFilterCity(''); }}
              className="text-slate-400 hover:text-white text-sm underline">Clear filters</button>
          )}
          <span className="ml-auto text-slate-500 text-sm">{filtered.length} case {filtered.length === 1 ? 'study' : 'studies'}</span>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No case studies found. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(cs => {
                let metrics = [];
                try { metrics = JSON.parse(cs.metrics || '[]'); } catch {}
                return (
                  <Link
                    key={cs.id}
                    to={`/case-study/${cs.slug}`}
                    className="group bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 flex flex-col transition-all hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
                  >
                    {cs.featured && (
                      <span className="self-start mb-3 text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full">⭐ Featured</span>
                    )}
                    <span className={`self-start text-xs font-semibold border px-2.5 py-1 rounded-full mb-4 ${SERVICE_COLORS[cs.service_used] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {SERVICE_LABELS[cs.service_used] || cs.service_used}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors mb-2">{cs.business_name}</h3>
                    <div className="flex items-center gap-3 text-slate-500 text-sm mb-3">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{cs.industry}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{cs.city}, {cs.state}</span>
                    </div>
                    {metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 my-3">
                        {metrics.slice(0, 4).map((m, i) => (
                          <div key={i} className="bg-slate-800 rounded-lg p-2 text-center">
                            <div className="text-white font-bold text-sm">{m.value}</div>
                            <div className="text-slate-500 text-xs">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-slate-400 text-sm line-clamp-2 mt-auto mb-4">{cs.results}</p>
                    <span className="text-violet-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Case Study <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Be the Next Success Story?</h2>
          <p className="text-slate-400 mb-8">Join local businesses across the country growing with NTA's marketing system.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Book-Call')} className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/20">
              Book a Strategy Call
            </Link>
            <Link to={createPageUrl('Start')} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}