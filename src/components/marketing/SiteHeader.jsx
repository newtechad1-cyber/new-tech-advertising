import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
    <header className={`transition-all duration-200 ${scrolled ? 'bg-slate-900/95 backdrop-blur shadow-lg' : 'bg-slate-900'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={createPageUrl('Home')} className="flex items-center gap-2">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
            alt="New Tech Advertising"
            style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="text-slate-300 hover:text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap">{l.label}</a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 ml-2">
          <a href={TRIAL_URL}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 h-9 whitespace-nowrap">Start Free Trial</Button>
          </a>
        </div>

        <button className="lg:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 px-6 py-4 space-y-3">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="block text-slate-300 hover:text-white py-1.5 text-sm font-medium" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href={TRIAL_URL} className="block">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold mt-2">Start Free Trial</Button>
          </a>
        </div>
      )}
    </header>

    {/* Logo banner below sticky nav */}
    <div className="flex justify-center items-center" style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', padding: '0' }}>
      <Link to={createPageUrl('Home')}>
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png"
          alt="New Tech Advertising"
          style={{ height: '100px', width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </Link>
    </div>
    </div>
  );
}