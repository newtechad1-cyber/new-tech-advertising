import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle, ArrowRight, Star, Zap, BarChart2, Share2, Video, Search, MapPin, Clock, ShieldAlert, ThermometerSnowflake, FileText, Smartphone, MessageSquare } from 'lucide-react';
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
  features: [
    { icon: Share2, title: 'Automated Social Media', desc: 'AI writes and schedules seasonal HVAC content — maintenance tips, promotions, emergency service posts.' },
    { icon: Search, title: 'Local SEO Automation', desc: 'Rank for "HVAC repair near me" with AI-generated blog posts and Google Business updates.' },
    { icon: Star, title: 'Review Management', desc: 'Automatically request reviews after service calls and monitor your reputation 24/7.' },
    { icon: Video, title: 'AI Video Creation', desc: 'Create professional "before & after" videos and service spotlights without a film crew.' },
    { icon: BarChart2, title: 'Lead Tracking', desc: 'See exactly which marketing channels are bringing in service calls and bookings.' },
  ],
  testimonial: {
    quote: 'We went from 12 Google reviews to 87 in 3 months. The social posts write themselves and the phone keeps ringing.',
    author: 'Mike T.',
    company: 'ProAir HVAC, Chicago IL',
  }
};

const PLAN_FEATURES = {
  Starter: ['12 AI social posts/mo', 'AI blog generator', 'Review monitoring', 'Basic analytics', '$197/mo'],
  Growth: ['20 AI social posts/mo', 'AI video creation', 'SEO automation', 'Content calendar', '$297/mo'],
  Pro: ['AI video campaigns', 'Reputation automation', 'Advanced analytics', 'Priority support', '$497/mo'],
};

const newFaqs = [
  {
    question: "How much does HVAC marketing cost?",
    answer: "Our HVAC marketing systems are tailored to your business size and growth goals. While basic setups start at an accessible tier, our comprehensive local lead systems typically range from $1,000 to $3,000+ per month depending on whether you need paid ads management, video production, or aggressive SEO. We focus on clear ROI so your marketing becomes a profit center, not an expense."
  },
  {
    question: "How long until I see results from local SEO?",
    answer: "While some optimizations like Google Business Profile updates can show improvements in weeks, structural local SEO is a long-term play. Typically, you'll start seeing a noticeable uptick in organic calls and map pack rankings between months 3 and 6. Once established, this creates a sustainable lead engine that doesn't disappear when you turn off ad spend."
  },
  {
    question: "Can you help me get more Google reviews?",
    answer: "Yes, this is one of our most effective strategies for HVAC contractors. We implement automated review request systems that text or email your customers immediately after a service call is completed. This captures them when they are most satisfied, dramatically increasing your review volume and boosting your local search visibility."
  },
  {
    question: "Do you work with HVAC companies outside Iowa?",
    answer: "Absolutely. While we are headquartered in North Iowa and serve many regional businesses across Iowa and Southern Minnesota, our systems and AI-powered strategies work for HVAC companies anywhere in the United States. The principles of local search dominance apply to any service area."
  },
  {
    question: "What makes AI marketing different from hiring a traditional agency?",
    answer: "Traditional agencies often rely on manual labor for every post and update, making them slow and expensive. Our AI marketing integrates smart automation to produce seasonal content, monitor reviews, and optimize your listings 24/7 at a fraction of the cost. You get enterprise-level digital infrastructure and hyper-local strategy without the bloated agency retainer."
  }
];

