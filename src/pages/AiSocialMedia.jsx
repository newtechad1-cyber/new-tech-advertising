import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';
import { Share2, Users, MessageCircle, TrendingUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/shared/SEOHead';

export default function AiSocialMedia() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <SEOHead 
        title="AI Social Media Management | New Tech Advertising"
        description="AI-powered social media management for small businesses. Automated content creation, scheduling & engagement. Facebook, Instagram & more. New Tech Advertising, Mason City IA."
      />
      <Header onCTAClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI Social Media for Iowa & MN Businesses <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">On Autopilot</span>
              </h1>
              <p className="text-xl text-indigo-100 mb-8">
                Consistent, high-quality content posted to all your channels automatically. Engage your audience without lifting a finger.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => window.location.href = 'https://ntaaffiliates.com/start/social-media'} 
                  size="lg" 
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg rounded-xl"
                >
                  Start Now
                </Button>
                <Button 
                  onClick={() => window.location.href = 'https://ntaaffiliates.com/start/social-media?proposal=1'} 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
                >
                  Request Proposal
                </Button>
              </div>
              <p className="text-indigo-100 text-sm mt-4">
                After you get started, you'll receive access to your private client portal where you can track progress, approvals, billing, and reporting in real time.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1683721003111-070bcc053d8b?q=80&w=1000&auto=format&fit=crop" 
                alt="AI social media management showing automated posts across Facebook, Instagram, TikTok, and LinkedIn for Iowa businesses" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <Share2 className="w-12 h-12 text-pink-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Multi-Channel Posting</h3>
                <p className="text-slate-600">One click publishes your content to Facebook, Instagram, LinkedIn, Twitter, and TikTok simultaneously.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <MessageCircle className="w-12 h-12 text-purple-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Engagement</h3>
                <p className="text-slate-600">Our AI monitors comments and messages, drafting suggested replies to keep your community active.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                <TrendingUp className="w-12 h-12 text-indigo-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Growth Analytics</h3>
                <p className="text-slate-600">Understand exactly what content drives followers and sales with our simplified weekly reports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Technology Deep Dive */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How AI Supercharges Your Socials</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                It's not just about posting—it's about posting the right thing, at the right time, to the right people in Iowa and Minnesota.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                  <h3 className="text-xl font-bold text-pink-700 mb-2">Generative Content AI</h3>
                  <p className="text-slate-700">
                    Our AI doesn't just copy-paste. It writes unique, engaging captions tailored to your brand voice. It generates custom graphics and selects trending hashtags relevant to Mason City and your industry.
                  </p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="text-xl font-bold text-indigo-700 mb-2">Sentiment Analysis</h3>
                  <p className="text-slate-700">
                    The system "reads" the emotions in comments and messages, allowing us to prioritize urgent customer service issues and engage positively with happy customers automatically.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Local Engagement Strategy</h3>
                <p className="text-slate-600 mb-6">
                  For businesses in Iowa and Minnesota, community is everything. Our AI identifies local events, holidays, and trending topics in your specific area to keep your content relevant and locally grounded.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700">Auto-posts during peak local activity hours</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700">Geo-tagged content to boost local discoverability</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700">Cross-promotion with other local businesses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple. Structured. Results.</h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Tell Us What You Need</h3>
                  <p className="text-slate-700">Complete a quick intake form so we understand your goals.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">We Send a Plan + Pricing</h3>
                  <p className="text-slate-700">You'll receive a clear proposal with scope and pricing options.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Approve & Pay Securely</h3>
                  <p className="text-slate-700">Approve online and pay via secure Stripe checkout.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">We Deliver Inside Your Client Portal</h3>
                  <p className="text-slate-700">Track progress, approvals, assets, and reporting in your private dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">Simple, Transparent Pricing</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* DIY Plan */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 flex flex-col hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">DIY</h3>
                <p className="text-slate-500 mb-2 text-lg">Do It Yourself</p>
                <div className="text-5xl font-bold text-slate-900 mb-2">$97<span className="text-lg text-slate-400 font-normal">/month</span></div>
                <p className="text-sm text-slate-500 mb-6">Month-to-month. Cancel anytime.</p>
                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> Access to AI Content Tools</li>
                  <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> You Manage Scheduling</li>
                  <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> Weekly Trending Ideas</li>
                  <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> Basic Performance Analytics</li>
                </ul>
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => window.location.href = 'https://ntaaffiliates.com/start/social-media'}
                    variant="outline"
                    className="w-full py-6 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors text-lg rounded-xl"
                  >
                    Start Now
                  </Button>
                  <Button 
                    onClick={() => window.location.href = 'https://ntaaffiliates.com/start/social-media?proposal=1'}
                    variant="ghost"
                    className="w-full py-6 text-slate-600 hover:text-slate-900 text-lg"
                  >
                    Request Proposal
                  </Button>
                </div>
              </div>

              {/* DFY Plan */}
              <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-indigo-600 flex flex-col relative overflow-hidden transform md:-translate-y-4 hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-xl text-sm font-bold uppercase tracking-wider">Most Popular</div>
                <h3 className="text-2xl font-bold text-indigo-600 mb-2">DFY</h3>
                <p className="text-slate-500 mb-2 text-lg">Done For You</p>
                <div className="text-5xl font-bold text-slate-900 mb-2">$197<span className="text-lg text-slate-400 font-normal">/month</span></div>
                <p className="text-sm text-slate-500 mb-6">Month-to-month. Cancel anytime.</p>
                <ul className="space-y-4 mb-10 flex-grow">
                   <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> Full Content Creation</li>
                   <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> We Handle Posting & Scheduling</li>
                   <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> Community Engagement & Reply Drafting</li>
                   <li className="flex items-start gap-3 text-slate-600"><Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> Advanced Growth Reports & Strategy</li>
                </ul>
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => window.location.href = 'https://ntaaffiliates.com/start/social-media'}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 text-lg rounded-xl"
                  >
                    Start Now
                  </Button>
                  <Button 
                    onClick={() => window.location.href = 'https://ntaaffiliates.com/start/social-media?proposal=1'}
                    variant="ghost"
                    className="w-full py-6 text-slate-600 hover:text-slate-900 text-lg"
                  >
                    Request Proposal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SignupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Chatbot />
    </div>
  );
}