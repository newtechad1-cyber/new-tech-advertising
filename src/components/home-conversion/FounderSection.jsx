import React from 'react';
import { motion } from 'framer-motion';

export default function FounderSection() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative min-h-[300px] md:min-h-[400px] bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" 
                alt="Rick Hesse - Founder" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
            </div>
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-3">Why Work With Us</h2>
                <h3 className="text-3xl font-bold text-white mb-6">Decades of Adaptation</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Founded by Rick Hesse, New Tech Advertising brings over four decades of experience helping local businesses navigate technological shifts. From the early days of radio and print to the rise of the internet, and now the AI revolution.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  We don't just sell the latest shiny tools. We build practical systems that protect your business, elevate your reputation, and ensure you remain visible as consumer habits change. 
                </p>
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <p className="text-white font-medium">Rick Hesse</p>
                  <p className="text-slate-500 text-sm">Founder, New Tech Advertising</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}