import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle } from 'lucide-react';

export default function GuaranteeSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            No Contracts. No Lock-In.
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            You're never locked into a contract. Cancel anytime with no penalties or fees. We earn your business every single month.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-6"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Month-to-Month</h3>
            <p className="text-slate-600 text-sm">
              Pay only for the months you use. No annual commitments required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-6"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Cancel Anytime</h3>
            <p className="text-slate-600 text-sm">
              Not working out? Just let us know. No penalties or fees.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-6"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Your Choice</h3>
            <p className="text-slate-600 text-sm">
              You're in control. Stay as long as it makes sense for your business.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}