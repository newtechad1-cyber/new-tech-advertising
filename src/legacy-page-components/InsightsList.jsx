import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight, BookOpen } from 'lucide-react';

import SEOHead from '@/components/shared/SEOHead';
export default function InsightsList() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.InsightPage.filter({ publish_status: 'published' }).then(p => {
      setPages(p);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <SEOHead 
        title="Marketing Insights & Articles | New Tech Advertising"
        description="AI marketing insights, tips, and articles for small businesses. Learn about local SEO, social media, and digital marketing strategies."
      />
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="text-white font-black text-lg">NTA</Link>
          <nav className="flex items-center gap-4">
            <Link to="/book-call" className="text-sm text-slate-400 hover:text-white">Book a Call</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">Insights</p>
          <h1 className="text-4xl font-black text-white leading-tight">Marketing Intelligence</h1>
          <p className="text-slate-400 mt-3 text-lg">Real-world strategies, campaigns, and growth frameworks from the NTA team.</p>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-900 rounded-2xl animate-pulse" />)}</div>
        ) : pages.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No published insights yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pages.map(page => (
              <Link key={page.id} to={`/insights/${page.slug}`}
                className="group bg-slate-900 border border-slate-800 hover:border-blue-700 rounded-2xl p-7 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">{page.headline || page.title}</h2>
                    {page.subheadline && <p className="text-slate-400 mt-2">{page.subheadline}</p>}
                    <p className="text-xs text-slate-600 mt-3 font-mono">/insights/{page.slug}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors" />
                </div>
                {page.cta_text && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <span className="text-xs font-bold text-blue-400">{page.cta_text} →</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-600 mt-20">
        © {new Date().getFullYear()} NTA · <Link to="/" className="hover:text-slate-400">Home</Link>
      </footer>
    </div>
  );
}