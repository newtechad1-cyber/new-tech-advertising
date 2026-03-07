import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Share2, Globe, Shield, Tv, MapPin, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    icon: Share2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: 'Social Media Management',
    desc: 'AI-generated posts, scheduling, and publishing across Facebook, Instagram, LinkedIn, TikTok, and more.',
    link: 'SocialMediaManagement',
    intakeLink: 'Get-Started',
    cta: 'Learn More',
  },
  {
    icon: Globe,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    title: 'Website Rebuild',
    desc: 'Modern, conversion-focused websites built for local businesses. ADA compliant, mobile-first, and SEO-ready.',
    link: 'WebsiteRebuild',
    intakeLink: 'Rebuild-Intake',
    cta: 'Learn More',
  },
  {
    icon: Shield,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    title: 'ADA Compliance',
    desc: 'Protect your business from accessibility lawsuits. We audit, fix, and certify your website for WCAG compliance.',
    link: 'AdaAccessibility',
    intakeLink: 'AdaIntake',
    cta: 'Learn More',
  },
  {
    icon: Tv,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: 'Streaming TV Ads',
    desc: 'Reach your local market on Hulu, Peacock, and Paramount+ with professionally produced streaming TV campaigns.',
    link: 'StreamingTV',
    intakeLink: 'StreamingIntake',
    cta: 'Learn More',
  },
  {
    icon: MapPin,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Local Visibility',
    desc: 'Dominate local search results, Google Business Profile, and map listings to drive foot traffic and calls.',
    link: 'LocalVisibility',
    intakeLink: 'Free-Audit',
    cta: 'Learn More',
  },
];

export default function HomeServices() {
  return (
    <section className="bg-slate-900 py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sky-400 text-sm font-semibold uppercase tracking-widest">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            Everything a small business needs to grow online
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From social media to streaming TV — NTA covers the full digital marketing stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(service => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col hover:border-slate-700 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${service.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${service.color}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-2">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{service.desc}</p>
                <div className="flex items-center gap-4">
                  <Link
                    to={createPageUrl(service.link)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    {service.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={createPageUrl(service.intakeLink)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Get Started →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}