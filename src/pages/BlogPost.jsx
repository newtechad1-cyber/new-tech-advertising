import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import NTAGrowthGuideBot from '../components/nta-guide/NTAGrowthGuideBot';
import { Calendar, User, ArrowLeft, Loader2, Tag, Clock, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../utils';

function estimateReadTime(content) {
  if (!content) return 1;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPost() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const slug = urlParams.get('slug');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPost', id, slug],
    queryFn: () => base44.entities.BlogPost.list(),
    enabled: !!(id || slug)
  });

  const post = posts ? posts.find(p => (id && p.id === id) || (slug && p.slug === slug)) : null;
  const readTime = post ? estimateReadTime(post.content) : 0;

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <MarketingNav />
        <div className="flex-1 flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <MarketingNav />
        <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Post not found</h2>
          <Link to={createPageUrl('Blog')} className="text-blue-600 hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Blog
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <MarketingNav />

      {/* ── Hero ── */}
      <div className="relative w-full" style={{ minHeight: '480px' }}>
        {post.image_url ? (
          <>
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full object-cover absolute inset-0 h-full"
              style={{ objectPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 flex flex-col justify-end" style={{ minHeight: '480px' }}>
          {/* Back link */}
          <Link
            to={createPageUrl('Blog')}
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Category badge */}
          {post.category && (
            <span className="inline-block bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 self-start">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <main className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-14">

          {/* Excerpt / lead + top internal link */}
          {post.excerpt && (
            <p className="text-xl text-slate-600 leading-relaxed mb-6 border-l-4 border-blue-500 pl-6 font-medium italic" style={{ fontFamily: 'Georgia, serif' }}>
              {post.excerpt}
            </p>
          )}

          {/* Strategic top link — first 150 words */}
          <p className="text-slate-600 leading-relaxed mb-10">
            If your business website isn't generating consistent leads, it may be time to explore our{' '}
            <Link to="/services/website-rebuilds" className="text-blue-600 font-semibold hover:underline">AI-powered website rebuild services</Link>
            {' '}— built to rank, convert, and grow with your business.
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-lg prose-slate max-w-none
            prose-headings:font-extrabold prose-headings:text-slate-900
            prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-blue-800
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-5
            prose-li:text-slate-700 prose-li:leading-relaxed
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:not-italic
            prose-code:bg-slate-100 prose-code:text-blue-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:shadow-lg
          " style={{ fontFamily: "'Georgia', serif", lineHeight: '1.85' }}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Mid-content strategic callout */}
          <div className="my-10 bg-blue-50 border border-blue-200 rounded-2xl px-7 py-6">
            <p className="text-slate-700 leading-relaxed m-0">
              <span className="font-semibold text-slate-900">Serving North Iowa &amp; Southern Minnesota?</span>{' '}
              Local businesses across the region are seeing real results with a focused rebuild strategy. Learn how our{' '}
              <Link to="/website-rebuilds/mason-city-ia" className="text-blue-600 font-semibold hover:underline">website rebuild services in Mason City</Link>{' '}
              are helping local companies turn their websites into lead machines.
            </p>
          </div>

          {/* Divider */}
          <hr className="my-14 border-slate-200" />

          {/* Author card */}
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-14">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {post.author ? post.author[0] : 'N'}
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-0.5">Written by</p>
              <p className="font-bold text-slate-900 text-lg">{post.author || 'NTA Team'}</p>
              <p className="text-slate-500 text-sm">New Tech Advertising — Local Business Growth Experts</p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-center shadow-xl shadow-blue-200">
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Free — No Obligation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Ready to Grow Your Business?
            </h3>
            <p className="text-blue-100 mb-8 max-w-md mx-auto leading-relaxed">
              Get a free website audit and discover exactly what's holding your business back online.
            </p>
            <Link
              to={`/rebuild-intake?source=article-${post.slug || 'blog'}`}
              className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-8 py-4 rounded-xl text-base transition shadow-lg"
            >
              Get your free website rebuild preview <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-blue-200 text-xs mt-4">No credit card required. Response within 24–48 hours.</p>
          </div>

          {/* Back link bottom */}
          <div className="mt-12 text-center">
            <Link
              to={createPageUrl('Blog')}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
      <NTAGrowthGuideBot />
    </div>
  );
}