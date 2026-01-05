import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../../utils';

export default function AdaComplianceSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-semibold text-blue-300">Website Accessibility</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Is Your Website <span className="text-blue-400">ADA Compliant</span>?
            </h2>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Most websites weren't built with accessibility in mind. We help Mason City and North Iowa businesses 
              understand their website accessibility, fix issues that matter, and stay compliant — without legal jargon or pressure.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Plain-English accessibility audits',
                'Practical remediation options',
                'Ongoing monitoring available',
                'Nonprofit-friendly pricing'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-slate-200 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>

            <Link to={createPageUrl('AdaAccessibility')}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group">
                Learn About ADA Compliance
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">ADA Website Audit</p>
                    <p className="text-slate-400 text-sm">Clear report with prioritized fixes</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {['Starter — One-Time Fix', 'Growth — Fix + Monitoring', 'Authority — Full Oversight'].map((tier, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors"
                    >
                      <p className="text-white font-medium">{tier}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-500/10 rounded-lg border border-green-400/20">
                  <p className="text-green-400 font-medium text-sm">
                    ✓ Nonprofit pricing available
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}