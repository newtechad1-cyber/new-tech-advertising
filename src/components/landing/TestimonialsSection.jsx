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
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/9dad16b6d_WendyLadybugpersona1.png"
    },
    {
      name: "Peter Gardner",
      business: "Psalmist Ministries",
      quote: "I have worked with Rick for many years now and have come to depend on his expertise in the field of social media marketing and web site development. Rick is a very unselfish person and has also taught me a lot about how to manage my own web site. I enjoy working with him because he cares first about the client and helping them understand how things work. I would recommend Rick for anyone wanting to grow their social media footprint and develop an effective web site.",
      rating: 5,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/2c85b69ee_PeteGardner.jpeg"
    },
    {
      name: "Tony Johnson",
      business: "Johnson Heating and Air Conditioning, LLC",
      quote: "Rick has been great to work with. I know nothing really about Social Media and he has our company heading in the right direction. Thanks for your hard work!",
      rating: 5,
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/7ea1b420b_tONYWITHOUTBACKGROUND.png"
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
                  className="w-14 h-14 rounded-full object-cover object-top ring-2 ring-blue-100"
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