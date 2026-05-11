import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Calendar, Folder } from 'lucide-react';

export default function LCHeader({ title, subtitle, breadcrumbs, category, readTime, date }) {
  return (
    <header className="relative pt-24 pb-16 px-6 border-b border-slate-800 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.link ? (
                  <Link to={crumb.link} className="hover:text-blue-400 transition-colors whitespace-nowrap">{crumb.label}</Link>
                ) : (
                  <span className="text-slate-300 whitespace-nowrap">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-6">
          {category && (
            <div className="inline-flex items-center gap-1.5 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider text-xs">
              <Folder className="w-3.5 h-3.5" />
              {category}
            </div>
          )}
          {readTime && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4" />
              {readTime}
            </div>
          )}
          {date && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}