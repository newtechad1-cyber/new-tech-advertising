import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import Chatbot from '../components/Chatbot';
import TrialSignupModal from '../components/trial/TrialSignupModal';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { CheckCircle, X } from 'lucide-react';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);

  useEffect(() => {
    document.title = 'New Tech Advertising | Help for Local Business Owners';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get more customers without getting overwhelmed. Simple tools or done-for-you help for local businesses.');
    }
  }, []);

  return (
    <div className="bg-white">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "New Tech Advertising",
          "description": "Marketing help for local businesses",
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
        <section
          className="py-28 relative"
          style={{
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/e6414dd7d_backgroundimage.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-block bg-blue-500/30 text-blue-100 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide border border-blue-400/40">
              Homegrown Values. Nationwide Reach.
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Get More Prospects, Clients or Customers Without Getting Overwhelmed
            </h1>
            <p className="text-xl text-slate-200 mb-4 leading-relaxed">
              You're busy running your business. You don't have time to figure out marketing on your own — and even if you did, AI has completely changed the rules. What worked even a year ago is already outdated.
            </p>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              We help local business owners like you show up online, look trustworthy, and reach more customers — without confusing jargon or wasted money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
              <Button onClick={() => setShowTrialModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 font-bold shadow-lg">
                Start My 7-Day Free Trial
              </Button>
              <a href="#choose-path" className="inline-flex items-center justify-center text-white font-semibold text-lg hover:text-blue-300 transition-colors cursor-pointer">
                See What We Do ↓
              </a>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              This is for you if:
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700">You're a local business owner who needs more customers</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700">You don't have time to learn marketing</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700">Your website feels outdated or isn't working</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700">You want to be found online but don't know where to start</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700">You've been told your website has problems you don't understand</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-slate-700">You're tired of wasting money on things that don't work</p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <p className="text-lg text-slate-700 font-semibold mb-6">
                You don't need to understand marketing.<br />
                We explain everything in plain language.
              </p>
              <Button onClick={() => setShowTrialModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 font-bold shadow-md">
                Start My 7-Day Free Trial
              </Button>
            </div>
          </div>
        </section>

        {/* Two Paths */}
        <section id="choose-path" className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose How You Want to Work</h2>
              <p className="text-lg text-slate-600">Two paths. You decide what fits.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-blue-200">
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
                    <span className="text-sm font-bold text-blue-900">Do It Yourself</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Simple Tools You Control
                  </h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">Easy-to-use tools for social media</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">Schedule posts ahead of time</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">Templates to make it faster</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">You set it up when you have time</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
                  <p className="text-2xl font-bold text-blue-900 mb-1">7-Day Free Trial</p>
                  <p className="text-sm text-slate-600">No credit card needed</p>
                </div>

                <a href="https://ntaaffiliates.com" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6 font-bold">
                    Start My 7-Day Free Trial
                  </Button>
                </a>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-purple-200">
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-2 bg-purple-100 rounded-full mb-4">
                    <span className="text-sm font-bold text-purple-900">Done For You</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    We Handle Everything
                  </h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">Website fixes or rebuilds</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">Social media posts created and scheduled</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">Local TV and video ads</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">You review and approve, we do the work</p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 mb-6 text-center">
                  <p className="text-lg font-semibold text-purple-900 mb-1">We'll explain pricing</p>
                  <p className="text-sm text-slate-600">After we understand what you need</p>
                </div>

                <Button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
                >
                  How We Support Your Business
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border-2 border-slate-200 text-center">
              <p className="text-lg text-slate-700 mb-2">
                <strong>Not sure which path to choose?</strong>
              </p>
              <p className="text-slate-600">
                That's okay. Tell us what you need and we'll point you in the right direction.
              </p>
              <a href="https://ntaaffiliates.com" target="_blank" rel="noopener noreferrer">
                <Button className="mt-6 bg-orange-600 hover:bg-orange-700">
                  Tell Us What You Need
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* What We Help With */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">What We Help With</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">🌐 Being Found Online</h3>
                <p className="text-slate-700">
                  Fix your website so people can find you on Google. Make it work on phones. Show up when people search for what you do.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">✅ Looking Trustworthy</h3>
                <p className="text-slate-700">
                  Make sure your website looks professional and loads fast. Fix problems that make you look outdated or unreliable.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">💬 Social Media Posts</h3>
                <p className="text-slate-700">
                  Keep your Facebook, Instagram, or LinkedIn active without spending hours on it. Either use simple tools or let us handle it.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">📺 Local TV Ads</h3>
                <p className="text-slate-700">
                  Get your business in front of people watching streaming TV. Costs less than you think, and you don't need a big production.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">🛡️ Website Problems</h3>
                <p className="text-slate-700">
                  Fix issues with your website that could cause legal trouble or make customers leave. We explain what's wrong and how to fix it.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">⏰ Saving Time</h3>
                <p className="text-slate-700">
                  Stop wasting time on marketing you don't understand. Use simple tools or hand it off completely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Awareness vs Short-Term Marketing */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How This Kind of Marketing Actually Works</h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Before we talk about strategy, it helps to understand the difference between two types of marketing — because they work very differently.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Brand Awareness */}
              <div className="bg-white/10 rounded-xl p-8 border border-white/20">
                <div className="inline-block bg-blue-500/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-blue-400/40 uppercase tracking-wide">
                  What We Specialize In
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Brand Awareness &amp; Top-of-Mind Growth</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  Most people aren't ready to buy the moment they see your ad. But when they <em>are</em> ready — you want to be the first name that comes to mind.
                </p>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  That's what brand awareness does. We help you show up consistently — on social media, streaming TV, and in local search — so that over time, your business becomes the obvious choice in your community.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  This is a long-term strategy. It builds real recognition and trust that compounds over months and years.
                </p>
              </div>

              {/* Short-Term Promotions */}
              <div className="bg-white/10 rounded-xl p-8 border border-white/20">
                <div className="inline-block bg-orange-400/30 text-orange-200 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-orange-400/40 uppercase tracking-wide">
                  We Can Help With This Too
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Short-Term Promotions &amp; Sales</h3>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  Running a special offer, seasonal sale, or time-limited promotion works differently. These campaigns are designed to drive immediate action — and they can work well when done right.
                </p>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  The key difference: a promotion tells people to act now. Brand awareness reminds people you exist. Both have a place — but they require different approaches, different messaging, and different expectations.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  If you have a promotion coming up, we can help with that too — just handled as its own campaign.
                </p>
              </div>
            </div>

            <div className="bg-blue-600/30 border border-blue-400/40 rounded-xl p-6 text-center">
              <p className="text-lg text-white font-semibold mb-2">
                Not sure which one you need?
              </p>
              <p className="text-slate-300">
                Tell us what you're trying to accomplish and we'll help you figure out the right approach — no guessing, no jargon.
              </p>
            </div>
          </div>
        </section>

        {/* Reassurance */}
        <section className="py-20 bg-blue-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Here's What You Should Know</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <p className="text-lg text-slate-700">
                  <strong>You don't need to understand marketing.</strong> We explain things in plain English, not jargon.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <p className="text-lg text-slate-700">
                  <strong>You're not locked into anything.</strong> Try the free tools with no credit card. If you hire us, there are no long-term contracts.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <p className="text-lg text-slate-700">
                  <strong>We won't waste your money.</strong> If something doesn't make sense for your business, we'll tell you.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-blue-200">
                <p className="text-lg text-slate-700">
                  <strong>We don't push you into things.</strong> You decide what makes sense. We just help you understand your options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pick Your Path</h3>
                  <p className="text-slate-700">Try the free tools yourself, or tell us what you need help with.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">We Explain Everything</h3>
                  <p className="text-slate-700">No confusing terms. We tell you what's wrong, what it will cost, and why it matters.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">You Decide</h3>
                  <p className="text-slate-700">Only move forward if it makes sense for you. No pressure.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              What Business Owners Say
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <p className="text-lg text-slate-700 mb-3 italic">
                  "They explained everything so I could understand it."
                </p>
                <p className="text-slate-600 mb-3">
                  No pressure, no confusing terms. Just clear answers.
                </p>
                <p className="text-slate-900 font-semibold">— Wendy Ruby</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <p className="text-lg text-slate-700 mb-3 italic">
                  "They didn't try to sell me things I didn't need."
                </p>
                <p className="text-slate-600 mb-3">
                  They told me what would work and what wouldn't.
                </p>
                <p className="text-slate-900 font-semibold">— Pete Gardner</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <p className="text-lg text-slate-700 mb-3 italic">
                  "Finally, someone who speaks plain English."
                </p>
                <p className="text-slate-600 mb-3">
                  I never felt lost or confused about what was happening.
                </p>
                <p className="text-slate-900 font-semibold">— Tony Johnson</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <p className="text-lg text-slate-700 mb-3 italic">
                  "They made it simple and saved me time."
                </p>
                <p className="text-slate-600 mb-3">
                  I can focus on my business now instead of worrying about marketing.
                </p>
                <p className="text-slate-900 font-semibold">— Jay Monson</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">What if I don't know what I need?</h3>
                <p className="text-slate-700">That's okay. Most people don't. We'll ask you a few questions and help you figure it out.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">How much does it cost?</h3>
                <p className="text-slate-700">It depends on what you need. The DIY tools have a free trial. Done-for-you services vary based on what we're doing. We'll always explain the cost before you commit.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Do I have to sign a long contract?</h3>
                <p className="text-slate-700">No. We don't believe in locking people in. You can stop anytime if it's not working for you.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Will this actually help me get more customers?</h3>
                <p className="text-slate-700">We focus on things that work: being found online, looking trustworthy, and showing up consistently. These things take time, but they do work.</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">What if I've tried marketing before and it didn't work?</h3>
                <p className="text-slate-700">That happens a lot. Usually it's because things weren't explained clearly or the approach didn't fit the business. We'll help you figure out what makes sense for you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 text-blue-100 leading-relaxed">
              Pick the option that feels right. No pressure. No confusion.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="https://ntaaffiliates.com" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-7 text-xl font-bold">
                  Start My 7-Day Free Trial
                </Button>
              </a>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-white text-purple-600 hover:bg-purple-50 px-10 py-7 text-xl font-bold"
              >
                How We Support Your Business
              </Button>
            </div>
            <p className="text-white/90 mt-8 text-lg">
              You're not locked into anything. Just see if it's a good fit.
            </p>
          </div>
        </section>

        {/* Website Add-On Promo Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              🛠️ Built Into Your Website
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Manage Your Website, Social Media & Customers — All From One Simple Dashboard
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              No extra apps. No tech headaches. Post updates, send emails, track leads, and see how your website is doing — right from your own dashboard. Built for HVAC companies, restaurants, retail stores, and local businesses like yours.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left">
              {[
                { icon: '📲', title: 'Update Your Website Yourself', desc: 'Post specials, news, photos & more without calling anyone.' },
                { icon: '📣', title: 'Stay Active on Social Media', desc: 'AI helps you write posts. Schedule them in minutes.' },
                { icon: '📬', title: 'Email Your Customers', desc: 'Send promos, follow-ups, and announcements easily.' },
              ].map((f) => (
                <div key={f.title} className="bg-white/10 border border-white/20 rounded-xl p-5">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
            <Link to={createPageUrl('ClientDashboardDemo')}>
              <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-10 py-6 font-bold shadow-xl">
                See How It Works →
              </Button>
            </Link>
            <p className="text-slate-500 text-sm mt-4">$100/month · $500 setup fee waived with any new or rebuilt website</p>
          </div>
        </section>

        {/* Accessibility Statement */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Accessibility Statement</h2>
            <p className="text-slate-600 text-center max-w-3xl mx-auto">
              We're committed to making our website work for everyone. We follow accessibility standards and are always looking for ways to improve. If you have trouble using this site, please contact us and we'll help you out.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
      <Chatbot />

      {/* Simple Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-slate-900">How Can We Help?</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-lg text-slate-700 mb-6">
              Choose what you need help with:
            </p>
            <div className="space-y-3">
              <Link to={createPageUrl('AdaAccessibility')} onClick={() => setShowModal(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-left justify-start text-base py-6">
                  Fix website problems or check for issues
                </Button>
              </Link>
              <Link to={createPageUrl('Rebuild')} onClick={() => setShowModal(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-left justify-start text-base py-6">
                  Get a new or rebuilt website
                </Button>
              </Link>
              <Link to={createPageUrl('StreamingTV')} onClick={() => setShowModal(false)}>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-left justify-start text-base py-6">
                  Run TV or video ads locally
                </Button>
              </Link>
              <a href="https://ntaaffiliates.com" target="_blank" rel="noopener noreferrer" className="w-full" onClick={() => setShowModal(false)}>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-left justify-start text-base py-6">
                  Manage social media posts
                </Button>
              </a>
              <a href="https://ntaaffiliates.com" target="_blank" rel="noopener noreferrer" className="w-full" onClick={() => setShowModal(false)}>
                <Button className="w-full bg-slate-600 hover:bg-slate-700 text-left justify-start text-base py-6">
                  I'm not sure what I need
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}