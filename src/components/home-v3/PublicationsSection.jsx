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
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col group hover:border-slate-700 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">The Better Business Book</h3>
            <p className="text-slate-400 leading-relaxed mb-8 flex-1">
              A practical, plainspoken business guide written specifically for owners of independent and local businesses trying to build stronger foundations.
            </p>
            <Link to="/better-business-book" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-800 transition-colors">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Practical AI */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col group hover:border-slate-700 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Practical AI</h3>
            <p className="text-slate-400 leading-relaxed mb-8 flex-1">
              A clear guide separating real artificial intelligence utility from noise and hype, showing exactly how small businesses can use AI to grow today.
            </p>
            <Link to="/practical-ai" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-800 transition-colors">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* NTA Journal */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col group hover:border-slate-700 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">NTA Journal</h3>
            <p className="text-slate-400 leading-relaxed mb-8 flex-1">
              The official publication of New Tech Advertising, covering digital systems, authority building, market trends, and practical operational tactics.
            </p>
            <Link to="/journal" className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl border border-slate-800 transition-colors">
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