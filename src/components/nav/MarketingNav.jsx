import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';
const TRIAL_URL = createPageUrl('TrialStart');
const LOGIN_URL = createPageUrl('Dashboard');

const NAV_SECTIONS = [
  {
    label: 'Platform',
    links: [
      {
        label: 'AI Marketing Platform',
        icon: '⚙️',
        desc: 'Your marketing command center. Create content, schedule posts, generate videos, and manage campaigns from one dashboard.',
        href: createPageUrl('AiMarketingPlatform'),
      },
      {
        label: 'Social Media Tools',
        icon: '📱',
        desc: 'Create and schedule posts in minutes. Generate content with AI and publish across multiple platforms automatically.',
        href: createPageUrl('AiSocialMedia'),
      },
      {
        label: 'AI Video Studio',
        icon: '🎬',
        desc: 'Turn ideas into marketing videos. Create short-form videos, ads, and promotional clips with AI scripts, images, and voice tracks.',
        href: createPageUrl('AiVideos'),
      },
      {
        label: 'Content Automation',
        icon: '🤖',
        desc: 'Never run out of content. Generate weekly marketing plans and social media posts automatically.',
        href: createPageUrl('AiMarketingPlatform'),
      },
      {
        label: 'Analytics Dashboard',
        icon: '📊',
        desc: 'See what\'s working. Track engagement, leads, and campaign performance in one place.',
        href: createPageUrl('Dashboard'),
      },
    ],
  },
  {
    label: 'Services',
    links: [
      {
        label: 'Social Media Management',
        icon: '📱',
        desc: 'DIY tools or full management. Create and schedule posts yourself or let our team run your social media for you.',
        href: createPageUrl('SocialMediaManagement'),
      },
      {
        label: 'Website Rebuilds',
        icon: '🌐',
        desc: 'Modern websites built to perform. Fast, mobile-friendly websites designed to convert visitors into customers.',
        href: createPageUrl('WebsiteRebuild'),
      },
      {
        label: 'ADA Compliance',
        icon: '♿',
        desc: 'Protect your business online. Make your website accessible and compliant with ADA accessibility standards.',
        href: createPageUrl('AdaAccessibility'),
      },
      {
        label: 'Streaming TV Advertising',
        icon: '📺',
        desc: 'Reach customers where they watch. Run targeted ads across Roku, Hulu, Fire TV, and other streaming platforms.',
        href: createPageUrl('StreamingTV'),
      },
      {
        label: 'Local Visibility',
        icon: '📍',
        desc: 'Get found in local searches. Improve rankings on Google Maps and local search results.',
        href: createPageUrl('LocalVisibility'),
      },
    ],
  },
  {
    label: 'Industries',
    links: [
      {
        label: 'HVAC Marketing',
        icon: '🔧',
        desc: 'Grow service calls and installs. Marketing tools designed for HVAC companies and home service businesses.',
        href: createPageUrl('HvacMarketing'),
      },
      {
        label: 'Restaurant Marketing',
        icon: '🍽️',
        desc: 'Keep tables full. Promotions, social media content, and video marketing designed for restaurants.',
        href: createPageUrl('RestaurantSocialMedia'),
      },
      {
        label: 'Service Trades',
        icon: '🛠️',
        desc: 'Marketing for skilled trades. Perfect for plumbers, electricians, landscapers, and contractors.',
        href: createPageUrl('IndustriesServiceTrades'),
      },
      {
        label: 'Professional Services',
        icon: '💼',
        desc: 'Build credibility and trust. Marketing tools for consultants, accountants, and service professionals.',
        href: createPageUrl('IndustriesProfessionals'),
      },
      {
        label: 'Nonprofits',
        icon: '❤️',
        desc: 'Increase awareness and donations. Content and campaigns designed for nonprofit organizations.',
        href: createPageUrl('IndustriesNonprofits'),
      },
    ],
  },
  {
    label: 'Pricing',
    pricing: true,
    plans: [
      { name: 'DIY Starter', price: '$99' },
      { name: 'DIY Pro', price: '$199' },
      { name: 'DFY Social', price: '$399' },
      { name: 'Total Reach Campaign', price: '$899' },
    ],
  },
  {
    label: 'Resources',
    links: [
      {
        label: 'Our Work',
        icon: '🖼️',
        desc: 'See how businesses use NTA. Examples of campaigns, websites, and marketing projects.',
        href: createPageUrl('OurWork'),
      },
      {
        label: 'Blog',
        icon: '📝',
        desc: 'Marketing tips for small businesses. Strategies, insights, and tools to help your business grow.',
        href: createPageUrl('Blog'),
      },
      {
        label: 'Contact',
        icon: '💬',
        desc: 'Talk with our team. Questions about the platform or services? We\'re here to help.',
        href: createPageUrl('Contact'),
      },
    ],
  },
];

