import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { 
  CheckCircle, ArrowRight, Star, BarChart2, Share2, Video, Search,
  AlertTriangle, DollarSign, MessageSquareWarning, ImageOff, MapPin, 
  Settings, Users, Clock
} from 'lucide-react';
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
  faqs: [
    {
      question: "How much does restaurant marketing cost?",
      answer: "Most independent restaurants spend $500-$1,500/month on their digital presence. NTA focuses entirely on organic reach and reputation management rather than throwing money at expensive paid ads. The true ROI shows up as more Google searches, more direct calls for reservations, and more walk-ins who tell your hostess, 'I saw you online.'"
    },
    {
      question: "I'm already on DoorDash and Uber Eats — isn't that enough?",
      answer: "No, because delivery apps own the customer relationship — you don't get their email, phone number, or data, and they take a punishing 15-30% commission per order. Building your own online presence means customers come directly to you and you keep the margins. The apps are fine as a supplement, but they absolutely shouldn't be your entire digital strategy."
    },
    {
      question: "We post on Facebook sometimes — why isn't it working?",
      answer: "Facebook's organic reach for business pages is currently under 5% of your followers. Consistency and content quality matter significantly more than just posting randomly. A real restaurant strategy includes a healthy mix of platforms (Google Business, Instagram, Facebook) with content tailored specifically to each algorithm."
    },
    {
      question: "Can you handle our social media completely so I don't have to think about it?",
      answer: "Yes, completely. The only thing we ask of you is to share occasional photos of daily specials or events — a quick photo from your phone is perfectly fine. NTA builds the content calendar, writes the appetizing copy, schedules the updates, and handles the posting and engagement."
    },
    {
      question: "How long until I see more customers from marketing?",
      answer: "Google Business Profile optimization can show noticeable results in 30-60 days. Automated review generation compounds monthly. Comprehensive local SEO takes 3-6 months for significant ranking improvements, and social media builds steady momentum over time. The key is structural consistency."
    }
  ]
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

