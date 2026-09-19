import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

// The actual NTA-branded Growth Roadmap PDF prepared for Pete and Janine Gardner.
const ROADMAP_PDF_URL =
  'https://media.base44.com/files/public/691f41a18de4a7f498c8f884/9c9e68df8_Cattlemans_Growth_Roadmap_NTA_Branded_Draft.pdf';

export default function CaseStudyRoadmapPDF() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <div className="rounded-2xl border border-blue-500/25 bg-gradient-to-b from-blue-950/30 to-slate-900/40 p-8 md:p-10 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
          See the Actual Growth Roadmap We Gave Cattleman's Dining
        </h3>

        <p className="text-white text-lg font-semibold leading-relaxed mb-4 max-w-3xl mx-auto">
          What does a Growth Roadmap actually look like when you begin working with a real business?
        </p>

        <p className="text-slate-400 leading-relaxed mb-4 max-w-3xl mx-auto">
          This is the Growth Roadmap NTA prepared for Pete and Janine Gardner as we began working through the
          opportunities at Cattleman's Dining in Belmond, Iowa.
        </p>

        <p className="text-slate-400 leading-relaxed mb-1 max-w-3xl mx-auto">
          It isn't a finished plan carved in stone.
        </p>
        <p className="text-slate-400 leading-relaxed mb-4 max-w-3xl mx-auto">
          It's a starting point.
        </p>

        <p className="text-slate-400 leading-relaxed mb-4 max-w-3xl mx-auto">
          It brings together what we're learning about the business, the questions we still need to answer, the
          opportunities we're seeing, and the first practical moves we can make together.
        </p>

        <p className="text-slate-400 leading-relaxed mb-6 max-w-3xl mx-auto">
          As Pete, Janine, their team and NTA learn more, the Roadmap can change with the business.
        </p>

        <p className="text-blue-300 font-semibold text-lg leading-relaxed mb-8">
          That's the point of a Growth Roadmap.
        </p>

        <div className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
          Real Client Roadmap • Case Study in Progress
        </div>

        <a
          href={ROADMAP_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_0_24px_rgba(59,130,246,0.3)]"
        >
          <FileText className="w-5 h-5" />
          Open the Cattleman's Dining Growth Roadmap
          <ArrowRight className="w-5 h-5" />
        </a>

        <p className="text-slate-500 text-sm leading-relaxed italic mt-6 max-w-2xl mx-auto">
          Shared as a real-world example of how NTA begins organizing a Growth Roadmap. The Roadmap will continue
          developing as the business learns and priorities become clearer.
        </p>
      </div>
    </section>
  );
}