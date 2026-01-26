import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';

export default function IndustriesSmallLocal() {
  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />

      {/* Section 1: Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Small Local Businesses
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Most small local businesses don't need everything — they need the right starting point. We help you choose the clearest path without pressure or long-term contracts.
          </p>
        </div>
      </section>

      {/* Section 2: Common Goals */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Common goals we hear</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              'Get more calls and inquiries',
              'Look credible and professional online',
              'Stop being invisible in search and social'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-slate-700 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Recommended Starting Points */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Recommended starting points</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <a href="/local-visibility">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg justify-center">
                Local Visibility
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="/adaaccessibility">
              <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                Free ADA Scan
              </Button>
            </a>
            <a href="/rebuild-intake">
              <Button variant="outline" className="w-full border border-slate-300 text-slate-700 hover:bg-slate-100 px-8 py-4 text-lg">
                Website Rebuild
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Section 4: What to Expect */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">What to expect</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              'Short review of your current situation',
              'Clear, plain-English recommendations',
              'No pressure and no obligation'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-slate-700 text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not sure where to start?</h2>
          <a href="/get-started">
            <Button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 text-lg">
              Full Onboarding
            </Button>
          </a>
        </div>
      </section>



      <Footer />
      <Chatbot />
    </div>
  );
}