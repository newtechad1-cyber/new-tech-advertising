import React from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DigitalRisks() {
  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300">
      <SEOHead 
        title="The Digital Risks Nobody Warns Small Businesses About | NTA"
        description="Learn about the hidden visibility, reputation, and technology gaps that can cost your small business customers and revenue."
      />
      <MarketingNav />

      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <Link to="/learning-center" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Learning Center
        </Link>

        <article className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
          <header className="mb-12 border-b border-slate-800 pb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <AlertTriangle className="w-4 h-4" />
              Digital Risks & Business Readiness
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
              The Digital Risks Nobody Warns Small Businesses About
            </h1>
            
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden relative">
              <img 
                src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/a8d32f161_generated_image.png" 
                alt="Digital Risks, Business Compliance, and Legal Scale" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-li:text-slate-300 prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300">
            <p className="text-xl font-medium text-white mb-6">Every day, business owners are bombarded with advice.</p>
            
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-400 mb-8 list-none pl-0">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Build your website.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Improve your SEO.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Post on social media.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Learn AI.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Run better ads.</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Generate more leads.</li>
            </ul>

            <p>All of those things matter. But there's a growing problem in today's digital economy that few people are talking about.</p>
            
            <p className="text-orange-200 bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-r-xl my-8 text-lg font-medium leading-relaxed">
              Many businesses are focusing on getting found online while completely overlooking the hidden risks that could damage their visibility, reputation, and growth.
            </p>

            <p className="space-y-2">
              <span className="block">A beautiful website doesn't guarantee success.</span>
              <span className="block">A strong social media presence doesn't guarantee protection.</span>
              <span className="block">Even great products and services can struggle if important pieces of your digital foundation are missing.</span>
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">Today's businesses face challenges that barely existed a few years ago:</h2>
            
            <ul className="space-y-4 mb-10 bg-slate-800/30 p-8 rounded-2xl border border-slate-800 list-disc pl-10 marker:text-blue-500">
              <li><strong>AI is changing</strong> how customers discover businesses.</li>
              <li><strong>Search engines</strong> are evolving rapidly.</li>
              <li><strong>Online reviews</strong> influence buying decisions more than ever.</li>
              <li><strong>Website accessibility</strong> expectations continue to increase.</li>
              <li><strong>Customer privacy</strong> concerns are growing.</li>
              <li><strong>Business information</strong> must remain accurate across dozens of platforms.</li>
              <li><strong>Content theft</strong> and brand impersonation have become easier.</li>
            </ul>

            <p>Most business owners aren't ignoring these issues. They simply don't know where to start.</p>
            
            <div className="my-12 py-8 border-y border-slate-800 text-center">
              <p className="text-2xl font-bold text-white leading-relaxed">
                "The truth is that digital success is no longer just about marketing.<br/>
                It's about visibility, trust, consistency, reputation, and adaptability."
              </p>
            </div>

            <p>At New Tech Advertising, we've discovered that many businesses have hidden gaps that prevent them from reaching their full potential online.</p>
            
            <ul className="space-y-3 mb-8 list-none pl-0 bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" /> <span className="text-slate-300">Sometimes it's inaccurate business information.</span></li>
              <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" /> <span className="text-slate-300">Sometimes it's poor visibility in search results.</span></li>
              <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" /> <span className="text-slate-300">Sometimes it's inconsistent branding across platforms.</span></li>
              <li className="flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" /> <span className="text-slate-300">Sometimes it's simply a lack of understanding about how AI is changing customer behavior.</span></li>
            </ul>

            <p>These gaps often remain invisible until they begin costing customers, opportunities, and revenue.</p>
            <p>That's why we focus on more than marketing. We help businesses identify the visibility, reputation, technology, and communication gaps that may be holding them back.</p>

            <p>Because the businesses that thrive in the next decade won't necessarily be the ones spending the most money on advertising.</p>
            
            <p className="text-xl text-blue-300 font-semibold mb-10">
              They'll be the businesses that understand how to adapt, stay visible, build trust, and protect what they've worked so hard to create.
            </p>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 md:p-10 mt-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                The digital world is changing quickly.
              </h3>
              <p className="text-lg text-slate-300 mb-8">
                The question isn't whether change is coming. The question is whether your business is prepared for it.
              </p>
              
              <div className="inline-block bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 w-full max-w-md mx-auto">
                <h4 className="text-xl font-bold text-white mb-2">That's where a Visibility Audit can help.</h4>
                <p className="text-slate-400 text-sm">Sometimes the biggest opportunities are hidden in the gaps you don't yet see.</p>
              </div>

              <div>
                <Link to="/free-audit" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] text-lg">
                  Run a Free Visibility Audit
                </Link>
              </div>
            </div>

          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}