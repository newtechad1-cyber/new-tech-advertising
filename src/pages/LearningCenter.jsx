import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Globe, Search, Video, Star, Megaphone, MapPin } from 'lucide-react';

const topics = [
  {
    tag: "AI Search",
    title: "AI Search & Visibility",
    description: "Help your business show up when people ask ChatGPT, Gemini, Google AI Overviews, and voice assistants for local recommendations. Most local businesses have no presence in these results yet.",
  },
  {
    tag: "Websites",
    title: "Website Lead Generation",
    description: "Turn your website from an online brochure into a system that explains your value, builds trust, and helps people take action — whether that's a call, a form, or a visit.",
  },
  {
    tag: "Local SEO",
    title: "Local SEO & Google Business Profile",
    description: "Improve how your business appears in local search, maps, reviews, and \"near me\" searches. A complete, active Google Business Profile is now the #1 local visibility tool.",
  },
  {
    tag: "Video",
    title: "Video & Content Marketing",
    description: "Use short videos, helpful posts, and educational content to stay visible before people are ready to buy. Familiarity drives trust — and trust drives calls.",
  },
  {
    tag: "Reviews",
    title: "Reviews & Reputation",
    description: "Build trust with better review requests, testimonial content, and reputation signals that help people choose you over competitors with more stars and more reviews.",
  },
  {
    tag: "Advertising",
    title: "Advertising That Gets Leads",
    description: "Connect paid advertising with landing pages, follow-up, tracking, and offers that create real calls, forms, and customers — not just impressions.",
  },
];

const industries = [
  { name: "HVAC & Boiler Companies", icon: "🌡️" },
  { name: "Plumbers & Contractors", icon: "🔧" },
  { name: "Restaurants & Local Retail", icon: "🍽️" },
  { name: "Gyms & Service Businesses", icon: "💪" },
  { name: "Excavating & Home Services", icon: "🏗️" },
  { name: "Professional Services", icon: "⚖️" },
];

const howNTAHelps = [
  {
    icon: Globe,
    title: "Website Strategy",
    description: "Fast, mobile-first websites built to explain your value clearly, earn trust, and convert local visitors into calls and form submissions.",
  },
  {
    icon: Search,
    title: "AI Search Visibility",
    description: "We structure your content and online presence so AI tools like Google's AI Overviews, ChatGPT, and Gemini can find and recommend your business.",
  },
  {
    icon: MapPin,
    title: "Google & Local SEO",
    description: "We manage your Google Business Profile, local citations, and on-page SEO so you consistently show up in Maps and local search results.",
  },
  {
    icon: Video,
    title: "Video & Content",
    description: "Short-form videos, written guides, and educational posts that keep your business visible and build trust before people are ready to call.",
  },
  {
    icon: Star,
    title: "Reviews & Reputation",
    description: "We set up systems that make it easy for satisfied customers to leave reviews — then make those reviews work for your visibility and credibility.",
  },
  {
    icon: Megaphone,
    title: "Advertising & Lead Generation",
    description: "When you're ready to run ads, we set them up with proper targeting, landing pages, offers, and tracking so you know what's actually driving results.",
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
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Practical guides from New Tech Advertising about websites, AI search, Google visibility, video, reviews, content, and lead generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-colors"
            >
              Request a Free AI Visibility Gap Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/what-changed-online"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              Start With "What Changed Online"
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* Featured Guide */}
        <section className="max-w-5xl mx-auto px-6 pt-16 pb-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Featured Guide</p>
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full mb-4 inline-block">Start Here</span>
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-snug">What Changed Online</h2>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-xl">
                The way people find businesses has changed. Google, AI search, social media, reviews, websites, and local visibility now work together. This guide explains what changed and what local businesses should do next.
              </p>
              <Link
                to="/what-changed-online"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Read the Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden md:flex w-36 h-36 bg-slate-800 border border-slate-700 rounded-2xl items-center justify-center flex-shrink-0">
              <BookOpen className="w-14 h-14 text-slate-600" />
            </div>
          </div>
        </section>

        {/* Topic Cards */}
        <section className="max-w-6xl mx-auto px-6 py-14" aria-label="Learning topics">
          <h2 className="text-2xl font-black text-slate-900 mb-2">More Guides Coming Soon</h2>
          <p className="text-slate-500 mb-10 text-sm max-w-2xl">Each guide covers a specific part of local online visibility — what the problem is and what to focus on now.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard key={topic.title} topic={topic} />
            ))}
          </div>
        </section>

        {/* Who This Is For */}
        <section className="bg-slate-50 border-y border-slate-200 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-3 text-center">Who This Helps</h2>
            <p className="text-slate-500 text-center mb-2 max-w-2xl mx-auto leading-relaxed text-sm">
              Different businesses need different kinds of leads. Service companies need calls. Restaurants need customers walking in. Fitness businesses need inquiries and members. The goal is the same: help people find you, understand you, trust you, and take action.
            </p>
            <p className="text-slate-400 text-center text-xs mb-10">These guides are written with local service businesses in mind.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

        {/* Bottom CTA */}
        <section className="bg-slate-900 text-white py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Want to Know What Your Business Looks Like Online?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              NTA can review how your business appears across Google, AI search, your website, reviews, and local visibility — then show you practical ways to improve it.
            </p>
            <Link
              to="/gap-audit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
            >
              Request a Free AI Visibility Gap Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-400 text-xs mt-4">No cost. No pressure. We'll follow up within 1 business day.</p>
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
  return (
    <div className="h-full flex flex-col border border-slate-200 bg-white rounded-2xl p-6 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{topic.tag}</span>
        <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
          <Clock className="w-3 h-3" /> Coming soon
        </span>
      </div>
      <h3 className="font-black text-base text-slate-800 mb-3 leading-snug">{topic.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed flex-1">{topic.description}</p>
      <div className="mt-5 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 italic">Guide coming soon — check back shortly.</span>
      </div>
    </div>
  );
}