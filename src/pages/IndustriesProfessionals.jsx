import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Shield, Briefcase, Lock, ChevronDown } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';

export default function IndustriesProfessionals() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Professional Offices (Law, Accounting, Medical)
            </h1>
            <p className="text-lg text-slate-600 mb-12">
              Build credibility, ensure accessibility compliance, and establish a modern web presence.
            </p>

            <div className="space-y-4 mb-12 text-left max-w-2xl mx-auto">
              {[
                'Credibility and clarity',
                'Accessible, modern web presence'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-lg">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/adaaccessibility">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  Start Free ADA Scan
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <a href="/local-visibility">
                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                  Local Visibility
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What Matters */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What Matters for Professional Offices</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Credibility</h3>
              <p className="text-slate-600">Your site reflects your professional standards and expertise.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Clarity</h3>
              <p className="text-slate-600">Make it obvious how clients can reach you and what you offer.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Accessibility & Trust</h3>
              <p className="text-slate-600">Ensure your site works for all clients and meets legal standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Starting Points */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Recommended Starting Points</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Primary: Free ADA Scan</h3>
                  <p className="text-slate-600 mb-4">Check if your site is accessible and compliant with legal standards.</p>
                  <a href="/adaaccessibility">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Scanned</Button>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Secondary: Local Visibility</h3>
                  <p className="text-slate-600 mb-4">Ensure potential clients can find you locally and online.</p>
                  <a href="/local-visibility">
                    <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">Learn More</Button>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Optional: Website Rebuild</h3>
                  <p className="text-slate-600 mb-4">If your site needs a complete refresh to match your professional image.</p>
                  <a href="/rebuild-intake">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">Explore</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "Do I need ongoing marketing?",
                answer: "It depends on your goals. Some offices do well with a strong foundational website. Others benefit from continuous local visibility and SEO to attract new clients. We can help you figure out what makes sense for your practice."
              },
              {
                question: "Is ADA required?",
                answer: "Yes. ADA compliance applies to all public-facing websites. Beyond legal requirements, an accessible site simply works better for everyone and builds client trust."
              },
              {
                question: "Can you rebuild instead of patching?",
                answer: "Absolutely. If your current site doesn't reflect your professional standards or has compliance issues, a full rebuild often makes more sense than incremental fixes."
              }
            ].map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50 flex items-center justify-between"
                >
                  {item.question}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-600 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not Sure Where to Start?</h2>
          <p className="text-blue-100 mb-8 text-lg">Our full onboarding walks you through all your options.</p>
          <a href="/get-started">
            <Button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg">
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