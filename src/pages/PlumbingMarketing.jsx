import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { 
  CheckCircle, ArrowRight, Star, BarChart2, Share2, Video, Search,
  AlertTriangle, DollarSign, ImageOff, MessageSquareWarning, MapPin, Settings
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DATA = {
  industry: 'Plumbing',
  headline: 'Get Found First When Pipes Burst at 2am',
  subheadline: 'Emergency calls drive plumbing revenue. Our AI platform keeps your business top-of-mind online 24/7 — so when something breaks, they call you first.',
  color: '#3b82f6',
  stats: [
    { value: '5x', label: 'More online visibility' },
    { value: '40+', label: 'Posts auto-published per month' },
    { value: '2hr', label: 'Avg setup time' },
    { value: '4.9★', label: 'Avg client review rating' },
  ],
  contentExamples: [
    {
      companyName: 'Fast Flow Plumbing',
      platform: 'Facebook',
      caption: '🚰 Slow drains are the #1 sign of a bigger problem. Don\'t wait until it\'s a full backup — our team can clear clogs same-day. Save this post and call us before the weekend rush!',
      hashtags: '#PlumbingTips #LocalPlumber #FastFlowPlumbing',
      likes: 56,
      comments: 18,
    },
    {
      companyName: 'Rivera Plumbing Co.',
      platform: 'Instagram',
      caption: '💧 Water heater giving you lukewarm results? We install same-day in most cases. Tankless options available — save up to 30% on water heating costs! Tap the link in bio for a free quote.',
      hashtags: '#WaterHeater #Plumber #HomeImprovement #RiveraPlumbing',
      likes: 102,
      comments: 31,
    },
    {
      companyName: 'Clearwater Services',
      platform: 'Google Business',
      caption: 'Winter pipe prep season is here! We\'re offering free pipe insulation assessments through the end of the month. Prevent a costly burst pipe — book your inspection online.',
      hashtags: '',
      likes: 28,
      comments: 6,
    },
  ],
  testimonial: {
    quote: 'I was spending $800/month on a social media manager doing the same thing this platform does automatically. Switching saved me $600/month.',
    author: 'Carlos R.',
    company: 'Rivera Plumbing Co., Austin TX',
  },
  faqs: [
    {
      question: "How much does plumbing marketing cost?",
      answer: "Most local plumbing companies spend $500-$2,000/month on marketing. NTA focuses on organic visibility and reputation rather than expensive pay-per-click ads. The ROI on local SEO compounds over time, unlike paid ads that stop the moment you stop paying."
    },
    {
      question: "How do I compete with HomeAdvisor and Angi?",
      answer: "Those platforms sell shared leads to multiple competitors, creating a race to the bottom on price. Owning your own Google rankings means customers call you directly. Investing in your own digital presence builds an asset you control rather than renting visibility from third-party aggregators."
    },
    {
      question: "Can you help me get more Google reviews?",
      answer: "Yes, our automated review request system ensures you capture feedback while the experience is fresh by texting customers after service calls. Google reviews are the #1 factor in local map rankings, and consistency of new reviews matters much more than just sheer volume."
    },
    {
      question: "I'm a plumber, not a marketer — how much of my time does this take?",
      answer: "NTA handles everything. The only ask is occasionally sharing job photos from the field. The entire system is designed for plumbing business owners who have zero interest in learning marketing and want to focus on their trade."
    },
    {
      question: "What if I already have a website? Do you rebuild it?",
      answer: "It depends on your current site's foundation. Sometimes optimization is enough to get you ranking. However, if the site is outdated, slow, or built on a platform with severe SEO limitations, a fresh rebuild will produce much better long-term results."
    }
  ]
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

export default function PlumbingMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead 
        title="Plumbing Marketing | AI Marketing for Plumbers"
        description="AI-driven marketing for plumbing companies. Google Business Profile, local SEO, social media & lead generation. Get more service calls. New Tech Advertising."
        faqs={DATA.faqs}
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
              "streetAddress": "123 Main St",
              "addressLocality": "Mason City",
              "addressRegion": "IA",
              "postalCode": "50401",
              "addressCountry": "US"
            },
            "telephone": "641-420-8816"
          },
          "areaServed": [
            { "@type": "City", "name": "Mason City", "addressRegion": "IA" },
            { "@type": "City", "name": "Clear Lake", "addressRegion": "IA" },
            { "@type": "City", "name": "Charles City", "addressRegion": "IA" },
            { "@type": "City", "name": "Garner", "addressRegion": "IA" },
            { "@type": "City", "name": "Forest City", "addressRegion": "IA" },
            { "@type": "City", "name": "Northwood", "addressRegion": "IA" },
            { "@type": "City", "name": "Osage", "addressRegion": "IA" },
            { "@type": "City", "name": "Rochester", "addressRegion": "MN" },
            { "@type": "City", "name": "Albert Lea", "addressRegion": "MN" },
            { "@type": "City", "name": "Austin", "addressRegion": "MN" }
          ]
        })
      }} />

      <MarketingNav />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ background: DATA.color }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest mb-4 block" style={{ color: DATA.color }}>
                {DATA.industry} Marketing
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                {DATA.headline}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {DATA.subheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={createPageUrl('Get-Started')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to={createPageUrl('Book-Call')}
                  className="border border-slate-700 hover:border-slate-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                  Book Demo
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {DATA.stats.map((s, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                  <p className="text-3xl md:text-4xl font-extrabold text-white mb-1" style={{ color: DATA.color }}>{s.value}</p>
                  <p className="text-slate-400 text-sm font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY PLUMBING COMPANIES GET BURIED ONLINE */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">Why Plumbing Companies Get Buried Online</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              You provide great service, but if you aren't showing up correctly when customers search, your competition wins the job. Here is what is likely holding your business back right now:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Emergency searches happen 24/7</h3>
              <p className="text-slate-400 leading-relaxed">A homeowner searching "burst pipe near me" at 3am goes to whoever ranks first in the map pack, not whoever is necessarily the best plumber in town.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Predatory Lead Aggregators</h3>
              <p className="text-slate-400 leading-relaxed">Platforms like HomeAdvisor, Angi, and Thumbtack charge $30–$75 per lead and simultaneously sell the exact same lead to 4 of your local competitors.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6">
                <ImageOff className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cookie-Cutter Websites</h3>
              <p className="text-slate-400 leading-relaxed">Most plumbing websites look identical — packed with cheesy stock photos of pristine wrenches and blue trucks that fail to build any real trust with homeowners.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <MessageSquareWarning className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unmanaged Online Reputations</h3>
              <p className="text-slate-400 leading-relaxed">Negative reviews from one bad day can tank years of hard-earned reputation if nobody is actively managing your online presence and balancing it with positive reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD FOR PLUMBING COMPANIES */}
      <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">What We Build for Plumbing Companies</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              We don't just sell leads. We build a sustainable digital engine that positions you as the premier choice in your market, ensuring steady growth month over month.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Search className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Emergency-First Local SEO</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We optimize your Google presence so when someone in your service area searches "plumber near me" or "emergency plumber [city]," you appear in the top 3 map results. This includes real-time GBP management, local citation building, and review velocity strategies.</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Star className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Automated Review Requests</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Your techs finish a job, and the customer gets a friendly text asking for a review. No clipboard handoffs, no awkward asks. We've seen clients double their Google review count in 90 days with this system.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Share2 className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Authentic Social Media</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Nobody wants to see stock photos of a clean bathroom. We build content calendars around your actual jobs — before/after photos of sewer line replacements, boiler installs, and bathroom remodels.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <MapPin className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Google Business Domination</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Weekly posts, service updates, photo uploads, and Q&A management. Your GBP becomes a living storefront, not a stale listing with a 2019 photo of your old office.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Video className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">AI-Powered Content & Video</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Short-form video tips like "How to prevent frozen pipes" and seasonal blog posts position your company as the local authority. AI helps us produce this at scale without eating into your busy schedule.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <BarChart2 className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Plain English Reporting</h3>
              <p className="text-slate-400 text-sm leading-relaxed">No confusing marketing jargon. You get a one-page summary: how many people found you, how many called for service, what is currently working, and what we are adjusting for next month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MINI CASE STUDY */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-800/50 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Settings className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10">
            <span className="text-blue-300 font-bold uppercase tracking-wider text-sm mb-4 block">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">From Zero Online Presence to First-Page Rankings</h2>
            <p className="text-lg text-blue-100/90 leading-relaxed mb-8">
              A North Iowa plumbing and excavating company came to us with a basic website that hadn't been updated in years. Within 6 months, we rebuilt their digital presence from scratch — optimized Google Business Profile, consistent NAP citations across 40+ directories, automated review generation, and a social media strategy built around their real fieldwork. They now rank in the top 3 map results for their primary service areas.
            </p>
            <div className="flex gap-4">
              <Link to="/case-studies" className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                View More Case Studies <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 px-6 border-y border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-6">Service Areas</h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">
                We work with plumbing contractors across North Iowa and Southern Minnesota. Whether you handle residential service calls or commercial excavation projects, we build marketing systems that keep your schedule full year-round.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed font-semibold text-blue-400">
                If you can drive to your customers, we can get those customers to find you online first.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <ul className="grid grid-cols-2 gap-y-4 gap-x-6 text-slate-300">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Mason City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Clear Lake, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Charles City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Garner, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Forest City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Northwood, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Osage, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Rochester, MN</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Albert Lea, MN</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Austin, MN</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Content Examples (Kept from original) */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              AI-Generated {DATA.industry} Content Examples
            </h2>
            <p className="text-slate-400">Real examples of posts our AI creates for {DATA.industry.toLowerCase()} businesses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {DATA.contentExamples.map((ex, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: DATA.color }}>{DATA.industry[0]}</div>
                  <div>
                    <p className="text-white text-sm font-semibold">{ex.companyName}</p>
                    <p className="text-slate-500 text-xs">{ex.platform}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{ex.caption}</p>
                {ex.hashtags && <p className="text-blue-400 text-xs">{ex.hashtags}</p>}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500">❤️ {ex.likes} likes</span>
                  <span className="text-xs text-slate-500">💬 {ex.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages / Features Comparison */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Choose the right plan for your plumbing business
              </h2>
              <p className="text-slate-400 mb-8">
                Our AI platform handles your marketing automatically — so you can focus on running your business. No hidden fees.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Share2 className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Seasonal Social Content</p>
                    <p className="text-slate-500 text-xs mt-0.5">AI generates plumbing tips and emergency reminders.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Search className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Emergency SEO Keywords</p>
                    <p className="text-slate-500 text-xs mt-0.5">Rank for high-intent searches like "emergency plumber near me".</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Star className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Review Generation</p>
                    <p className="text-slate-500 text-xs mt-0.5">Automatically follow up with customers post-job to capture 5-star reviews.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(PLAN_FEATURES).map(([name, feats], i) => (
                <div key={name} className={`rounded-2xl p-5 border ${i === 1 ? 'border-blue-500/40 bg-blue-900/10' : 'border-slate-800 bg-slate-900'}`}>
                  {i === 1 && <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Most Popular</span>}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-bold">{name}</p>
                    <p className="text-slate-300 font-bold">{feats[feats.length - 1]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {feats.slice(0, -1).map(f => (
                      <span key={f} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Link to={createPageUrl('Pricing')}
                className="block text-center text-blue-400 hover:text-blue-300 text-sm underline">
                View full plan comparison →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {DATA.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-slate-800">
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-slate-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed text-base pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
          </div>
          <blockquote className="text-xl text-white font-medium leading-relaxed mb-4">
            "{DATA.testimonial.quote}"
          </blockquote>
          <p className="text-slate-400 text-sm">— {DATA.testimonial.author}, {DATA.testimonial.company}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-slate-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Start growing your {DATA.industry.toLowerCase()} business today
          </h2>
          <p className="text-slate-400 mb-8">Stop paying aggregators for shared leads. Build your own pipeline.</p>
          <Link to={createPageUrl('Book-Call')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-lg">
            Book a Demo <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Questions? Call us at 641-420-8816</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}