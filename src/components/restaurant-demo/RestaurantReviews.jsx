import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function RestaurantReviews({ config }) {
  const { reviews, rating, reviewCount, primaryColor, name } = config;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const prev = () => setIndex(i => (i === 0 ? reviews.length - 1 : i - 1));
  const next = () => setIndex(i => (i + 1) % reviews.length);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>What People Are Saying</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-2xl font-black text-slate-900">{rating}</span>
            <span className="text-slate-500 text-sm">({reviewCount} reviews on Google & Facebook)</span>
          </div>
        </div>

        {/* Desktop: all cards */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <Quote className="w-6 h-6 mb-3 text-slate-300" />
              <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900 text-sm">{r.name}</p>
                  <p className="text-slate-400 text-xs">{r.source}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(r.rating)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: single slider */}
        <div className="md:hidden mb-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <Quote className="w-6 h-6 mb-3 text-slate-300" />
            <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">&ldquo;{reviews[index].text}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-slate-900 text-sm">{reviews[index].name}</p>
                <p className="text-slate-400 text-xs">{reviews[index].source}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={next} className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}