import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users2, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PathSection() {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Choose Your Path</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Whether you run a business, lead a community organization, or just want to learn, we have a clear next step for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-950 flex flex-col rounded-2xl border border-slate-800 shadow-xl overflow-hidden group"
          >
            <div className="p-8 flex-1">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Business Owner</h3>
              <p className="text-slate-400 mb-8">
                Get a comprehensive analysis of how AI search engines and local directories view your business right now.
              </p>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/free-audit">
                  Get Visibility Audit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-950 flex flex-col rounded-2xl border border-slate-800 shadow-xl overflow-hidden group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="p-8 flex-1 relative z-10">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                <Users2 className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Community Organization</h3>
              <p className="text-slate-400 mb-8">
                Partner with us to provide digital visibility training and resources to businesses in your local area.
              </p>
            </div>
            <div className="p-8 pt-0 mt-auto relative z-10">
              <Button asChild variant="outline" className="w-full border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300">
                <Link to="/community-partner">
                  Partner Program
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-950 flex flex-col rounded-2xl border border-slate-800 shadow-xl overflow-hidden group"
          >
            <div className="p-8 flex-1">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI Learner</h3>
              <p className="text-slate-400 mb-8">
                Access our library of straightforward, practical guides to using AI tools for everyday business tasks.
              </p>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <Button asChild variant="outline" className="w-full border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-300">
                <Link to="/learning-center">
                  AI Learning Center
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}