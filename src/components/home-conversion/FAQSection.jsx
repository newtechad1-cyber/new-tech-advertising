import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      question: "What is the NTA Growth Conversation?",
      answer: "The Growth Conversation is a free discovery process that helps us understand what is happening in your business, what you want to change, and what may need attention first. We confirm what we heard before recommending a next step."
    },
    {
      question: "What is the free Business Gap Audit?",
      answer: "The free Business Gap Audit is a useful first-pass assessment. It helps identify visible gaps, immediate priorities, and practical next steps without requiring you to purchase a full consulting engagement."
    },
    {
      question: "Is there a deeper paid audit?",
      answer: "Yes. When a business needs more evidence, detailed analysis, interviews, system review, or a complete Growth Roadmap, NTA may recommend a separate paid deep-dive audit. The scope and price are explained before any paid work begins."
    },
    {
      question: "How does New Tech Advertising help a local business grow?",
      answer: "NTA helps local businesses strengthen their website and growth foundation, improve visibility, build trust, strengthen customer follow-up, and connect practical AI and automation into one useful system."
    },
    {
      question: "Does New Tech Advertising serve businesses outside Iowa?",
      answer: "Yes. New Tech Advertising is based in Mason City, Iowa and can work with local businesses and organizations in other parts of the United States."
    },
    {
      question: "What types of businesses does NTA work with?",
      answer: "NTA primarily helps local service businesses, restaurants, retailers, contractors, and other small businesses that need clearer marketing, stronger customer relationships, better follow-up, and practical growth systems."
    }
  ];

  return (
    <section className="py-20 bg-slate-950 relative border-t border-slate-900 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-900/30 rounded-xl mb-6 border border-blue-800/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <HelpCircle className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-400 font-light">
            Clear answers about how NTA begins, evaluates, and recommends next steps.
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
                key={faq.question}
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

          <div className="text-center mt-10">
            <Link
              to="/free-audit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3 rounded-xl transition-all"
            >
              Take the Free Business Gap Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
