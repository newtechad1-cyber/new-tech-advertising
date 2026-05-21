import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from 'lucide-react';

export default function LCAIFaqSection() {
  return (
    <section className="bg-slate-900/30 border-y border-slate-800 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            <Info className="w-4 h-4" />
            AI For Small Business
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Understanding the Risks &amp; Benefits
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Technology allows small businesses to be more competitive in today's fast-paced economy. As a small business owner, AI can help your business do more with less. At New Tech Advertising, we want to help you think about effective ways to implement AI into your practices securely and ethically.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            
            <AccordionItem value="item-1" className="border border-slate-800 bg-slate-950/50 px-6 rounded-2xl data-[state=open]:bg-slate-800/50 transition-colors">
              <AccordionTrigger className="text-lg sm:text-xl font-bold text-white hover:text-indigo-400 hover:no-underline py-6">
                How AI can benefit your small business
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 leading-relaxed max-w-none pb-6">
                <p className="mb-6 text-base">AI can improve efficiency, save time, and keep your business competitive. It can also help compensate for labor shortages by taking on repetitive tasks.</p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Solve problems before they happen</strong> Predict inventory needs, optimize shipping, and catch operational issues early.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Make better business decisions</strong> Analyze your data to spot trends, compare against competitors, and find hidden opportunities.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Take on repeat tasks</strong> Automate scheduling, sort emails, update lists, and generate reusable templates to improve communication.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Create business content</strong> Generate marketing copy, draft business plans, write blogs, and schedule social media posts across multiple platforms.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Collaborate and brainstorm</strong> Use AI as a sounding board for marketing plans, design ideas, and problem-solving.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Improve customer service</strong> Add intelligent chat widgets to your website to answer common questions and intelligently route inquiries.</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-slate-800 bg-slate-950/50 px-6 rounded-2xl data-[state=open]:bg-slate-800/50 transition-colors">
              <AccordionTrigger className="text-lg sm:text-xl font-bold text-white hover:text-indigo-400 hover:no-underline py-6">
                Risks of AI use
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 leading-relaxed max-w-none pb-6">
                <p className="mb-6 text-base">Using AI means assuming some risk. Always review AI outputs to ensure they are secure and accurately represent your business.</p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Intellectual property</strong> AI sources content from the web. Make sure anything you produce or publish doesn’t infringe on existing copyrights or trademarks.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Security risks</strong> Avoid feeding sensitive customer data or proprietary information into public AI models, as it could become part of their training data.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Customer trust</strong> Purely automated outreach can sometimes feel impersonal. Always have a human review generated content to maintain your authentic voice and prevent spam.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    <span><strong className="text-white block mb-1">Ethical concerns</strong> Monitor content to ensure it reflects your business’s culture and principles. Transparency about your use of AI is becoming an expected best practice.</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-slate-800 bg-slate-950/50 px-6 rounded-2xl data-[state=open]:bg-slate-800/50 transition-colors">
              <AccordionTrigger className="text-lg sm:text-xl font-bold text-white hover:text-indigo-400 hover:no-underline py-6">
                Common AI Terms Glossary
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 leading-relaxed max-w-none pb-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-white font-bold text-lg mb-2">Artificial intelligence (AI)</h4>
                    <p className="text-sm">Systems programmed to solve problems or adapt to new information, imitating human intelligence.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-white font-bold text-lg mb-2">Algorithm</h4>
                    <p className="text-sm">A specific list of rules or instructions that help a computer system perform a task.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-white font-bold text-lg mb-2">Machine learning</h4>
                    <p className="text-sm">A field within AI focused on using data to train models so they can "learn" and perform tasks without explicit programming.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-white font-bold text-lg mb-2">Large language model (LLM)</h4>
                    <p className="text-sm">A model trained on massive amounts of text data to recognize language patterns. It uses math to predict words and can write, translate, or answer questions.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-white font-bold text-lg mb-2">Generative AI (GenAI)</h4>
                    <p className="text-sm">AI that can create entirely new content—including text, images, videos, and music—by learning patterns from existing data.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-white font-bold text-lg mb-2">Prompt</h4>
                    <p className="text-sm">The instructions, questions, or context you feed into Generative AI to guide its response.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>
      </div>
    </section>
  );
}