import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, CheckCircle, Activity } from 'lucide-react';

export default function ProofSection() {
  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Proven Results</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Don't just take our word for it. See how we're making a measurable impact for local businesses.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Audits Completed", value: "500+", icon: Activity },
            { label: "Avg Visibility Boost", value: "150%", icon: TrendingUp },
            { label: "Marketing Hours Saved", value: "10k+", icon: CheckCircle },
            { label: "Local Businesses", value: "120+", icon: Star }
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center"
              >
                <Icon className="w-6 h-6 text-blue-400 mx-auto mb-4" />
                <h4 className="text-3xl font-bold text-white mb-2">{metric.value}</h4>
                <p className="text-sm text-slate-400">{metric.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-950 p-8 rounded-2xl border border-slate-800"
          >
            <div className="flex text-yellow-500 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-slate-300 italic mb-6">
              "The visibility audit showed us exactly where we were losing to competitors on AI searches. The changes we implemented paid for themselves within the first month."
            </p>
            <div>
              <p className="text-white font-semibold">Local Restaurant Owner</p>
              <p className="text-slate-500 text-sm">Mason City, IA</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-950 p-8 rounded-2xl border border-slate-800"
          >
            <div className="flex text-yellow-500 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-slate-300 italic mb-6">
              "Rick's approach is different. Instead of selling us another useless tool, he helped us build a system that works. The training in the AI Learning Center is incredibly practical."
            </p>
            <div>
              <p className="text-white font-semibold">Home Services Contractor</p>
              <p className="text-slate-500 text-sm">Southern Minnesota</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}