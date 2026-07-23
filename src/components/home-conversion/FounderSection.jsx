import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FounderSection() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative min-h-[280px] md:min-h-[360px] bg-slate-800">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/c099addb0_headshot.png"
                alt="Rick Hesse, founder of New Tech Advertising"
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
                <p className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-3">Experienced guidance</p>
                <h2 className="text-3xl font-bold text-white mb-5">The tools change. The goal does not.</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  Rick Hesse has spent decades helping local businesses navigate changes in advertising, customer behavior, the internet, social media, and now artificial intelligence.
                </p>
                <p className="text-slate-400 leading-relaxed mb-7">
                  That experience helps NTA separate useful change from distraction and build practical systems around what still matters: visibility, trust, relationships, follow-up, and steady progress.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Read Rick's story <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
