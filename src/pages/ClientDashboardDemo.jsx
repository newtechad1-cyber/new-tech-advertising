import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Globe, Share2, Mail, Users, BarChart2, BookOpen,
  ShoppingBag, Image, Video, RefreshCw, StickyNote,
  Briefcase, MonitorPlay, ArrowRight, CheckCircle,
  Zap, Star, ChevronDown
} from 'lucide-react';

const FEATURES = [
  {
    icon: Globe,
    color: 'bg-sky-500',
    title: 'Website Management',
    items: ['Blog creation & management', 'Portfolio showcase', 'Product/store management', 'Ebook writing tools', 'Notes & ideas workspace'],
  },
  {
    icon: Share2,
    color: 'bg-pink-500',
    title: 'Social Media Studio',
    items: ['AI Video Studio', 'Image & media library', 'Video asset management', 'Content scheduling queue', 'Social post creation'],
  },
  {
    icon: Mail,
    color: 'bg-blue-500',
    title: 'Email Marketing',
    items: ['Email broadcast campaigns', 'Automated autoresponders', 'Subscriber list management', 'Campaign analytics', 'Template library'],
  },
  {
    icon: Users,
    color: 'bg-green-500',
    title: 'Client & Lead CRM',
    items: ['Lead pipeline management', 'Client profile tracking', 'Activity & interaction logs', 'Status-based workflows', 'Notes per client'],
  },
  {
    icon: BarChart2,
    color: 'bg-purple-500',
    title: 'Analytics & Reporting',
    items: ['Google Analytics integration', 'Website traffic overview', 'Top pages & sources', 'Client-facing reports', 'Performance snapshots'],
  },
  {
    icon: MonitorPlay,
    color: 'bg-indigo-500',
    title: 'AI-Powered Tools',
    items: ['AI video generation from scripts', 'AI ebook chapter writing', 'AI image creation', 'AI content suggestions', 'Lead scoring'],
  },
];

export default function ClientDashboardDemo() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'Is this white-labeled for my clients?', a: 'Yes. The dashboard can be branded for your agency and offered as an add-on to your clients\' website packages.' },
    { q: 'What does the client actually see?', a: 'Clients get a clean portal where they can submit content, view projects, track proposals, manage their marketing, and communicate with your team.' },
    { q: 'How does the admin dashboard work?', a: 'You get a full backend hub to manage all clients, leads, content, social media, email campaigns, and analytics from one place.' },
    { q: 'Can I add this to existing client websites?', a: 'Absolutely. This is designed as an add-on service you offer to your existing or new clients as part of a monthly retainer.' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-4 h-4" /> Website Add-On Service
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Give Every Client a<br />
            <span className="text-indigo-400">Powerful Marketing Hub</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            A fully-loaded client dashboard you can offer as an add-on to any website. Includes CRM, email marketing, social media studio, AI tools, and more — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AdminDashboard')}>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 font-bold shadow-xl">
                See the Admin Hub <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" variant="outline" className="border-slate-500 text-white hover:bg-white/10 text-lg px-8 py-6 font-bold">
                See the Client View
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything Included</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Six powerful modules, all managed from a single dashboard — for you and your clients.</p>
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

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-14">How It Works as an Add-On</h2>
          <div className="space-y-8">
            {[
              { n: '1', title: 'You offer it as a monthly add-on', desc: 'Bundle the dashboard with any website package you deliver. Set your own price — we recommend positioning it as a $99–$299/mo management hub.' },
              { n: '2', title: 'We set it up for your client', desc: 'The dashboard is configured for your client\'s business — branding, CRM, email, and content tools ready to go.' },
              { n: '3', title: 'Clients log in and get to work', desc: 'They submit content, view project status, communicate with your team, and track their marketing — all without needing to call you for every update.' },
              { n: '4', title: 'You manage everything from the Admin Hub', desc: 'Monitor all clients, manage leads, schedule content, run email campaigns, and generate reports from your central admin dashboard.' },
            ].map((step) => (
              <div key={step.n} className="flex gap-6 items-start">
                <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {step.n}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="text-2xl font-bold text-slate-800 mb-2">"Our clients love having everything in one place."</p>
          <p className="text-slate-600">The dashboard pays for itself in the first month by reducing back-and-forth emails and support calls.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to See It In Action?</h2>
          <p className="text-xl text-indigo-200 mb-10">Explore both the Admin Hub and the Client View — live demos, no login required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AdminDashboard')}>
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 text-lg px-8 py-6 font-bold">
                Explore Admin Hub
              </Button>
            </Link>
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 font-bold">
                Explore Client View
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}