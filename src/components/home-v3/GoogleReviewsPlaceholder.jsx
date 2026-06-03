import React from 'react';
import { Star } from 'lucide-react';

export default function GoogleReviewsPlaceholder() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span>CLIENT TRUST & REVIEWS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            What Local Businesses Say
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Real feedback from our partners. (Live Google Reviews API Stream connecting soon).
          </p>
        </div>
        
        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex text-amber-400 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6 italic leading-relaxed">
                "Connecting live reviews feed... Placeholder text representing genuine customer feedback highlighting AI SEO and local marketing success."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  JS
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">John Smith</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">Local Contractor</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}