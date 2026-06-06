import React from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

export default function CaseStudyJohnsonHeating() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead 
        title="Johnson Heating & AC Case Study | NTA"
        description="How a Mason City HVAC company stayed ahead of the competition with AI-powered marketing"
      />
      <MarketingNav />
      <div className="flex-grow pt-24 pb-12">
        <main className="max-w-4xl mx-auto px-6">
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link to="/learning-center" className="hover:text-white transition-colors">Learning Center</Link>
            <span>›</span>
            <span className="text-slate-300">Johnson Heating & AC</span>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-purple-400 font-bold uppercase tracking-wider">Show Me Real Results</span>
              <span className="text-slate-400 font-medium">Step 1 of 5</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Johnson Heating & AC — 14 Years of Growth
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              How a Mason City HVAC company stayed ahead of the competition with AI-powered marketing
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-2xl font-bold text-white mb-1">14 Years</div>
              <div className="text-slate-400 text-sm">Client since 2012</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-2xl font-bold text-white mb-1">Local Leader</div>
              <div className="text-slate-400 text-sm">#1 HVAC visibility in Mason City</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="text-2xl font-bold text-white mb-1">Full System</div>
              <div className="text-slate-400 text-sm">Marketing + Back-Office AI</div>
            </div>
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-a:text-purple-400 hover:prose-a:text-purple-300">
            <p>
              Tony Johnson has been running Johnson Heating & AC in Mason City for over a decade. When the marketing landscape shifted to AI-driven search, NTA helped Johnson Heating maintain their dominant local position. From optimizing their AI visibility to building a custom back-office system that replaces expensive software like QuickBooks, Johnson Heating is the model for how a small local business can compete with corporate chains.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4">What We Built</h2>
            <ul className="space-y-2 text-slate-300">
              <li><strong className="text-white">AI-optimized website:</strong> johnsonheatingandac.com</li>
              <li><strong className="text-white">Custom back-office app:</strong> (dispatch, invoicing, inventory, expenses)</li>
              <li><strong className="text-white">Local SEO:</strong> and AI search visibility</li>
              <li><strong className="text-white">Consistent presence:</strong> social media and video content</li>
            </ul>
          </article>

          <div className="mt-12 bg-gradient-to-r from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Want results like this?</h3>
            <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
              Get your free AI audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col">
            <Link to="/case-study/monson-plumbing" className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:text-purple-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
              Next: Monson Plumbing Case Study <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </main>
        
        <LCRelatedArticles 
          articles={[
            {
              tag: "Visibility",
              title: "AI Visibility Basics",
              description: "How ChatGPT and Gemini choose which local businesses to recommend.",
              link: "/ai-visibility-basics",
              date: "Guide"
            },
            {
              tag: "Video",
              title: "AI Video Marketing",
              description: "Scale your presence with AI-powered video.",
              link: "/ai-video-marketing",
              date: "Guide"
            },
            {
              tag: "Lead Gen",
              title: "Local Lead Systems",
              description: "Connect your marketing efforts into a single, predictable lead generation engine.",
              link: "/local-lead-systems",
              date: "Guide"
            }
          ]}
        />
      </div>
      <SiteFooter />
    </div>
  );
}