import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingSection({ onCTAClick }) {
  const included = [
    "Professional website design",
    "Local SEO optimization",
    "AI-powered content creation",
    "High-converting videos",
    "Automated social posting",
    "Dedicated support team",
    "Monthly strategy calls",
    "Performance tracking"
  ];

  const notIncluded = [
    "Long-term contracts",
    "Setup fees",
    "Hidden charges",
    "Generic templates"
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need. One Simple Price.
          </h2>
          <p className="text-xl text-slate-300">
            Most agencies charge $2,000+ for less. We're different.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <p className="text-white/90 text-lg mb-2">Complete Marketing Solution</p>
              <p className="text-white/60 text-sm line-through mb-1">Regular Price $497.00/month</p>
              <div className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full inline-block mb-3 text-sm font-bold">
                For a Limited Time Save $200/month
              </div>
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-6xl md:text-7xl font-bold text-white">$297</span>
                <span className="text-2xl text-white/90 mb-3">/month</span>
              </div>
              <p className="text-white/80 text-sm">No contracts • Cancel anytime</p>
            </div>

            <div className="p-12">
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    What's Included
                  </h3>
                  <ul className="space-y-4">
                    {included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    What We DON'T Do
                  </h3>
                  <ul className="space-y-4">
                    {notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                <p className="text-center text-slate-700 text-lg mb-2">
                  <span className="font-bold text-slate-900">You get everything done for you</span>, so you can get back to running your business.
                </p>
                <p className="text-center text-slate-600">
                  We're here to support small business owners — not fleece them.
                </p>
              </div>

              <a 
                href="https://buy.stripe.com/28E6oI3fA4KI17j5T1fMA01" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Get Started Today for Only $297/month
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}