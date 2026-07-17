import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Compass, Layers, MessageSquare } from 'lucide-react';
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

      {/* Where Do You Go From Here? */}
      <section className="py-24 px-6 border-t border-slate-800 bg-slate-950/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Where Do You Go From Here?</h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-4">
              You may have come here because you were trying to understand what New Tech Advertising is building, why the pieces of a business need to work together, or how AI fits into the future of a small business.
            </p>
            <p className="text-lg text-slate-400">
              You do not need to take every next step. Choose the path that fits where you are today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Path 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Keep Learning</h3>
              <p className="text-slate-400 mb-8 flex-1">
                Explore the deeper principles behind business growth, customer trust, lasting relationships, business knowledge, AI, and connected systems.
              </p>
              <div className="space-y-4">
                <Link to="/knowledge" className="flex items-center justify-center w-full gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                  Explore the Knowledge Library
                </Link>
                <p className="text-sm text-center text-slate-500 font-medium">49 cornerstone lessons organized into a guided learning experience.</p>
              </div>
            </div>

            {/* Path 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Understand Your Business</h3>
              <p className="text-slate-400 mb-8 flex-1">
                Move from general ideas to your own business. See where the business is strong, where growth may be getting stuck, and what deserves attention first.
              </p>
              <div className="space-y-3">
                <Link to="/business-score" className="flex flex-col items-center justify-center w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700">
                  <span>Take the Business Score</span>
                  <span className="text-xs text-slate-400 mt-1 font-normal">Evaluate six connected areas of the business</span>
                </Link>
                <Link to="/growth-roadmap-generator" className="flex flex-col items-center justify-center w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700">
                  <span>Build Your Growth Roadmap</span>
                  <span className="text-xs text-slate-400 mt-1 font-normal">Turn what you learn into a practical sequence</span>
                </Link>
              </div>
            </div>

            {/* Path 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
              <div className="w-14 h-14 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Work Through It Together</h3>
              <p className="text-slate-400 mb-8 flex-1">
                Sometimes the next step is not another tool or another page. It is a practical conversation about what is happening in the business and how the pieces fit together.
              </p>
              <div className="space-y-3 mt-auto">
                <Link to="/growth-conversation" className="flex items-center justify-center w-full gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700">
                  Start a Growth Conversation
                </Link>
                <Link to="/book-call" className="flex items-center justify-center w-full gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700">
                  Book a Direct Conversation
                </Link>
              </div>
            </div>

            {/* Path 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
              <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">See What Implementation Can Look Like</h3>
              <p className="text-slate-400 mb-8 flex-1">
                See how priorities, customers, marketing, business knowledge, operations, NTA support, and practical AI assistance can work from one shared direction.
              </p>
              <div className="mt-auto">
                <Link to="/digital-growth-office-preview" className="flex items-center justify-center w-full gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700">
                  See the Digital Growth Office in Action
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              The goal is not to push every business owner into the same process. The goal is to help you understand the business clearly enough to choose the right next step.
            </p>
            <Link to="/business-score" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Take the Business Score <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}