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
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">🛡️ ADA Website Accessibility</h3>
                  <p className="text-sm text-slate-500 mb-3">Free scan + clear next steps</p>
                </div>
                <p className="text-slate-600 mb-6">
                  If you're concerned about ADA compliance, accessibility complaints, or usability issues, start here. We'll scan your site and explain what matters — clearly and calmly.
                </p>
                <Link to={createPageUrl('AdaAccessibility')}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Free ADA Scan
                  </Button>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">🧱 ADA-Friendly Website Rebuild</h3>
                  <p className="text-sm text-slate-500 mb-3">Modern, accessible, conversion-ready</p>
                </div>
                <p className="text-slate-600 mb-6">
                  If your website is outdated or difficult to use, we'll review it and recommend a rebuild designed for accessibility, clarity, and real conversions.
                </p>
                <Link to={createPageUrl('Rebuild')}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Request a Rebuild Review
                  </Button>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">📺 Local Visibility</h3>
                  <p className="text-sm text-slate-500 mb-3">Streaming TV + social presence, coordinated</p>
                </div>
                <p className="text-slate-600 mb-6">
                  Increase awareness in your local market using streaming TV and digital visibility — aligned, consistent, and easy to understand.
                </p>
                <Link to={createPageUrl('StreamingTV')}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Get Visibility Guidance
                  </Button>
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">🧭 Not Sure Where to Start?</h3>
                  <p className="text-sm text-slate-500 mb-3">We'll guide you</p>
                </div>
                <p className="text-slate-600 mb-6">
                  Answer a few questions and we'll point you in the right direction — no pressure, no guessing.
                </p>
                <Link to={createPageUrl('OnboardingStart')}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Tell Us What You Need
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

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Do I have to know what I need before starting?</h3>
                <p className="text-slate-600">No. Many clients don't. That's why we offer guided starting points and full onboarding if you're unsure.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Is ADA compliance guaranteed?</h3>
                <p className="text-slate-600">No one can guarantee compliance. Accessibility is an ongoing process. We help identify issues and guide you toward practical improvements based on recognized standards.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Do you work only with local businesses?</h3>
                <p className="text-slate-600">Yes. Everything we do is designed specifically for local and regional businesses — not enterprise platforms or one-size-fits-all solutions.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Is there a long-term contract?</h3>
                <p className="text-slate-600">No. We focus on clarity first. You move forward only if it makes sense for your business.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">What if I just want advice?</h3>
                <p className="text-slate-600">That's fine. Many people start with a scan or review and decide later. No pressure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Is For / Not For */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Who This Is For</h2>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <p className="text-lg text-slate-600 mb-6">
                New Tech Advertising is a good fit if you:
              </p>
              <div className="space-y-4">
                {[
                  'Run a local or regional business',
                  'Want clear guidance, not marketing jargon',
                  'Care about accessibility, usability, and real results',
                  'Prefer practical next steps over pressure or hype',
                  'Want to understand why something is recommended'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-slate-700 text-lg">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 mt-6 font-medium">
                We work best with business owners who value clarity, trust, and long-term results.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Who This Is Not For</h2>
            
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 mb-8">
              <p className="text-lg text-slate-600 mb-6">
                We may not be the right fit if you:
              </p>
              <div className="space-y-4">
                {[
                  'Are looking for the cheapest option',
                  'Want a "set it and forget it" solution with no involvement',
                  'Expect guaranteed rankings, instant results, or legal promises',
                  'Want aggressive sales tactics or buzzwords',
                  'Aren\'t open to guidance or collaboration'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 mt-1">
                      <span className="text-red-600 text-xl">✖️</span>
                    </div>
                    <p className="text-slate-700 text-lg">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 mt-6 font-medium">
                That's okay — not every solution fits every business.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Why This Matters</h3>
              <p className="text-lg text-slate-700 mb-2">
                We believe the best results come from clear communication and shared expectations.
              </p>
              <p className="text-lg text-slate-900 font-semibold">
                If that sounds like how you like to work, you're in the right place.
              </p>
            </div>
          </div>
        </section>

        {/* Ready to Get Started */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Ready to get started — without the overwhelm?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Link to={createPageUrl('AdaAccessibility')}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Free ADA Scan
                </Button>
              </Link>
              <Link to={createPageUrl('Rebuild')}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Request a Rebuild Review
                </Button>
              </Link>
              <Link to={createPageUrl('StreamingTV')}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Get Visibility Guidance
                </Button>
              </Link>
              <Link to={createPageUrl('OnboardingStart')}>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Tell Us What You Need
                </Button>
              </Link>
            </div>
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