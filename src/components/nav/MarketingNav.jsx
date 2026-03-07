import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

// ── Canonical route map ────────────────────────────────────────────────────────
// /              → Home
// /platform      → AiMarketingPlatform
// /services      → SocialMediaManagement (hub)
// /industries    → IndustriesHub
// /pricing       → Home#pricing
// /start         → Get-Started
// /book-call     → Book-Call
// /free-audit    → Free-Audit
// /onboarding    → ClientOnboarding
// /dashboard     → Dashboard
// /admin         → AdminDashboard

const NAV_LINKS = [
  {
    label: 'Platform',
    href: createPageUrl('AiMarketingPlatform'),
    children: [
      { label: 'AI Marketing Platform', href: createPageUrl('AiMarketingPlatform'), desc: 'Your marketing command center' },
      { label: 'Social Media Tools', href: createPageUrl('AiSocialMedia'), desc: 'Create, schedule, and publish automatically' },
      { label: 'AI Video Studio', href: createPageUrl('AiVideos'), desc: 'Turn ideas into marketing videos' },
      { label: 'Analytics Dashboard', href: createPageUrl('Dashboard'), desc: 'Track reach, engagement, and performance' },
    ],
  },
  {
    label: 'Services',
    href: createPageUrl('SocialMediaManagement'),
    children: [
      { label: 'Social Media Management', href: createPageUrl('SocialMediaManagement'), desc: 'DIY or fully managed social posting' },
      { label: 'Website Rebuild', href: createPageUrl('WebsiteRebuild'), desc: 'Fast, modern, conversion-focused websites' },
      { label: 'ADA Compliance', href: createPageUrl('AdaAccessibility'), desc: 'Protect your business from lawsuits' },
      { label: 'Streaming TV Ads', href: createPageUrl('StreamingTV'), desc: 'Local ads on Hulu, Roku, Paramount+' },
      { label: 'Local Visibility', href: createPageUrl('LocalVisibility'), desc: 'Dominate Google Maps and local search' },
    ],
  },
  {
    label: 'Industries',
    href: createPageUrl('IndustriesHub'),
    children: [
      { label: 'HVAC & Home Services', href: createPageUrl('HvacMarketing'), desc: 'Grow service calls and installs' },
      { label: 'Restaurants', href: createPageUrl('RestaurantSocialMedia'), desc: 'Keep tables full year-round' },
      { label: 'Service Trades', href: createPageUrl('IndustriesServiceTrades'), desc: 'Plumbers, electricians, contractors' },
      { label: 'Professional Services', href: createPageUrl('IndustriesProfessionals'), desc: 'Consultants, legal, accounting' },
      { label: 'Nonprofits', href: createPageUrl('IndustriesNonprofits'), desc: 'Awareness and donor campaigns' },
    ],
  },
  {
    label: 'Pricing',
    href: createPageUrl('Home') + '#pricing',
  },
];

function DropdownMenu({ items, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
      {items.map(item => (
        <a
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="flex flex-col px-4 py-3 hover:bg-slate-50 transition-colors"
        >
          <span className="text-sm font-semibold text-slate-900">{item.label}</span>
          {item.desc && <span className="text-xs text-slate-500 mt-0.5">{item.desc}</span>}
        </a>
      ))}
    </div>
  );
}

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setActiveDropdown(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-slate-950/98 backdrop-blur shadow-lg' : 'bg-slate-950'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to={createPageUrl('Home')} className="flex-shrink-0">
          <img src={LOGO_URL} alt="New Tech Advertising" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(link => (
            <div key={link.label} className="relative">
              {link.children ? (
                <button
                  onClick={e => { e.stopPropagation(); setActiveDropdown(activeDropdown === link.label ? null : link.label); }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  {link.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <a href={link.href} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors">
                  {link.label}
                </a>
              )}
              {link.children && activeDropdown === link.label && (
                <DropdownMenu items={link.children} onClose={() => setActiveDropdown(null)} />
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link to={createPageUrl('Dashboard')} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
            Client Login
          </Link>
          <Link to={createPageUrl('Admin')} className="text-xs text-slate-600 hover:text-slate-400 transition-colors font-medium">
            Admin
          </Link>
          <Link
            to={createPageUrl('Book-Call')}
            className="text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg transition-colors"
          >
            Book a Call
          </Link>
          <Link
            to={createPageUrl('Get-Started')}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all shadow-lg shadow-violet-600/20"
          >
            Start Free Trial
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="lg:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-slate-950 overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-white rounded-lg hover:bg-slate-800"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileExpanded === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileExpanded === link.label && (
                      <div className="ml-4 border-l border-slate-800 pl-3 space-y-0.5 mb-1">
                        {link.children.map(child => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2.5 rounded-lg hover:bg-slate-800"
                          >
                            <div className="text-sm font-medium text-white">{child.label}</div>
                            {child.desc && <div className="text-xs text-slate-500 mt-0.5">{child.desc}</div>}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-base font-semibold text-white rounded-lg hover:bg-slate-800"
                  >
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile CTAs */}
          <div className="px-4 py-6 border-t border-slate-800 space-y-3">
            <Link
              to={createPageUrl('Get-Started')}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to={createPageUrl('Book-Call')}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Book a Strategy Call
            </Link>
            <Link
              to={createPageUrl('Dashboard')}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full text-slate-400 hover:text-white text-sm py-2 transition-colors"
            >
              Client Login →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}