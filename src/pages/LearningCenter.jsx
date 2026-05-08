import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, CheckCircle2, Globe, Search, Video, Star, Megaphone, MapPin } from 'lucide-react';

const topics = [
  {
    title: "What Changed Online — And What It Means for Your Business",
    problem: "Most local businesses are still using marketing playbooks from 2018. The internet doesn't work that way anymore.",
    whyOldFailed: "Yellow Pages died. Facebook reach collapsed. Google added AI answers. The old \"just have a website\" approach stopped generating leads.",
    focusNow: "Understand the new local search landscape so you know where to spend your time and money.",
    href: "/what-changed-online",
    available: true,
    tag: "Start Here",
  },
  {
    title: "AI Search & Visibility: How to Get Found in the New Era",
    problem: "Google now shows AI-generated answers at the top of search results. Most local businesses never appear there.",
    whyOldFailed: "Keyword stuffing and link building don't drive AI visibility. Google's AI pulls from authoritative, well-structured local content — something most business websites don't have.",
    focusNow: "Build content and structure that signals local authority so AI search includes your business in its answers.",
    href: null,
    available: false,
    tag: "AI Search",
  },
  {
    title: "Website Lead Generation: Turn Visitors Into Phone Calls",
    problem: "Most local business websites get visits but very few calls. The design looks fine — but the conversion strategy is missing.",
    whyOldFailed: "A brochure-style website was enough in 2015. Today, customers compare you with competitors in seconds and leave if your site doesn't immediately answer their questions.",
    focusNow: "Learn what local service websites need — trust signals, clear CTAs, fast load time, and mobile-first design — to actually generate leads.",
    href: null,
    available: false,
    tag: "Websites",
  },
  {
    title: "Local SEO & Google Business Profile: Get Found on Maps",
    problem: "Customers search \"[service] near me\" and your business doesn't show up — even though you've been operating for years.",
    whyOldFailed: "An unclaimed or outdated Google Business Profile leaves you invisible on Maps. Competitors who optimize consistently rank above businesses that ignore it.",
    focusNow: "A complete, active Google Business Profile with photos, posts, reviews, and accurate information is now the #1 local visibility tool for service businesses.",
    href: null,
    available: false,
    tag: "Local SEO",
  },
  {
    title: "Video & Content Marketing: Build Trust Before They Call",
    problem: "Customers don't know who to trust. They pick businesses that feel familiar — even if they've never met them.",
    whyOldFailed: "Static websites and occasional Facebook posts don't build familiarity. Customers now expect to see you, hear from you, and understand your work before they call.",
    focusNow: "Short videos explaining your work, answering common questions, and showing real jobs build trust faster than any ad — and they keep working long after you post them.",
    href: null,
    available: false,
    tag: "Video",
  },
  {
    title: "Reviews & Reputation: Your Best Salespeople Are Your Past Customers",
    problem: "You do great work — but your competitors have 4x more reviews and consistently outrank you.",
    whyOldFailed: "Happy customers rarely leave reviews on their own. Without a system for asking, collecting, and responding to reviews, your reputation stays invisible online.",
    focusNow: "A simple, repeatable review generation system turns satisfied customers into social proof that drives new ones — and signals quality to both Google and AI search.",
    href: null,
    available: false,
    tag: "Reviews",
  },
  {
    title: "Advertising That Gets Leads — Not Just Impressions",
    problem: "You've tried ads before. Maybe Facebook, maybe Google. It didn't work — or you couldn't tell if it did.",
    whyOldFailed: "Running ads without a clear offer, proper targeting, or a landing page that converts is like pouring water into a leaky bucket. The platform isn't the problem — the strategy is.",
    focusNow: "Effective local advertising requires the right audience, a compelling offer, a fast-loading landing page, and tracking that shows you what's actually generating calls.",
    href: null,
    available: false,
    tag: "Advertising",
  },
];

const industries = [
  { name: "HVAC", icon: "🌡️" },
  { name: "Plumbers", icon: "🔧" },
  { name: "Contractors", icon: "🏗️" },
  { name: "Restaurants", icon: "🍽️" },
  { name: "Gyms & Fitness", icon: "💪" },
  { name: "Landscapers", icon: "🌿" },
  { name: "Electricians", icon: "⚡" },
  { name: "Auto Repair", icon: "🚗" },
  { name: "Dental & Medical", icon: "🏥" },
  { name: "Law Firms", icon: "⚖️" },
  { name: "Salons & Spas", icon: "✂️" },
  { name: "Pet Services", icon: "🐾" },
];

const howNTAHelps = [
  {
    icon: Globe,
    title: "Website Rebuilds",
    description: "We build fast, mobile-first websites designed to convert local visitors into phone calls and form submissions — not just look good.",
  },
  {
    icon: Search,
    title: "AI & Local Search Visibility",
    description: "We optimize your business to appear in AI-generated answers and local search results — where customers are actually looking now.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile Optimization",
    description: "We manage and optimize your Google Business Profile so you consistently show up on Maps and in local results for your service area.",
  },
  {
    icon: Video,
    title: "Video & Content Marketing",
    description: "We produce short-form video content and written guides that build trust with potential customers before they ever pick up the phone.",
  },
  {
    icon: Star,
    title: "Review Generation",
    description: "We set up systems that make it easy for your happy customers to leave reviews — and make sure those reviews work for your visibility.",
  },
  {
    icon: Megaphone,
    title: "Lead Generation & Advertising",
    description: "When you're ready to run ads, we set them up with proper targeting, offers, and tracking so you know what's actually driving results.",
  },
];

