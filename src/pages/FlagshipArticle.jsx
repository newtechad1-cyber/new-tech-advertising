import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ChevronRight, Clock, User, BookOpen, ArrowLeft } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { flagshipArticleToolsVsSystem } from '@/data/flagshipArticles';

const articlesMap = {
  [flagshipArticleToolsVsSystem.slug]: flagshipArticleToolsVsSystem
};

export default function FlagshipArticle() {
  const { slug } = useParams();
  const article = articlesMap[slug];

  useEffect(() => {
    if (article) {
      window.scrollTo(0, 0);
    }
  }, [slug, article]);

  if (!article) {
    return <Navigate to="/knowledge" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={article.title + " | NTA Perspectives"}
        description={article.primaryAudience}
        articleData={{
          title: article.title,
          description: article.primaryAudience,
          author: article.author || "Rick Hesse",
          datePublished: "2026-07-15",
          dateModified: "2026-07-15",
          slug: `/knowledge/articles/${article.slug}`
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        <header className="pt-24 pb-12 px-6 border-b border-slate-800 bg-slate-900/30">
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
              <Link to="/knowledge" className="hover:text-white transition-colors flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Knowledge Library
              </Link>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="text-white font-medium">Perspectives</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Featured Article
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
              {article.title}
            </h1>

            <div className="flex items-center gap-3 border-t border-slate-800 pt-6">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{article.author}</p>
                <p className="text-xs text-slate-500">Your Digital Growth Guide™</p>
              </div>
            </div>
          </div>
        </header>

        <article className="py-12 px-6">
          <div className="max-w-3xl mx-auto prose prose-invert prose-indigo max-w-none prose-headings:font-black prose-p:leading-relaxed prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>

        <section className="py-16 px-6 bg-slate-900 border-t border-slate-800">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Want to apply this principle?</h3>
            <p className="text-slate-400 mb-8">
              Begin a Growth Conversation and we will build a system designed for the way your business actually grows.
            </p>
            <Link to="/book-call" className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
              Start a Growth Conversation
            </Link>
          </div>
        </section>

        <nav className="border-t border-slate-800 bg-slate-950 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/knowledge" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Knowledge Library
            </Link>
          </div>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}