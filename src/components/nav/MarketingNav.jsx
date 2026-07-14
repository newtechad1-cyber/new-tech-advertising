import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

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
    label: 'Solutions', 
    href: '/local-lead-systems',
    children: [
      { label: 'Local Lead Systems', href: '/local-lead-systems', desc: 'Complete growth architecture' },
      { label: 'Website Rebuilds', href: '/services/website-rebuilds', desc: 'Conversion-focused web design' },
      { label: 'Social Media Management', href: '/services/social-media-management', desc: 'Content that builds trust' },
      { label: 'AI Video Marketing', href: '/ai-video-marketing', desc: 'High-volume video production' },
      { label: 'Back-Office Solutions', href: '/back-office-solutions', desc: 'Automation for your operations' },
      { label: 'Restaurant Solutions', href: '/restaurants', desc: 'Growth systems for hospitality' }
    ]
  },
  {
    label: 'Learn',
    href: '/learning-center',
    children: [
      { label: 'NTA Knowledge Library', href: '/learning-center', desc: 'All educational collections' },
      { label: 'Business Foundations', href: '/knowledge/business-foundations', desc: 'Core principles of local business growth' },
      { label: 'AI Foundations', href: '/knowledge/ai-foundations', desc: 'Practical AI for small business' },
      { label: 'Growth Show', href: '/learning-center/videos', desc: 'Video insights' }
    ]
  },
  {
    label: 'Build',
    href: '/operating-system',
    children: [
      { label: 'NTA Operating System', href: '/operating-system', desc: 'Our core methodology' },
      { label: 'Visibility & Content', href: '/operating-system', desc: 'Foundation of the system' },
      { label: 'Trust & Reviews', href: '/operating-system', desc: 'Conversion accelerators' },
      { label: 'AI & Automation', href: '/operating-system', desc: 'Operational efficiency' }
    ]
  },
  {
    label: 'Resources',
    href: '/learning-center',
    children: [
      { label: 'Prompt Library', href: '/knowledge/prompts', desc: 'Ready-to-use AI prompts' },
      { label: 'Sales Conversations', href: '/knowledge/sales-conversations', desc: 'Scripts and guides' },
      { label: 'NTA Playbook', href: '/knowledge/playbook', desc: 'Standard operating procedures' },
      { label: 'Downloads & Tools', href: '/learning-center', desc: 'Templates and checklists' }
    ]
  },
  {
    label: 'About',
    href: '/why-nta',
    children: [
      { label: 'Why NTA Exists', href: '/why-nta', desc: 'Our mission and philosophy' },
      { label: 'Founder Story', href: '/i-was-early-again', desc: 'The journey of NTA' },
      { label: 'Brand Book', href: '/brand-book', desc: 'Our visual and strategic identity' },
      { label: 'Community Partners', href: '/community-partner', desc: 'Network and alliances' }
    ]
  },
  { label: 'Pricing', href: '/find-your-plan' },
  { label: 'Contact', href: '/contact' }
];

function DropdownMenu({ items, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
      {items.map((item, idx) => (
        <React.Fragment key={item.label}>
          {item.divider && <div className="my-2 border-t border-slate-200"></div>}
          <Link
            to={item.href}
            onClick={onClose}
            className="flex flex-col px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-semibold text-slate-900">{item.label}</span>
            {item.desc && <span className="text-xs text-slate-500 mt-0.5">{item.desc}</span>}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

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
        <div className="hidden xl:flex items-center gap-0.5 flex-1">
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
                <Link to={link.href} className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg transition-colors whitespace-nowrap block">
                  {link.label}
                </Link>
              )}
              {link.children && activeDropdown === link.label && (
                <DropdownMenu items={link.children} onClose={() => setActiveDropdown(null)} />
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden xl:flex items-center gap-3 flex-shrink-0 ml-2">
          <a href="tel:6414208816" className="text-xs text-slate-400 hover:text-white transition-colors font-medium whitespace-nowrap mr-2">
            641-420-8816
          </a>
          
          {user ? (
            <div className="flex items-center gap-3 mr-1">
              <span className="text-slate-300 text-sm font-medium">{user.name || user.email}</span>
              {(user.role === 'admin' || user.email === 'info@newtechadvertising.com') && (
                <Link to="/admin-dashboard" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Admin</Link>
              )}
              <Link to={user.role === 'admin' || user.email === 'info@newtechadvertising.com' ? '/admin-dashboard' : '/client-dashboard'} className="text-sm font-semibold border border-slate-600 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors">
                Dashboard
              </Link>
              <button onClick={() => base44.auth.logout()} className="text-slate-400 hover:text-white transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/Login" className="text-sm font-semibold border border-slate-600 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap mr-1">
              Login
            </Link>
          )}

          <a href="https://calendar.app.google/p6ieYanvwhixXxZ67" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-blue-600/20">
            Book a Call
          </a>
          <Link to="/gap-audit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap">
            Free Gap Audit
          </Link>
          <Link to="/join-nta" className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-lg shadow-violet-600/20 whitespace-nowrap">
            Join Our Team
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="xl:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 top-16 z-40 bg-slate-950 overflow-y-auto">
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
                          <Link key={child.label} to={child.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg hover:bg-slate-800">
                            <div className="text-sm font-medium text-white">{child.label}</div>
                            {child.desc && <div className="text-xs text-slate-500 mt-0.5">{child.desc}</div>}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-base font-semibold text-white rounded-lg hover:bg-slate-800">
                    {link.label}
                  </Link>
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
            <Link
              to="/join-nta"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              Join Our Team
            </Link>
            <div className="pt-2">
              {user ? (
                <div className="space-y-3">
                  <div className="text-center text-slate-300 text-sm font-medium">{user.name || user.email}</div>
                  
                  {(user.role === 'admin' || user.email === 'info@newtechadvertising.com') && (
                    <Link 
                      to="/admin-dashboard" 
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center bg-blue-900/30 text-blue-400 border border-blue-800 hover:bg-blue-900/50 text-sm py-2 rounded-lg transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="flex gap-3">
                    <Link
                      to={user.role === 'admin' || user.email === 'info@newtechadvertising.com' ? '/admin-dashboard' : '/client-dashboard'}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); base44.auth.logout(); }}
                      className="flex-1 flex items-center justify-center text-slate-400 hover:text-white border border-slate-700 text-sm py-2 rounded-lg transition-colors gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/Login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center text-slate-300 hover:text-white text-sm py-3 border border-slate-700 rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}