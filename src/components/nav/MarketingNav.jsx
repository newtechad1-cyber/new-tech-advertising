import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

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
      { label: 'Restaurant Solutions', href: '/restaurants', desc: 'Growth systems for hospitality' },
    ],
  },
  {
    label: 'Learn',
    href: '/knowledge',
    children: [
      { label: 'NTA Knowledge Library', href: '/knowledge', desc: 'All educational collections' },
      { label: 'Business Foundations', href: '/knowledge/business-foundations', desc: 'Core principles of local business growth' },
      { label: 'AI Foundations', href: '/knowledge/ai-foundations', desc: 'Practical AI for small business' },
      { label: 'Growth Show', href: '/learning-center/videos', desc: 'Video insights' },
    ],
  },
  {
    label: 'Build',
    href: '/operating-system',
    children: [
      { label: 'NTA Operating System', href: '/operating-system', desc: 'Our core methodology' },
      { label: 'Visibility & Content', href: '/operating-system', desc: 'Foundation of the system' },
      { label: 'Trust & Reviews', href: '/operating-system', desc: 'Conversion accelerators' },
      { label: 'AI & Automation', href: '/operating-system', desc: 'Operational efficiency' },
    ],
  },
  {
    label: 'Resources',
    href: '/learning-center',
    children: [
      { label: 'Prompt Library', href: '/knowledge/prompts', desc: 'Ready-to-use AI prompts' },
      { label: 'Sales Conversations', href: '/knowledge/sales-conversations', desc: 'Scripts and guides' },
      { label: 'NTA Playbook', href: '/knowledge/playbook', desc: 'Standard operating procedures' },
      { label: 'Downloads & Tools', href: '/learning-center', desc: 'Templates and checklists' },
    ],
  },
  {
    label: 'About',
    href: '/why-nta',
    children: [
      { label: 'Why NTA Exists', href: '/why-nta', desc: 'Our mission and philosophy' },
      { label: 'Founder Story', href: '/i-was-early-again', desc: 'The journey of NTA' },
      { label: 'Brand Book', href: '/brand-book', desc: 'Our visual and strategic identity' },
      { label: 'Community Partners', href: '/community-partner', desc: 'Network and alliances' },
    ],
  },
  { label: 'Pricing', href: '/find-your-plan' },
  { label: 'Contact', href: '/contact' },
];

