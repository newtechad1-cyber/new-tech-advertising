import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Grandma Wendy",
      business: "Ladybug Restaurant & The Ladybug Travels",
      quote: "I am a long-time client of New Tech Advertising and couldn't be more thrilled with the exceptional work of Rick Hesse. For the past 10 years, Rick has been an invaluable asset, helping me achieve tremendous success with my Ladybug Restaurant and now my new website, theladybugtravels.com. I could speak volumes about the expertise and dedication of the New Tech Advertising team, who have consistently delivered innovative solutions that have propelled my businesses to new heights.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    {
      name: "Michael Stevens",
      business: "Stevens Plumbing Services",
      quote: "Before working with New Tech Advertising, I was spending thousands on ads with no results. Within 3 months of using their AI-powered marketing system, my phone started ringing off the hook. Best investment I've made in my business.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Sarah Chen",
      business: "Chen's Auto Repair",
      quote: "Rick and his team completely transformed our online presence. We went from invisible on Google to the top of local search results. The automated content and videos they create for us save me hours every week, and our customer base has doubled.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      name: "David Martinez",
      business: "Martinez Law Firm",
      quote: "I was skeptical about AI marketing at first, but the results speak for themselves. Our website now converts visitors into clients, and the SEO work has brought us more quality leads than we've ever had. Worth every penny.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
      name: "Jennifer Thompson",
      business: "Bella's Boutique",
      quote: "New Tech Advertising gave my small retail shop the kind of professional marketing I thought only big companies could afford. The AI content they create is spot-on for my brand, and I'm finally seeing real ROI from my marketing budget.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop"
    },
    {
      name: "Robert Johnson",
      business: "Johnson's HVAC",
      quote: "After struggling with marketing for years, New Tech Advertising made it simple. They handle everything—website, SEO, videos, social media—and it actually works. My business has grown 40% in just 6 months.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Real Results from Real Businesses</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our Clients Are Saying
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Don't just take our word for it. See how AI-powered marketing is transforming local businesses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <div className="relative mb-6">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200" />
                <p className="text-slate-700 leading-relaxed pl-6 relative z-10">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 max-w-3xl mx-auto">
            <p className="text-2xl font-bold text-slate-900 mb-2">
              Join Hundreds of Successful Local Businesses
            </p>
            <p className="text-slate-600">
              Stop wasting money on marketing that doesn't work. Get real results with AI-powered solutions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}