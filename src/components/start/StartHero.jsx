import { ArrowDown, MessageCircle } from 'lucide-react';

export default function StartHero({ onScrollToForm }) {
  const openGrowthGuide = () => {
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { source: 'start_hero_talk_office' },
    }));
  };

  return (
    <section className="relative bg-slate-950 overflow-hidden pt-28 pb-16">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-blue-600/15 rounded-full blur-[110px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full uppercase tracking-wider">
          <MessageCircle className="w-3.5 h-3.5" /> A Free Conversation About Your Business
        </span>

        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
          What would you like to understand better about your business?
        </h1>

        <div className="mt-6 max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
          <p>
            You don't need to know what service you need—or whether you need one at all.
          </p>
          <p>
            Tell me what's on your mind. It might be your team, customers, website, marketing, AI, communication, growth, or simply something in the business that doesn't seem to be working as well as you'd like.
          </p>
          <p>
            We'll talk about it. I'll listen, ask questions, and help you sort through what you're seeing. If there's a useful next step, we'll identify it together.
          </p>
          <p>
            That conversation may eventually become the beginning of your <strong className="text-white font-semibold">Digital Growth Roadmap™</strong>, but there's no package you have to choose and nothing you have to buy just to have the conversation.
          </p>
          <p className="text-blue-300 font-semibold">
            The conversation is free. The purpose is understanding your business better.
          </p>
        </div>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl text-base sm:text-lg transition-colors shadow-lg shadow-blue-600/30"
          >
            Start a Free Growth Conversation <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={openGrowthGuide}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors border border-slate-700"
          >
            Talk to My Office™
          </button>
        </div>
      </div>
    </section>
  );
}