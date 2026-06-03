import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle, ArrowRight, Star, Zap, BarChart2, Share2, Video, Search, Smartphone, ShieldAlert, UtensilsCrossed, Calendar, MapPin } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DATA = {
  industry: 'Restaurant',
  headline: 'Fill More Tables With AI-Powered Restaurant Marketing',
  subheadline: 'Hungry customers scroll social media before they search on Google. Our AI keeps your restaurant front-and-center with mouth-watering content, automated reviews, and local SEO.',
  color: '#ef4444',
  stats: [
    { value: '3x', label: 'More social engagement' },
    { value: '60%', label: 'Guests discover via social' },
    { value: '12+', label: 'Posts created per month' },
    { value: '0 hrs', label: 'Owner time on marketing' },
  ],
  contentExamples: [
    {
      companyName: "Luigi's Trattoria",
      platform: 'Instagram',
      caption: '🍝 It\'s Pasta Wednesday! Our handmade fettuccine Alfredo is back by popular demand. Made fresh daily with a family recipe passed down 3 generations. Reservations filling fast — link in bio!',
      hashtags: '#PastaWednesday #ItalianFood #LocalRestaurant #FreshPasta',
      likes: 234,
      comments: 47,
    },
    {
      companyName: 'Smokehouse BBQ',
      platform: 'Facebook',
      caption: '🔥 Weekend Special Alert! Full rack of ribs + 2 sides + cornbread for $28.99. Available Saturday & Sunday only while supplies last. Tag someone you\'d share these with 👇',
      hashtags: '#BBQ #WeekendSpecial #SmokehouseBBQ #RibsAndBeer',
      likes: 189,
      comments: 83,
    },
    {
      companyName: 'The Morning Cup',
      platform: 'Google Business',
      caption: 'Happy Monday from The Morning Cup! Stop in for our seasonal Lavender Honey Latte — only available through May. Open at 6am for your early commute. See you soon!',
      hashtags: '',
      likes: 45,
      comments: 11,
    },
  ],
  testimonial: {
    quote: 'We grew our Instagram from 400 to 2,200 followers in 90 days. Friday nights are consistently packed now. The AI literally writes better captions than I do.',
    author: 'Maria L.',
    company: "Luigi's Trattoria, Denver CO",
  },
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

const FAQS = [
  {
    question: "How much does restaurant marketing cost?",
    answer: "Most independent restaurants spend $500-$1,500/month on marketing. We focus intensely on organic reach and reputation management over expensive paid ads. Your ROI shows up directly in tangible results: more Google searches for your name, more calls for reservations, and more walk-ins who specifically mention \"I saw you online\" or \"I saw that dish on Instagram.\""
  },
  {
    question: "I'm already on DoorDash and Uber Eats — isn't that enough?",
    answer: "Delivery apps absolutely do not replace your own marketing. Those apps own the customer relationship completely — you don't even get the customer's email address or phone number. Furthermore, they take a massive 15-30% commission per order. Building your own digital presence means customers come directly to you, saving you margin. Third-party apps are fine as a supplement to capture lazy orders, but they should never be your entire digital strategy."
  },
  {
    question: "We post on Facebook sometimes — why isn't it working?",
    answer: "Facebook's organic reach for business pages has plummeted to under 5% of your followers. Simply posting sporadically won't move the needle anymore. Consistency, high-quality visuals, and localized tagging matter far more than frequency. A real strategy includes a dedicated mix of platforms (Google Business Profile, Instagram, and Facebook) with content tailored to how users interact on each specific network."
  },
  {
    question: "Can you handle our social media completely so I don't have to think about it?",
    answer: "Yes, completely. Our entire system is built for operators who have no time. The only ask we have is that you or your staff share photos of daily specials, events, or behind-the-scenes prep (a quick smartphone photo is perfectly fine). NTA takes those raw assets and builds the content calendar, writes engaging copy, adds the right local hashtags, and handles the actual posting and engagement."
  },
  {
    question: "How long until I see more customers from marketing?",
    answer: "Google Business Profile optimization can show noticeable results in local map pack views within 30-60 days. Automated review generation begins compounding monthly, providing steady social proof. On-site SEO takes 3-6 months for significant organic ranking improvements, while social media builds momentum over time. The key to restaurant marketing is relentless consistency, not overnight virality."
  }
];

export default function RestaurantMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen font-sans text-slate-300">
      <SEOHead 
        title="Restaurant Marketing | AI Marketing for Restaurants"
        description="AI-powered marketing for restaurants. Social media management, Google Business Profile, online ordering integration & customer engagement. New Tech Advertising."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Restaurant Marketing",
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
            { "@type": "City", "name": "Osage", "addressRegion": "IA" },
            { "@type": "City", "name": "Northwood", "addressRegion": "IA" },
            { "@type": "City", "name": "Waverly", "addressRegion": "IA" },
            { "@type": "City", "name": "Rochester", "addressRegion": "MN" },
            { "@type": "City", "name": "Albert Lea", "addressRegion": "MN" }
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
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-600/20">
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

      {/* NEW: Why Restaurants Lose Customers Online */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Restaurants Lose Customers Online</h2>
            <p className="text-lg leading-relaxed text-slate-400">
              You know you have great food and great service, but potential diners are making decisions before they ever walk through the door. Here is exactly why tables sit empty.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Search className="w-10 h-10 text-red-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">The Google "Menu & Photo" Test</h3>
              <p className="text-slate-400 leading-relaxed">90% of diners check Google reviews and photos before choosing where to eat. A stale Google Business Profile with no recent photos of your best dishes is losing you covers every single night as diners swipe to the next option.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Smartphone className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Surrendering to Delivery Apps</h3>
              <p className="text-slate-400 leading-relaxed">Third-party delivery apps like DoorDash, Uber Eats, and Grubhub take a crushing 15–30% commission and entirely own the customer relationship. You fulfill the order, but you don't even get their email address to invite them back.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Share2 className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">The Social Media Time Sink</h3>
              <p className="text-slate-400 leading-relaxed">Posting on social media feels like screaming into the void when you're busy prepping for a Friday rush. But inconsistent posting severely kills your algorithm reach, meaning your followers rarely even see your specials.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ShieldAlert className="w-10 h-10 text-cyan-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Reputational Damage Control</h3>
              <p className="text-slate-400 leading-relaxed">Negative reviews travel significantly faster than word of mouth. One bad Yelp or Google review from an unreasonable customer can undo months of serving great food if nobody is actively monitoring and responding professionally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: The Restaurant Marketing Problem Nobody Talks About */}
      <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <UtensilsCrossed className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Restaurant Marketing Problem Nobody Talks About:<br/>You're Competing Against Algorithms, Not Just Other Restaurants</h2>
          <p className="text-lg leading-relaxed text-slate-300 text-left md:text-center">
            Google, Yelp, DoorDash — they all use algorithms to decide who gets seen. A restaurant with 200 Google reviews and weekly photo updates will always outrank a restaurant with better food but 12 reviews from 2021.
          </p>
          <p className="text-lg leading-relaxed text-slate-300 text-left md:text-center mt-4">
            The unfair truth is that online visibility is now a core operational function, not a marketing luxury. The restaurants that understand this are filling tables effortlessly. The ones that don't are left wondering why Tuesday nights are dead. We handle the algorithm side so you can handle the kitchen side.
          </p>
        </div>
      </section>

      {/* NEW: What We Build for Restaurants */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">What We Build for Restaurants</h2>
            <p className="text-lg text-slate-400">We implement the digital infrastructure required to fill dining rooms year-round.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-red-500/50 transition-colors">
              <Search className="w-8 h-8 text-red-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Own Your Google Presence</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We optimize your Google Business Profile so you show up first when locals search "restaurants near me" or "best [cuisine] in [city]." Weekly photo uploads of your actual dishes, updated hours for holidays, and menu highlights that make people click "Directions" instead of scrolling past.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-red-500/50 transition-colors">
              <Star className="w-8 h-8 text-red-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Automated Review & Reputation Management</h3>
              <p className="text-slate-400 leading-relaxed text-sm">After every visit, your customers get a gentle prompt to leave a review. We monitor Google, Yelp, and Facebook reviews daily and draft professional responses — both to praise and complaints — so your reputation stays spotless without you checking your phone during service.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-red-500/50 transition-colors">
              <Share2 className="w-8 h-8 text-red-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Social Media That Fills Seats</h3>
              <p className="text-slate-400 leading-relaxed text-sm">We build content calendars around your actual menu, specials, and events — not generic food stock photos. Daily/weekly posts featuring your dishes, your staff, your atmosphere. The kind of content that makes someone say "I need to go there tonight."</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-red-500/50 transition-colors">
              <Calendar className="w-8 h-8 text-red-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Event & Special Promotion Campaigns</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Holiday menus, live music nights, catering services, seasonal specials — we build targeted local campaigns so the right people in your area see your events before they make weekend plans.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-red-500/50 transition-colors">
              <Video className="w-8 h-8 text-red-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Menu & Content Marketing</h3>
              <p className="text-slate-400 leading-relaxed text-sm">Blog posts like "Best Date Night Restaurants in Mason City" or "What to Order at [Your Restaurant] — Staff Picks" that rank in Google and AI search results. This kind of content builds long-term authority and drives organic traffic directly to your site.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-red-500/50 transition-colors">
              <BarChart2 className="w-8 h-8 text-red-400 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Monthly Performance Reports in Plain English</h3>
              <p className="text-slate-400 leading-relaxed text-sm">How many people searched for you, how many clicked for directions, how many called. No marketing jargon. One page, once a month. You always know exactly what your marketing dollars are accomplishing.</p>
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
                {ex.hashtags && <p className="text-red-400 text-xs">{ex.hashtags}</p>}
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
            <p className="text-slate-400">Transparent pricing for local restaurants and hospitality groups.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PLAN_FEATURES).map(([name, feats], i) => (
              <div key={name} className={`rounded-2xl p-6 border ${i === 1 ? 'border-red-500/50 bg-red-900/10 shadow-lg shadow-red-900/20' : 'border-slate-800 bg-slate-900'}`}>
                {i === 1 && <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 block">Most Popular</span>}
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
            <Link to={createPageUrl('Pricing')} className="text-red-400 hover:text-red-300 font-semibold underline">
              View full plan comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* NEW: Service Areas */}
      <section className="py-16 px-4 bg-slate-900 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Regional Service Areas</h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              We work with independent restaurants, bars, cafes, and catering companies across North Iowa and Southern Minnesota. Chain franchises have corporate marketing teams. You deserve the same firepower.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Mason City, IA", "Clear Lake, IA", "Charles City, IA", "Garner, IA", 
              "Forest City, IA", "Osage, IA", "Northwood, IA", "Waverly, IA",
              "Rochester, MN", "Albert Lea, MN"
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
        <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Start filling your dining room tonight.
          </h2>
          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Stop relying solely on foot traffic and third-party delivery apps. Take control of your online presence. 7-day free trial. No credit card required. Cancel anytime.
          </p>
          <Link to={createPageUrl('Get-Started')}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-10 py-5 rounded-xl transition-all shadow-xl shadow-red-600/20 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm mt-6">Starter plan from $197/mo after trial</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}