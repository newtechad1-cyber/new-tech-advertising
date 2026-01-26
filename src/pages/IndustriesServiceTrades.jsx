import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, MapPin, Star, Phone } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';

export default function IndustriesServiceTrades() {
  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => {}} />

      <section className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Service Trades (HVAC, Plumbing, Electrical)
            </h1>
            <p className="text-lg text-slate-600 mb-12">
              Win more jobs in your service area and build lasting customer trust.
            </p>

            <div className="space-y-4 mb-12 text-left max-w-2xl mx-auto">
              {[
                'Win in your service area',
                'Stay visible and trusted'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-lg">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/local-visibility">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  Local Visibility
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <a href="/rebuild-intake">
                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
                  Website Rebuild
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What Matters */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What Matters in Service Trades</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Service Area Visibility</h3>
              <p className="text-slate-600">Show up when customers search for your services in your area.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Trust + Reviews</h3>
              <p className="text-slate-600">Build credibility through customer reviews and testimonials.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fast Contact Options</h3>
              <p className="text-slate-600">Make it easy for customers to call, text, or message you.</p>
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
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Primary: Local Visibility</h3>
                  <p className="text-slate-600 mb-4">Get found in your service area with streaming TV, social media, and local SEO.</p>
                  <a href="/local-visibility">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Learn More</Button>
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
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Secondary: Website Rebuild</h3>
                  <p className="text-slate-600 mb-4">Update your online presence with a modern, mobile-friendly site.</p>
                  <a href="/rebuild-intake">
                    <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">Explore</Button>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Optional: Free ADA Scan</h3>
                  <p className="text-slate-600 mb-4">Check accessibility and compliance—no cost to scan.</p>
                  <a href="/adaaccessibility">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">Get Scanned</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Callout Box */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 p-8 rounded-lg">
            <p className="text-lg text-slate-900 font-semibold">
              Consistency matters more than a big budget.
            </p>
            <p className="text-slate-600 mt-2">
              Regular visibility, steady customer communication, and trustworthy reviews compound over time. Small, consistent efforts win more jobs than sporadic expensive campaigns.
            </p>
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