function MobileNavSection({ section }) {
  const [open, setOpen] = useState(false);

  if (section.pricing) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 rounded-lg"
        >
          {section.label}
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        {open && (
          <div className="ml-4 border-l border-blue-500 pl-3 mb-1 space-y-1">
            <p className="text-blue-200 text-xs px-3 py-1">Start simple and grow when you're ready.</p>
            {section.plans.map(plan => (
              <div key={plan.name} className="flex items-center justify-between px-3 py-2 text-sm text-blue-100 rounded-md">
                <span>{plan.name}</span>
                <span className="font-bold text-white">{plan.price}</span>
              </div>
            ))}
            <a href={TRIAL_URL} className="block px-3 py-2 text-sm font-semibold text-yellow-300 hover:text-yellow-100">
              → Start Free Trial
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 rounded-lg"
      >
        {section.label}
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {open && (
        <div className="ml-4 border-l border-blue-500 pl-3 mb-1 space-y-0.5">
          {section.links.map(link => (
            <a key={link.label} href={link.href} className="flex items-start gap-2 px-3 py-2.5 rounded-md hover:bg-blue-700 group">
              <span className="text-base mt-0.5 shrink-0">{link.icon}</span>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-yellow-200">{link.label}</div>
                <div className="text-xs text-blue-200 leading-snug mt-0.5">{link.desc}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <div
        className={`transition-all duration-200 ${scrolled ? 'bg-blue-700/98 backdrop-blur shadow-lg' : ''}`}
        style={{ background: scrolled ? undefined : 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}
      >
        {/* Main header row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Hamburger */}
          <button
            className="text-white p-2 -ml-2 hover:bg-blue-600/50 rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center: Logo */}
          <Link to={createPageUrl('Home')} className="absolute left-1/2 -translate-x-1/2">
            <img
              src={LOGO_URL}
              alt="New Tech Advertising"
              style={{ height: '52px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>

          {/* Right: Login + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a href={LOGIN_URL} className="hidden sm:flex flex-col items-end text-right leading-none">
              <span className="text-blue-100 hover:text-white text-sm font-medium transition-colors">Client Login</span>
              <span className="text-blue-300 text-xs mt-0.5">Access your marketing dashboard.</span>
            </a>
            <a href={TRIAL_URL}>
              <Button className="bg-white hover:bg-blue-50 text-blue-700 font-bold px-3 sm:px-5 h-9 text-xs sm:text-sm whitespace-nowrap shadow">
                Start Free Trial
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Full-screen slide-out menu */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-blue-800 overflow-y-auto">
          {/* Menu header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-blue-600">
            <Link to={createPageUrl('Home')} onClick={() => setOpen(false)}>
              <img
                src={LOGO_URL}
                alt="New Tech Advertising"
                style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="text-white p-2 hover:bg-blue-700 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav sections */}
          <nav className="px-4 py-4 space-y-1">
            {NAV_SECTIONS.map(section => (
              <MobileNavSection key={section.label} section={section} />
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="px-4 py-6 border-t border-blue-600 mt-4">
            <div className="bg-blue-900/60 rounded-xl p-5 mb-4">
              <p className="text-white font-bold text-base mb-1">Start Your 7-Day Free Trial</p>
              <p className="text-blue-200 text-sm mb-4">Create content, schedule posts, and see how the NTA platform works for your business.</p>
              <a href={TRIAL_URL} className="block" onClick={() => setOpen(false)}>
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold py-5 text-base shadow">
                  Start Free Trial
                </Button>
              </a>
            </div>
            <a href={LOGIN_URL} className="block" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full border-white text-white hover:bg-blue-700 font-semibold py-5 text-base">
                Client Login
              </Button>
            </a>
            <p className="text-blue-300 text-xs text-center mt-2">Access your marketing dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
}