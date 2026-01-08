import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';

export default function AdaThankYou() {
  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 via-blue-50 to-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              You're All Set! 🎉
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Thank you for completing your onboarding. We'll start your ADA accessibility remediation within 24 hours.
            </p>

            <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 mb-8 text-left">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                What Happens Next
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Initial Review (Today)</h3>
                    <p className="text-slate-600">We'll analyze your website and confirm priority pages.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Begin Remediation (24-48 hours)</h3>
                    <p className="text-slate-600">Start fixing accessibility issues based on WCAG guidelines.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Verification Review (1-2 weeks)</h3>
                    <p className="text-slate-600">Complete testing and provide your accessibility report.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="text-slate-700">
                📧 Check your email for confirmation and next steps<br />
                📱 Text or call Rick anytime at <a href="tel:641-420-8816" className="text-blue-600 font-semibold hover:underline">641-420-8816</a>
              </p>
            </div>

            <Link to={createPageUrl('Home')}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                Return to Home
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}