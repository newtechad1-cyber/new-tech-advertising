import React from 'react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "I wanted a local expert I could talk to directly. I didn't want to manage software or track analytics dashboards — I needed a partner who treats my company like their own and just handles the technology. Rick has done exactly that for 14 years.",
    name: "Tony Johnson",
    company: "Johnson Heating & AC, Mason City, IA",
  },
  {
    quote: "We went from barely showing up online to being the first result people see in our area. The best part is I don't have to think about any of it — everything just runs.",
    name: "Client Testimonial",
    company: "Local Service Business, North Iowa",
  },
  {
    quote: "Rick doesn't just do marketing — he builds systems that actually work for small businesses. No fluff, no dashboards I'll never use. Just results.",
    name: "Client Testimonial",
    company: "Local Service Business, North Iowa",
  },
];

function TestimonialCard({ t }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md flex flex-col h-full relative">
      <Quote className="w-10 h-10 text-blue-500/20 absolute top-6 right-6" />
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-300 text-base leading-relaxed flex-1 mb-8 relative z-10">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="border-t border-slate-800 pt-5 mt-auto">
        <p className="text-white font-bold text-base">{t.name}</p>
        <p className="text-slate-400 text-sm mt-1">{t.company}</p>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="bg-slate-950 py-24 px-6 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-slate-400 text-lg">
            Real results from real business owners in North Iowa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://www.google.com/search?q=New+Tech+Advertising+Mason+City+Iowa#lrd=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
          >
            See Our Google Reviews
          </a>
        </div>
      </div>
    </section>
  );
}