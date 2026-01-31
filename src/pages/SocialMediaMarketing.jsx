import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Clock, BarChart3, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import Chatbot from '../components/Chatbot';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SocialMediaMarketing() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.title = 'Social Media Marketing Management | New Tech Advertising';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Social media management for local businesses — content creation, scheduling, and strategic posting. DIY or fully managed.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => setShowModal(true)} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-purple-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Stay Visible on Social Media —<br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Without It Taking Over Your Life
              </span>
            </h1>

            <p className="text-xl text-slate-700 max-w-4xl mx-auto mb-6 leading-relaxed">
              Your customers are on Facebook, Instagram, and LinkedIn. You need to show up there regularly — but you're busy running your business.
            </p>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
              We help you stay visible and professional on social media. You can do it yourself with simple tools, or have us handle everything.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
              >
                Start Free Trial
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg"
              >
                Questions? Let's Talk
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why Social Media Matters for Your Business
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              People check Facebook, Instagram, and LinkedIn before they choose who to call. If you're not showing up, you're missing out.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Helps People Find You</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                When people see you posting regularly, they remember your business. When they need what you offer, you're top of mind.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Builds Trust</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                A business with an active social media presence looks professional and trustworthy. An inactive page makes people wonder if you're still open.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Saves You Time</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Instead of scrambling to post every day, you can schedule posts ahead of time or hand it off completely. Either way, it gets done.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Works With Everything Else</h3>
              <p className="text-slate-700 text-lg leading-relaxed">
                Your social media, website, and local advertising can work together. One message, multiple places.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Ways to Do This */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Two Ways to Do This
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              You can use our simple tools and do it yourself. Or we can handle everything for you. Your choice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Do It Yourself */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Do It Yourself</h3>
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                You write the posts. We give you simple tools to schedule them, track what's working, and manage your accounts.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 font-semibold mb-1">Schedule posts ahead of time</p>
                    <p className="text-slate-600">Write once, post across Facebook, Instagram, and LinkedIn</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 font-semibold mb-1">See what's working</p>
                    <p className="text-slate-600">Simple reports that make sense</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 font-semibold mb-1">Easy to use</p>
                    <p className="text-slate-600">No tech skills needed</p>
                  </div>
                </li>
              </ul>
              <p className="text-slate-700 font-semibold mb-4 text-lg">
                Good for: Owners who want control over what gets posted
              </p>
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
              >
                Start Free Trial
              </Button>
            </motion.div>

            {/* We Do It For You */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border-4 border-purple-600 rounded-2xl p-8 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">We Do It For You</h3>
              <p className="text-slate-700 text-lg mb-6 leading-relaxed">
                You run your business. We handle your social media — writing, posting, responding, and reporting.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 font-semibold mb-1">We create all the posts</p>
                    <p className="text-slate-600">Writing, images, and scheduling — handled</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 font-semibold mb-1">We respond to comments</p>
                    <p className="text-slate-600">Keep your pages active and professional</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-900 font-semibold mb-1">You get monthly updates</p>
                    <p className="text-slate-600">Simple reports on what's happening</p>
                  </div>
                </li>
              </ul>
              <p className="text-slate-700 font-semibold mb-4 text-lg">
                Good for: Busy owners who want it handled professionally
              </p>
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-lg"
              >
                Have Us Do It For You
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Can Post */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Post to All Your Accounts at Once
            </h2>
            <p className="text-xl text-slate-600">
              Facebook, Instagram, LinkedIn — write once, post everywhere.
            </p>
          </motion.div>

          <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">What you can post:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">Photos and images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">Videos</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">Updates and announcements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">Tips and advice</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-600 text-lg">
            Your accounts connect securely. No passwords shared.
          </p>
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
                Do I need to be good with computers?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                No. Everything is easy to use. If you can send an email, you can use this.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                What if I change my mind about doing it myself?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                That's fine. You can start doing it yourself and switch to having us handle it later. Or the other way around. Your choice.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                How often should I post?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Typically 3-5 times a week keeps you visible. We'll help you figure out what makes sense for your business.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Can I see how it's going?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Yes. You get simple reports that show how many people are seeing your posts and interacting with your business.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Is there a free trial?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Yes. Try the do-it-yourself tools free for 30 days. See if it works for you before committing.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Works With Everything */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-purple-100 rounded-2xl p-8 border-2 border-purple-300 text-center"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Works With Everything Else We Do</h3>
            <p className="text-lg text-slate-700 mb-4 leading-relaxed">
              Your social media can work together with your website and local advertising. Same message, more places.
            </p>
            <p className="text-slate-700">
              If you're doing streaming TV ads or updating your website, we can coordinate it all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Your Social Media Handled?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Do it yourself with simple tools, or have us handle everything. Either way, you'll stay visible without the stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                className="bg-white text-purple-600 hover:bg-slate-100 px-10 py-7 text-xl font-bold"
              >
                Start Free Trial
              </Button>
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-xl font-bold"
              >
                Have Us Do It For You
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