import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Rick helped us modernize the way our business looks online and made the whole process simple. The new content, videos, and website updates really fit our company and the way we work. We've already had customers mention seeing our videos and online content before calling us. I like that everything feels practical and built around getting real leads and helping customers understand our services better.",
    name: "Tony Johnson",
    company: "Johnson Heating & AC",
  },
  {
    quote: "Working with Rick has been completely different than dealing with a typical marketing company. He understands local service businesses and knows how to explain things in a way customers actually connect with. From our excavation campaigns to videos and website improvements, everything has felt personalized to our business. The visibility and branding have improved a lot, and customers are definitely noticing us more online.",
    name: "Jay Monson",
    company: "Monson Plumbing, Heating & Excavating",
  },
  {
    quote: "Rick brought a lot of fresh ideas to our marketing and helped us think beyond just posting on Facebook once in a while. The content, visuals, and promotions feel much more professional and engaging now. We really appreciate how easy he makes the process and how focused he is on helping local businesses stay visible and connected with their customers.",
    name: "Sandra Marks",
    company: "Papa Everett's Pizza",
  },
];

function TestimonialCard({ t }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm flex flex-col h-full">
      <Quote className="w-8 h-8 text-blue-500 mb-4 flex-shrink-0" />
      <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-6">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="border-t border-slate-100 pt-4">
        <p className="text-slate-900 font-bold text-sm">— {t.name}</p>
        <p className="text-slate-500 text-xs mt-0.5">{t.company}</p>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex(i => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIndex(i => (i + 1) % testimonials.length);

  const t0 = testimonials[index];
  const t1 = testimonials[(index + 1) % testimonials.length];
  const t2 = testimonials[(index + 2) % testimonials.length];

  return (
    <section className="bg-slate-50 py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">

        <div className="max-w-2xl mb-12">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">Trusted By Local Businesses</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Real Results From Local Businesses
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm">
            We help local businesses improve visibility, generate more leads, and stay connected with customers through modern marketing systems.
          </p>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-8">
          <TestimonialCard t={t0} />
          <TestimonialCard t={t1} />
          <TestimonialCard t={t2} />
        </div>

        {/* Tablet: 2 cards */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6 mb-8">
          <TestimonialCard t={t0} />
          <TestimonialCard t={t1} />
        </div>

        {/* Mobile: 1 card */}
        <div className="sm:hidden mb-8">
          <TestimonialCard t={t0} />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-500 flex items-center justify-center transition-colors bg-white"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`rounded-full transition-all ${
                  i === index ? 'w-6 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-slate-300 hover:border-slate-500 flex items-center justify-center transition-colors bg-white"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>

      </div>
    </section>
  );
}