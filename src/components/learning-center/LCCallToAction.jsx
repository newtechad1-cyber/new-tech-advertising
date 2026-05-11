import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LCCallToAction({ type = 'audit', title, description, buttonText, className }) {
  const content = {
    audit: {
      title: "Ready to Fix Your Online Visibility?",
      description: "Get a complete breakdown of where your business is losing to competitors in AI and local search. No cost, highly actionable.",
      buttonText: "Request Free Gap Audit",
      link: "/gap-audit",
      features: ["AI Search Performance", "Website Conversion Check", "Local SEO Standing"]
    },
    ai_visibility: {
      title: "How Does AI See Your Business?",
      description: "Stop guessing. See exactly what ChatGPT, Gemini, and Google think about your business when locals search for your services.",
      buttonText: "Get Free AI Visibility Check",
      link: "/gap-audit",
      features: ["ChatGPT Recommendations", "Google AI Overviews", "Trust & Authority Score"]
    },
    talk: {
      title: "Want to Talk Strategy?",
      description: "Skip the generic agency pitch. Let's look at your actual business and see what's stopping you from growing.",
      buttonText: "Book A Strategy Call",
      link: "/book-call",
      features: ["Custom Growth Plan", "Competitor Analysis", "Clear Next Steps"]
    }
  }[type] || content.audit;

  const displayTitle = title || content.title;
  const displayDesc = description || content.description;
  const displayBtn = buttonText || content.buttonText;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 md:p-12 text-center", className)}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-black text-white mb-4">{displayTitle}</h3>
        <p className="text-lg text-slate-400 mb-8">{displayDesc}</p>
        
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-10">
          {content.features.map((feature, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-sm text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        <Link
          to={content.link}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)] group w-full sm:w-auto"
        >
          {displayBtn} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}