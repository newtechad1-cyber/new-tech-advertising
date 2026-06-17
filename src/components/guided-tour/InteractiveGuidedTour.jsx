import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Map, Cpu, Zap, LineChart, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: "problem",
    title: "The End of Blind Faith",
    subtitle: "Stop guessing if your marketing works.",
    icon: <LineChart className="w-10 h-10 text-red-500 mb-4" />,
    content: "For years, local businesses have been forced to rely on 'blind faith' marketing—paying 'digital tollbooths' like lead gen sites and hoping for the best. It's time to shift from guesswork to proof. Own your digital presence instead of renting it.",
    color: "bg-red-50"
  },
  {
    id: "journey",
    title: "The Invisible Salesperson",
    subtitle: "Consumers decide before they ever call.",
    icon: <Map className="w-10 h-10 text-blue-500 mb-4" />,
    content: "The consumer journey has changed forever. People use AI Search, Voice, and Google Maps to evaluate you invisibly. If your 'invisible salesperson' (your online presence) isn't dominating local visibility, you're losing deals before you even know they exist.",
    color: "bg-blue-50"
  },
  {
    id: "ai-vs-saas",
    title: "Custom AI vs. Expensive SaaS",
    subtitle: "Why pay for 10 disconnected tools?",
    icon: <Cpu className="w-10 h-10 text-purple-500 mb-4" />,
    content: "Cookie-cutter SaaS platforms charge per-seat fees and force you to change how you work. We build custom, interconnected AI systems and automation that fit your exact operations. No monthly SaaS bloat—just smart technology built for you.",
    color: "bg-purple-50"
  },
  {
    id: "system",
    title: "The 4-Step Growth System",
    subtitle: "A connected engine for local growth.",
    icon: <Zap className="w-10 h-10 text-amber-500 mb-4" />,
    content: (
      <div className="space-y-3 mt-2 text-left text-sm text-slate-600">
        <div className="flex gap-3"><strong className="text-slate-800">1. Discovery:</strong> AI Search, Voice, & Maps dominance.</div>
        <div className="flex gap-3"><strong className="text-slate-800">2. Trust:</strong> Authority websites & authentic reviews.</div>
        <div className="flex gap-3"><strong className="text-slate-800">3. Conversion:</strong> AI chat agents & friction-free booking.</div>
        <div className="flex gap-3"><strong className="text-slate-800">4. Follow-up:</strong> Stopping budget leaks with automated SMS/Email.</div>
      </div>
    ),
    color: "bg-amber-50"
  },
  {
    id: "action",
    title: "Take the Next Step",
    subtitle: "See exactly where you stand today.",
    icon: <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />,
    content: "Ready to stop guessing and start proving your ROI? Let's analyze your current visibility or map out a custom growth system.",
    color: "bg-green-50",
    actions: true
  }
];

export default function InteractiveGuidedTour({ isOpen, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  const slide = slides[currentSlide];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col min-h-[480px]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar */}
          <div className="flex w-full h-1.5 bg-slate-100">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-full transition-colors duration-300 ${i <= currentSlide ? 'bg-blue-600' : 'bg-transparent'}`} 
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center"
              >
                <div className={`p-4 rounded-2xl mb-6 ${slide.color}`}>
                  {slide.icon}
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {slide.title}
                </h2>
                <h3 className="text-lg text-blue-600 font-medium mb-6">
                  {slide.subtitle}
                </h3>
                
                <div className="text-slate-600 leading-relaxed max-w-lg text-[15px] sm:text-base">
                  {slide.content}
                </div>

                {slide.actions && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-base rounded-xl"
                      onClick={() => { window.location.href = '/book-call'; }}
                    >
                      Book a Free Call
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 text-base rounded-xl border-slate-300 text-slate-700"
                      onClick={() => { window.location.href = '/free-audit'; }}
                    >
                      Get Free Gap Audit
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            
            <div className="text-sm font-medium text-slate-400">
              {currentSlide + 1} / {slides.length}
            </div>

            {currentSlide < slides.length - 1 ? (
              <Button
                onClick={nextSlide}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6"
              >
                Finish <CheckCircle2 className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}