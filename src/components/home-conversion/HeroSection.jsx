import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-950 text-white">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none blur-3xl">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8"
        >
          We help local businesses get found online, build trust, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">grow consistently</span> month after month.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          We use AI as our behind-the-scenes advantage to deliver high-quality marketing faster and more affordably. First we build or fix your foundation. Then we help more people find you. Then we build trust through consistent content and reputation. As your business grows, we use AI and automation to save time and improve follow-up.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap"
        >
          <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-0">
            <Link to="/free-audit">
              <Search className="w-5 h-5 mr-2" />
              Run a Free Visibility Audit
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
            <Link to="/book-call">
              <Users className="w-5 h-5 mr-2" />
              Schedule a Discovery Call
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
            <Link to="/nta/pricing-ladder">
              <BookOpen className="w-5 h-5 mr-2" />
              Start with Foundation Launch
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}