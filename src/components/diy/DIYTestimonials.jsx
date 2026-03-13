import React from 'react';
import { Star } from 'lucide-react';

export default function DIYTestimonials() {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'HVAC Business Owner',
      text: 'Started with DIY, got results in the first month. The AI content tools are a game-changer.',
      rating: 5,
    },
    {
      name: 'James Rodriguez',
      role: 'Digital Marketing Manager',
      text: 'We use this for our client projects. Incredible ROI for a $99/month investment.',
      rating: 5,
    },
    {
      name: 'Maria Chen',
      role: 'Restaurant Owner',
      text: 'The social media planner saves us hours each week. Customer support is fantastic.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Customer Success Stories</h2>
          <p className="text-xl text-slate-400">See what DIY Growth System users are achieving</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-violet-600/50 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-slate-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}