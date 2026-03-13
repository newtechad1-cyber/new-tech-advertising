import React from 'react';

export default function NTAFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">NTA</span>
              </div>
              <span className="text-white font-black">Authority Platform</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-driven local market authority system for growth-focused businesses.
            </p>
          </div>

          {[
            { title: 'Platform', links: ['Content Engine', 'Streaming TV', 'SEO System', 'ROI Dashboard'] },
            { title: 'Industries', links: ['HVAC', 'Roofing', 'Plumbing', 'All Industries'] },
            { title: 'Company', links: ['About NTA', 'Client Results', 'Book Demo', 'Contact'] },
          ].map((col, i) => (
            <div key={i}>
              <p className="text-white text-sm font-black mb-4">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2026 NTA Authority Platform. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" className="text-slate-600 text-sm hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}