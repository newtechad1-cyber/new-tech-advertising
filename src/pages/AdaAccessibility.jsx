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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">ADA Website Accessibility</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Website Accessibility — <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clear Guidance for Local Businesses
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-6 leading-relaxed">
              Website accessibility can feel confusing and intimidating. We make it practical.
            </p>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
              Our approach focuses on identifying accessibility issues, explaining what matters, and guiding you toward improvements that reduce risk and improve usability.
            </p>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 font-medium">
              No scare tactics. Just clear next steps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Button
                onClick={() => goToIntake('Growth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
              >
                Request an ADA Website Audit
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
              >
                Talk to an ADA Compliance Advisor
              </Button>
            </div>
            
            <p className="text-sm text-slate-500">
              Informational accessibility services. Not legal advice or certification.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Local Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              ADA Website Accessibility for Businesses Nationwide
            </h2>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto mb-8">
              Many websites were built years ago and were never reviewed for accessibility. 
              That doesn't make them bad — just outdated. We help businesses across the U.S. identify accessibility issues early and fix them before they become problems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Building2, label: 'Small local businesses' },
              { icon: Wrench, label: 'HVAC, plumbing, electrical & service trades' },
              { icon: Briefcase, label: 'Professional offices (law, accounting, medical)' },
              { icon: Heart, label: 'Nonprofits, churches & community organizations' }
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
              Request an ADA Website Audit
            </Button>
          </div>
        </div>
      </section>

      {/* Audit Offer Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Start With an ADA Website Accessibility Audit
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              The audit gives you clarity — not pressure.
            </p>
          </motion.div>

          <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-blue-600" />
              What the audit includes:
            </h3>
            <ul className="space-y-4">
              {[
                'Accessibility scan of key pages',
                'Identification of high-risk accessibility barriers',
                'Plain-English findings (no technical jargon)',
                'Prioritized recommendations',
                'Downloadable report'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 mt-6 p-4 bg-blue-50 rounded-lg">
              This audit is informational and designed to help you make informed decisions about your website.
            </p>
          </div>

          <div className="text-center">
            <Button
              onClick={() => goToIntake('Growth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
            >
              Request an ADA Website Audit
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
              Accessibility Remediation & Support Options
            </h2>
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
                Starter — One-Time Remediation
              </h3>
              <p className="text-slate-600 mb-6">
                Best for simple websites that need core issues fixed.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Fix high-risk issues identified in the audit',
                  'Remediation for core pages',
                  'Verification review after completion'
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
                Start with Starter
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
                Growth — Fix + Monitoring
              </h3>
              <p className="text-slate-600 mb-6">
                Best for businesses that want peace of mind long-term.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Starter',
                  'Ongoing accessibility monitoring',
                  'Quarterly reviews & updates',
                  'Predictable monthly support'
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
                Choose Growth (Most Popular)
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
                Authority — Full Oversight & Reporting
              </h3>
              <p className="text-slate-600 mb-6">
                Best for larger or frequently updated websites.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Full-site accessibility remediation',
                  'Monthly monitoring & reporting',
                  'Priority support',
                  'Documentation assistance'
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
                Talk About Authority
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
              Accessibility & Inclusion for Nonprofits
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              We offer mission-aligned, budget-conscious accessibility options for nonprofits, churches, and community organizations.
            </p>
          </motion.div>

          <div className="bg-white border-2 border-green-200 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Nonprofit Pricing:</h3>
            <ul className="space-y-4">
              {[
                { tier: 'Starter', price: '$500 – $1,000' },
                { tier: 'Growth (Most Chosen)', price: '$900 setup + $79 / month' },
                { tier: 'Authority', price: '$1,750 setup + $149 / month' }
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
              View Nonprofit Accessibility Options
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
              Find Your Industry
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Learn how accessibility applies specifically to your organization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Building2, label: 'ADA for Small Local Businesses' },
              { icon: Wrench, label: 'ADA for Service Trades (HVAC, Plumbing, Electrical)' },
              { icon: Briefcase, label: 'ADA for Professionals (Law, Accounting, Medical)' },
              { icon: Heart, label: 'ADA for Nonprofits & Community Organizations' }
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

          <p className="text-center text-slate-600 text-lg">
            Not sure? Start with the audit and we'll guide you.
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

      {/* Legal Referral Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-slate-200 rounded-2xl p-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Optional Legal Compliance Services
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Some organizations prefer formal legal compliance services through specialized providers. 
              If requested, we can refer you to vetted third-party ADA legal and compliance partners. 
              These services are optional and typically higher cost than website remediation.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-900 font-medium">
                New Tech Advertising does not provide legal advice or legal certification.
              </p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
            >
              Request a Legal Compliance Referral
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
                Is ADA accessibility required for websites?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                Accessibility applies to public-facing websites. Most organizations benefit from understanding their risk and addressing issues early.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Do you provide legal certification?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                No. We provide technical audits, remediation, and monitoring. Legal compliance services are handled by independent providers if requested.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-slate-50 border border-slate-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                Do I have to choose ongoing monitoring?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                No. Many clients choose a one-time fix. Monitoring is optional.
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
              Get Clarity in One Step
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start with an ADA Website Accessibility Audit and we'll help you choose the right path 
              for your website, your goals, and your budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => goToIntake('Growth')}
                className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-6 text-lg"
              >
                Request an ADA Website Audit
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Schedule a Call
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