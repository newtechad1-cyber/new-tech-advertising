import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      question: "What exactly do I get for $297/month?",
      answer: "You get a complete, done-for-you marketing system: a professional website built to convert visitors into customers, local SEO optimization so you actually show up in searches, AI-powered content that posts automatically on your behalf, high-converting videos that tell your story, dedicated support from a team that cares, and monthly strategy calls. Everything is included—no hidden fees, no upsells."
    },
    {
      question: "How is this different from other marketing agencies?",
      answer: "Most agencies charge $2,000+ per month and lock you into long contracts. We keep it simple and affordable for small businesses. We use AI to automate what can be automated, so you get enterprise-level marketing at a fraction of the cost. Plus, we've been small business owners ourselves—we understand the struggle and we're here to genuinely help, not just take your money."
    },
    {
      question: "Do I need to sign a contract?",
      answer: "No. Zero contracts. You can cancel anytime with no penalties or fees. We believe in earning your business every single month by delivering real results. If you're not happy, you're free to leave—simple as that."
    },
    {
      question: "What if I'm not satisfied?",
      answer: "You're never locked into a contract with us. If you're not satisfied, simply cancel anytime—no penalties, no fees, no questions asked. We believe in earning your business every month by delivering real results, not by trapping you in a long-term commitment."
    },
    {
      question: "How long does it take to get set up?",
      answer: "Most clients are fully set up and live within 48-72 hours. We move fast because we know every day you're not showing up online, you're losing potential customers. Once you sign up, our team gets to work immediately on your website, SEO, and content strategy."
    },
    {
      question: "Will this work for my type of business?",
      answer: "Our system is designed specifically for local small businesses—whether you're a plumber, dentist, lawyer, contractor, restaurant owner, or any service-based business. If you serve customers in your local area and need more leads, our system will work for you. The AI adapts to your industry and creates content that speaks to your specific audience."
    },
    {
      question: "Do I need to know anything about marketing or technology?",
      answer: "Not at all. That's the whole point—we do everything for you. You don't need to understand SEO, write content, edit videos, or manage social media. Our team and our AI handle all of that. You just focus on running your business and serving the customers we send your way."
    },
    {
      question: "What if I already have a website?",
      answer: "No problem. We can either rebuild your website to make it conversion-optimized, or we can work with your existing site and optimize it. During your onboarding call, we'll discuss what makes the most sense for your specific situation. The goal is always to maximize your results."
    },
    {
      question: "How do I track results?",
      answer: "You'll have access to a dashboard showing your website traffic, leads, calls, and conversions. Plus, we provide monthly reports and strategy calls to review performance and make adjustments. You'll always know exactly how your marketing is performing and where your money is going."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, absolutely. Cancel anytime with zero penalties. We don't believe in trapping customers in contracts. If you ever decide this isn't right for you, just let us know and you can cancel—no hard feelings, no hassle."
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about our service
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-slate-200 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-slate-900 font-semibold hover:text-blue-600 transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <p className="text-slate-700 text-lg mb-2">
              Still have questions?
            </p>
            <p className="text-slate-600">
              We're here to help. Reach out to us at{' '}
              <a href="mailto:rick@newtechadvertising.com" className="text-blue-600 font-semibold hover:text-blue-700">
                rick@newtechadvertising.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}