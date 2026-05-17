import React, { useEffect } from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import { Link } from 'react-router-dom';

export default function AiBroughtMeOutOfRetirement() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "AI Brought Me Out of Retirement — Here's Why I'm Launching the Region's First AI-Powered Marketing Agency";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', "After 45 years in business, NTA founder Rick Hesse came out of retirement to launch the region's first AI-powered marketing agency.");
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="AI Brought Me Out of Retirement — Here's Why I'm Launching the Region's First AI-Powered Marketing Agency"
          category="Modern Marketing Systems"
          readingTime="3 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Modern Marketing Systems', path: '/learning-center/category/modern-marketing-systems' },
            { label: 'AI Brought Me Out of Retirement' }
          ]}
        />

        <div className="max-w-3xl mx-auto px-6 mt-12 prose prose-invert prose-lg prose-blue">
          
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 mb-12 not-prose">
            <iframe 
              src="https://www.youtube.com/embed/UPPqjOPkHGc" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              title="AI Brought Me Out of Retirement" 
            />
          </div>

          <h2>45 Years of Walking in Your Shoes</h2>
          <p>
            My entrepreneurial journey started in 1980 with Sleepy Hollow Waterbeds, a retail store right here in Mason City. After managing retail furniture operations, I spent a decade (1989–1999) selling television advertising at KAAL TV (ABC 6) in Rochester, Minnesota. I...
          </p>

          <h2>Two Ways to Work Together</h2>
          <p>
            I know business owners have different comfort levels with technology. That's why we offer two models:
          </p>
          <ul>
            <li><strong>Hands-on training</strong> — for owners who want to learn and manage their own marketing</li>
            <li><strong>Done-for-you</strong> — for those who'd rather focus on running their business while we handle the marketing</li>
          </ul>
          <p>
            Either way, the goal is the same: a marketing system that actually works, at a price that makes sense for a small business.
          </p>

          <h2>Serving the Region</h2>
          <p>
            We work with locally owned businesses across Mason City, Iowa; Rochester, Minnesota; Austin, Minnesota; and Albert Lea, Minnesota. Retail shops, restaurants, service companies — any local business that needs to be found by more customers.
          </p>

          <h2>Get Started</h2>
          <p>
            If you're a local business owner wondering what AI can actually do for your marketing, I'd love to show you. Request a free Gap Audit and I'll evaluate your current online presence and show you exactly where the opportunities are.
          </p>

          <div className="mt-10 mb-12 text-center not-prose">
            <Link to="/gap-audit" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
              Request Your Free Gap Audit
            </Link>
          </div>

          <div className="mt-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl not-prose">
            <h3 className="text-xl font-bold text-white mb-2 mt-0">About the Author</h3>
            <p className="text-slate-400 text-base mb-0">
              Rick A. Hesse is the founder of New Tech Advertising, the first AI-powered marketing agency in the North Iowa and Southern Minnesota region. With 45+ years of entrepreneurial experience, Rick helps local businesses grow with AI-powered marketing systems. <br/><br/>Contact: 641-420-8816 | info@newtechadvertising.com
            </p>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800 not-prose">
            <LCRelatedVideos currentVideoId="ai-brought-me-out-of-retirement" limit={3} category="Modern Marketing Systems" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}