import React from 'react';
import { Link } from 'react-router-dom';

export default function RestFooter() {
  return (
    <footer className="bg-slate-950 py-12 px-6 border-t border-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} New Tech Advertising
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">Main Site</Link>
          <Link to="/local-lead-systems" className="text-sm text-slate-400 hover:text-white transition-colors">Marketing Solutions</Link>
          <Link to="/back-office-solutions" className="text-sm text-slate-400 hover:text-white transition-colors">Back-Office Solutions</Link>
          <Link to="/book-call" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}