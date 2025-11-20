import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection({ onCTAClick }) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">AI-Powered Marketing That Actually Works</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8"
        >
          How Smart Local Business Owners Are Using AI to Finally{' '}
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Get Results
          </span>{' '}
          From Their Ads
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-300 font-light mb-4"
        >
          Without Wasting Another Dollar
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
        >
          <Button
            size="lg"
            onClick={onCTAClick}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 group"
          >
            Get Started Risk-Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-slate-400">30-day money-back guarantee</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-slate-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>No contracts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Setup in 48 hours</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}