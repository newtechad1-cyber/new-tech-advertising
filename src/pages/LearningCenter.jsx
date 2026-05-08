import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

const topics = [
  {
    title: "What Changed Online (And What It Means for Your Business)",
    description: "The internet shifted. Search changed. AI changed how customers find businesses. Here's what happened and what to do about it.",
    href: "/what-changed-online",
    available: true,
    tag: "Start Here",
  },
  {
    title: "AI Search & Visibility",
    description: "How AI-powered search engines decide which local businesses to show — and how to make sure yours is one of them.",
    href: null,
    available: false,
    tag: "AI Search",
  },
  {
    title: "Website Lead Generation",
    description: "Your website should be your best salesperson. Learn what makes local business websites actually convert visitors into calls.",
    href: null,
    available: false,
    tag: "Websites",
  },
  {
    title: "Local SEO & Google Business Profile",
    description: "Getting found on Google Maps and local search results starts here. A practical guide for service-based businesses.",
    href: null,
    available: false,
    tag: "Local SEO",
  },
  {
    title: "Video & Content Marketing",
    description: "Short videos and consistent content build trust faster than any ad. Learn how local businesses use video to grow.",
    href: null,
    available: false,
    tag: "Video",
  },
  {
    title: "Reviews & Reputation",
    description: "Online reviews are the new word of mouth. Learn how to earn more reviews and turn your reputation into a growth engine.",
    href: null,
    available: false,
    tag: "Reviews",
  },
  {
    title: "Advertising That Gets Leads",
    description: "When to run ads, what works for local businesses, and how to make sure every dollar has a chance of coming back to you.",
    href: null,
    available: false,
    tag: "Advertising",
  },
];

export default function LearningCenter() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-900 text-white px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <BookOpen className="w-4 h-4" />
            NTA Learning Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            Learn How Local Businesses<br className="hidden sm:block" /> Get Found Now
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Practical guides from New Tech Advertising about websites, AI search, local SEO, video, social media, reviews, and lead generation.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic.title} topic={topic} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-slate-900 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-black mb-3">Want a free marketing audit?</h2>
          <p className="text-slate-400 mb-6">We'll show you exactly where your business is missing online — no cost, no pressure.</p>
          <Link
            to="/gap-audit"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Get My Free Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic }) {
  const cardContent = (
    <div className={`group h-full flex flex-col border rounded-2xl p-6 transition-all ${
      topic.available
        ? 'border-blue-200 bg-blue-50 hover:border-blue-400 hover:shadow-md cursor-pointer'
        : 'border-slate-200 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          topic.available
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-500'
        }`}>
          {topic.tag}
        </span>
        {!topic.available && (
          <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Clock className="w-3 h-3" /> Coming soon
          </span>
        )}
      </div>
      <h3 className={`font-black text-base mb-2 leading-snug flex-1 ${
        topic.available ? 'text-slate-900' : 'text-slate-500'
      }`}>
        {topic.title}
      </h3>
      <p className={`text-sm leading-relaxed ${
        topic.available ? 'text-slate-600' : 'text-slate-400'
      }`}>
        {topic.description}
      </p>
      {topic.available && (
        <div className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-bold group-hover:gap-2 transition-all">
          Read now <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (topic.available && topic.href) {
    return <Link to={topic.href}>{cardContent}</Link>;
  }

  return <div>{cardContent}</div>;
}