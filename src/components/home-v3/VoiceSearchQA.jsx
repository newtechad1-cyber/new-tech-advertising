import React from 'react';

export default function VoiceSearchQA() {
  const qas = [
    {
      q: "What is AI Search Optimization (AISO)?",
      a: "AI Search Optimization is the process of making your business visible and recommended by AI search engines like ChatGPT, Google AI Overviews, and Perplexity. Unlike traditional SEO which focuses on Google rankings, AISO focuses on the signals AI uses to recommend businesses — including reviews, structured data, certifications, and consistent business information across the web."
    },
    {
      q: "How much does AI marketing cost for a small business?",
      a: "New Tech Advertising offers AI marketing packages starting at affordable rates for small businesses. We believe every main street business deserves access to modern marketing technology. Contact us at 641-420-8816 for a free consultation and custom quote based on your needs."
    },
    {
      q: "What is an AI Gap Audit?",
      a: "Our free AI Gap Audit analyzes how AI search engines currently see your business. We check your visibility on ChatGPT, Google AI, and Perplexity, review your website structure, schema markup, business listings, and online reviews, then provide a prioritized action plan showing exactly what to fix first for maximum AI visibility."
    },
    {
      q: "Does New Tech Advertising serve businesses outside Iowa?",
      a: "Yes! While we're based in Mason City, Iowa and primarily serve businesses across Iowa and southern Minnesota, our AI marketing services can help any local business in the United States get found by AI search engines."
    },
    {
      q: "What types of businesses does NTA work with?",
      a: "We specialize in helping local service businesses including HVAC contractors, plumbers, restaurants, retail stores, and other small businesses. Our founder Rick Hesse has decades of experience in advertising and understands the unique challenges main street businesses face with marketing."
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Answers for AI & Voice Search
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Common questions our clients and voice assistants ask about our AI marketing growth systems.
          </p>
        </div>
        <div className="space-y-8">
          {qas.map((item, index) => (
            <div key={index} className="bg-white dark:bg-slate-950 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {item.q}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}