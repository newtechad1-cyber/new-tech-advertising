import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Free AI Education', href: '/knowledge/ai-foundations' },
  { label: 'Digital Growth Office', href: '/operating-system' },
  { label: 'How NTA Helps', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'The Journal', href: '/journal' },
  { label: 'Growth Show', href: '/growth-show' },
  { label: 'About NTA', href: '/why-nta' },
  { label: 'Account Manager Opportunity', href: '/account-manager' },
];

export default function MarketingNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const normalizedEmail = user?.email?.toLowerCase();
  const isAdmin = user?.role === 'admin' || ['info@newtechadvertising.com', 'newtechad1@gmail.com'].includes(normalizedEmail);
  const hubHref = isAdmin
    ? 'https://app.newtechadvertising.com/admin-dashboard'
    : 'https://app.newtechadvertising.com/Login';

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
              href={hubHref}
              className="hidden items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900 hover:text-white md:inline-flex"
            >
              {isAdmin && <ShieldCheck className="h-4 w-4" />}
              {isAdmin ? 'Admin Dashboard' : 'Core Hub'}
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
              className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-500 sm:px-4 sm:text-sm"
            >
              Talk to My Office™
            </button>
            {user && (
              <button
                type="button"
                onClick={() => base44.auth.logout()}
                className="hidden rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-900 hover:text-white lg:inline-flex"
                title="Logout"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800/80 bg-slate-950">
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
              href={hubHref}
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-slate-900 hover:text-cyan-200 md:hidden"
            >
              {isAdmin ? 'Admin Dashboard' : 'Core Hub'}
            </a>
            <Link
              to="/free-audit"
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-blue-300 transition-colors hover:bg-slate-900 hover:text-blue-200 sm:hidden"
            >
              Free Audit
            </Link>
          </div>
        </div>
      </nav>

      <div className="h-[108px]" aria-hidden="true" />
    </>
  );
}
