import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lightbulb, TrendingUp, MessageSquare, ShieldCheck, Globe } from 'lucide-react';

export default function SolutionSection() {
  const outcomes = [
    { icon: Lightbulb, title: "Understand digital visibility", desc: "Gain clarity on exactly how search engines and AI platforms view your business today." },
    { icon: TrendingUp, title: "Learn practical AI skills", desc: "Empower yourself and your team with straightforward, actionable AI training." },
    { icon: Globe, title: "Improve online presence", desc: "Ensure your business shows up accurately where your local customers are looking." },
    { icon: MessageSquare, title: "Create consistent marketing messages", desc: "Develop a reliable communication system that builds trust with your audience." },
    { icon: ShieldCheck, title: "Build long-term digital assets", desc: "Stop renting ads and start owning content that drives traffic for years to come." }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Clear Outcomes, <br />
              <span className="text-blue-400">Zero Guesswork</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400 mb-8"
            >
              We cut through the noise to deliver exactly what you need. No complicated retainers, no vanity metrics. Just practical solutions that produce real business outcomes.
            </motion.p>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-6">
            {outcomes.map((item, idx) => {
              const Icon = item.icon || CheckCircle2;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}