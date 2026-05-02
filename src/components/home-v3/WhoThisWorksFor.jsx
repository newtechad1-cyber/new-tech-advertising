import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const clients = [
  {
    name: 'Monson Plumbing, Heating & Excavating',
    logo: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/35bc65203_MonsonPlumbingHeatingExcavating.png',
    url: 'https://monsonplumbing.com/',
    bg: 'bg-white',
  },
  {
    name: 'Johnson Heating & Air Conditioning',
    logo: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/fa83faf2f_3Dlogo.png',
    url: 'https://johnsonheatingandac.com/',
    bg: 'bg-white',
  },
  {
    name: "Papa Everett's Pizza",
    logo: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/da2bd4a73_Pappa-Everette-pizza.jpg',
    url: 'https://pizzaclearlake.com/',
    bg: 'bg-white',
  },
  {
    name: 'Club Fitness – Fort Dodge',
    logo: 'https://media.base44.com/images/public/691f41a18de4a7f498c8f884/b88c7c084_306090828_501907041940322_3593526891402694754_n.jpg',
    url: 'https://clubfitnessfd.com/',
    bg: 'bg-black',
  },
];

const testimonials = [
  {
    name: 'Jay Monson',
    business: 'Monson Plumbing, Heating & Excavating',
    quote: null,
  },
  {
    name: 'Tony Johnson',
    business: 'Johnson Heating & AC',
    quote: null,
  },
  {
    name: 'Sandy Mark',
    business: "Papa Everett's Pizza",
    quote: null,
  },
];

function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex(i => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIndex(i => (i === testimonials.length - 1 ? 0 : i + 1));
  const t = testimonials[index];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
      <div className="min-h-[80px] mb-6">
        {t.quote ? (
          <p className="text-slate-700 text-lg leading-relaxed italic">"{t.quote}"</p>
        ) : (
          <p className="text-slate-400 italic text-base">Client feedback coming soon.</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-900 font-bold text-sm">{t.name}</p>
          <p className="text-slate-500 text-xs">{t.business}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-slate-300 hover:border-slate-500 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-xs text-slate-400">{index + 1} / {testimonials.length}</span>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-slate-300 hover:border-slate-500 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WhoThisWorksFor() {
  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Real Work With Local Businesses
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm mb-3">
            I've worked with many types of local businesses over the years — including HVAC, plumbing, excavation, restaurants, fitness businesses, and local service companies.
          </p>
          <p className="text-slate-500 leading-relaxed text-sm mb-3">
            Different businesses need different outcomes. Service businesses need calls and leads. Restaurants need customers walking in. Fitness businesses need members and inquiries.
          </p>
          <p className="text-slate-700 font-semibold text-sm">
            The goal is always the same: help people find you, understand you, and take action.
          </p>
        </div>

        {/* Client logo cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {clients.map(c => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`border border-slate-200 rounded-xl p-4 flex items-center justify-center min-h-[100px] hover:shadow-md transition-shadow ${c.bg}`}
            >
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-16 max-w-full object-contain"
              />
            </a>
          ))}
        </div>

        {/* Testimonial slider */}
        <div className="max-w-2xl mb-10">
          <TestimonialSlider />
        </div>

        {/* CTA */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-slate-600 font-medium">Want your business shown clearly online?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+16414208816"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              Call or Text 641-420-8816
            </a>
            <Link
              to="/our-work"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              See My Work
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}