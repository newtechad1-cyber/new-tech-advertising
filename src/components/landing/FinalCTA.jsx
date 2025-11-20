import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FinalCTA({ onCTAClick }) {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Your next customer is looking right now</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Don't Wait.{' '}
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Are You Showing Up?
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
            If you're tired of wasting money on ads, fix the real problem.
            <br />
            Let AI do what it does best — while we set it up right for you.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-10">
            <p className="text-2xl font-light text-white mb-6">
              Most agencies charge <span className="line-through text-slate-500">$2,000+</span> for less
            </p>
            <p className="text-5xl font-bold text-white mb-2">$297/month</p>
            <p className="text-slate-400">Everything included • No contracts • 30-day guarantee</p>
          </div>

          <Button
            size="lg"
            onClick={onCTAClick}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-7 text-xl rounded-xl shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 group"
          >
            Start Your Risk-Free Trial Now
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-slate-400 mt-6 text-sm">
            Setup begins within 48 hours • Cancel anytime • No questions asked
          </p>
        </motion.div>
      </div>
    </section>
  );
}