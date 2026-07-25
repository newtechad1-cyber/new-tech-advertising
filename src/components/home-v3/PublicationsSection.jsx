import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Newspaper, BrainCircuit } from 'lucide-react';

export default function PublicationsSection() {
  return (
    <section className="py-20 px-6 bg-slate-900/30 border-y border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">NTA Publications</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Practical knowledge for local business growth.</h2>
          <p className="text-lg text-slate-400 leading-relaxed">Read our flagship publications on business growth, applied artificial intelligence, and operating systems.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Better Business Book */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col group hover:border-slate-700 transition-colors shadow-sm">
            <div className="mb-6 overflow-hidden rounded-xl bg-slate-900 aspect-[3/4] flex items-center justify-center relative shadow-lg">
              <img 
                src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/9671c51cd_TheBetterBusinessBookFront.png" 
                alt="The Better Business Book cover by Rick Hesse" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The Better Business Book</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              A practical, plainspoken business guide written specifically for owners of independent and local businesses trying to build stronger foundations.
            </p>
            <Link to="/better-business-book" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg border border-slate-800 transition-colors text-sm">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Practical AI */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col group hover:border-slate-700 transition-colors shadow-sm">
            <div className="mb-6 overflow-hidden rounded-xl bg-slate-900 aspect-[3/4] flex items-center justify-center relative shadow-lg">
              <img 
                src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/919f0b245_Practical_AI_for_Small_BusinessBookFrontCover.png" 
                alt="Practical AI for Small Business book cover by Rick Hesse" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Practical AI for Small Business</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              A clear guide separating real artificial intelligence utility from noise and hype, showing exactly how small businesses can use AI to grow today.
            </p>
            <Link to="/practical-ai-for-small-business" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg border border-slate-800 transition-colors text-sm">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* NTA Journal */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col group hover:border-slate-700 transition-colors shadow-sm">
            <div className="mb-6 overflow-hidden rounded-xl bg-emerald-500/10 aspect-[3/4] flex items-center justify-center text-emerald-400 shadow-lg group-hover:bg-emerald-500/20 transition-colors">
              <Newspaper className="w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">NTA Journal</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              The official publication of New Tech Advertising, covering digital systems, authority building, market trends, and practical operational tactics.
            </p>
            <Link to="/journal" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg border border-slate-800 transition-colors text-sm">
              Read the Journal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/books" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors">
            View all books & publications <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}