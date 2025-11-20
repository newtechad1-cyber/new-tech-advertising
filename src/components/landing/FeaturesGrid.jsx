import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Video, Bot, Users, Zap } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: Zap,
      title: "Complete AI-Powered Marketing Setup",
      description: "Built specifically for small businesses that need results, not complexity"
    },
    {
      icon: Globe,
      title: "Smart Website That Converts",
      description: "Clean, professional design that turns visitors into paying customers"
    },
    {
      icon: Search,
      title: "Local SEO That Actually Works",
      description: "Finally show up when customers search for what you do"
    },
    {
      icon: Video,
      title: "High-Converting Videos",
      description: "Tell your story fast with videos that capture attention and drive action"
    },
    {
      icon: Bot,
      title: "Automated Content Creation",
      description: "Smart, AI-powered content that posts on your behalf—consistently"
    },
    {
      icon: Users,
      title: "A Team That Actually Cares",
      description: "We've been small business owners too. We get it, and we're here to help"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            We'll fix it all — here's what you get
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to finally see results from your marketing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}