function DropdownMenu({ items, onClose }) {
  return (
    <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-100 bg-white py-2 shadow-xl">
      {items.map(item => (
        <Link
          key={item.label}
          to={item.href}
          onClick={onClose}
          className="flex flex-col px-4 py-3 transition-colors hover:bg-slate-50"
        >
          <span className="text-sm font-semibold text-slate-900">{item.label}</span>
          {item.desc && <span className="mt-0.5 text-xs text-slate-500">{item.desc}</span>}
        </Link>
      ))}
    </div>
  );
}

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const closeDropdown = () => setActiveDropdown(null);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isAdmin = user?.role === 'admin' || user?.email === 'info@newtechadvertising.com';
  const dashboardHref = isAdmin ? '/admin-dashboard' : '/client-dashboard';
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <nav
        aria-label="Main website navigation"
        className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-200 ${
          scrolled ? 'bg-slate-950/98 shadow-lg backdrop-blur' : 'bg-slate-950'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link to="/" className="flex-shrink-0" aria-label="New Tech Advertising home">
            <img src={LOGO_URL} alt="New Tech Advertising" className="h-10 w-auto" />
          </Link>

          <div className="hidden flex-1 items-center gap-0.5 xl:flex">
            {NAV_LINKS.map(link => (
              <div key={link.label} className="relative">
                {link.children ? (
                  <button
                    type="button"
                    aria-expanded={activeDropdown === link.label}
                    onClick={event => {
                      event.stopPropagation();
                      setActiveDropdown(activeDropdown === link.label ? null : link.label);
                    }}
                    className="flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                )}
                {link.children && activeDropdown === link.label && (
                  <DropdownMenu items={link.children} onClose={() => setActiveDropdown(null)} />
                )}
              </div>
            ))}
          </div>

          <div className="hidden flex-shrink-0 items-center gap-3 xl:flex">
            <a href="tel:6414208816" className="mr-2 whitespace-nowrap text-xs font-medium text-slate-400 transition-colors hover:text-white">
              641-420-8816
            </a>

            {user ? (
              <div className="mr-1 flex items-center gap-3">
                <span className="text-sm font-medium text-slate-300">{user.name || user.email}</span>
                {isAdmin && <Link to="/admin-dashboard" className="text-sm font-medium text-blue-400 hover:text-blue-300">Admin</Link>}
                <Link to={dashboardHref} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                  Dashboard
                </Link>
                <button type="button" onClick={() => base44.auth.logout()} className="text-slate-400 transition-colors hover:text-white" title="Logout">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link to="/Login" className="mr-1 whitespace-nowrap rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                Login
              </Link>
            )}

            <a href="https://calendar.app.google/p6ieYanvwhixXxZ67" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500">
              Book a Call
            </a>
            <Link to="/gap-audit" className="whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500">
              Free Gap Audit
            </Link>
            <Link to="/join-nta" className="whitespace-nowrap rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500">
              Join Our Team
            </Link>
          </div>

          <button
            type="button"
            className="p-2 text-slate-300 hover:text-white xl:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(open => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 top-16 z-40 overflow-y-auto bg-slate-950 xl:hidden">
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map(link => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={mobileExpanded === link.label}
                        onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-white hover:bg-slate-800"
                      >
                        {link.label}
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${mobileExpanded === link.label ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileExpanded === link.label && (
                        <div className="mb-1 ml-4 space-y-0.5 border-l border-slate-800 pl-3">
                          {link.children.map(child => (
                            <Link key={child.label} to={child.href} onClick={closeMobile} className="block rounded-lg px-3 py-2.5 hover:bg-slate-800">
                              <div className="text-sm font-medium text-white">{child.label}</div>
                              {child.desc && <div className="mt-0.5 text-xs text-slate-500">{child.desc}</div>}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link to={link.href} onClick={closeMobile} className="block rounded-lg px-4 py-3 text-base font-semibold text-white hover:bg-slate-800">
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-slate-800 px-4 py-6">
              <a href="https://calendar.app.google/p6ieYanvwhixXxZ67" target="_blank" rel="noopener noreferrer" onClick={closeMobile} className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-500">
                Book a Call
              </a>
              <Link to="/gap-audit" onClick={closeMobile} className="flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 font-bold text-white transition-all hover:bg-emerald-500">
                Free Gap Audit
              </Link>
              <Link to="/join-nta" onClick={closeMobile} className="flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 font-bold text-white transition-all hover:bg-violet-500">
                Join Our Team
              </Link>

              <div className="pt-2">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-center text-sm font-medium text-slate-300">{user.name || user.email}</div>
                    {isAdmin && (
                      <Link to="/admin-dashboard" onClick={closeMobile} className="flex w-full items-center justify-center rounded-lg border border-blue-800 bg-blue-900/30 py-2 text-sm text-blue-400 transition-colors hover:bg-blue-900/50">
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="flex gap-3">
                      <Link to={dashboardHref} onClick={closeMobile} className="flex flex-1 items-center justify-center rounded-lg bg-slate-800 py-2 text-sm text-white transition-colors hover:bg-slate-700">
                        Dashboard
                      </Link>
                      <button type="button" onClick={() => { closeMobile(); base44.auth.logout(); }} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 py-2 text-sm text-slate-400 transition-colors hover:text-white">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/Login" onClick={closeMobile} className="flex w-full items-center justify-center rounded-lg border border-slate-700 py-3 text-sm font-medium text-slate-300 transition-colors hover:text-white">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" aria-hidden="true" />
    </>
  );
}
