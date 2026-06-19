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
      question: "What is AI Search Optimization (AISO)?",
      answer: "AI Search Optimization is the process of making your business visible and recommended by AI search engines like ChatGPT, Google AI Overviews, and Perplexity. Unlike traditional SEO which focuses on Google rankings, AISO focuses on the signals AI uses to recommend businesses — including reviews, structured data, certifications, and consistent business information across the web."
    },
    {
      question: "How much does AI marketing cost for a small business?",
      answer: "New Tech Advertising offers AI marketing packages starting at affordable rates for small businesses. We believe every main street business deserves access to modern marketing technology. Contact us at 641-420-8816 for a free consultation and custom quote based on your needs."
    },
    {
      question: "What is an AI Gap Audit?",
      answer: "Our free AI Gap Audit analyzes how AI search engines currently see your business. We check your visibility on ChatGPT, Google AI, and Perplexity, review your website structure, schema markup, business listings, and online reviews, then provide a prioritized action plan showing exactly what to fix first for maximum AI visibility."
    },
    {
      question: "Does New Tech Advertising serve businesses outside Iowa?",
      answer: "Yes! While we're based in Mason City, Iowa and primarily serve businesses across Iowa and southern Minnesota, our AI marketing services can help any local business in the United States get found by AI search engines."
    },
    {
      question: "What types of businesses does NTA work with?",
      answer: "We specialize in helping local service businesses including HVAC contractors, plumbers, restaurants, retail stores, and other small businesses. Our founder Rick Hesse has decades of experience in advertising and understands the unique challenges main street businesses face with marketing."
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative border-t border-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-900/30 rounded-xl mb-6 border border-blue-800/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <HelpCircle className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-400 font-light">
            Answers to common questions about AI optimization and our services.
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
                className="bg-slate-900/50 border border-slate-800 rounded-xl px-6 data-[state=open]:bg-slate-900 data-[state=open]:border-slate-700 transition-all shadow-lg"
              >
                <AccordionTrigger className="text-left text-slate-200 font-medium hover:text-blue-400 transition-colors py-5 text-lg hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed pb-5 text-base font-light">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}