export default function LearningCenter() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <header className="bg-slate-900 text-white px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <BookOpen className="w-4 h-4" />
            NTA Learning Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            Learn How Local Businesses<br className="hidden sm:block" /> Get Found Now
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Practical, no-jargon guides from New Tech Advertising — covering what changed online, why old marketing stopped working, and what local service businesses should focus on today.
          </p>
        </div>
      </header>

      {/* Topic Cards */}
      <main>
        <section className="max-w-6xl mx-auto px-6 py-16" aria-label="Learning topics">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Educational Guides</h2>
          <p className="text-slate-500 mb-10 text-sm">Each guide explains the problem, why old approaches stopped working, and what to focus on now.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard key={topic.title} topic={topic} />
            ))}
          </div>
        </section>

        {/* Who This Is For */}
        <section className="bg-slate-50 border-y border-slate-200 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Who This Is For</h2>
            <p className="text-slate-500 text-center mb-10 text-sm max-w-xl mx-auto">
              These guides are written for local service businesses — the kind that rely on customers finding them online in their community.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {industries.map((ind) => (
                <div key={ind.name} className="bg-white border border-slate-200 rounded-xl px-4 py-4 flex items-center gap-3">
                  <span className="text-2xl">{ind.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{ind.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How NTA Helps */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-slate-900 mb-2">How NTA Helps Businesses Get Found</h2>
          <p className="text-slate-500 mb-10 text-sm max-w-2xl">
            New Tech Advertising works with local service businesses across Iowa and Minnesota to build consistent online visibility — using the channels and strategies that actually work in today's environment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {howNTAHelps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Visibility CTA */}
        <section className="bg-blue-600 text-white py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Want to See How Your Business Appears Online?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              We'll run a free AI Visibility Gap Audit — showing you exactly where your business is missing in search, Maps, and AI-generated results. No cost, no pressure.
            </p>
            <Link
              to="/gap-audit"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-colors text-base"
            >
              Request a Free AI Visibility Gap Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-blue-200 text-xs mt-4">Takes less than 2 minutes to request. We'll follow up within 1 business day.</p>
          </div>
        </section>

        {/* Internal links / trust footer */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-12">
            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Start Learning</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/what-changed-online" className="hover:text-blue-600 transition-colors">What Changed Online →</Link></li>
                <li><Link to="/local-lead-systems" className="hover:text-blue-600 transition-colors">Local Lead Systems →</Link></li>
                <li><Link to="/seo-pages-for-local-businesses" className="hover:text-blue-600 transition-colors">SEO for Local Businesses →</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Our Services</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/services/website-rebuilds" className="hover:text-blue-600 transition-colors">Website Rebuilds →</Link></li>
                <li><Link to="/services/social-media-management" className="hover:text-blue-600 transition-colors">Social Media Management →</Link></li>
                <li><Link to="/ai-video-marketing" className="hover:text-blue-600 transition-colors">AI Video Marketing →</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Work With NTA</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/gap-audit" className="hover:text-blue-600 transition-colors">Free AI Gap Audit →</Link></li>
                <li><Link to="/book-call" className="hover:text-blue-600 transition-colors">Book a Strategy Call →</Link></li>
                <li><Link to="/our-work" className="hover:text-blue-600 transition-colors">See Our Work →</Link></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function TopicCard({ topic }) {
  const cardInner = (
    <div className={`group h-full flex flex-col border rounded-2xl p-6 transition-all ${
      topic.available
        ? 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:shadow-md'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          topic.available ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
        }`}>
          {topic.tag}
        </span>
        {!topic.available && (
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Clock className="w-3 h-3" /> Coming soon
          </span>
        )}
      </div>

      <h3 className={`font-black text-base mb-4 leading-snug ${
        topic.available ? 'text-slate-900' : 'text-slate-700'
      }`}>
        {topic.title}
      </h3>

      <div className="space-y-3 flex-1">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">The Problem</p>
          <p className="text-sm text-slate-600 leading-relaxed">{topic.problem}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Why Old Marketing Failed</p>
          <p className="text-sm text-slate-500 leading-relaxed">{topic.whyOldFailed}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">What to Focus On Now</p>
          <p className="text-sm text-slate-600 leading-relaxed">{topic.focusNow}</p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-200">
        {topic.available ? (
          <span className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-bold group-hover:gap-2.5 transition-all">
            Read the guide <ArrowRight className="w-4 h-4" />
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">Guide coming soon — check back shortly.</span>
        )}
      </div>
    </div>
  );

  if (topic.available && topic.href) {
    return <Link to={topic.href} className="block h-full">{cardInner}</Link>;
  }
  return <div className="h-full">{cardInner}</div>;
}