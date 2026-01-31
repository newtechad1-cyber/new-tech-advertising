import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Building2, Wrench, Briefcase, Heart, ArrowRight, FileCheck, ChevronDown } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import SignupModal from '../components/landing/SignupModal';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import Chatbot from '../components/Chatbot';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdaAccessibility() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const goToIntake = (packageName, nonprofit = false) => {
    const params = new URLSearchParams({ package: packageName });
    if (nonprofit) params.append('nonprofit', 'true');
    navigate(createPageUrl('AdaIntake') + '?' + params.toString());
  };

  useEffect(() => {
    document.title = 'ADA Website Accessibility Services | New Tech Advertising';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'ADA website accessibility audits, remediation, and monitoring for businesses nationwide. Clear options. No legal jargon.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header onCTAClick={() => setShowModal(true)} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Website Accessibility & Risk Protection —<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Helping Your Business Stay Safe
              </span>
            </h1>

            <p className="text-xl text-slate-700 max-w-4xl mx-auto mb-6 leading-relaxed">
              Many business owners don't realize their website can cause legal problems. If certain people can't use your site, you could face complaints or lawsuits.
            </p>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              This happens to good businesses with perfectly fine websites. It's not about doing something wrong — it's about websites not being built for everyone.
            </p>

            <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8 font-semibold">
              The good news: It's fixable. We'll help you understand what needs attention and get it handled.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Button
                onClick={() => goToIntake('Growth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
              >
                Check My Website
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
              >
                Questions? Let's Talk
              </Button>
            </div>
            
            <p className="text-sm text-slate-500">
              We provide guidance and support. This is not legal advice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who This Affects */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              This Affects More Businesses Than You Think
            </h2>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto mb-8 leading-relaxed">
              Most websites were built years ago and were never checked to see if everyone could use them. That's normal — but it can create risk.
            </p>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto mb-8 leading-relaxed">
              We work with businesses nationwide to identify problems early and fix them quietly before anything happens.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Building2, label: 'Small local businesses' },
              { icon: Wrench, label: 'Service businesses (HVAC, plumbing, electrical)' },
              { icon: Briefcase, label: 'Professional offices (law firms, accountants, doctors)' },
              { icon: Heart, label: 'Nonprofits and community organizations' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6 text-center"
              >
                <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-slate-700 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => goToIntake('Growth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Check My Website
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Start With a Website Check
            </h2>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              We'll review your website and explain what needs attention. No pressure, no confusing reports.
            </p>
          </motion.div>

          <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-blue-600" />
              What you get:
            </h3>
            <ul className="space-y-4">
              {[
                'We check your website for common problems',
                'We explain what could cause risk',
                'You get a simple report in plain English',
                'We tell you what to fix first',
                'You decide what makes sense for your business'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-slate-700 text-lg leading-relaxed">
                This covers what's known as "ADA website accessibility" — rules about making sure all people, including those with disabilities, can use your site. You don't need to understand the rules. We handle that.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => goToIntake('Growth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
            >
              Check My Website
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Options for Fixing Your Website
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the level of support that makes sense for your business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Starter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🟢</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Starter — One-Time Fix
              </h3>
              <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                We fix the main problems on your site. Good for small websites that need a simple cleanup.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'We fix the biggest risks',
                  'We handle the important pages',
                  'You get a follow-up review when we're done'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <p className="text-3xl font-bold text-slate-900 mb-2">$750 – $1,500</p>
                <p className="text-slate-600">one-time</p>
              </div>
              <Button
                onClick={() => goToIntake('Starter')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Learn About One-Time Fix
              </Button>
            </motion.div>

            {/* Growth - Most Popular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-white border-4 border-blue-600 rounded-2xl p-8 relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Growth — Fix + Protection
              </h3>
              <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                We fix your site and keep checking it over time. Best for businesses that want ongoing peace of mind.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything from the one-time fix',
                  'We keep checking your site regularly',
                  'We update things every few months',
                  'Predictable monthly cost'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <p className="text-3xl font-bold text-slate-900 mb-2">$1,250 – $2,500</p>
                <p className="text-slate-600 mb-2">setup</p>
                <p className="text-2xl font-bold text-blue-600">$99 – $149/mo</p>
              </div>
              <Button
                onClick={() => goToIntake('Growth')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Get Ongoing Protection (Most Popular)
              </Button>
            </motion.div>

            {/* Authority */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔵</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Authority — Complete Coverage
              </h3>
              <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                For bigger websites or businesses that update their site often. We handle everything and keep you updated monthly.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'We fix the entire site',
                  'Monthly checks and reports',
                  'You get priority support',
                  'We help with documentation'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-6">
                <p className="text-3xl font-bold text-slate-900 mb-2">$2,500 – $5,000</p>
                <p className="text-slate-600 mb-2">setup</p>
                <p className="text-2xl font-bold text-purple-600">$199 – $299/mo</p>
              </div>
              <Button
                onClick={() => goToIntake('Authority')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Learn About Complete Coverage
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nonprofit Pricing */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Heart className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Special Pricing for Nonprofits
            </h2>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Lower pricing for nonprofits, churches, and community organizations.
            </p>
          </motion.div>

          <div className="bg-white border-2 border-green-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Nonprofit Options:</h3>
            <ul className="space-y-4">
              {[
                { tier: 'One-Time Fix', price: '$500 – $1,000' },
                { tier: 'Ongoing Protection (Most Chosen)', price: '$900 setup + $79 / month' },
                { tier: 'Complete Coverage', price: '$1,750 setup + $149 / month' }
              ].map((item, index) => (
                <li key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-slate-900 font-semibold">{item.tier}</span>
                  <span className="text-green-700 font-bold">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button
              onClick={() => goToIntake('Growth', true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              See Nonprofit Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Business Type Routing */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              See How This Applies to Your Business
            </h2>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Different types of businesses face different risks. Find yours.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Building2, label: 'Small Local Businesses' },
              { icon: Wrench, label: 'Service Trades (HVAC, Plumbing, Electrical)' },
              { icon: Briefcase, label: 'Professionals (Law Firms, Accountants, Doctors)' },
              { icon: Heart, label: 'Nonprofits & Community Groups' }
            ].map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => goToIntake('Growth')}
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all group text-left"
              >
                <item.icon className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-slate-900 font-semibold flex-1">{item.label}</span>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>

          <p className="text-center text-slate-700 text-lg">
            Not sure where you fit? We'll help you figure it out.
          </p>
        </div>
      </section>

      {/* Integration Note */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white rounded-xl p-8 border-2 border-blue-200">
            <p className="text-xl font-semibold text-slate-900 mb-3">
              Manage ADA projects alongside your social media clients
            </p>
            <p className="text-lg text-slate-700">
              All in one unified platform — coordinate accessibility, social media, and visibility strategies seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-slate-200 rounded-2xl p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Important: What We Do and Don't Do
            </h2>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              We help you fix your website and reduce risk. We explain things clearly and help you make good decisions.
            </p>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              We do not provide legal advice. We are not lawyers. If you want formal legal protection or have received a lawsuit, we can refer you to attorneys who specialize in this area.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-slate-700 font-medium leading-relaxed">
                Most businesses just need their website fixed. Legal services are optional and cost more. We'll help you decide what makes sense.
              </p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
            >
              Questions About This?
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
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
            <AccordionItem value="item-1" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Why does this matter for my business?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                If someone with a disability can't use your website, they could file a complaint or lawsuit. This happens more often than most people realize. Fixing your site reduces that risk.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Do I need a lawyer for this?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Usually no. Most businesses just need their website fixed. We handle that. If you've already received a legal notice or want formal legal protection, we can refer you to attorneys.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Do I have to pay for ongoing monitoring?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                No. Many businesses just want a one-time fix. Ongoing monitoring is optional and gives you peace of mind over time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                How long does it take to fix a website?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 text-base leading-relaxed">
                Depends on the size of your site and what needs fixing. Small sites can be done in a few weeks. We'll give you a clear timeline after reviewing your website.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Protect Your Business — No Stress
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Let us check your website and explain what needs attention. Simple, clear, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => goToIntake('Growth')}
                className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg"
              >
                Check My Website
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Questions? Let's Talk
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