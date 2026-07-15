import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, BrainCircuit } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function AIHumanityCollection() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="AI, Humanity & Responsibility | NTA Knowledge Library"
        description="Artificial intelligence is more than a new business tool. It reflects the knowledge, contradictions, hopes, fears, wisdom, and brokenness of the people who created it."
        collectionData={{
          name: "AI, Humanity & Responsibility",
          description: "Artificial intelligence is more than a new business tool. It reflects the knowledge, contradictions, hopes, fears, wisdom, and brokenness of the people who created it. This collection explores how we can understand AI without worshiping it, fearing it blindly, or surrendering our responsibility to think.",
          numberOfItems: 1,
          hasPart: [
            {
              name: "AI Is a Mirror, Not a God",
              url: "/knowledge/ai-humanity/ai-is-a-mirror-not-a-god"
            }
          ]
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        <section className="relative pt-24 pb-16 px-6 border-b border-slate-800">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
              <Link to="/knowledge" className="hover:text-white transition-colors flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Back to Knowledge Library
              </Link>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Deeper Exploration
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              AI, Humanity & Responsibility
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
              Artificial intelligence is more than a new business tool. It reflects the knowledge, contradictions, hopes, fears, wisdom, and brokenness of the people who created it. This collection explores how we can understand AI without worshiping it, fearing it blindly, or surrendering our responsibility to think.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/knowledge/ai-humanity/ai-is-a-mirror-not-a-god"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
              >
                <BrainCircuit className="w-5 h-5" />
                Begin Exploring
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-slate-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">Featured Perspective</h2>
            
            <div className="space-y-4">
              <Link 
                to="/knowledge/ai-humanity/ai-is-a-mirror-not-a-god"
                className="group block p-6 sm:p-8 rounded-2xl border transition-all bg-slate-900 border-indigo-500/30 hover:border-indigo-500/60 shadow-lg shadow-indigo-900/5"
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FileText className="w-8 h-8 text-indigo-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                      AI Is a Mirror, Not a God
                    </h3>
                    <p className="text-indigo-300 font-medium mb-4">
                      Why artificial intelligence contains both the best and the worst of humanity
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      AI did not appear from somewhere outside humanity. We created it from our accumulated knowledge, which means it reflects both our wisdom and our brokenness. The appropriate response is neither blind trust nor automatic fear, but understanding, discernment, and responsibility.
                    </p>
                  </div>
                  
                  <div className="md:w-auto flex-shrink-0 mt-4 md:mt-0 self-start md:self-center">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      Read the Article &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="mt-12 text-center border-t border-slate-800 pt-10">
              <p className="text-slate-500 italic">More perspectives will be added as this conversation continues.</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}