import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Globe, Phone, MessageSquare, Users } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function WebsiteRebuild() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = 'Website Rebuild Services | New Tech Advertising';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Modern, accessible website rebuilds for local businesses. Clear, trustworthy, and built to get results.');
    }
  }, []);

  const goToIntake = () => {
    navigate(createPageUrl('RebuildIntake'));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => setShowModal(true)} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-orange-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Is Your Website Actually<br />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Helping Your Business?
              </span>
            </h1>

            <p className="text-xl text-slate-700 max-w-4xl mx-auto mb-6 leading-relaxed">
              A website doesn't need to be fancy. But it does need to make it easy for people to contact you, trust you, and choose you.
            </p>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              If your website feels outdated, confusing, or like it's not doing its job — you're not alone. Most websites were built years ago and were never updated.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com/start/website-rebuild'}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-6 text-lg"
              >
                Start Now
              </Button>
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com/start/website-rebuild?proposal=1'}
                variant="outline"
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg"
              >
                Request Proposal
              </Button>
            </div>
            <p className="text-slate-600 text-sm mt-4 max-w-2xl mx-auto">
              After you get started, you'll receive access to your private client portal where you can track progress, approvals, billing, and reporting in real time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Common Problems */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Signs Your Website Might Not Be Helping
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed">
              These are common problems — and they're all fixable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Looks outdated or unprofessional',
              'Hard to read on a phone',
              'Takes forever to load',
              'No clear way to contact you',
              'You rarely get calls or emails from it',
              'People tell you they had trouble using it'
            ].map((problem, i) => (
              <div key={i} className="flex items-start gap-3 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-700 text-lg">{problem}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-orange-50 rounded-xl border-2 border-orange-200 text-center">
            <p className="text-xl text-slate-900 font-semibold mb-3">
              If any of these sound familiar, your website might be costing you business.
            </p>
            <p className="text-lg text-slate-700">
              The good news: rebuilding is simpler than you think.
            </p>
          </div>
        </div>
      </section>

      {/* What a Good Website Does */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              What a Good Website Actually Does
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed">
              It doesn't need bells and whistles. It needs to work.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Phone className="w-8 h-8 text-orange-600" />
                Gets You Calls
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Your phone number is easy to find. People can call or text you with one click. Contact forms are simple and visible.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-orange-600" />
                Builds Trust
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                It looks professional. It loads fast. It works on phones. People feel confident choosing you.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-orange-600" />
                Says What You Do, Clearly
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Visitors understand what you offer within seconds. No confusion. No digging around.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Globe className="w-8 h-8 text-orange-600" />
                Helps People Find You
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Built so Google can understand it. Easy for everyone to use, including people with disabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Simple. Structured. Results.
            </h2>
          </motion.div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Tell Us What You Need</h3>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Complete a quick intake form so we understand your goals.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">We Send a Plan + Pricing</h3>
                <p className="text-slate-700 text-lg leading-relaxed">
                  You'll receive a clear proposal with scope and pricing options.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Approve & Pay Securely</h3>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Approve online and pay via secure Stripe checkout.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">We Deliver Inside Your Client Portal</h3>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Track progress, approvals, assets, and reporting in your private dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              <strong>Built for everyone to use:</strong> We build websites that work for all visitors, including people with disabilities. This protects you and helps more people reach you.
            </p>
            <p className="text-slate-600 mb-4">
              This is sometimes called "accessible" or "ADA-friendly" — you don't need to understand the rules. We handle that.
            </p>
            <p className="text-sm text-slate-600 border-t border-blue-300 pt-4 mt-4">
              <strong>Pricing:</strong> 50% deposit to begin. Balance due upon completion.
            </p>
          </div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Common Questions
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                How long does a rebuild take?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Most rebuilds take 4-8 weeks depending on the size of your site and how quickly you can provide feedback. We'll give you a clear timeline after reviewing your current site.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Do I need to know anything technical?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                No. We handle all the technical work. You just need to tell us what your business does and what you want the website to accomplish.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Can I keep my current website running during the rebuild?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Yes. We build your new site separately and launch it when it's ready. Your current site stays live the whole time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                What if I don't have photos or a logo?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                That's okay. We can help with that. We'll use professional stock photos or work with what you have.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                How much does a website rebuild cost?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                It depends on the size and complexity of your site. After we review what you need, we'll give you a clear price with no surprises. Most rebuilds range from a few thousand dollars to around ten thousand.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Integration Note */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-purple-100 rounded-2xl p-8 border-2 border-purple-300 text-center"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Works With Your Other Marketing</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              Your new website can work together with your social media and local advertising. One clear message, multiple places.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Get a Website That Actually Helps?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Let us review your current site and show you what a rebuild could do for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com/start/website-rebuild'}
                className="bg-white text-orange-600 hover:bg-slate-100 px-10 py-7 text-xl font-bold"
              >
                Start Now
              </Button>
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com/start/website-rebuild?proposal=1'}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-xl font-bold"
              >
                Request Proposal
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <SignupModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Chatbot />
    </div>
  );
}