export default function HvacMarketing() {
  const { color } = DATA;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "HVAC Marketing",
    "provider": {
      "@type": "Organization",
      "name": "New Tech Advertising",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mason City",
        "addressRegion": "IA",
        "addressCountry": "US"
      }
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
  };

  return (
    <div className="bg-slate-950 min-h-screen font-sans">
      <SEOHead 
        title="HVAC Marketing | AI Marketing for HVAC Companies"
        description="AI-powered marketing for HVAC contractors. Google Business Profile, AI search optimization, social media & lead generation. Get more furnace and AC calls. New Tech Advertising."
        faqs={newFaqs}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <MarketingNav />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ background: color }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest mb-4 block" style={{ color }}>
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
                  <p className="text-3xl font-extrabold text-white mb-1" style={{ color }}>{s.value}</p>
                  <p className="text-slate-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Why HVAC Companies Struggle Online */}
      <section className="py-20 px-6 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Why HVAC Companies Struggle Online</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Running an HVAC business is demanding. Most contractors don't have the time to become digital marketing experts, leading to common digital roadblocks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ThermometerSnowflake className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Seasonal Demand Swings</h3>
              <p className="text-slate-400 leading-relaxed">Dead winters versus slammed summers make cash flow unpredictable. You need a marketing engine that builds proactive maintenance bookings during the shoulder seasons.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <ShieldAlert className="w-10 h-10 text-red-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Competing Against Aggregators</h3>
              <p className="text-slate-400 leading-relaxed">HomeAdvisor, Angi, and Yelp aggregate your leads and resell them to multiple competitors simultaneously. You need your own direct pipeline of exclusive leads.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <Clock className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Missed After-Hours Searches</h3>
              <p className="text-slate-400 leading-relaxed">Customers are frantically searching "AC repair near me" at 2am when their system fails. If you aren't monitoring ads or ranking organically, you lose the job.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
              <MessageSquare className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Scattered Review Management</h3>
              <p className="text-slate-400 leading-relaxed">It's nearly impossible to manage reviews across Google, Facebook, and Yelp manually while you're out running service calls and managing your crew.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: What We Do Differently */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">What We Do Differently</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We replace fragmented tactics with a comprehensive, AI-powered growth system tailored for heating and cooling contractors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <Search className="w-8 h-8 text-orange-500 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Local SEO</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We target "HVAC + your city" searches automatically to ensure you capture local intent. We build out dedicated city and service pages that rank organically when homeowners are searching for emergency repairs or installations.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <Star className="w-8 h-8 text-yellow-500 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Automated Review Generation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Capturing feedback when the customer is most satisfied is crucial for local ranking. Our system automatically follows up via SMS and email after service calls, making it frictionless to get 5-star Google reviews.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <Share2 className="w-8 h-8 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Social Media on Autopilot</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We maintain a consistent cadence of educational and promotional posts across your social channels. From winterizing tips to mid-summer AC maintenance reminders, your audience stays engaged year-round without you lifting a finger.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <MapPin className="w-8 h-8 text-red-500 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Google Business Profile Optimization</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Your Google map listing is often the first impression a customer has. We continuously optimize it with weekly posts, recent job photos, and updated service offerings to keep Google's algorithm favoring your business.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <Video className="w-8 h-8 text-purple-500 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">AI Video Content</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Video builds trust faster than any other medium. We help you create and distribute professional video assets that highlight your expertise, showcase your fleet, and provide quick DIY tips to homeowners.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
              <BarChart2 className="w-8 h-8 text-emerald-500 mb-5" />
              <h3 className="text-xl font-bold text-white mb-3">Monthly Performance Reports</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Stop guessing where your leads are coming from or what your ROI is. We provide transparent, plain-English analytics that clearly show how many calls, clicks, and bookings your digital footprint is generating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Case Study Mini-Section */}
      <section className="py-20 px-6 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="bg-blue-900/20 border border-blue-800/40 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-3 block">Featured Case Study</span>
                <h2 className="text-3xl font-extrabold text-white mb-4">Johnson Heating & AC</h2>
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                  See how a North Iowa HVAC company went from phone book ads to #1 in local search over 14 years.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <span className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300 font-medium">14-Year Partnership</span>
                  <span className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300 font-medium">Eliminated Print Ads</span>
                  <span className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300 font-medium">5-Channel Social Presence</span>
                  <span className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm text-slate-300 font-medium">Top-Rated Google Positioning</span>
                </div>
                <Link to="/case-studies/johnson-heating" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                  Read Full Case Study <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Examples (Existing from DATA) */}
      <section className="py-16 px-4 border-t border-slate-800">
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
                    style={{ background: color }}>{DATA.industry[0]}</div>
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

      {/* NEW: Service Areas */}
      <section className="py-20 px-6 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-white mb-6">Our Primary Service Areas</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
            We serve HVAC contractors across North Iowa and Southern Minnesota. If you can drive to your customers, we can get those customers to find you online first.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Mason City, IA", "Clear Lake, IA", "Charles City, IA", 
              "Garner, IA", "Forest City, IA", "Northwood, IA", 
              "Rochester, MN", "Albert Lea, MN", "Austin, MN"
            ].map((city, idx) => (
              <span key={idx} className="bg-slate-900 border border-slate-700 text-white px-5 py-2.5 rounded-full font-medium shadow-sm">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about partnering with NTA for your HVAC marketing.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {newFaqs.map((faq, i) => (
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

      {/* Testimonial (Existing) */}
      <section className="py-16 px-4 border-t border-slate-800 bg-slate-900/30">
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
      <section className="py-20 px-4 border-t border-slate-800 bg-slate-950 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Start growing your {DATA.industry.toLowerCase()} business today
          </h2>
          <p className="text-slate-400 text-lg mb-8">Stop letting competitors take your high-value local calls.</p>
          <div className="flex justify-center gap-4">
            <Link to={createPageUrl('Book-Call')}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-600/20 text-lg">
              Book a Strategy Call <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}