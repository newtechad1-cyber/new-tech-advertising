import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle, ArrowRight, Star, Zap, BarChart2, Share2, Video, Search, CloudLightning, ShieldAlert, BadgeCheck, MapPin, Wrench } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DATA = {
  industry: 'Roofing',
  headline: 'Win More Roofing Contracts With AI Marketing That Works While You\'re on the Roof',
  subheadline: 'Storm season is your biggest opportunity. Our AI platform builds your online presence, generates reviews, and keeps you top-of-mind so homeowners call you first after the next big storm.',
  color: '#8b5cf6',
  stats: [
    { value: '10x', label: 'ROI on marketing spend' },
    { value: '72%', label: 'Of homeowners check reviews first' },
    { value: '50+', label: 'Leads per month on average' },
    { value: '5★', label: 'Avg Google rating after 90 days' },
  ],
  contentExamples: [
    {
      companyName: 'Storm Shield Roofing',
      platform: 'Facebook',
      caption: '⛈️ Storm hit your area last night? We\'re offering FREE damage assessments this week — no obligation. A small fix now prevents a massive repair bill later. DM us or call to schedule. Crews available 7 days a week.',
      hashtags: '#StormDamage #RoofRepair #FreeInspection #StormShield',
      likes: 92,
      comments: 34,
    },
    {
      companyName: 'Peak Roofing Solutions',
      platform: 'Instagram',
      caption: '✅ Project Complete! 28 squares of GAF Timberline HDZ® installed in just 2 days for the Martinez family in Plano. Before & after below. 50-year warranty included. Get your free estimate — link in bio!',
      hashtags: '#RoofInstallation #NewRoof #GAFRoofing #PeakRoofing',
      likes: 156,
      comments: 29,
    },
    {
      companyName: 'Apex Roofing Co.',
      platform: 'Google Business',
      caption: 'Gutter cleaning season is here! Clogged gutters are the #1 cause of roof damage over winter. We\'re booking gutter cleanouts now — bundle with a roof inspection and save 20%.',
      hashtags: '',
      likes: 38,
      comments: 9,
    },
  ],
  testimonial: {
    quote: 'After a bad storm last April, our phones were ringing off the hook because of the posts this system published automatically. We booked $180k in jobs in two weeks.',
    author: 'Derek S.',
    company: 'Storm Shield Roofing, Dallas TX',
  },
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

const FAQS = [
  {
    question: "How much does roofing marketing cost?",
    answer: "Most local roofing companies spend $1,000-$3,000/month on marketing. Considering the average roofing job is $8,000-$15,000, just one closed lead per month from organic search pays for the entire year of marketing. At NTA, we focus on building lasting organic visibility rather than expensive PPC campaigns that stop producing the exact day you stop paying. This creates a compounding return on your investment over time."
  },
  {
    question: "How do I compete with storm chasers who flood the market?",
    answer: "Storm chasers rely almost entirely on short-term Google Ads and aggressive door knocking because they have no local reputation or reviews. A local roofing company with strong local SEO, 100+ Google reviews, and a professional, trustworthy website consistently wins over homeowners who are specifically trying to avoid fly-by-night operations. We build that moat of local authority so you become the obvious safe choice."
  },
  {
    question: "Can you help me rank for 'roofing company near me' in multiple cities?",
    answer: "Yes, but multi-city local SEO requires a structured approach including a combination of Google Business Profile optimization, city-specific landing pages, local citation building, and consistent NAP (Name, Address, Phone) data across all directories. NTA builds this exact infrastructure so you rank dominantly in your primary city and successfully expand your visibility into surrounding target markets."
  },
  {
    question: "I get most of my work from referrals — do I really need marketing?",
    answer: "Referrals are absolutely the best leads you can get, but even referred customers will Google your company before they actually call. A strong online presence with great reviews validates that referral and ensures they follow through. Furthermore, consistent marketing fills the gaps between referral cycles and expands your reach far beyond your existing network, smoothing out seasonal revenue dips."
  },
  {
    question: "What makes AI marketing different for roofers?",
    answer: "AI helps us produce significantly more content at a higher quality and lower cost — this includes seasonal blog posts, social media updates, video scripts, and even review response drafts. It allows a small local roofing company to have the same consistent content output and professional polish as a much larger operation. The AI doesn't run wild on autopilot; it works under NTA's strict strategic direction to ensure brand accuracy."
  }
];

export default function RoofingMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300">
      <SEOHead 
        title="Roofing Marketing | AI Marketing for Roofers"
        description="AI-powered marketing for roofing companies. Google Business Profile, local SEO, social media & lead generation. More roofing leads. New Tech Advertising."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Roofing Marketing",
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
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                {DATA.headline}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {DATA.subheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={createPageUrl('Get-Started')}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20">
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

      {/* NEW: Why Roofing Companies Fight an Uphill Battle Online */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Roofing Companies Fight an Uphill Battle Online</h2>
            <p className="text-lg leading-relaxed text-slate-400">
              The roofing industry is intensely competitive, and the digital landscape is stacked against local contractors who rely on word-of-mouth alone. Here is why you're losing deals to inferior competitors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <CloudLightning className="w-10 h-10 text-violet-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Storm Chaser Invasions</h3>
              <p className="text-slate-400 leading-relaxed">Storm chasers flood your market after every hail event. Out-of-state crews run aggressive Google Ads for 2 weeks, grab the easiest jobs, and then vanish — making homeowners skeptical of all roofers and increasing the trust barrier for everyone else.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Share2 className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Predatory Lead Aggregators</h3>
              <p className="text-slate-400 leading-relaxed">Lead generation sites like Angi, HomeAdvisor, and Modernize sell the exact same lead to 4-5 different roofers in your area. They charge you $50-$150 per lead whether you close the deal or not, creating a race to the bottom on price.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ShieldAlert className="w-10 h-10 text-rose-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">The Trust Deficit</h3>
              <p className="text-slate-400 leading-relaxed">Insurance restoration work depends entirely on trust. Homeowners will Google your company before signing a $15,000 contract. If they find a bare-bones website with no recent reviews, they immediately go to the next contractor on the list.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <BarChart2 className="w-10 h-10 text-cyan-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Feast-or-Famine Cycles</h3>
              <p className="text-slate-400 leading-relaxed">Seasonal demand creates brutal feast-or-famine cycles. You're completely slammed after storms, but dead in the winter. Most roofers have absolutely no proactive marketing strategy for filling the slow months with maintenance or retail jobs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: The Trust Problem in Roofing */}
      <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <BadgeCheck className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Homeowners Don't Trust Roofers. Your Online Presence Has to Fix That.</h2>
          <p className="text-lg leading-relaxed text-slate-300 text-left md:text-center">
            Roofing has a reputation problem. Storm chasers, high-pressure sales tactics, and companies that disappear after cashing the insurance check have made homeowners deeply skeptical. When someone needs a $12,000 roof replacement, they don't pick the first company that knocks on their door — they Google. 
          </p>
          <p className="text-lg leading-relaxed text-slate-300 text-left md:text-center mt-4">
            They read reviews. They look at your website. They check if you have real photos of real work. If your online presence doesn't immediately communicate <em>"this is a legitimate, established local company,"</em> you lose the job before you ever give a bid. We build the kind of digital presence that closes that trust gap before your salesperson shows up.
          </p>
        </div>
      </section>

      {/* NEW: What We Build for Roofing Companies */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What We Build for Roofing Companies</h2>
            <p className="text-lg text-slate-400">Comprehensive, trust-building digital systems that do the heavy lifting for your sales team.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-violet-500/50 transition-colors">
              <Search className="w-8 h-8 text-violet-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Storm-Response Local SEO</h3>
              <p className="text-slate-400 leading-relaxed text-sm">When a hail storm hits your area, homeowners start searching within hours. We maintain your local SEO year-round so when the storm comes, you're already ranking #1 for "roof repair [city]" and "hail damage roof inspection near me" — not scrambling to spin up ads while storm chasers grab all the leads.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-violet-500/50 transition-colors">
              <Video className="w-8 h-8 text-violet-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Before & After Project Galleries That Close Sales</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We build photo galleries on your website and Google Business Profile showing real completed jobs — tear-offs, full replacements, storm damage repairs, commercial flat roofs. Homeowners comparing 3 bids always pick the roofer who looks the most professional online.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-violet-500/50 transition-colors">
              <Star className="w-8 h-8 text-violet-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Automated Review Generation at Scale</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Your crew finishes a job, and the homeowner gets a text requesting a review. Roofing is a high-trust, high-ticket purchase. A company with 150 Google reviews at 4.8 stars closes more estimates than a company with 12 reviews, period.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-violet-500/50 transition-colors">
              <Wrench className="w-8 h-8 text-violet-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Google Business Profile as Your #1 Sales Tool</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Weekly posts showing current projects, crew photos, certifications, manufacturer partnerships (GAF, Owens Corning, CertainTeed). Your GBP should work harder than your business card, acting as an interactive portfolio for anyone searching your name.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-violet-500/50 transition-colors">
              <Share2 className="w-8 h-8 text-violet-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Seasonal Content Strategy</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Winter: ice dam prevention guides. Spring: free inspection offers. Summer: "signs your roof didn't survive the storm." Fall: gutter and maintenance campaigns. We keep your company visible year-round so you're not starting from zero when the phone needs to ring.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-violet-500/50 transition-colors">
              <BarChart2 className="w-8 h-8 text-violet-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Monthly Performance Reports — No Jargon</h3>
              <p className="text-slate-400 leading-relaxed text-sm">How many people found you on Google, how many clicked to your website, how many called. Clear, simple, one page. If something isn't working, we tell you and fix it. You shouldn't need a marketing degree to know if your investment is paying off.</p>
            </div>
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
                {ex.hashtags && <p className="text-violet-400 text-xs">{ex.hashtags}</p>}
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
              <div key={name} className={`rounded-2xl p-6 border ${i === 1 ? 'border-violet-500/50 bg-violet-900/10 shadow-lg shadow-violet-900/20' : 'border-slate-800 bg-slate-900'}`}>
                {i === 1 && <span className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 block">Most Popular</span>}
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
            <Link to={createPageUrl('Pricing')} className="text-violet-400 hover:text-violet-300 font-semibold underline">
              View full plan comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* NEW: Service Areas */}
      <section className="py-16 px-4 bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <MapPin className="w-12 h-12 text-violet-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Regional Service Areas</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              We work with roofing contractors across North Iowa and Southern Minnesota. Whether you specialize in residential shingles, commercial flat roofs, or insurance restoration work, we build marketing systems that generate leads year-round — not just after storms.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Mason City, IA", "Clear Lake, IA", "Charles City, IA", "Garner, IA", 
              "Forest City, IA", "Northwood, IA", "Osage, IA", "Waverly, IA",
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

      {/* Testimonial (from template) */}
      <section className="py-20 px-4 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
          </div>
          <blockquote className="text-2xl text-white font-bold leading-relaxed mb-6 italic">
            "{DATA.testimonial.quote}"
          </blockquote>
          <p className="text-slate-400 text-lg">— {DATA.testimonial.author}, {DATA.testimonial.company}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-violet-900/10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Start growing your roofing business today
          </h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Stop relying solely on storms. Build a predictable, year-round lead engine. 7-day free trial. No credit card required. Cancel anytime.
          </p>
          <Link to={createPageUrl('Get-Started')}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-5 rounded-xl transition-all shadow-xl shadow-violet-600/20 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm mt-6">Starter plan from $197/mo after trial</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}