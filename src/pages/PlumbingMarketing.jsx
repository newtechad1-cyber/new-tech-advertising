import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle, ArrowRight, Star, Zap, BarChart2, Share2, Video, Search, Droplets, ShieldAlert, Image as ImageIcon, MapPin, Wrench } from 'lucide-react';
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
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

const FAQS = [
  {
    question: "How much does plumbing marketing cost?",
    answer: "Most local plumbing companies spend $500-$2,000/month on marketing. We focus on organic visibility and reputation rather than expensive pay-per-click advertising. The ROI on local SEO compounds over time, building a permanent asset for your business, unlike paid ads that stop producing the moment you stop paying."
  },
  {
    question: "How do I compete with HomeAdvisor and Angi?",
    answer: "Those platforms sell shared leads to multiple competitors, creating a race to the bottom on price. Owning your own Google rankings means customers call you directly without interference. Investing in your own digital presence builds an asset you control, rather than renting access to leads from a third party."
  },
  {
    question: "Can you help me get more Google reviews?",
    answer: "Yes. We implement an automated review request system that gently prompts customers for feedback right after a completed job. Google reviews are the #1 factor in local map rankings. For local SEO, consistency matters more than volume — getting steady reviews week after week sends the strongest signal to Google."
  },
  {
    question: "I'm a plumber, not a marketer — how much of my time does this take?",
    answer: "NTA handles everything. The entire system is designed specifically for business owners who have zero interest in learning marketing. Our only ask is that you occasionally share photos of your jobs from your phone — we take care of the formatting, captions, posting, SEO, and strategy."
  },
  {
    question: "What if I already have a website? Do you rebuild it?",
    answer: "It depends entirely on your current site's technical foundation. Sometimes optimization is enough. However, if the site is outdated, slow, poorly designed for mobile, or built on a platform with SEO limitations, a fresh rebuild produces significantly better long-term results and higher conversion rates."
  }
];

