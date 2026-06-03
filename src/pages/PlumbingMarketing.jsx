import React, { useEffect } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '../components/shared/SEOHead';
import { Link } from 'react-router-dom';
import { 
  Clock, ShieldAlert, MonitorSmartphone, Star, Search, MessageSquare, 
  Video, BarChart2, TrendingUp, Droplet, Users, ArrowRight, Target, MapPin
} from 'lucide-react';

export default function PlumbingMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      question: "How much does plumbing marketing cost?",
      answer: "Most local plumbing companies spend $500-$2,000/month on marketing, but traditional agencies often burn that on inefficient pay-per-click campaigns. New Tech Advertising focuses purely on organic visibility and automated reputation management. The ROI on local SEO and review generation compounds over time, building a lasting asset, unlike paid ads that stop working the moment you stop paying."
    },
    {
      question: "How do I compete with HomeAdvisor and Angi?",
      answer: "Those platforms exist to sell shared leads to multiple competitors, pitting you in a race to the bottom on price. By owning your own Google rankings and building a robust Google Business Profile, customers call you directly without a middleman. Investing in your own digital presence builds a regional asset you control, shielding your profit margins from aggregator fees."
    },
    {
      question: "Can you help me get more Google reviews?",
      answer: "Yes. We deploy an automated review request system that integrates with your daily operations. Whenever your technicians complete a service call, the customer automatically receives a friendly text or email asking for feedback. Because Google reviews are the #1 factor in local map rankings, maintaining a consistent stream of 5-star reviews is critical. Consistency and review velocity matter far more than just sheer volume."
    },
    {
      question: "I'm a plumber, not a marketer — how much of my time does this take?",
      answer: "We handle absolutely everything so you can focus on running your business. The only thing we ask is that your team occasionally snaps photos of their completed jobs or equipment installations. Our entire system—from AI-driven content generation to automated review requests—is engineered specifically for trade business owners who have zero interest in learning digital marketing."
    },
    {
      question: "What if I already have a website? Do you rebuild it?",
      answer: "It depends entirely on the foundation of your current site. Sometimes, rigorous local SEO optimization, speed enhancements, and mobile formatting are enough. However, if your website is severely outdated, difficult to navigate, or built on a platform with structural SEO limitations, a fresh rebuild will produce vastly superior long-term results. We assess this during our initial gap audit."
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans">
      <SEOHead 
        title="Plumbing Marketing | AI Marketing for Plumbers"
        description="AI-driven marketing for plumbing companies. Rank #1 for emergency plumbing, automate Google reviews, and eliminate shared lead fees. Built for North Iowa & Southern MN."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Plumbing Marketing",
          "provider": {
            "@type": "Organization",
            "name": "New Tech Advertising",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "111 W State St",
              "addressLocality": "Mason City",
              "addressRegion": "IA",
              "postalCode": "50401",
              "addressCountry": "US"
            },
            "telephone": "641-420-8816"
          },
          "areaServed": [
            { "@type": "City", "name": "Mason City, IA" },
            { "@type": "City", "name": "Clear Lake, IA" },
            { "@type": "City", "name": "Charles City, IA" },
            { "@type": "City", "name": "Garner, IA" },
            { "@type": "City", "name": "Forest City, IA" },
            { "@type": "City", "name": "Northwood, IA" },
            { "@type": "City", "name": "Osage, IA" },
            { "@type": "City", "name": "Rochester, MN" },
            { "@type": "City", "name": "Albert Lea, MN" },
            { "@type": "City", "name": "Austin, MN" }
          ]
        })
      }} />

      <MarketingNav />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-slate-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Plumbing Marketing Systems</p>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-6">
            Get Found First When Pipes Burst at 2am
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Emergency calls drive plumbing revenue. Our AI platform keeps your business top-of-mind online 24/7 — so when something breaks, they call you first instead of Angi or HomeAdvisor.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/gap-audit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-lg w-full sm:w-auto">
              Get Your Free Gap Audit
            </Link>
            <Link to="/book-call" className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg w-full sm:w-auto">
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 1 - Why Plumbing Companies Get Buried Online */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Why Plumbing Companies Get Buried Online</h2>
            <p className="text-lg leading-relaxed text-slate-400">
              You do great work, but if your digital presence is broken, you're losing high-margin jobs to competitors with better marketing. Here's what's holding you back:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Emergency Searches Happen 24/7</h3>
              <p className="text-slate-400 leading-relaxed">
                Emergency searches happen 24/7 — "burst pipe near me" at 3am goes to whoever ranks first, not whoever's best.
              </p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lead Aggregators Eat Your Margins</h3>
              <p className="text-slate-400 leading-relaxed">
                Lead aggregators (HomeAdvisor, Angi, Thumbtack) charge $30–$75 per lead, and sell the exact same lead to 4 of your local competitors, creating a race to the bottom on price.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <MonitorSmartphone className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Identical, Trust-Killing Websites</h3>
              <p className="text-slate-400 leading-relaxed">
                Most plumbing websites look exactly identical — full of stock photos of wrenches, generic blue trucks, and fake smiles that do nothing to build authentic trust with a frantic homeowner.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unmanaged Online Reputations</h3>
              <p className="text-slate-400 leading-relaxed">
                Negative reviews from one bad day can tank years of hard-earned reputation if nobody is actively managing your online presence and consistently generating new 5-star reviews to bury the bad ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - What We Build for Plumbing Companies */}
      <section className="py-24 px-6 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">What We Build for Plumbing Companies</h2>
            <p className="text-lg leading-relaxed text-slate-400">
              We replace random acts of marketing with a structured, automated growth system designed specifically for the plumbing trade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <Search className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Emergency-First Local SEO</h3>
              <p className="text-slate-400 leading-relaxed">
                We optimize your Google presence so when someone in your service area searches "plumber near me" or "emergency plumber [city]," you appear in the top 3 map results. This includes real-time GBP management, local citation building, and review velocity strategies.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <MessageSquare className="w-8 h-8 text-emerald-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Automated Review Requests After Every Job</h3>
              <p className="text-slate-400 leading-relaxed">
                Your techs finish a job, and the customer gets a friendly text asking for a review. No clipboard handoffs, no awkward asks. We've seen clients double their Google review count in 90 days with this system.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <Droplet className="w-8 h-8 text-cyan-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Social Media That Shows Real Work</h3>
              <p className="text-slate-400 leading-relaxed">
                Nobody wants to see stock photos of a clean bathroom. We build content calendars around your actual jobs — before/after photos of sewer line replacements, boiler installs, bathroom remodels — the kind of content homeowners share.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <Target className="w-8 h-8 text-amber-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Google Business Profile Domination</h3>
              <p className="text-slate-400 leading-relaxed">
                Weekly posts, service updates, photo uploads, and Q&A management. Your GBP becomes a living storefront, not a stale listing with a 2019 photo. This is critical for converting map pack viewers into direct callers.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <Video className="w-8 h-8 text-purple-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Content & Video</h3>
              <p className="text-slate-400 leading-relaxed">
                Short-form video tips ("How to prevent frozen pipes") and seasonal blog posts that position your company as the local authority. AI helps us produce this at scale without eating your schedule.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <BarChart2 className="w-8 h-8 text-indigo-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Monthly Reporting in Plain English</h3>
              <p className="text-slate-400 leading-relaxed">
                No marketing jargon. You get a one-page summary: how many people found you, how many called, what's working, what we're adjusting. Real metrics tied directly to your pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - Mini Case Study */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <TrendingUp className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Case Study: Johnson Heating & AC</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">From Zero Online Presence to First-Page Rankings</h2>
              
              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-3xl">
                A North Iowa plumbing and excavating company came to us with a basic website that hadn't been updated in years. Within 6 months, we rebuilt their digital presence from scratch — optimized Google Business Profile, consistent NAP citations across 40+ directories, automated review generation, and a social media strategy built around their real fieldwork. They now rank in the top 3 map results for their primary service areas.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6 mb-10 border-t border-slate-700/50 pt-8">
                <div>
                  <div className="text-3xl font-black text-white mb-1">14 Years</div>
                  <div className="text-sm text-blue-300 font-medium">Partnership Growth</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">100%</div>
                  <div className="text-sm text-blue-300 font-medium">Print Advertising Eliminated</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white mb-1">Top 3</div>
                  <div className="text-sm text-blue-300 font-medium">Google Map Positioning</div>
                </div>
              </div>
              
              <Link to="/case-studies/johnson-heating" className="inline-flex items-center gap-2 text-white font-semibold hover:text-blue-300 transition-colors">
                Read the full Johnson Heating & AC Case Study <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - Service Areas */}
      <section className="py-24 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">Our North Iowa & Southern MN Service Areas</h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            We work with plumbing contractors across North Iowa and Southern Minnesota. Whether you handle residential service calls or commercial excavation projects, we build marketing systems that keep your schedule full year-round.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {['Mason City, IA', 'Clear Lake, IA', 'Charles City, IA', 'Garner, IA', 'Forest City, IA', 'Northwood, IA', 'Osage, IA', 'Rochester, MN', 'Albert Lea, MN', 'Austin, MN'].map((city) => (
              <span key={city} className="bg-slate-800 border border-slate-700 text-slate-300 px-6 py-3 rounded-full font-medium shadow-sm">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - FAQs */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-400">Everything you need to know about scaling your plumbing business online.</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-blue-900 border-t border-blue-800 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-6">Stop Sharing Leads. Own Your Market.</h2>
          <p className="text-xl text-blue-200 mb-10">Let's build a custom digital engine that drives direct emergency calls to your dispatch team.</p>
          <Link to="/book-call" className="inline-flex items-center justify-center bg-white text-blue-900 hover:bg-slate-100 font-bold px-10 py-5 rounded-xl transition-all shadow-xl text-lg mb-8">
            Schedule Your Strategy Call
          </Link>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-300 font-medium">
            <a href="tel:6414208816" className="hover:text-white transition-colors">641-420-8816</a>
            <span className="hidden sm:block text-blue-500">•</span>
            <a href="mailto:info@newtechadvertising.com" className="hover:text-white transition-colors">info@newtechadvertising.com</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}