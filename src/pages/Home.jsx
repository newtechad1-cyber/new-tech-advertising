import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '../components/shared/SEOHead';
import HeroSection from '../components/home-conversion/HeroSection';
import PhilosophySection from '../components/home-conversion/PhilosophySection';
import ProblemSection from '../components/home-conversion/ProblemSection';
import SolutionSection from '../components/home-conversion/SolutionSection';
import PathSection from '../components/home-conversion/PathSection';
import FounderSection from '../components/home-conversion/FounderSection';
import CombinedReviewsSection from '../components/home-v3/CombinedReviewsSection';
import FAQSection from '../components/home-conversion/FAQSection';

export default function Home() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead 
        title="AI Marketing Agency Mason City Iowa | New Tech Advertising"
        description="AI-powered marketing agency in Mason City, Iowa. AI search optimization, Google Business Profile management, social media & local SEO for small businesses. Call for a free audit."
      />
      <MarketingNav />
      
      <main>
        <HeroSection />
        <PhilosophySection />
        
        {/* Choose Your Journey Section */}
        <section className="py-20 px-6 bg-slate-900 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Choose Your Journey</h2>
            <p className="text-slate-400 text-lg mb-12">Select the path that matches your current goal.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/knowledge/business-foundations" className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col items-center text-center hover:border-emerald-500/50 hover:bg-slate-800 transition-colors group">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">I'm New Here</h3>
                <p className="text-slate-400 mb-6 flex-grow text-sm">Start with Business Foundations to understand modern growth.</p>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:text-emerald-300 text-sm">
                  Business Foundations <span>→</span>
                </span>
              </Link>

              <Link to="/knowledge/ai-foundations" className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col items-center text-center hover:border-blue-500/50 hover:bg-slate-800 transition-colors group">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">I Want to Learn AI</h3>
                <p className="text-slate-400 mb-6 flex-grow text-sm">Explore AI Foundations to see how AI impacts local search.</p>
                <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:text-blue-300 text-sm">
                  AI Foundations <span>→</span>
                </span>
              </Link>

              <Link to="/growth-conversation" className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col items-center text-center hover:border-purple-500/50 hover:bg-slate-800 transition-colors group">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">I Want to Grow</h3>
                <p className="text-slate-400 mb-6 flex-grow text-sm">Identify gaps in your digital presence with a free interactive audit.</p>
                <span className="text-purple-400 font-semibold flex items-center gap-1 group-hover:text-purple-300 text-sm">
                  Growth Conversation <span>→</span>
                </span>
              </Link>

              <Link to="/book-call" className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col items-center text-center hover:border-orange-500/50 hover:bg-slate-800 transition-colors group">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">I Want to Work</h3>
                <p className="text-slate-400 mb-6 flex-grow text-sm">Ready to implement? Schedule a discovery meeting with our team.</p>
                <span className="text-orange-400 font-semibold flex items-center gap-1 group-hover:text-orange-300 text-sm">
                  Discovery Meeting <span>→</span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        <ProblemSection />
        <SolutionSection />
        <PathSection />
        <FounderSection />
        <CombinedReviewsSection />
        <FAQSection />
      </main>

      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is AI Search Optimization (AISO)?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AI Search Optimization is the process of making your business visible and recommended by AI search engines like ChatGPT, Google AI Overviews, and Perplexity. Unlike traditional SEO which focuses on Google rankings, AISO focuses on the signals AI uses to recommend businesses — including reviews, structured data, certifications, and consistent business information across the web."
              }
            },
            {
              "@type": "Question",
              "name": "How much does AI marketing cost for a small business?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "New Tech Advertising offers AI marketing packages starting at affordable rates for small businesses. We believe every main street business deserves access to modern marketing technology. Contact us at 641-420-8816 for a free consultation and custom quote based on your needs."
              }
            },
            {
              "@type": "Question",
              "name": "What is an AI Gap Audit?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our free AI Gap Audit analyzes how AI search engines currently see your business. We check your visibility on ChatGPT, Google AI, and Perplexity, review your website structure, schema markup, business listings, and online reviews, then provide a prioritized action plan showing exactly what to fix first for maximum AI visibility."
              }
            },
            {
              "@type": "Question",
              "name": "Does New Tech Advertising serve businesses outside Iowa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! While we're based in Mason City, Iowa and primarily serve businesses across Iowa and southern Minnesota, our AI marketing services can help any local business in the United States get found by AI search engines."
              }
            },
            {
              "@type": "Question",
              "name": "What types of businesses does NTA work with?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We specialize in helping local service businesses including HVAC contractors, plumbers, restaurants, retail stores, and other small businesses. Our founder Rick Hesse has decades of experience in advertising and understands the unique challenges main street businesses face with marketing"
              }
            }
          ]
        })
      }} />
    </div>
  );
}