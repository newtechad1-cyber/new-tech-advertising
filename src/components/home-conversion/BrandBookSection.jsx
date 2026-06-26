import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function BrandBookSection() {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-10 md:p-12 md:w-3/5 relative z-10">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-2">Core Philosophy</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">The NTA Brand Book™</h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Discover the foundational principles that drive our approach. The NTA Brand Book™ outlines our commitment to transparency, education over fear-based marketing, and empowering local businesses to succeed in an AI-first world.
              </p>
              <Button asChild className="h-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 transition-all w-full sm:w-auto">
                <Link to="/brand-book" className="flex items-center justify-center gap-2">
                  <span>Read The Brand Book</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Link>
              </Button>
            </div>
            
            <div className="hidden md:flex w-2/5 p-12 items-center justify-center relative z-10 border-l border-slate-800/50">
                <div className="relative w-full aspect-square max-w-[280px] bg-slate-900 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-2xl" />
                    <div className="text-center p-6">
                        <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <div className="text-white font-bold text-xl mb-1">NTA</div>
                        <div className="text-blue-400 text-sm font-medium uppercase tracking-widest">Brand Book</div>
                    </div>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}