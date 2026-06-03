import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle, ArrowRight, Star, Zap, BarChart2, Share2, Video, Search, ThermometerSnowflake, ShieldAlert, BadgeCheck, MapPin, Wrench } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DATA = {
  industry: 'HVAC',
  headline: 'AI Marketing That Fills Your HVAC Calendar Year-Round',
  subheadline: 'Stop relying on slow seasons. Our AI platform automates your social media, SEO, and review management — so leads find you when their system breaks down.',
  color: '#f97316',
  stats: [
    { value: '3x', label: 'More Google reviews on average' },
    { value: '80%', label: 'Time saved on marketing' },
    { value: '24/7', label: 'Automated posting & monitoring' },
    { value: '$0', label: 'Extra staff needed' },
  ],
  contentExamples: [
    {
      companyName: 'ProAir HVAC',
      platform: 'Facebook',
      caption: '🌡️ Summer is coming — is your AC ready? Don\'t wait until it\'s 95° outside to find out your unit needs work. We\'re booking maintenance appointments now. Call us today and keep your family cool all summer long!',
      hashtags: '#HVACservice #AirConditioning #SummerReady #ProAirHVAC',
      likes: 47,
      comments: 12,
    },
    {
      companyName: 'Arctic Comfort Systems',
      platform: 'Instagram',
      caption: '❄️ Did you know? Changing your air filter every 90 days can reduce energy bills by up to 15%. Our team makes it easy — we\'ll remind you AND do it for you on our maintenance plan. Link in bio to sign up!',
      hashtags: '#HVACTips #EnergySavings #HVACMaintenance',
      likes: 89,
      comments: 23,
    },
    {
      companyName: 'Elite Heating & Cooling',
      platform: 'Google Business',
      caption: 'New heat pump installation completed in Naperville today! This Carrier 20 SEER unit will save the Johnson family an estimated $800/year on energy bills. Call us for a free efficiency estimate!',
      hashtags: '',
      likes: 34,
      comments: 8,
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
    question: "How much does HVAC marketing cost?",
    answer: "Most local HVAC companies spend between $500 and $2,000 per month on marketing depending on their market size and growth goals. At NTA, our system is designed to provide maximum ROI by focusing on long-term organic assets rather than temporary paid ads. Because a single furnace or AC install can range from $4,000 to $10,000+, generating just one or two consistent organic leads per month pays for the entire year's marketing budget."
  },
  {
    question: "How long until I see results from local SEO?",
    answer: "You will typically see initial improvements in local map pack visibility (Google Business Profile) within 30 to 60 days as we optimize your listing and increase your review velocity. Comprehensive on-site SEO — ranking for competitive terms like 'AC repair near me' across multiple cities — is a structural process that builds significant momentum over 3 to 6 months. Consistency is the primary driver of success."
  },
  {
    question: "Can you help me get more Google reviews?",
    answer: "Yes, this is one of our most powerful features. We implement an automated review generation system that sends a friendly text message to your customer immediately after a service call is completed. By catching them when they are happiest (right after their heat or AC is restored), our clients consistently double or triple their review count."
  },
  {
    question: "Do you work with HVAC companies outside Iowa?",
    answer: "Yes. While we are headquartered in North Iowa and heavily serve the Southern Minnesota and Northern Iowa regions, our marketing systems and AI infrastructure are highly effective for independent HVAC contractors anywhere in the United States. If you are a local service business that needs to dominate local search, our frameworks apply directly to your market."
  },
  {
    question: "What makes AI marketing different from hiring a traditional agency?",
    answer: "Traditional agencies often charge massive retainers for manual labor — writing social posts, basic SEO tasks, and generic blog creation. We leverage AI to execute these high-volume tasks perfectly, consistently, and at a fraction of the cost. The AI handles the heavy lifting of content generation while our human experts direct the overall strategy, meaning your budget goes directly toward measurable growth instead of agency overhead."
  }
];

export default function HvacMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300">
      <SEOHead 
        title="HVAC Marketing | AI Marketing for HVAC Companies"
        description="AI-powered marketing for HVAC contractors. Google Business Profile, AI search optimization, social media & lead generation. Get more furnace and AC calls. New Tech Advertising."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "HVAC Marketing",
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
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-orange-600/20">
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

      {/* NEW: Why HVAC Companies Struggle Online */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why HVAC Companies Struggle Online</h2>
            <p className="text-lg leading-relaxed text-slate-400">
              Running a profitable HVAC business requires constant momentum. Unfortunately, the digital landscape is actively working against contractors who aren't armed with the right systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ThermometerSnowflake className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Seasonal Demand Swings</h3>
              <p className="text-slate-400 leading-relaxed">Your business shouldn't rely solely on weather extremes. Most HVAC companies are completely slammed during mid-summer heatwaves and dead during mild winters. Surviving these swings requires proactive marketing, not just waiting for things to break.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Share2 className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Predatory Lead Aggregators</h3>
              <p className="text-slate-400 leading-relaxed">Lead aggregators like HomeAdvisor, Angi, and Thumbtack exist to bleed your margins. They routinely sell the exact same lead to multiple competitors, forcing you into a race-to-the-bottom bidding war while they pocket the profit.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Zap className="w-10 h-10 text-rose-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Missed 2AM Emergency Calls</h3>
              <p className="text-slate-400 leading-relaxed">Customers search "AC repair near me" at 2:00 AM when their system dies. If you aren't actively monitoring your ads or ranking at the absolute top of the organic map pack, they will call your competitor who is.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Star className="w-10 h-10 text-cyan-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Fragmented Reputation Management</h3>
              <p className="text-slate-400 leading-relaxed">You are running from service call to service call; you don't have time to monitor Google, Yelp, and Facebook for reviews. Meanwhile, a single unanswered negative review can drag down your reputation and cost you high-ticket installs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: What We Do Differently */}
      <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What We Do Differently</h2>
            <p className="text-lg text-slate-400">We build the infrastructure that turns unpredictable seasons into a year-round revenue engine.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-orange-500/50 transition-colors">
              <Search className="w-8 h-8 text-orange-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Local SEO</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We automatically target high-intent "HVAC + [your city]" searches across your entire service area. Our systems ensure your website architecture matches exactly what Google's local algorithm demands for top placement.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-orange-500/50 transition-colors">
              <Star className="w-8 h-8 text-orange-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Automated Review Generation</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We integrate with your dispatch process to text customers immediately after service calls. This intercepts happy customers at the perfect moment, rapidly scaling your 5-star reputation on autopilot.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-orange-500/50 transition-colors">
              <Share2 className="w-8 h-8 text-orange-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Social Media on Autopilot</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We deploy engaging, seasonal HVAC content perfectly timed to the weather — from spring tune-up reminders to fall furnace checks. Your social presence remains active and authoritative without you lifting a finger.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-orange-500/50 transition-colors">
              <Wrench className="w-8 h-8 text-orange-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Google Business Profile Optimization</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We treat your Google Business Profile like your most important storefront. We manage it with weekly posts, photo updates, and Q&A responses to signal massive local relevance to Google.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-orange-500/50 transition-colors">
              <Video className="w-8 h-8 text-orange-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">AI Video Content</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We produce compelling video content highlighting your team, your equipment, and your completed jobs. Videos build immense trust before your technician ever knocks on the customer's door.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-orange-500/50 transition-colors">
              <BarChart2 className="w-8 h-8 text-orange-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Monthly Performance Reports</h3>
              <p className="text-slate-400 leading-relaxed text-sm">You receive transparent, plain-English reports showing exactly what matters: how many people found you, where they came from, and how many called. No vanity metrics, just bottom-line truth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Case Study */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <BadgeCheck className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Case Study: Johnson Heating & AC</h2>
          <div className="bg-orange-900/10 border border-orange-500/20 rounded-3xl p-8 md:p-12 text-left mt-10">
            <p className="text-xl leading-relaxed text-white font-bold mb-4">
              See how a North Iowa HVAC company went from phone book ads to #1 in local search over 14 years.
            </p>
            <ul className="space-y-3 text-slate-300 text-lg mb-8">
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-orange-400" /> 14-year proven partnership</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-orange-400" /> Eliminated all print advertising</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-orange-400" /> Established a dominant 5-channel social presence</li>
              <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-orange-400" /> Secured top-rated Google positioning</li>
            </ul>
            <Link to="/case-studies/johnson-heating" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold transition-colors">
              Read the full 14-year case study <ArrowRight className="w-5 h-5" />
            </Link>
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
                {ex.hashtags && <p className="text-orange-400 text-xs">{ex.hashtags}</p>}
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
              <div key={name} className={`rounded-2xl p-6 border ${i === 1 ? 'border-orange-500/50 bg-orange-900/10 shadow-lg shadow-orange-900/20' : 'border-slate-800 bg-slate-900'}`}>
                {i === 1 && <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 block">Most Popular</span>}
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
            <Link to={createPageUrl('Pricing')} className="text-orange-400 hover:text-orange-300 font-semibold underline">
              View full plan comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* NEW: Service Areas */}
      <section className="py-16 px-4 bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Regional Service Areas</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              We serve HVAC contractors across North Iowa and Southern Minnesota. If you can drive to your customers, we can get those customers to find you online first.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Mason City, IA", "Clear Lake, IA", "Charles City, IA", "Garner, IA", 
              "Forest City, IA", "Northwood, IA", "Rochester, MN", "Albert Lea, MN", "Austin, MN"
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
        <div className="absolute inset-0 bg-orange-900/10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Ready to end the feast-or-famine cycle?
          </h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Build a local marketing engine that keeps your dispatch board full year-round. 7-day free trial. No credit card required.
          </p>
          <Link to={createPageUrl('Get-Started')}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-10 py-5 rounded-xl transition-all shadow-xl shadow-orange-600/20 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm mt-6">Starter plan from $197/mo after trial</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}