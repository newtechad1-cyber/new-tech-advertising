import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FounderSection() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative min-h-[300px] md:min-h-[400px] bg-slate-800">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/c099addb0_headshot.png" 
                alt="Rick Hesse - Founder" 
                className="absolute inset-0 w-full h-full object-cover object-top mix-blend-luminosity opacity-80"
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
                <h3 className="text-3xl font-bold text-white mb-6">Proven Through Every Wave of Change</h3>
                <p className="text-slate-400 mb-4 leading-relaxed">
                  Founded by Rick Hesse, New Tech Advertising combines decades of real-world marketing experience with today's AI-powered technology.
                </p>
                <p className="text-slate-400 mb-4 leading-relaxed">
                  Rick has helped local businesses navigate every major shift in advertising—from traditional media and the early internet to search engines, social media, and now artificial intelligence.
                </p>
                <p className="text-slate-300 font-medium mb-4 leading-relaxed text-lg">
                  The tools change. The goal doesn't.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Our focus is helping local businesses stay visible, build trust, and grow consistently as technology and consumer behavior continue to evolve.
                </p>

                <blockquote className="my-8 p-6 bg-slate-950/50 border border-slate-800 border-l-4 border-l-blue-500 rounded-r-xl shadow-lg">
                  <p className="text-xl text-blue-100 font-medium italic mb-4 leading-relaxed">
                    "If you can offer me enough trust to begin, I will work to earn enough trust to continue."
                  </p>
                  <footer>
                    <span className="block text-white font-semibold">Rick Hesse</span>
                    <span className="block text-slate-400 text-sm">Founder, New Tech Advertising</span>
                  </footer>
                </blockquote>

                <p className="text-slate-400 leading-relaxed mb-6">
                  NTA relationships begin with enough trust to have an honest conversation. From there, trust is earned through listening, teaching, useful work, and visible progress.
                </p>

                <div className="mt-2 pt-6 border-t border-slate-800 flex justify-end">
                  <Button asChild variant="outline" className="bg-slate-900 border-slate-700 hover:bg-slate-800 text-white">
                    <Link to="/about">
                      Read the Full Story <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}