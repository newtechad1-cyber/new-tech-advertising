import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, MessageSquare } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      icon: TrendingDown,
      text: "You've run ads and seen no return"
    },
    {
      icon: MessageSquare,
      text: "Been told to 'just post more on social'"
    },
    {
      icon: AlertCircle,
      text: "Feel like you're working too hard for too little"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            If you feel like you're spinning your wheels...
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            If you've been told to "try another platform" — <strong>stop</strong>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200"
              >
                <Icon className="w-8 h-8 text-slate-400 mb-4" />
                <p className="text-slate-700 font-medium">{problem.text}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center"
        >
          <p className="text-2xl md:text-3xl text-white font-light mb-4">
            The problem isn't you.
          </p>
          <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
            It's the setup.
          </p>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Your website isn't built to convert. Your SEO doesn't show up. Your message is invisible.
            <br />
            <span className="text-orange-400 font-semibold mt-2 inline-block">
              But that changes now.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}