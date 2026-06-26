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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Choose Your Growth Journey</h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Every business owner, organization, and learner starts from a different place.<br />
            Choose the path that best describes where you are today, and we'll guide you step-by-step.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-950 flex flex-col rounded-3xl border border-slate-800 shadow-xl overflow-hidden group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300"
          >
            <div className="p-8 flex-1">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-2">Business Owner</div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Grow My Business</h3>
              <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                Whether you're starting from scratch or looking to grow an established business, we'll help you understand where your business stands today and create a practical roadmap for long-term growth.
              </p>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <Button asChild className="w-full h-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 sm:py-6 px-4 text-base sm:text-lg font-medium shadow-lg shadow-blue-600/20 group-hover:shadow-blue-500/40 transition-all whitespace-normal">
                <Link to="/growth-conversation" className="flex items-center justify-center gap-2 text-center">
                  <span>Start My Growth Conversation™</span>
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
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
            className="bg-slate-950 flex flex-col rounded-3xl border border-slate-800 shadow-xl overflow-hidden group hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="p-8 flex-1 relative z-10">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users2 className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-2">Community Organization</div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Strengthen My Community</h3>
              <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                Help local businesses succeed by providing practical digital visibility education, business growth resources, and ongoing support through the NTA Community Partner Program.
              </p>
            </div>
            <div className="p-8 pt-0 mt-auto relative z-10">
              <Button asChild className="w-full h-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 sm:py-6 px-4 text-base sm:text-lg font-medium shadow-lg shadow-blue-600/20 group-hover:shadow-blue-500/40 transition-all whitespace-normal">
                <Link to="/community-partner" className="flex items-center justify-center gap-2 text-center">
                  <span>Explore Community Partnership™</span>
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
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
            className="bg-slate-950 flex flex-col rounded-3xl border border-slate-800 shadow-xl overflow-hidden group hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300"
          >
            <div className="p-8 flex-1">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-2">AI Learner</div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Learn AI With Confidence</h3>
              <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                Discover practical ways to use today's AI tools to save time, improve productivity, and grow your business without needing a technical background.
              </p>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <Button asChild className="w-full h-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-4 sm:py-6 px-4 text-base sm:text-lg font-medium shadow-lg shadow-blue-600/20 group-hover:shadow-blue-500/40 transition-all whitespace-normal">
                <Link to="/learning-center" className="flex items-center justify-center gap-2 text-center">
                  <span>Enter the AI Learning Center™</span>
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}