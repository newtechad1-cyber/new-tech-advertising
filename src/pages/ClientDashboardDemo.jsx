import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Globe, Share2, Mail, Users, BarChart2,
  MonitorPlay, ArrowRight, CheckCircle,
  Zap, Star, ChevronDown, Phone
} from 'lucide-react';

const FEATURES = [
  {
    icon: Globe,
    color: 'bg-sky-500',
    title: 'Keep Your Website Fresh',
    items: [
      'Post news, specials & updates yourself',
      'Add photos and showcase your work',
      'Update your services or menu anytime',
      'No tech skills needed',
      'Changes go live instantly',
    ],
  },
  {
    icon: Share2,
    color: 'bg-pink-500',
    title: 'Social Media Made Simple',
    items: [
      'Create posts without a designer',
      'Upload photos & videos easily',
      'Schedule posts in advance',
      'AI helps write your captions',
      'Works with Facebook, Instagram & more',
    ],
  },
  {
    icon: Mail,
    color: 'bg-blue-500',
    title: 'Email Your Customers',
    items: [
      'Send promotions & announcements',
      'Automatic follow-up emails',
      'Grow your email list from your website',
      'Simple newsletter templates',
      'See who opened your emails',
    ],
  },
  {
    icon: Users,
    color: 'bg-green-500',
    title: 'Track Leads & Customers',
    items: [
      'See every new inquiry in one place',
      'Know who\'s interested and follow up',
      'Keep notes on each customer',
      'Never lose track of a hot lead',
      'Simple pipeline — no complicated CRM',
    ],
  },
  {
    icon: BarChart2,
    color: 'bg-purple-500',
    title: 'See How Your Website Is Doing',
    items: [
      'How many people visited your site',
      'Where your visitors are coming from',
      'Which pages they looked at most',
      'Easy-to-read reports — no guesswork',
      'Connected to Google Analytics',
    ],
  },
  {
    icon: MonitorPlay,
    color: 'bg-indigo-500',
    title: 'AI Tools Built Right In',
    items: [
      'AI writes social posts for you',
      'Generate promo images in seconds',
      'Create short videos from a script',
      'AI suggests content ideas',
      'Saves you hours every week',
    ],
  },
];

export default function ClientDashboardDemo() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Do I need to be tech-savvy to use this?',
      a: 'Not at all. Everything is point-and-click simple. If you can send a text message or post on Facebook, you can use this dashboard. We also set everything up for you — you just log in and go.'
    },
    {
      q: 'What does the dashboard actually look like for me?',
      a: 'You get a clean, simple portal where you can post updates to your website, submit social media content, send emails to your customers, and see how your website is performing — all from one screen.'
    },
    {
      q: 'What\'s included for $100/month?',
      a: 'Everything you see on this page — website updates, social media tools, email marketing, customer lead tracking, and analytics. It\'s like having a full marketing team in your pocket for less than you\'d spend on one Facebook ad boost.'
    },
    {
      q: 'What if I just got a new website built — does this come with it?',
      a: 'Yes! If you had your website built or rebuilt by us, the dashboard install is included free. The $100/month covers your ongoing access and tools.'
    },
    {
      q: 'What if I already have a website and want to add this?',
      a: 'No problem. We can install the dashboard onto your existing website for a one-time setup fee of $500. After that, it\'s just $100/month to keep everything running.'
    },
    {
      q: 'Do I have to do everything myself?',
      a: 'No. The dashboard gives you the option to do it yourself when you have time, or you can hand things off to us. You decide how much or how little you want to be involved.'
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-4 h-4" /> Built for Local Business Owners
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Your Website. Your Customers.<br />
            <span className="text-indigo-400">Finally, One Simple Place to Manage It All.</span>
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Whether you run an HVAC company, a restaurant, or a retail shop — keeping up with your website and social media shouldn't feel like a second job.
          </p>
          <p className="text-lg text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            This dashboard is built into your website. Post updates, send emails, manage your leads, and track your results — without ever touching code or hiring a designer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AdminDashboard')}>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 font-bold shadow-xl">
                See It Live <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" variant="outline" className="border-slate-500 text-white hover:bg-white/10 text-lg px-8 py-6 font-bold">
                <Phone className="w-5 h-5 mr-2" /> Talk to Us First
              </Button>
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-6">$100/month · Free with any new or rebuilt website</p>
        </div>
      </section>

      {/* Problem/Solution Banner */}
      <section className="py-10 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xl text-slate-800 font-semibold mb-2">
            "I got a new website — now what? I don't know how to update it, I can't keep up with social media, and I have no idea if it's even working."
          </p>
          <p className="text-slate-600">Sound familiar? That's exactly what this dashboard solves.</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What You Can Do From Your Dashboard</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Six tools, all in one place. No extra apps, no monthly subscriptions stacking up, no tech headaches.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-600 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Honest Pricing</h2>
          <p className="text-lg text-slate-600 mb-12">No surprises. No long contracts. Cancel anytime.</p>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 text-left">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">New or Rebuilt Website</p>
              <p className="text-4xl font-extrabold text-slate-900 mb-1">Free Install</p>
              <p className="text-slate-500 text-sm mb-6">+ $100/month for tools & access</p>
              <ul className="space-y-2">
                {['Dashboard installed for you', 'All 6 tools included', 'We walk you through it', 'Ongoing support available'].map(i => (
                  <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-600 border-2 border-indigo-600 rounded-2xl p-8 text-left text-white">
              <p className="text-sm font-bold text-indigo-200 uppercase tracking-wide mb-2">Add to Your Existing Website</p>
              <p className="text-4xl font-extrabold text-white mb-1">$500 Setup</p>
              <p className="text-indigo-200 text-sm mb-6">+ $100/month for tools & access</p>
              <ul className="space-y-2">
                {['We install it on your current site', 'All 6 tools included', 'We walk you through it', 'Ongoing support available'].map(i => (
                  <li key={i} className="flex items-center gap-2 text-indigo-100 text-sm">
                    <CheckCircle className="w-4 h-4 text-indigo-300 flex-shrink-0" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="text-2xl font-bold text-slate-800 mb-2">"I can finally update my own website without calling anyone."</p>
          <p className="text-slate-600">— Local business owner, HVAC company</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Questions We Hear All the Time</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Stop Struggling with Your Website?</h2>
          <p className="text-xl text-indigo-200 mb-10">See the dashboard live, or reach out and we'll walk you through it personally.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AdminDashboard')}>
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 text-lg px-8 py-6 font-bold">
                See It Live
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 font-bold">
                <Phone className="w-5 h-5 mr-2" /> Let's Talk
              </Button>
            </Link>
          </div>
          <p className="text-indigo-300 text-sm mt-6">No pressure. No jargon. Just a simple conversation.</p>
        </div>
      </section>
    </div>
  );
}