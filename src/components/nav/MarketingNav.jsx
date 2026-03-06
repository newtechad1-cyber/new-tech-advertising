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
      { label: 'AI Marketing Platform', href: createPageUrl('Home') },
      { label: 'Social Media Tools', href: createPageUrl('AiSocialMediaSmallBusiness') },
      { label: 'AI Video Studio', href: createPageUrl('AiVideoStudio') },
      { label: 'Content Automation', href: createPageUrl('ContentQueue') },
      { label: 'Analytics Dashboard', href: createPageUrl('Dashboard') },
    ],
  },
  {
    label: 'Services',
    links: [
      { label: 'Social Media Management', href: createPageUrl('SocialMediaManagement') },
      { label: 'Website Rebuilds', href: createPageUrl('WebsiteRebuild') },
      { label: 'ADA Compliance', href: createPageUrl('AdaWebsiteLawsuitPrevention') },
      { label: 'Streaming TV Advertising', href: createPageUrl('StreamingTV') },
      { label: 'Local Visibility', href: createPageUrl('LocalVisibility') },
    ],
  },
  {
    label: 'Industries',
    links: [
      { label: 'HVAC', href: createPageUrl('HvacMarketing') },
      { label: 'Restaurants', href: createPageUrl('RestaurantSocialMedia') },
      { label: 'Service Trades', href: createPageUrl('IndustriesServiceTrades') },
      { label: 'Professionals', href: createPageUrl('IndustriesProfessionals') },
      { label: 'Nonprofits', href: createPageUrl('IndustriesNonprofits') },
    ],
  },
  {
    label: 'Pricing',
    href: createPageUrl('Home') + '#pricing',
  },
  {
    label: 'Resources',
    links: [
      { label: 'Our Work', href: createPageUrl('OurWork') },
      { label: 'Blog', href: createPageUrl('Blog') },
      { label: 'Contact', href: createPageUrl('Contact') },
    ],
  },
];

function NavSection({ section, mobile = false }) {
  const [open, setOpen] = useState(false);

  if (section.href) {
    return (
      <a
        href={section.href}
        className={mobile
          ? "block px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 rounded-lg"
          : "hidden"}
      >
        {section.label}
      </a>
    );
  }

  if (mobile) {
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
              <a key={link.label} href={link.href} className="block px-3 py-2 text-sm text-blue-100 hover:text-white hover:bg-blue-700 rounded-md">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
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
            <a href={LOGIN_URL} className="hidden sm:block text-blue-100 hover:text-white text-sm font-medium transition-colors">
              Login
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
              <NavSection key={section.label} section={section} mobile />
            ))}
          </nav>

          {/* Bottom persistent buttons */}
          <div className="px-4 py-6 border-t border-blue-600 space-y-3 mt-4">
            <a href={TRIAL_URL} className="block" onClick={() => setOpen(false)}>
              <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold py-6 text-base shadow">
                Start 7-Day Free Trial
              </Button>
            </a>
            <a href={LOGIN_URL} className="block" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full border-white text-white hover:bg-blue-700 font-semibold py-6 text-base">
                Login
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}