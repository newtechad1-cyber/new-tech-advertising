import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { createPageUrl } from '../utils';
import { Calendar, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';

const SERVICE_LABELS = {
  'streaming-tv': 'Streaming TV',
  'local-seo': 'Local SEO',
  'ada-rebuild': 'ADA Compliance',
  'ai-social-media': 'AI Social Media',
  'video-marketing': 'Video Marketing',
  'website-rebuild': 'Website Rebuild',
  'hvac-marketing': 'HVAC Marketing',
  'plumbing-marketing': 'Plumbing',
  'small-business-marketing': 'Small Business',
};

export default function Blog() {
  const [filterService, setFilterService] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list('-published_date', 100),
  });

  const featured = posts.filter(p => p.featured);
  const services = [...new Set(posts.map(p => p.service).filter(Boolean))];
  const industries = [...new Set(posts.map(p => p.industry).filter(Boolean))];

  const filtered = posts.filter(p => {
    if (filterService && p.service !== filterService) return false;
    if (filterIndustry && p.industry !== filterIndustry) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEOHead 
        title="Marketing Blog | New Tech Advertising"
        description="AI marketing tips, local SEO strategies & social media guides for small businesses. Expert insights from New Tech Advertising in Mason City, Iowa."
      />
      <MarketingNav />

      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Marketing Intelligence Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Marketing Tips & Insights</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Practical guides for local businesses on streaming TV, social media, SEO, and AI marketing.
          </p>
        </div>
      </section>

      {/* Featured */}
      {!filterService && !filterIndustry && featured.length > 0 && (
        <section className="py-10 px-4 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Featured</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.slice(0, 2).map(post => (
                <Link key={post.id} to={`${createPageUrl('BlogPost')}?id=${post.id}`}
                  className="group bg-slate-900 border border-slate-700 hover:border-violet-500/50 rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
                  {post.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {post.service && <span className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">{SERVICE_LABELS[post.service] || post.service}</span>}
                      {post.industry && <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">{post.industry}</span>}
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                    <span className="text-violet-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-5 px-4 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <span className="text-slate-400 text-sm">Filter:</span>
          {services.length > 0 && (
            <select value={filterService} onChange={e => setFilterService(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option value="">All Services</option>
              {services.map(s => <option key={s} value={s}>{SERVICE_LABELS[s] || s}</option>)}
            </select>
          )}
          {industries.length > 0 && (
            <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              <option value="">All Industries</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          )}
          {(filterService || filterIndustry) && (
            <button onClick={() => { setFilterService(''); setFilterIndustry(''); }}
              className="text-slate-400 hover:text-white text-sm underline">Clear</button>
          )}
          <span className="ml-auto text-slate-500 text-sm">{filtered.length} articles</span>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No articles found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <Link key={post.id} to={`${createPageUrl('BlogPost')}?id=${post.id}`}
                  className="group bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg">
                  {post.image_url ? (
                    <div className="h-40 overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-violet-900/40 to-slate-800 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-violet-500/40" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.service && <span className="text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">{SERVICE_LABELS[post.service] || post.service}</span>}
                      {post.industry && <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">{post.industry}</span>}
                      {post.city && <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">{post.city}</span>}
                    </div>
                    <h2 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.published_date}</span>
                      <span className="text-violet-400 font-medium group-hover:underline">Read →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-slate-900 border-t border-slate-800 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to Grow Your Business?</h2>
          <p className="text-slate-400 mb-6">Book a free strategy call and let us build your marketing system.</p>
          <Link to={createPageUrl('Book-Call')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-violet-600/20">
            Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}