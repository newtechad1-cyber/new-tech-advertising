import React from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, BookOpen, Brain, PlayCircle, Library, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { pointOfViewArticles } from '@/data/povArticles';

// This acts as a mock representation of the Knowledge Library lessons
// for the "Continue Learning" section. In a real environment, this would
// be imported from a central lesson catalog.
const relatedLessonsCatalog = {
  "business-foundations": { title: "Business Foundations", path: "/knowledge/business-foundations" },
  "digital-trust": { title: "Building Digital Trust", path: "/knowledge/digital-trust" },
  "truth-about-growth": { title: "The Truth About Business Growth", path: "/knowledge/truth-about-business-growth" },
  "ai-foundations": { title: "AI Foundations for Small Business", path: "/knowledge/ai-foundations" },
};

export default function POVArticleView() {
  const { slug } = useParams();
  
  const currentIndex = pointOfViewArticles.findIndex(a => a.slug === slug);
  const article = pointOfViewArticles[currentIndex];
  
  if (!article) {
    return <Navigate to="/point-of-view" replace />;
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === pointOfViewArticles.length - 1;
  const nextArticle = !isLast ? pointOfViewArticles[currentIndex + 1] : null;
  const prevArticle = !isFirst ? pointOfViewArticles[currentIndex - 1] : null;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
      <SEOHead 
        title={article.seoTitle || `${article.title} | The NTA Point of View`}
        description={article.metaDescription || article.description}
      />
      <MarketingNav />

      {/* Article Header */}
      <section className="pt-32 pb-12 px-6 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <Link to="/point-of-view" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to The NTA Point of View
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-900/40 text-blue-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-500/30">
              Article {article.order} of 6
            </span>
            <span className="text-slate-500 text-sm font-medium">{article.readingTime}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-slate-400 mb-8">{article.subtitle}</p>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-4 items-start">
            <Brain className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Question Answered</p>
              <p className="text-slate-200 font-medium">{article.questionAnswered}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </section>

      {/* Continue Learning / Related Lessons */}
      {article.relatedLessonIds && article.relatedLessonIds.length > 0 && (
        <section className="py-12 px-6 border-t border-slate-800/50 bg-slate-900/30">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Library className="w-5 h-5 text-blue-400" /> Continue Learning
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {article.relatedLessonIds.map(id => {
                const lesson = relatedLessonsCatalog[id];
                if (!lesson) return null;
                return (
                  <Link key={id} to={lesson.path} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors group">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Knowledge Library Lesson</p>
                    <p className="text-slate-200 font-medium group-hover:text-blue-400 transition-colors">{lesson.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Navigation & Next Steps (if end of journey) */}
      <section className="py-16 px-6 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          {!isLast ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <div className="text-center sm:text-left">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Up Next (Article {nextArticle.order} of 6)</p>
                <h4 className="text-white font-bold text-xl">{nextArticle.title}</h4>
              </div>
              <Link to={`/point-of-view/${nextArticle.slug}`} className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors">
                Read Next <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12 rounded-3xl border border-slate-800 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">You Have Completed the NTA Point of View</h3>
              <p className="text-slate-400 mb-10 max-w-xl mx-auto">You now understand why we built NTA, how we view AI, and why we believe your business needs a connected system.</p>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <Link to="/knowledge" className="bg-slate-900 border border-slate-800 hover:border-blue-500 p-6 rounded-2xl group transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                  <p className="text-white font-bold text-sm mb-1">Keep Learning</p>
                  <p className="text-slate-500 text-xs">Knowledge Library</p>
                </Link>
                <Link to="/business-score" className="bg-slate-900 border border-slate-800 hover:border-indigo-500 p-6 rounded-2xl group transition-colors">
                  <Activity className="w-6 h-6 text-indigo-400 mx-auto mb-3" />
                  <p className="text-white font-bold text-sm mb-1">Understand Your Business</p>
                  <p className="text-slate-500 text-xs">NTA Business Score</p>
                </Link>
                <Link to="/growth-conversation" className="bg-slate-900 border border-slate-800 hover:border-emerald-500 p-6 rounded-2xl group transition-colors">
                  <PlayCircle className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-bold text-sm mb-1">Get Help Building It</p>
                  <p className="text-slate-500 text-xs">Growth Conversation</p>
                </Link>
              </div>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/point-of-view" className="text-slate-500 hover:text-slate-300 transition-colors font-medium">
              View the Complete Collection
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}