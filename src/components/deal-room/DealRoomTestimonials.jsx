import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'John Smith',
    company: 'Smith HVAC',
    quote: 'NTA increased our leads by 340% in 6 months. The strategy and execution are exceptional.',
    stars: 5,
  },
  {
    name: 'Sarah Johnson',
    company: 'Bright Dental',
    quote: 'Our market authority went from invisible to top 3 in our area. Best decision we made.',
    stars: 5,
  },
  {
    name: 'Mike Chen',
    company: 'Elite Plumbing',
    quote: 'The ROI from month 4 onward was extraordinary. Clear system, clear results.',
    stars: 5,
  },
];

export default function DealRoomTestimonials() {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 p-8">
      <h2 className="text-2xl font-bold text-white mb-8">Why Companies Choose NTA</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            {/* Stars */}
            <div className="flex gap-1 mb-3">
              {Array.from({ length: testimonial.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-slate-300 mb-4">"{testimonial.quote}"</p>

            {/* Author */}
            <div>
              <p className="font-semibold text-white text-sm">{testimonial.name}</p>
              <p className="text-xs text-slate-400">{testimonial.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}