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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Share2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Social Media Management</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Social Media Management —<br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Without the Overwhelm
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-6 leading-relaxed">
              Content creation, scheduling, and strategy — handled your way. Whether you want to manage it yourself or hand it off completely.
            </p>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 font-medium">
              Consistent, professional presence on Facebook, Instagram, LinkedIn, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
              >
                Get Started on ntaaffiliates.com
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

      {/* What Is Social Media Management */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              What Social Media Management Includes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Share2 className="w-8 h-8 text-purple-600" />
                Content Creation
              </h3>
              <ul className="space-y-3">
                {['Post writing and copywriting', 'Image selection and design', 'Video creation', 'Hashtag strategy'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Clock className="w-8 h-8 text-purple-600" />
                Scheduling & Posting
              </h3>
              <ul className="space-y-3">
                {['Calendar-based scheduling', 'Optimal posting times', 'Multi-platform posting', 'Consistent frequency'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                Engagement & Community
              </h3>
              <ul className="space-y-3">
                {['Responding to comments and DMs', 'Community management', 'Audience building', 'Relationship nurturing'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 rounded-xl p-8 border border-purple-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Analytics & Reporting
              </h3>
              <ul className="space-y-3">
                {['Performance tracking', 'Growth metrics', 'Engagement analysis', 'Monthly reports'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-purple-100 rounded-xl p-8 border-2 border-purple-300 text-center">
            <p className="text-lg text-slate-900 font-semibold">
              Seamlessly connects with all your other services — streaming TV campaigns, website rebuild, ADA accessibility projects.
            </p>
          </div>
        </div>
      </section>

      {/* DIY vs DFY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Choose Your Approach
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Want to create content yourself but use our tools? Or prefer us to handle everything? Both options available.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* DIY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">DIY — You Create, We Schedule</h3>
              <p className="text-slate-600 mb-6">
                You write the posts. We handle scheduling, analytics, and platform management.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'OAuth-connected social platforms',
                  'Content scheduling tools',
                  'Analytics dashboard',
                  'Account management'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 font-medium mb-4">
                Best for: Businesses that want control over their voice
              </p>
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Get Started with DIY
              </Button>
            </motion.div>

            {/* DFY */}
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
              <h3 className="text-2xl font-bold text-slate-900 mb-4">DFY — We Handle Everything</h3>
              <p className="text-slate-600 mb-6">
                We create, schedule, post, and manage your entire social media presence.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Full content creation',
                  'Strategic scheduling',
                  'Community management',
                  'Monthly reporting',
                  'Account oversight'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 font-medium mb-4">
                Best for: Busy businesses that want results without the effort
              </p>
              <Button
                onClick={() => window.location.href = 'https://ntaaffiliates.com'}
                target="_blank"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Get Started with Done For You
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Manage All Your Platforms in One Place
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {['Facebook', 'Instagram', 'LinkedIn', 'Twitter/X'].map((platform, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
                <p className="text-lg font-semibold text-slate-900">{platform}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-600 text-lg">
            OAuth-connected for secure, seamless access and posting.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Can I use social media management without other services?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                Yes. Social media management works as a standalone service. It also integrates seamlessly with streaming TV, website rebuilds, and ADA projects if you want a coordinated approach.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                How does DIY differ from DFY?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                DIY: You write posts, we schedule and manage the accounts. DFY: We handle everything from content creation to posting to community engagement. Choose based on your time and comfort level.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                What about analytics and reporting?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                Both options include dashboard access and monthly reporting. You'll always know how your social media is performing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Can I switch between DIY and DFY?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                Yes. Your situation may change, and so can your approach. Flexibility is built in.
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
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Works Seamlessly With All Our Services</h3>
            <p className="text-lg text-slate-700 mb-4">
              Social media management coordinates with streaming TV campaigns, website rebuilds, and ADA accessibility projects for a unified marketing strategy.
            </p>
            <p className="text-slate-600 font-medium">
              One unified platform. One source of truth. All your digital marketing in one place.
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Choose DIY or Done For You. Either way, we've got you covered.
            </p>
            <Button
              onClick={() => window.location.href = 'https://ntaaffiliates.com'}
              target="_blank"
              className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-6 text-lg"
            >
              Get Started on ntaaffiliates.com
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <SignupModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Chatbot />
    </div>
  );
}