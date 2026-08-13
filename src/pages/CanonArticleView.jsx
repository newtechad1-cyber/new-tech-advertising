import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Loader2,
  User,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

/**
 * CanonArticleView
 *
 * Public, data-driven reader for canonical PublishingArticle records.
 * Article bodies remain in PublishingArticle; this page intentionally contains
 * no article copy so the Knowledge Library has one source of truth.
 */
export default function CanonArticleView() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      setLoading(true);
      try {
        const matches = await base44.entities.PublishingArticle.filter(
          { slug, status: 'Published' },
          null,
          1
        );

        if (!cancelled) {
          setArticle(matches[0] || null);
        }
      } catch (error) {
        console.error('Unable to load canonical article:', error);
        if (!cancelled) {
          setArticle(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          window.scrollTo(0, 0);
        }
      }
    }

    loadArticle();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <MarketingNav />
        <main className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" aria-label="Loading article" />
        </main>
      </>
    );
  }

  if (!article) {
    return <Navigate to="/canon" replace />;
  }

  const isLesson = article.asset_type === 'lesson' || article.content_type === 'Learning Lesson';
  const canonicalPath = article.canonical_url || '/canon/' + article.slug;
  const description = article.summary || article.subtitle || 'An NTA Knowledge Library lesson from Rick Hesse.';
  const publishedDate = article.published_date || article.approved_date || article.created_date;
  const modifiedDate = article.updated_date || publishedDate;
  const collectionSlug = (article.collection_slugs || [])[0];
  const collectionTitle = collectionSlug === 'nta-principles'
    ? 'The NTA Principles'
    : 'Knowledge Library Collection';

  const action = article.cta_text && article.cta_url
    ? { text: article.cta_text, url: article.cta_url }
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={article.title + ' | NTA Knowledge Library'}
        description={description}
        canonical={canonicalPath}
        articleData={{
          title: article.title,
          description,
          author: article.author || 'Rick Hesse',
          datePublished: publishedDate,
          dateModified: modifiedDate,
          image: article.featured_image_url,
          slug: canonicalPath,
        }}
        learningData={isLesson ? {
          name: article.title,
          description,
          educationalLevel: article.difficulty || 'Beginner',
          learningResourceType: 'lesson',
        } : null}
      />
      <MarketingNav />

      <main className="flex-grow">
        <header className="pt-24 pb-12 px-6 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/canon"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to the NTA Knowledge Library
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-blue-300">
                {isLesson ? <GraduationCap className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                {isLesson ? 'Knowledge Library Lesson' : (article.series || 'NTA Point of View')}
              </span>
              {article.estimated_read_time && (
                <span className="inline-flex items-center gap-1.5 text-slate-500 normal-case tracking-normal">
                  <Clock className="w-3.5 h-3.5" />
                  {article.estimated_read_time} min read
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-xl text-slate-400 leading-relaxed mb-6">
                {article.subtitle}
              </p>
            )}

            <div className="flex items-center gap-3 border-t border-slate-800 pt-6">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{article.author || 'Rick Hesse'}</p>
                <p className="text-xs text-slate-500">New Tech Advertising</p>
              </div>
            </div>
          </div>
        </header>

        <article className="py-14 px-6">
          <div className="max-w-3xl mx-auto">
            {article.summary && (
              <p className="text-xl text-slate-300 leading-relaxed mb-10 font-medium">
                {article.summary}
              </p>
            )}

            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-black prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-300 prose-a:text-blue-400 hover:prose-a:text-blue-300">
              <ReactMarkdown>{article.body || ''}</ReactMarkdown>
            </div>
          </div>
        </article>

        {(action || collectionSlug) && (
          <section className="border-t border-slate-800 bg-slate-900/30 py-12 px-6">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
              {collectionSlug && (
                <Link
                  to={'/canon/collection/' + collectionSlug}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-4 font-bold text-white hover:border-blue-500 hover:text-blue-300 transition-colors"
                >
                  Explore {collectionTitle}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {action && (action.url.startsWith('/') ? (
                <Link
                  to={action.url}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-500 transition-colors"
                >
                  {action.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <a
                  href={action.url}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-500 transition-colors"
                >
                  {action.text}
                  <ArrowRight className="w-4 h-4" />
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
