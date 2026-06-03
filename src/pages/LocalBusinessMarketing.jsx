import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { 
  CheckCircle, ArrowRight, Star, BarChart2, Share2, Video, Search,
  AlertTriangle, DollarSign, ImageOff, MessageSquareWarning, MapPin, 
  Settings, Activity, Target, PenTool, TrendingUp, Users, Wrench, Smartphone
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DATA = {
  industry: 'Local Business',
  headline: 'Grow Your Local Business Visibility Online',
  subheadline: 'AI-powered marketing systems that help local businesses dominate search, build their reputation, and attract more customers — without the cost of a traditional agency.',
  color: '#3b82f6',
  stats: [
    { value: '3x', label: 'More local visibility' },
    { value: '4.9★', label: 'Average Google rating' },
    { value: '85%', label: 'Consumers search locally first' },
    { value: '0 hrs', label: 'Owner time on marketing' },
  ],
  faqs: [
    {
      question: "How much does local business marketing cost?",
      answer: "Most small businesses work with NTA for $500-$2,000/month depending on the scope of services. The ROI depends on your average transaction value — for instance, a $500/month marketing spend that generates 3 new customers worth $200 each immediately pays for itself. NTA focuses on organic growth (SEO, content, reviews) that compounds in value over time, unlike paid ads that disappear the second you stop paying."
    },
    {
      question: "I already have a website — why isn't it bringing in customers?",
      answer: "Having a website is not the same as having a marketing system. Most small business websites have zero SEO, no Google Business Profile integration, no active review strategy, and no content that actually ranks for local searches. A website is an essential foundation, but it needs to be connected to a complete local visibility strategy to drive real foot traffic or calls."
    },
    {
      question: "Can you really handle everything so I don't have to think about marketing?",
      answer: "Yes. Our entire platform is designed for business owners who have no time or desire to learn marketing. The only ask on your end is occasional input — snapping a quick photo of a job site or answering a quick question about your business. We build the strategy, create the content, schedule the posts, and manage the local SEO."
    },
    {
      question: "How is this different from hiring a freelancer or using Fiverr?",
      answer: "Freelancers and Fiverr gigs are purely task-based ('write 5 blog posts' or 'design a logo') with no overarching strategy connecting them. NTA builds and manages a complete marketing system where your website, Google Business Profile, reviews, and social media all work together. In local marketing, strategy and consistency matter significantly more than isolated tasks."
    },
    {
      question: "What if I've been burned by a marketing company before?",
      answer: "This is unfortunately extremely common. Most generic agencies oversell their capabilities and underdeliver on results, wrapping their failures in confusing jargon. NTA is a local business based in Mason City, Iowa — not a faceless call center. Rick has been doing this for over 14 years, and you can talk directly to existing long-term clients like Johnson Heating & AC to hear about their results."
    }
  ]
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

export default function LocalBusinessMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans">
      <SEOHead 
        title="Local Business Marketing | AI Marketing for Small Business"
        description="AI-powered marketing for local businesses. Google Business Profile, social media, local SEO & AI search optimization. Grow your local customer base. New Tech Advertising."
        faqs={DATA.faqs}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Local Business Marketing",
          "provider": {
            "@type": "Organization",
            "name": "New Tech Advertising",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "15 E State St, Suite 201",
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
            { "@type": "City", "name": "Fort Dodge", "addressRegion": "IA" },
            { "@type": "City", "name": "Charles City", "addressRegion": "IA" },
            { "@type": "City", "name": "Garner", "addressRegion": "IA" },
            { "@type": "City", "name": "Forest City", "addressRegion": "IA" },
            { "@type": "City", "name": "Northwood", "addressRegion": "IA" },
            { "@type": "City", "name": "Algona", "addressRegion": "IA" },
            { "@type": "City", "name": "Waverly", "addressRegion": "IA" },
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

      {/* Why Local Businesses Lose to Bigger Competitors Online */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">Why Local Businesses Lose to Bigger Competitors Online</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              When someone needs what you offer, they search online first. If you aren't visible, you lose the customer before they ever walk in your door. Here is what's holding you back:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Corporate Spending Power</h3>
              <p className="text-slate-400 leading-relaxed">National chains and franchises spend millions on SEO and ads. A local business competing on the exact same keywords with a $500/month budget needs a completely different, highly localized strategy to win.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The "Next Week" Syndrome</h3>
              <p className="text-slate-400 leading-relaxed">Most small business owners wear every single hat — operations, hiring, bookkeeping, customer service. Marketing is the one task that keeps getting pushed to "next week" because there's simply never enough time in the day.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Generic Agency Packages</h3>
              <p className="text-slate-400 leading-relaxed">Generic marketing agencies sell copy-paste packages designed for any business in any city, with zero understanding of how local search, local reputation, and community trust actually drive small business revenue.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <PenTool className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The DIY Illusion</h3>
              <p className="text-slate-400 leading-relaxed">DIY website builders like Wix, Squarespace, or GoDaddy and free social media tools give business owners a false sense of "having marketing handled," while their competitors with professional digital infrastructure take all the actual search traffic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build for Local Businesses */}
      <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">What We Build for Local Businesses</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              We build complete digital marketing systems that run in the background, driving traffic and building trust while you focus on running your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Search className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Local Search Domination</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We build your Google presence so when someone in your area searches for what you sell, your business shows up in the top 3 map results. This includes Google Business Profile optimization, local citation building across 40+ directories, and consistent NAP data.</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Star className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Reputation That Sells for You</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Google reviews are the new word of mouth. We set up automated review requests so every happy customer gets a chance to leave a review — no awkward asks from your staff, just a simple text message after every transaction.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Smartphone className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Custom Websites That Convert</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Not a template. Not a generic page builder. We build custom digital properties designed around your specific business and local market. A website that loads fast, looks professional, ranks in search, and turns visitors into phone calls.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Share2 className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Social Media That Reflects You</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We create content calendars built around your real business — your products, your team, your location, your community involvement. Not stock photos and motivational quotes. Real content that builds trust with local customers.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">AI-Powered Content at Scale</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Blog posts, video scripts, social media content, email newsletters — AI helps us produce at the volume of a large agency at a fraction of the cost. Every piece is reviewed and tailored strictly to your brand voice and local market.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <BarChart2 className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Monthly Reporting You'll Read</h3>
              <p className="text-slate-400 text-sm leading-relaxed">One page. How many people found you, how many called, what's working. No complex dashboards you'll never log into. No marketing jargon. We tell you exactly what happened and what we're doing about it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">From HVAC to Fitness Centers — We Build Marketing Systems for Iowa Businesses</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              We don't specialize in one industry. We specialize in one thing: making local businesses visible online and converting that visibility into revenue. Our clients include:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <Wrench className="w-10 h-10 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">HVAC & Trade Services</h3>
              <p className="text-slate-400 leading-relaxed mb-4">Johnson Heating & AC has been our client for 14 years. We took them from phone book ads to #1 in local search.</p>
              <Link to="/case-studies/johnson-heating" className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1">Read Case Study <ArrowRight className="w-4 h-4" /></Link>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <Activity className="w-10 h-10 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Fitness & Wellness</h3>
              <p className="text-slate-400 leading-relaxed mb-4">Club Fitness in Fort Dodge is Fort Dodge's only 18+ fitness and recovery center. We built their entire digital presence — custom website, Google optimization, and membership systems — from scratch.</p>
              <a href="https://clubfitnessfd.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1">Visit Site <ArrowRight className="w-4 h-4" /></a>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <Target className="w-10 h-10 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Plumbing & Excavation</h3>
              <p className="text-slate-400 leading-relaxed">Monson Plumbing in Mason City trusts us to manage their online reputation and local search visibility in a highly competitive market.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
              <CheckCircle className="w-10 h-10 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Your Industry</h3>
              <p className="text-slate-400 leading-relaxed">Restaurants, dental practices, roofing, med spas, retail, professional services — if you serve local customers, we know exactly how to get them to find you first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE SMALL BUSINESS MARKETING PROBLEM */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/80 to-slate-900 border border-blue-800/50 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Settings className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10">
            <span className="text-blue-300 font-bold uppercase tracking-wider text-sm mb-4 block">The Small Business Marketing Problem</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">You Don't Need a Marketing Department. You Need One System That Works.</h2>
            <p className="text-lg text-blue-100/90 leading-relaxed mb-6">
              Most local businesses don't fail because they have a bad product or service. They fail because nobody can find them. The business owner is great at what they do — whether that's fixing furnaces, training athletes, or pulling teeth — but marketing is a completely different skill set. 
            </p>
            <p className="text-lg text-blue-100/90 leading-relaxed mb-6">
              And the marketing industry has made it worse: jargon-filled reports, long-term contracts, template websites, and promises of 'leads' that never actually convert.
            </p>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              We built New Tech Advertising for business owners who have zero interest in learning digital marketing. You tell us what you do and who your customers are. We build the entire digital infrastructure — website, Google presence, reviews, social media, content — and run it for you. You focus on your business. We make sure people find it.
            </p>
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
                We work with local businesses across Iowa and Southern Minnesota. If your customers are within driving distance, we'll make sure they find you online before they find your competitor.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <ul className="grid grid-cols-2 gap-y-4 gap-x-6 text-slate-300">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Mason City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Clear Lake, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Fort Dodge, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Charles City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Garner, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Forest City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Northwood, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Algona, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Waverly, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Rochester, MN</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Albert Lea, MN</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> Austin, MN</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packages / Features Comparison */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Choose the right plan for your business
              </h2>
              <p className="text-slate-400 mb-8">
                Our AI platform handles your marketing automatically — so you can focus on your customers. No hidden fees.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Star className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Review Generation</p>
                    <p className="text-slate-500 text-xs mt-0.5">Automated customer review requests post-service.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Search className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Local Search Dominance</p>
                    <p className="text-slate-500 text-xs mt-0.5">Rank on maps when locals search for your services.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Share2 className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Social Media Handled</p>
                    <p className="text-slate-500 text-xs mt-0.5">Consistent posting that builds community trust.</p>
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
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-slate-300 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-slate-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Start growing your local business today
          </h2>
          <p className="text-slate-400 mb-8">Take control of your online presence and attract more customers automatically.</p>
          <Link to={createPageUrl('Book-Call')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-lg">
            Book a Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Questions? Call us at 641-420-8816</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}