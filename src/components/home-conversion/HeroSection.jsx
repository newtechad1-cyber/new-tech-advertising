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
          Helping Local Businesses Improve Their <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Digital Visibility</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Practical AI training, digital visibility audits, and affordable AI-powered marketing solutions that help local businesses compete in today's digital economy.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-0">
            <Link to="/free-audit">
              <Search className="w-5 h-5 mr-2" />
              Get a Free Digital Visibility Audit
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-0">
            <Link to="/learning-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Explore the NTA AI Learning Center
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-0">
            <Link to="/community-partner">
              <Users className="w-5 h-5 mr-2" />
              Become a Community Partner
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}