export default function PlumbingMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300">
      <SEOHead 
        title="Plumbing Marketing | AI Marketing for Plumbers"
        description="AI-driven marketing for plumbing companies. Google Business Profile, local SEO, social media & lead generation. Get more service calls. New Tech Advertising."
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
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
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
                  <p className="text-3xl font-extrabold text-white mb-1" style={{ color: DATA.color }}>{s.value}</p>
                  <p className="text-slate-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Why Plumbing Companies Get Buried Online */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Plumbing Companies Get Buried Online</h2>
            <p className="text-lg leading-relaxed text-slate-400">
              The digital landscape for plumbers is ruthless. If your online presence is weak, you're not just missing out on leads — you're actively sending them to your competitors. Here's why most plumbers struggle online.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Zap className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">24/7 Emergency Demands</h3>
              <p className="text-slate-400 leading-relaxed">Emergency searches happen 24/7. A homeowner searching "burst pipe near me" at 3am goes to whoever ranks first on Google Maps, not whoever is necessarily the most skilled. If you aren't visible instantly, you don't get the call.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Share2 className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Predatory Lead Aggregators</h3>
              <p className="text-slate-400 leading-relaxed">Lead aggregators like HomeAdvisor, Angi, and Thumbtack charge $30–$75 per lead, but they sell the exact same lead to 4 competitors. You end up racing to the bottom on price just to win a job you already paid to bid on.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ImageIcon className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Generic, Invisible Websites</h3>
              <p className="text-slate-400 leading-relaxed">Most plumbing websites look identical — endless stock photos of shiny wrenches and clean blue trucks. They do nothing to build genuine trust with homeowners who are anxious about letting a stranger into their house to fix a mess.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ShieldAlert className="w-10 h-10 text-rose-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Reputation Fragility</h3>
              <p className="text-slate-400 leading-relaxed">Negative reviews from one bad day can tank years of hard-earned reputation. If nobody is actively managing your online presence and generating new, positive reviews, a single 1-star rant stands out like a sore thumb.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: What We Build for Plumbing Companies */}
      <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What We Build for Plumbing Companies</h2>
            <p className="text-lg text-slate-400">Marketing systems engineered to dominate local search and build absolute trust.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-blue-500/50 transition-colors">
              <Search className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Emergency-First Local SEO</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We optimize your Google presence so when someone in your service area searches "plumber near me" or "emergency plumber [city]," you appear in the top 3 map results. This includes real-time GBP management, local citation building, and review velocity strategies.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-blue-500/50 transition-colors">
              <Star className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Automated Review Requests After Every Job</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Your techs finish a job, and the customer gets a friendly text asking for a review. No clipboard handoffs, no awkward asks. We've seen clients double their Google review count in 90 days with this system.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-blue-500/50 transition-colors">
              <Share2 className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Social Media That Shows Real Work</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Nobody wants to see stock photos of a clean bathroom. We build content calendars around your actual jobs — before/after photos of sewer line replacements, boiler installs, bathroom remodels — the kind of content homeowners share.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-blue-500/50 transition-colors">
              <Wrench className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Google Business Profile Domination</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Weekly posts, service updates, photo uploads, and Q&A management. Your GBP becomes a living storefront, not a stale listing with a 2019 photo. This constant activity signals to Google that you are the most relevant result.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-blue-500/50 transition-colors">
              <Video className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Content & Video</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Short-form video tips ("How to prevent frozen pipes") and seasonal blog posts that position your company as the local authority. AI helps us produce this at scale without eating your schedule.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-blue-500/50 transition-colors">
              <BarChart2 className="w-8 h-8 text-blue-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Monthly Reporting in Plain English</h3>
              <p className="text-slate-400 leading-relaxed text-sm">No marketing jargon. You get a one-page summary: how many people found you, how many called, what's working, what we're adjusting. Full transparency into exactly what your investment is doing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: How It Works for a Plumbing Company */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Droplets className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">How It Works for a Plumbing Company: <br/>From Zero Online Presence to First-Page Rankings</h2>
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-3xl p-8 md:p-12 text-left mt-10">
            <p className="text-lg leading-relaxed text-slate-300">
              A North Iowa plumbing and excavating company came to us with a basic website that hadn't been updated in years. They were relying almost entirely on word-of-mouth and legacy phone book listings, missing out on hundreds of local emergency searches every month.
            </p>
            <p className="text-lg leading-relaxed text-slate-300 mt-6">
              Within 6 months, we rebuilt their digital presence from scratch. We deployed a high-conversion website, fully optimized their Google Business Profile, established consistent NAP (Name, Address, Phone) citations across 40+ local directories, and implemented an automated review generation system. We also launched a social media strategy built around their real fieldwork instead of stock images.
            </p>
            <p className="text-lg leading-relaxed text-slate-300 mt-6 font-semibold text-white">
              The Result: They now rank dominantly in the top 3 map results for their primary service areas, capturing high-intent emergency traffic effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Content Examples (Kept from template) */}
      <section className="py-16 px-4 border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              AI-Generated {DATA.industry} Content Examples
            </h2>
            <p className="text-slate-400">Real examples of posts our AI creates for {DATA.industry.toLowerCase()} businesses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {DATA.contentExamples.map((ex, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
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

      {/* Pricing Options (Kept from template logic) */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">Choose Your Growth Plan</h2>
            <p className="text-slate-400">Transparent pricing for local service contractors.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PLAN_FEATURES).map(([name, feats], i) => (
              <div key={name} className={`rounded-2xl p-6 border ${i === 1 ? 'border-blue-500/50 bg-blue-900/10 shadow-lg shadow-blue-900/20' : 'border-slate-800 bg-slate-900'}`}>
                {i === 1 && <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 block">Most Popular</span>}
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                  <p className="text-xl font-bold text-white">{name}</p>
                  <p className="text-2xl font-black text-slate-100">{feats[feats.length - 1]}</p>
                </div>
                <div className="flex flex-col gap-3">
                  {feats.slice(0, -1).map(f => (
                    <span key={f} className="text-sm text-slate-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('Pricing')} className="text-blue-400 hover:text-blue-300 font-semibold underline">
              View full plan comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* NEW: Service Areas */}
      <section className="py-16 px-4 bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Regional Service Areas</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              We work with plumbing contractors across North Iowa and Southern Minnesota. Whether you handle residential service calls or commercial excavation projects, we build marketing systems that keep your schedule full year-round.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Mason City, IA", "Clear Lake, IA", "Charles City, IA", "Garner, IA", 
              "Forest City, IA", "Northwood, IA", "Osage, IA", 
              "Rochester, MN", "Albert Lea, MN", "Austin, MN"
            ].map((city) => (
              <span key={city} className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-full text-sm font-medium">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: FAQs */}
      <section className="py-20 px-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
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
      <section className="py-24 px-4 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Stop losing emergency calls to competitors.
          </h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Build a local marketing engine that keeps your dispatch board full. 7-day free trial. No credit card required. Cancel anytime.
          </p>
          <Link to={createPageUrl('Get-Started')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl transition-all shadow-xl shadow-blue-600/20 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm mt-6">Starter plan from $197/mo after trial</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}