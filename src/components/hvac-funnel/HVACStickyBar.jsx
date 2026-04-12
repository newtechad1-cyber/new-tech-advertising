import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HVACStickyBar({ href, label = 'Continue →' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-700 shadow-2xl border-t border-blue-600 px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-white text-sm font-semibold hidden sm:block">NTA HVAC Growth System — Limited Spots Available</p>
      <Link to={href}
        className="ml-auto flex items-center gap-2 bg-white text-blue-700 font-black px-5 py-2.5 rounded-xl text-sm whitespace-nowrap hover:bg-blue-50 transition-colors shadow-lg">
        {label} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}