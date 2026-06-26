import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, X, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function BrandBookSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageUrl = "https://media.base44.com/images/public/691f41a18de4a7f498c8f884/0d5eac480_NTABrandBook.png";

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
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
              <div className="p-8 md:p-12 md:w-3/5 relative z-10">
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
              
              <div className="w-full md:w-2/5 p-8 md:p-12 items-center justify-center relative z-10 md:border-l border-slate-800/50">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="relative w-full aspect-video md:aspect-[4/3] bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      <img 
                        src={imageUrl} 
                        alt="NTA Brand Book Cover" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-slate-900/80 p-3 rounded-full backdrop-blur-sm border border-slate-700">
                          <Maximize2 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                  </button>
                  <p className="text-slate-500 text-sm text-center mt-4 flex items-center justify-center gap-1.5 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => setIsModalOpen(true)}>
                    <Maximize2 className="w-3.5 h-3.5" /> Click to enlarge
                  </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors z-[101]"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-full overflow-auto rounded-2xl shadow-2xl border border-slate-800 bg-slate-900/50"
            >
              <img 
                src={imageUrl} 
                alt="NTA Brand Book Cover Expanded" 
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}