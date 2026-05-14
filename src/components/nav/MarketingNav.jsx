import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/local-lead-systems',
    children: [
      { label: 'Local Lead Systems', href: '/local-lead-systems', desc: 'Full system: site + SEO + campaigns + follow-up' },
      { label: 'Website Rebuilds', href: '/website-rebuilds', desc: 'Modern sites built to rank and convert' },
      { label: 'Accessible Websites', href: '/accessible-websites', desc: 'ADA compliant, AI-ready, modern sites' },
      { label: 'SEO Pages', href: '/seo-pages-for-local-businesses', desc: 'City & service pages that drive local traffic' },
      { label: 'Seasonal Campaigns', href: '/seasonal-campaigns', desc: 'Timed marketing for peak demand' },
      { label: 'Social Media Content', href: '/social-media-content-system', desc: 'Consistent social posts done-for-you' },
      { label: 'AI Video Marketing', href: '/ai-video-marketing', desc: 'AI-produced video that builds trust' },
    ],
  },
  {
    label: 'Industries',
    href: '/hvac-marketing-north-iowa',
    children: [
      { label: 'HVAC Marketing', href: '/hvac-marketing-north-iowa', desc: 'Heating & cooling contractors in North Iowa' },
      { label: 'Contractor Marketing', href: '/contractor-marketing-north-iowa', desc: 'Home service pros & tradespeople' },
      { label: 'Small Business Marketing', href: '/small-business-marketing-north-iowa', desc: 'Local retail, care, and service businesses' },
    ],
  },
  { label: 'Our Work', href: '/our-work' },
  { label: 'Learning Center', href: '/learning-center' },
  { label: 'Free Gap Audit', href: '/gap-audit' },
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
        <Link to="/" className="flex-shrink-0">
          <img src={LOGO_URL} alt="New Tech Advertising" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map(link => (
            <div key={link.label} className="relative">
              {link.children ? (
                <button
                  onClick={e => { e.stopPropagation(); setActiveDropdown(activeDropdown === link.label ? null : link.label); }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  {link.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <a href={link.href} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors whitespace-nowrap block">
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
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <Link to="/ops" className="text-xs text-slate-500 hover:text-white transition-colors font-medium whitespace-nowrap border border-slate-800 hover:border-slate-600 px-2.5 py-1.5 rounded-lg">
            Ops →
          </Link>
          <a
            href="tel:6414208816"
            className="text-xs text-slate-400 hover:text-white transition-colors font-medium whitespace-nowrap"
          >
            641-420-8816
          </a>
          <a
            href="https://calendar.app.google/p6ieYanvwhixXxZ67"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-blue-600/20"
          >
            Book a Call
          </a>
          <Link
            to="/gap-audit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap"
          >
            Free Gap Audit
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
                          <a key={child.label} href={child.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-800">
                            <div className="text-sm font-medium text-white">{child.label}</div>
                            {child.desc && <div className="text-xs text-slate-500 mt-0.5">{child.desc}</div>}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-semibold text-white rounded-lg hover:bg-slate-800">
                    {link.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile CTAs */}
          <div className="px-4 py-6 border-t border-slate-800 space-y-3">
            <a
              href="https://calendar.app.google/p6ieYanvwhixXxZ67"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              Book a Call
            </a>
            <Link
              to="/gap-audit"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              Free Gap Audit
            </Link>
            <div className="flex gap-3">
              <Link
                to="/client/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center text-slate-400 hover:text-white text-sm py-2 border border-slate-700 rounded-lg transition-colors"
              >
                Client Login
              </Link>
              <Link
                to="/ops"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center text-slate-400 hover:text-white text-sm py-2 border border-slate-700 rounded-lg transition-colors"
              >
                Ops →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}