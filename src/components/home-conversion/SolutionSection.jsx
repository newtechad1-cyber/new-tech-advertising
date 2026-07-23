import React from 'react';
import { motion } from 'framer-motion';
import { Route, SearchCheck, RefreshCcw } from 'lucide-react';

export default function SolutionSection() {
  const outcomes = [
    {
      icon: Route,
      title: 'A clear growth roadmap',
      desc: 'Know what needs attention now, what can wait, and how each improvement supports the larger business.'
    },
    {
      icon: SearchCheck,
      title: 'A stronger customer path',
      desc: 'Make it easier for the right people to find you, understand your value, trust your business, and take the next step.'
    },
    {
      icon: RefreshCcw,
      title: 'A system that improves over time',
      desc: 'Connect content, follow-up, customer relationships, and practical automation so progress does not depend on starting over every month.'
    }
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-3">What changes</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">You gain clarity, consistency, and a better path forward.</h2>
          <p className="text-lg text-slate-400">
            The goal is not to add more activity. It is to make the important parts of your business work together in a way you can understand and sustain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
