import React from 'react';
import { motion } from 'framer-motion';
import { Layers3, Compass, MessageCircleMore } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      icon: Layers3,
      title: 'Your marketing feels disconnected',
      desc: 'Your website, social media, customer information, advertising, and follow-up may all exist, but they are not working together as one clear system.'
    },
    {
      icon: Compass,
      title: 'It is hard to know what matters first',
      desc: 'There are too many tools, too many promises, and too many possible directions. You need a practical order of operations, not another pile of ideas.'
    },
    {
      icon: MessageCircleMore,
      title: 'Good opportunities fall through the cracks',
      desc: 'When follow-up depends on memory, scattered notes, or extra time you do not have, potential customers can disappear before a relationship begins.'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest text-blue-400 uppercase mb-3">Does this sound familiar?</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Growth gets harder when the pieces do not work together.</h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Most local businesses do not need more tools. They need clearer priorities, stronger follow-up, and a practical system that connects what they already have.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-slate-950 p-7 rounded-2xl border border-slate-800"
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
