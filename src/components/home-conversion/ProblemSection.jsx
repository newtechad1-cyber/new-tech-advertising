import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, Target } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      icon: AlertCircle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      title: "AI Search is Replacing Google",
      desc: "Customers are asking ChatGPT and AI tools instead of searching Google. If your business isn't optimized for AI, you simply won't be found."
    },
    {
      icon: TrendingDown,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      title: "Rising Ad Costs",
      desc: "Big tech companies continue to raise the cost of advertising, making it difficult for local businesses to see a profitable return on investment."
    },
    {
      icon: Target,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      title: "Information Overload",
      desc: "There are too many tools, too many gurus, and not enough clear direction. It's overwhelming to know where to spend your limited time."
    }
  ];

  return (
    <section className="py-24 bg-slate-900 border-y border-slate-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Internet Has Changed. Are You Keeping Up?</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Traditional marketing isn't working like it used to. Local businesses are facing new challenges that make it harder than ever to stand out.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl"
              >
                <div className={`w-12 h-12 rounded-lg ${item.iconBg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}