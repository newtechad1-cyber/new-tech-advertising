import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const navLinks = [
  { label: 'Platform', href: createPageUrl('Home') },
  { label: 'Social Media', href: createPageUrl('AiSocialMediaSmallBusiness') },
  { label: 'HVAC', href: createPageUrl('HvacMarketing') },
  { label: 'Restaurants', href: createPageUrl('RestaurantSocialMedia') },
  { label: 'ADA Compliance', href: createPageUrl('AdaWebsiteLawsuitPrevention') },
  { label: 'Streaming TV', href: createPageUrl('StreamingTV') },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* Big logo banner with nav inside */}
      <div className={`transition-all duration-200 ${scrolled ? 'bg-blue-700/98 backdrop-blur shadow-lg' : ''}`}
        style={{ background: scrolled ? undefined : 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>

        {/* Logo row */}
        <div className="max-w-6xl mx-auto px-6 pt-3 pb-1 flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
              alt="New Tech Advertising"
              style={{ height: '80px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>

          {/* Login links (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-blue-100 text-sm font-medium">{user.name || user.email}</span>
                <span className="text-blue-300">|</span>
                <button onClick={() => base44.auth.logout()} className="text-blue-100 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <button onClick={() => base44.auth.login ? base44.auth.login() : base44.auth.redirectToLogin()} className="text-blue-100 hover:text-white text-sm font-medium underline underline-offset-2 transition-colors">
                Login
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Nav row */}
        <div className="max-w-6xl mx-auto px-6 h-12 hidden lg:flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="text-blue-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-600/50 transition-colors whitespace-nowrap">{l.label}</a>
            ))}
          </nav>

          <a href={TRIAL_URL}>
            <Button className="bg-white hover:bg-blue-50 text-blue-700 font-bold px-5 h-9 whitespace-nowrap shadow">Start Free Trial</Button>
          </a>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-blue-600 px-6 py-4 space-y-3">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="block text-blue-100 hover:text-white py-1.5 text-sm font-medium" onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            {user ? (
              <div className="pt-1 border-t border-blue-600/40">
                <span className="block text-blue-200 text-sm mb-2">{user.name || user.email}</span>
                <button onClick={() => base44.auth.logout()} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-1 border-t border-blue-600/40">
                <button onClick={() => base44.auth.login ? base44.auth.login() : base44.auth.redirectToLogin()} className="text-blue-200 hover:text-white text-sm underline">Login</button>
              </div>
            )}
            <a href={TRIAL_URL} className="block">
              <Button className="w-full bg-white text-blue-700 font-bold mt-1 hover:bg-blue-50">Start Free Trial</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}