import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Shield, Globe, Tv, HelpCircle, CheckCircle } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    document.title = 'New Tech Advertising | Clear Marketing & Compliance Solutions';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Clear marketing and compliance solutions for local businesses — guided, not overwhelming.');
    }
  }, []);



  return (
    <div className="bg-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "New Tech Advertising",
          "description": "Clear marketing and compliance solutions for local businesses",
          "url": "https://newtechadvertising.com",
          "telephone": "641-420-8816",
          "email": "rick@newtechadvertising.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Mason City",
            "addressRegion": "IA",
            "addressCountry": "US"
          },
          "areaServed": ["Iowa", "Minnesota", "Mason City", "Clear Lake", "Rochester", "Des Moines", "Minneapolis"],
          "priceRange": "$$",
          "paymentAccepted": "Credit Card, Cash",
          "openingHours": "Mo-Fr 09:00-17:00"
        })}
      </script>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Clear marketing and compliance solutions for local businesses
            </h1>
            <p className="text-2xl text-slate-600 mb-8 font-medium">
              ADA accessibility, modern website rebuilds, and local visibility — guided, not overwhelming.
            </p>
            <div className="inline-block">
              <a href="#final-cta" className="text-blue-600 font-semibold text-lg mb-4 hover:text-blue-700 transition-colors cursor-pointer">
                Choose Your Starting Point ↓
              </a>
            </div>
          </div>
        </section>

        {/* Trust / Positioning Strip */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              Built for local businesses that want clarity, not chaos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-700 font-medium">ADA compliance explained in plain English</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-700 font-medium">Websites designed to convert — not just look nice</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-700 font-medium">Local visibility strategies that actually get seen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-700 font-medium">Real guidance, not a maze of upsells</p>
                </div>
              </div>
            </div>
            <p className="text-center text-slate-600 mt-8 font-medium">
              No guesswork. No overwhelm. Just smart next steps.
            </p>
          </div>
        </section>

        {/* Choose Your Starting Point */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Starting Point</h2>
              <p className="text-lg text-slate-600">Not sure where to begin? Pick the option that best fits your situation — we'll guide you from there.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">ADA Website Accessibility</h3>
                    <p className="text-sm text-slate-500 mb-3">Free scan + clear next steps</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  We help identify accessibility issues and guide you toward practical improvements based on widely recognized accessibility standards.
                </p>
                <p className="text-slate-600 mb-6">
                  Our goal is to help you reduce risk, improve usability, and make your website more accessible to all users — without confusion or panic.
                </p>
                <Link to={createPageUrl('AdaAccessibility')}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    👉 Start Free ADA Scan
                  </Button>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <Globe className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">ADA-Friendly Website Rebuild</h3>
                    <p className="text-sm text-slate-500 mb-3">Modern, accessible, conversion-ready</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  If your website is outdated or difficult to use, we'll review it and recommend a rebuild designed with accessibility, clarity, and conversions in mind.
                </p>
                <p className="text-slate-600 mb-6">
                  Our rebuilds focus on clean structure, clear messaging, accessibility-aware design, and better user experience for real customers. No templates dumped on you. No bloated features.
                </p>
                <Link to={createPageUrl('Rebuild')}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    👉 Request a Rebuild Review
                  </Button>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <Tv className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Local Visibility</h3>
                    <p className="text-sm text-slate-500 mb-3">Streaming TV + social presence, coordinated</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">
                  We help local businesses increase awareness using streaming TV advertising and coordinated digital visibility strategies.
                </p>
                <p className="text-slate-600 mb-6">
                  Instead of disconnected campaigns, we focus on reaching the right local audience, consistent messaging, clear next steps for viewers, and visibility without confusion.
                </p>
                <Link to={createPageUrl('StreamingTV')}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    👉 Get Visibility Guidance
                  </Button>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <HelpCircle className="w-8 h-8 text-orange-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Not Sure Where to Start?</h3>
                    <p className="text-sm text-slate-500 mb-3">We'll help you choose</p>
                  </div>
                </div>
                <p className="text-slate-600 mb-6">
                  If you're unsure which option is right, that's okay. Answer a few simple questions and we'll guide you to the best next step — no pressure.
                </p>
                <Link to={createPageUrl('OnboardingStart')}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    👉 Tell Us What You Need
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Choose a starting point</h3>
                <p className="text-slate-600">Pick the option that feels closest to your situation.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Get clarity</h3>
                <p className="text-slate-600">We review, scan, or assess — then explain everything in plain language.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Move forward confidently</h3>
                <p className="text-slate-600">Only proceed if it makes sense for your business.</p>
              </div>
            </div>
            <p className="text-center text-lg text-slate-600 font-medium">
              No long contracts. No confusion. No sales pressure.
            </p>
          </div>
        </section>

        {/* Why New Tech Advertising */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Why local businesses choose New Tech Advertising</h2>
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-200">We specialize in local businesses — not generic enterprise fluff</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-200">We care about compliance, conversions, and clarity</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-200">We guide you instead of overwhelming you</p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-slate-200">We explain the "why," not just the "what"</p>
              </div>
            </div>
            <p className="text-center text-xl text-slate-300 font-medium">
              You'll always know what we're doing and why it matters.
            </p>
          </div>
        </section>

        {/* Pre-CTA Message */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xl text-slate-600">
              Not sure what you need yet? That's more common than you think. We'll help you figure it out.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section id="final-cta" className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to take the next step — without the overwhelm?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Start where you're comfortable. We'll take care of the rest.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Link to={createPageUrl('AdaAccessibility')}>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Start Free ADA Scan
                </Button>
              </Link>
              <Link to={createPageUrl('Rebuild')}>
                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50">
                  Request a Rebuild Review
                </Button>
              </Link>
              <Link to={createPageUrl('StreamingTV')}>
                <Button className="w-full bg-white text-green-600 hover:bg-green-50">
                  Get Visibility Guidance
                </Button>
              </Link>
              <Link to={createPageUrl('OnboardingStart')}>
                <Button className="w-full bg-white text-orange-600 hover:bg-orange-50">
                  Tell Us What You Need
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Accessibility Statement */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Accessibility Statement</h2>
            <p className="text-slate-600 text-center max-w-3xl mx-auto">
              New Tech Advertising is committed to improving website accessibility and usability for all users. 
              We strive to follow recognized accessibility standards and best practices and continually evaluate ways to improve the user experience. 
              If you experience difficulty accessing content on this site, please contact us and we will work to assist you.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
}