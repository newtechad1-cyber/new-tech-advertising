import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function RestaurantNav({ config }) {
  const { name, logo, phone, orderUrl, menuUrl, primaryColor } = config;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-slate-950/98 backdrop-blur shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{logo}</span>
          <span className={`font-black text-lg transition-colors ${scrolled ? 'text-white' : 'text-white'}`}>{name}</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {[['Menu', menuUrl], ['Specials', '#specials'], ['About', '#about'], ['Location', '#location']].map(([label, href]) => (
            <a key={label} href={href} className={`text-sm font-semibold transition-colors ${scrolled ? 'text-slate-300 hover:text-white' : 'text-white/80 hover:text-white'}`}>{label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href={`tel:${phone}`} className="text-white/70 hover:text-white text-sm font-semibold transition-colors">{phone}</a>
          <a href={orderUrl} className="text-sm font-black text-white px-4 py-2 rounded-xl transition-colors" style={{ backgroundColor: primaryColor }}>
            Order Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* NTA demo banner */}
      <div className="bg-blue-600 text-center py-1.5 px-4">
        <p className="text-white text-xs font-bold">
          📊 NTA Demo Site — <Link to="/restaurant-demo" className="underline hover:no-underline">View All Restaurant Demos</Link> · <Link to="/gap-audit" className="underline hover:no-underline">Get a Free Audit for Your Restaurant</Link>
        </p>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-6 py-4 space-y-3">
          {[['View Menu', menuUrl], ['Specials', '#specials'], ['About', '#about'], ['Location', '#location']].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMobileOpen(false)} className="block py-2 text-white font-semibold border-b border-slate-800">{label}</a>
          ))}
          <a href={orderUrl} className="block text-center font-black text-white py-3 rounded-xl mt-2" style={{ backgroundColor: primaryColor }}>Order Online</a>
        </div>
      )}
    </nav>
  );
}