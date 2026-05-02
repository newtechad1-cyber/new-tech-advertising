import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Megaphone, Video, Share2, RefreshCw, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    step: '01',
    label: 'Gap Audit',
    desc: "We look at your current site and online presence and identify where you're losing leads — usually 3–5 clear gaps we can fix.",
    href: '/gap-audit/example-hvac-mason-city',
    color: 'bg-violet-600',
    linkLabel: 'See a Sample Audit',
  },
  {
    icon: Globe,
    step: '02',
    label: 'Website Rebuild',
    desc: 'We rebuild or improve your site with the right structure, content, and conversion elements — designed specifically for local service businesses.',
    href: '/services/website-rebuilds',
    color: 'bg-blue-600',
    linkLabel: 'Website Rebuilds',
  },
  {
    icon: Search,
    step: '03',
    label: 'SEO Pages',
    desc: 'City and service-specific landing pages that target the exact searches your customers are making in your area.',
    href: '/services/website-rebuilds',
    color: 'bg-cyan-600',
    linkLabel: 'SEO Pages',
  },
  {
    icon: Megaphone,
    step: '04',
    label: 'Seasonal Campaigns',
    desc: 'Facebook and social campaigns timed to your busy seasons — spring tune-ups, fall clean-ups, winter emergency calls.',
    href: '/our-work',
    color: 'bg-orange-500',
    linkLabel: 'See Campaign Examples',
  },
  {
    icon: Share2,
    step: '05',
    label: 'Social Content',
    desc: 'Regular posts that keep your name in front of local customers — done for you so you don\'t have to think about it.',
    href: '/services/social-media-management',
    color: 'bg-pink-600',
    linkLabel: 'Social Media',
  },
  {
    icon: Video,
    step: '06',
    label: 'AI Video Marketing',
    desc: 'Short videos, reels, and YouTube content that build trust and drive traffic — created with AI to keep costs low.',
    href: '/AiSeo',
    color: 'bg-emerald-600',
    linkLabel: 'AI Video Marketing',
  },
  {
    icon: RefreshCw,
    step: '07',
    label: 'Follow-Up System',
    desc: "Automated follow-up so no lead falls through the cracks — text, email, or call reminders that work while you're on the job.",
    href: '/book-call',
    color: 'bg-slate-700',
    linkLabel: 'Learn More',
  },
];

export default function HomeLeadSystem() {
  return (
    <section className="py-20 px-6 bg-white" id="lead-system">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">The NTA Lead System</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            One System. All the Pieces.
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Most agencies sell you one thing. We build the whole system — from the first Google search to a booked job — so every piece works together.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {STEPS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${s.color} w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {s.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{s.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{s.desc}</p>
                <Link to={s.href} className="mt-4 text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1">
                  {s.linkLabel} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/rebuild-intake?source=lead-system"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-lg"
          >
            Build My Lead System <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}