export default function RestaurantMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen">
      <SEOHead 
        title="Restaurant Marketing | AI Marketing for Restaurants"
        description="AI-powered marketing for restaurants. Social media management, Google Business Profile, online ordering integration & customer engagement. New Tech Advertising."
        faqs={DATA.faqs}
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
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
                  <p className="text-3xl md:text-4xl font-extrabold text-white mb-1" style={{ color: DATA.color }}>{s.value}</p>
                  <p className="text-slate-400 text-sm font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY RESTAURANTS LOSE CUSTOMERS ONLINE */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">Why Restaurants Lose Customers Online</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Your food might be the best in town, but if your digital presence is outdated, hungry diners will go to the place with the better photos and recent reviews. Here's what's costing you tables:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Stale Google Business Profiles</h3>
              <p className="text-slate-400 leading-relaxed">90% of diners check Google reviews and photos before choosing where to eat — a stale GBP with no recent photos is losing you covers every single night.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Predatory Delivery Apps</h3>
              <p className="text-slate-400 leading-relaxed">Third-party delivery apps (DoorDash, Uber Eats, Grubhub) take 15–30% commission and own the customer relationship — you don't even get their email for future marketing.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <ImageOff className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Inconsistent Social Media</h3>
              <p className="text-slate-400 leading-relaxed">Posting on social media feels like screaming into the void when you're prepping for a Friday rush, and inconsistent posting kills your algorithm reach completely.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <MessageSquareWarning className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unmanaged Negative Reviews</h3>
              <p className="text-slate-400 leading-relaxed">Negative reviews travel faster than word of mouth — one bad Yelp review can undo months of great food if nobody responds professionally and resolves the issue publicly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD FOR RESTAURANTS */}
      <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-6">What We Build for Restaurants</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              We build end-to-end digital systems that keep your restaurant visible, engaged, and busy without adding to your daily plate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Search className="w-8 h-8 text-red-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Own Your Google Presence</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We optimize your Google Business Profile so you show up first when locals search "restaurants near me" or "best [cuisine] in [city]." Weekly photo uploads of your actual dishes, updated hours for holidays, and menu highlights that make people click "Directions" instead of scrolling past.</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Star className="w-8 h-8 text-red-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Automated Reputation Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">After every visit, your customers get a gentle prompt to leave a review. We monitor Google, Yelp, and Facebook reviews daily and draft professional responses — both to praise and complaints — so your reputation stays spotless without you checking your phone during service.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Share2 className="w-8 h-8 text-red-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Social Media That Fills Seats</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We build content calendars around your actual menu, specials, and events — not generic food stock photos. Daily/weekly posts featuring your dishes, your staff, your atmosphere. The kind of content that makes someone say "I need to go there tonight."</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <MapPin className="w-8 h-8 text-red-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Event & Special Promotions</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Holiday menus, live music nights, catering services, seasonal specials — we build targeted local campaigns so the right people in your area see your events before they make their weekend dining plans.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <Video className="w-8 h-8 text-red-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">AI-Powered Menu & Content</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Blog posts like "Best Date Night Restaurants in Mason City" or "What to Order at [Your Restaurant] — Staff Picks" that rank in Google and AI search results. This kind of content builds long-term authority and drives organic traffic.</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
              <BarChart2 className="w-8 h-8 text-red-500 mb-5" />
              <h3 className="text-lg font-bold text-white mb-3">Plain English Monthly Reports</h3>
              <p className="text-slate-400 text-sm leading-relaxed">How many people searched for you, how many clicked for directions, how many called for reservations. No marketing jargon. One page, once a month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE RESTAURANT MARKETING PROBLEM NOBODY TALKS ABOUT */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-red-900 to-slate-900 border border-red-800/50 rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Settings className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10">
            <span className="text-red-300 font-bold uppercase tracking-wider text-sm mb-4 block">The Hard Truth</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">You're Competing Against Algorithms, Not Just Other Restaurants</h2>
            <p className="text-lg text-red-100/90 leading-relaxed mb-6">
              Google, Yelp, DoorDash — they all use algorithms to decide who gets seen. A restaurant with 200 Google reviews and weekly photo updates will always outrank a restaurant with better food but only 12 reviews from 2021.
            </p>
            <p className="text-lg text-red-100/90 leading-relaxed">
              The unfair truth is that online visibility is now a core operational function, not a marketing luxury. The restaurants that understand this are filling tables. The ones that don't are wondering why Tuesday nights are dead. We handle the algorithm side so you can handle the kitchen side.
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
                We work with independent restaurants, bars, cafes, and catering companies across North Iowa and Southern Minnesota. 
              </p>
              <p className="text-lg text-slate-400 leading-relaxed font-semibold text-red-400">
                Chain franchises have corporate marketing teams. You deserve the same firepower.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
              <ul className="grid grid-cols-2 gap-y-4 gap-x-6 text-slate-300">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Mason City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Clear Lake, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Charles City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Garner, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Forest City, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Osage, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Northwood, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Waverly, IA</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Rochester, MN</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" /> Albert Lea, MN</li>
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
            <p className="text-slate-400">Real examples of posts our AI creates for {DATA.industry.toLowerCase()}s</p>
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

      {/* Packages / Features Comparison */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Choose the right plan for your restaurant
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
                    <p className="text-white font-semibold text-sm">Food & Promo Content</p>
                    <p className="text-slate-500 text-xs mt-0.5">AI creates drool-worthy menu posts, daily specials, and event announcements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Search className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Local Restaurant SEO</p>
                    <p className="text-slate-500 text-xs mt-0.5">Get found when people search "best [cuisine] near me".</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${DATA.color}22`, border: `1px solid ${DATA.color}44` }}>
                    <Star className="w-4 h-4" style={{ color: DATA.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Review Management</p>
                    <p className="text-slate-500 text-xs mt-0.5">Respond to reviews automatically and grow your rating.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {Object.entries(PLAN_FEATURES).map(([name, feats], i) => (
                <div key={name} className={`rounded-2xl p-5 border ${i === 1 ? 'border-red-500/40 bg-red-900/10' : 'border-slate-800 bg-slate-900'}`}>
                  {i === 1 && <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 block">Most Popular</span>}
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
                className="block text-center text-red-400 hover:text-red-300 text-sm underline">
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
            Start filling your tables today
          </h2>
          <p className="text-slate-400 mb-8">Take control of your online presence. Don't let apps steal your margins.</p>
          <Link to={createPageUrl('Book-Call')}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-600/20 text-lg">
            Book a Demo <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-600 text-sm mt-4">Questions? Call us at 641-420-8816</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}