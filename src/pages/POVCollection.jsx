import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Globe, MessageSquare } from 'lucide-react';
import SEOHead from '@/components/shared/SEOHead';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { pointOfViewArticles } from '@/data/povArticles';

export default function POVCollection() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30">
      <SEOHead 
        title="The NTA Point of View | New Tech Advertising"
        description="Understand the experience, principles, and business philosophy behind New Tech Advertising through this curated six-article journey."
      />
      <MarketingNav />

      {/* Header */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" /> Reading Journey
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            The NTA Point of View
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            New Tech Advertising grew out of a lifetime of learning how businesses, customers, technology, and relationships actually work together. These six articles explain what I have learned, why I built NTA the way I did, and what it means for small business owners trying to navigate AI and the changing business world.
          </p>
          <p className="text-lg text-blue-400 font-medium">
            Start here to understand the experience, principles, and business philosophy behind New Tech Advertising.
          </p>
        </div>
      </section>

      {/* Articles List */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {pointOfViewArticles.map((article, idx) => (
            <div key={article.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start hover:border-slate-700 transition-colors">
              <div className="w-16 h-16 shrink-0 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center text-xl font-bold text-blue-400 shadow-xl">
                {article.order}
              </div>
              
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <span className="font-bold text-slate-300">Estimated reading time:</span> {article.readingTime}
                  </p>
                </div>
                
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <Brain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">The Question It Answers</p>
                    <p className="text-slate-200 text-sm italic">"{article.questionAnswered}"</p>
                  </div>
                </div>

                <p className="text-slate-300 mb-6 line-clamp-2">
                  {article.description}
                </p>

                <Link 
                  to={`/point-of-view/${article.slug}`} 
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors border border-slate-700 hover:border-blue-500"
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}