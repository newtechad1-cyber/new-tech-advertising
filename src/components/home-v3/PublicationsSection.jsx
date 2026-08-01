import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import growthShowCover from '@/assets/brand/nta-growth-show-cover.webp';

export default function PublicationsSection() {
  return (
    <section className="py-20 px-6 bg-slate-900/30 border-y border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Books, Journal &amp; Growth Show</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">Keep learning in the format that fits you.</h2>
          <p className="text-lg text-slate-400 leading-relaxed">Read the books, follow practical ideas in the Journal, or watch the NTA Growth Show and continue the conversation.</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
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
            <div className="mb-6 overflow-hidden rounded-xl bg-slate-900 aspect-[3/4] flex items-center justify-center relative shadow-lg">
              <img 
                src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/01b890ce2_NTAJournal.png" 
                alt="NTA Journal cover" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">NTA Journal</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              Practical business, growth, and AI insights for small business owners.
            </p>
            <Link to="/nta-journal" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg border border-slate-800 transition-colors text-sm">
              Learn More & Subscribe <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* NTA Growth Show */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col group hover:border-blue-500/30 transition-colors shadow-sm">
            <Link to="/growth-show" className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-blue-950 to-slate-900 aspect-[3/4] relative shadow-lg border border-blue-500/20">
              <img
                src={growthShowCover}
                alt="The NTA Growth Show conversation studio"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/45" />
              <p className="absolute left-4 top-4 rounded-full border border-blue-300/30 bg-slate-950/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 backdrop-blur-sm">New Tech Advertising</p>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <Play className="ml-1 h-6 w-6 fill-current" />
                </div>
                <p className="text-2xl font-black leading-tight text-white">The NTA Growth Show</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Watch · Learn · Continue</p>
              </div>
            </Link>
            <h3 className="text-xl font-bold text-white mb-2">The NTA Growth Show</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
              Practical conversations connected to YouTube, Knowledge Library lessons, Journal material, books, and social content.
            </p>
            <Link to="/growth-show" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm">
              Watch the Show <ArrowRight className="w-4 h-4" />
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
