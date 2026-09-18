import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';
const OPPORTUNITY_HREF = '/digital-growth-advisor';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Solutions',
    href: '/services',
    children: [
      { label: 'How NTA Helps', href: '/services', desc: 'A connected Digital Growth Office for your business' },
      { label: 'Case Studies', href: '/case-studies', desc: 'See how the work comes together' },
      { label: 'Free Business Gap Audit', href: '/free-audit', desc: 'Start with a practical look at your business' },
    ],
  },
  {
    label: 'Learn',
    href: '/knowledge',
    children: [
      { label: 'Knowledge Library', href: '/knowledge', desc: 'Practical lessons and ideas' },
      { label: 'Video Gallery', href: '/learning-center/videos', desc: 'Choose what you would rather watch' },
      { label: 'Free AI Education', href: '/knowledge/ai-foundations', desc: 'Understand practical AI at your own pace' },
      { label: 'The Journal', href: '/journal', desc: 'Building NTA in public each week' },
      { label: 'Growth Show', href: '/growth-show', desc: 'Business and AI conversations' },
    ],
  },
  {
    label: 'Build',
    href: '/operating-system',
    children: [
      { label: 'Digital Growth Office', href: '/operating-system', desc: 'The connected system behind your growth' },
      { label: 'Digital Growth Advisor', href: OPPORTUNITY_HREF, desc: 'Learn AI. Learn Business. Help Businesses Grow.' },
    ],
  },
  {
    label: 'More',
    href: '/why-nta',
    children: [
      { label: 'About NTA', href: '/why-nta', desc: 'Why this work matters' },
      { label: 'Pricing', href: '/find-your-plan', desc: 'See NTA’s current working price ranges' },
      { label: 'Contact & Support', href: '/contact', desc: 'Choose call, text, email, or a conversation' },
    ],
  },
];

function DropdownMenu({ items, onClose }) {
  return (
    <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-100 bg-white py-2 shadow-xl">
      {items.map((item) => (
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

  useEffect(() => {
    const closeDropdown = () => setActiveDropdown(null);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-nav-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-nav-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-nav-open');
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  const openGrowthGuide = (source) => {
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', { detail: { source } }));
  };

  return (
    <>
      <nav
        aria-label="Main website navigation"
        className="fixed inset-x-0 top-0 z-[100] h-16 isolate border-b border-slate-800 bg-slate-950/98 shadow-lg backdrop-blur"
      >
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-2 px-4 sm:px-6">
          <Link to="/" className="inline-flex min-w-0 shrink-0" aria-label="New Tech Advertising home">
            <img src={LOGO_URL} alt="New Tech Advertising" className="h-8 max-w-[155px] object-contain sm:h-10 sm:max-w-none" />
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.children ? (
                  <button
                    type="button"
                    aria-expanded={activeDropdown === link.label}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveDropdown(activeDropdown === link.label ? null : link.label);
                    }}
                    className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:text-white xl:px-3 xl:text-sm"
                  >
                    {link.label}
                    <ChevronDown className={'h-3.5 w-3.5 transition-transform ' + (activeDropdown === link.label ? 'rotate-180' : '')} />
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className="block whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:text-white xl:px-3 xl:text-sm"
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

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a href="tel:6414208816" className="hidden text-xs font-medium text-slate-400 transition-colors hover:text-white 2xl:inline">
              641-420-8816
            </a>
            <Link
              to="/free-audit"
              className="whitespace-nowrap rounded-lg border border-blue-500/50 px-3 py-2 text-sm font-semibold text-blue-200 transition-colors hover:border-blue-300 hover:bg-blue-500/10 hover:text-white"
            >
              Free Audit
            </Link>
            <button
              type="button"
              onClick={() => openGrowthGuide('main_navigation')}
              aria-label="Talk to My Office: call, text, email, or start a conversation"
              title="Call, text, email, or start a conversation"
              className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500"
            >
              Talk to My Office™
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-main-menu"
            aria-label={mobileOpen ? 'Close website menu' : 'Open website menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition-colors hover:bg-slate-900 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-main-menu" className="fixed inset-0 top-16 z-40 overflow-y-auto bg-slate-950 lg:hidden">
            <div className="space-y-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
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
                        <ChevronDown className={'h-4 w-4 text-slate-400 transition-transform ' + (mobileExpanded === link.label ? 'rotate-180' : '')} />
                      </button>
                      {mobileExpanded === link.label && (
                        <div className="mb-1 ml-4 space-y-0.5 border-l border-slate-800 pl-3">
                          {link.children.map((child) => (
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
              <Link to="/free-audit" onClick={closeMobile} className="flex w-full items-center justify-center rounded-xl border border-blue-500/50 py-3 font-bold text-blue-200 transition-colors hover:border-blue-300 hover:bg-blue-500/10 hover:text-white">
                Free Business Gap Audit
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  openGrowthGuide('mobile_navigation');
                }}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-500"
              >
                Talk to My Office™
              </button>
              <div className="flex justify-center gap-6 border-t border-slate-800 pt-4 text-sm text-slate-500">
                <a href="tel:6414208816" className="transition-colors hover:text-slate-300">641-420-8816</a>
                <Link to="/contact" className="transition-colors hover:text-slate-300" onClick={closeMobile}>Support</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" aria-hidden="true" />
    </>
  );
}
