import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Knowledge Library', href: '/knowledge' },
  { label: 'Free AI Education', href: '/knowledge/ai-foundations' },
  { label: 'Digital Growth Office', href: '/operating-system' },
  { label: 'How NTA Helps', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'The Journal', href: '/journal' },
  { label: 'Growth Show', href: '/growth-show' },
  { label: 'About NTA', href: '/why-nta' },
  { label: 'Account Manager Opportunity', href: '/account-manager' },
];

// This is the prospect entrance; the Core domain currently requires sign-in.
const OPPORTUNITY_HREF = '/account-manager';

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <nav
        aria-label="Main website navigation"
        className="fixed inset-x-0 top-0 z-[100] isolate border-b border-slate-800 bg-slate-950/98 shadow-lg backdrop-blur"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:px-6">
          <Link to="/" className="inline-flex min-w-0 shrink-0" aria-label="New Tech Advertising home">
            <img src={LOGO_URL} alt="New Tech Advertising" className="h-8 max-w-[155px] object-contain sm:h-10 sm:max-w-none" />
          </Link>

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <a href="tel:6414208816" className="hidden text-xs font-medium text-slate-400 transition-colors hover:text-white lg:inline">
              641-420-8816
            </a>
            <a
              href={OPPORTUNITY_HREF}
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white md:inline-flex"
            >
              NTA Opportunity
            </a>
            <Link
              to="/free-audit"
              className="hidden whitespace-nowrap rounded-lg border border-blue-500/50 px-3 py-2 text-sm font-semibold text-blue-200 transition-colors hover:border-blue-300 hover:bg-blue-500/10 hover:text-white sm:inline-flex"
            >
              Free Audit
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('nta:open-growth-guide', { detail: { source: 'main_navigation' } }))}
              aria-label="Talk to My Office: call, text, email, or start a conversation"
              title="Call, text, email, or start a conversation"
              className="hidden whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500 sm:inline-flex sm:px-4 sm:text-sm"
            >
              Talk to My Office™
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-main-menu"
              aria-label={mobileOpen ? 'Close website menu' : 'Open website menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition-colors hover:bg-slate-900 hover:text-white md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>

        <div className="hidden border-t border-slate-800/80 bg-slate-950 md:block">
          <div
            className="mx-auto flex h-11 max-w-7xl items-center gap-1 overflow-x-auto overscroll-x-contain px-3 [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden"
            aria-label="Website sections"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={OPPORTUNITY_HREF}
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-slate-900 hover:text-cyan-200 md:hidden"
            >
              NTA Opportunity
            </a>
            <Link
              to="/free-audit"
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-blue-300 transition-colors hover:bg-slate-900 hover:text-blue-200 sm:hidden"
            >
              Free Audit
            </Link>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-main-menu" className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Mobile website sections">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <a href={OPPORTUNITY_HREF} onClick={closeMobileMenu} className="block rounded-lg px-3 py-3 text-base font-medium text-cyan-300 hover:bg-slate-900">
                NTA Opportunity
              </a>
              <Link to="/free-audit" onClick={closeMobileMenu} className="block rounded-lg px-3 py-3 text-base font-medium text-blue-300 hover:bg-slate-900">
                Free Audit
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  window.dispatchEvent(new CustomEvent('nta:open-growth-guide', { detail: { source: 'mobile_navigation' } }));
                }}
                className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-left text-base font-bold text-white hover:bg-blue-500"
              >
                Talk to My Office™
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="h-16 md:h-[108px]" aria-hidden="true" />
    </>
  );
}
