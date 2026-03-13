import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function NTANav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white text-xs font-black">NTA</span>
          </div>
          <span className={`font-black text-lg transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            Authority Platform
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Platform', 'Industries', 'Results', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className={`text-sm font-semibold transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'}`}>
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#sign-in" className={`text-sm font-semibold transition-colors ${scrolled ? 'text-slate-600' : 'text-white/80'}`}>
            Sign In
          </a>
          <a href="/book-call" className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
            Book Demo →
          </a>
        </div>

        <button onClick={() => setOpen(o => !o)} className={`md:hidden ${scrolled ? 'text-slate-800' : 'text-white'}`}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
       <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-4">
         {['Platform', 'Industries', 'Results', 'Pricing'].map(item => (
           <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}
             className="block text-sm font-semibold text-slate-700">{item}</a>
         ))}
         <a href="/book-call" className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600">
           Book Demo →
         </a>
       </div>
      )}
    </nav>
  );
}