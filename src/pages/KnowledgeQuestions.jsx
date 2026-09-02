import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageCircleQuestion, Sparkles } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import {
  knowledgeQuestionGroups,
  knowledgeQuestions,
  getKnowledgeQuestionPath
} from '@/data/knowledgeQuestions';

export default function KnowledgeQuestions() {
  const questionsByGroup = knowledgeQuestionGroups.map((group) => ({
    ...group,
    questions: knowledgeQuestions.filter((question) => question.group === group.id)
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="Small Business Questions About AI and Marketing | NTA"
        description="Plainspoken answers to practical small-business questions about AI, marketing budgets, customer trust, websites, local visibility, and growth."
        canonical="https://newtechadvertising.com/knowledge/questions"
        collectionData={{
          name: 'NTA Small Business Question Library',
          description: 'Plainspoken answers and connected NTA teaching for the practical AI, marketing, trust, and local-growth questions small-business owners actually ask.',
          numberOfItems: knowledgeQuestions.length,
          hasPart: knowledgeQuestions.map((question) => ({
            name: question.question,
            url: getKnowledgeQuestionPath(question)
          }))
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        <header className="relative border-b border-slate-800 bg-slate-900/40 px-6 pt-24 pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.18),_transparent_52%)] pointer-events-none" />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-blue-300 mb-6">
              <MessageCircleQuestion className="w-4 h-4" />
              Start with your question
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
              Small-business questions about AI and marketing
            </h1>
            <p className="text-lg leading-relaxed text-slate-300 max-w-3xl mx-auto mb-5">
              You do not need to learn everything at once. Begin with the question that is in front of you, get a clear answer, then follow the connected teaching only as far as it is useful.
            </p>
            <p className="text-sm leading-relaxed text-slate-500 max-w-2xl mx-auto">
              These are plainspoken starting points from Rick Hesse and New Tech Advertising. They are meant to help an owner think clearly—not replace the judgment of the people closest to the business.
            </p>
          </div>
        </header>

        <section className="px-6 py-12 border-b border-slate-800 bg-slate-950">
          <div className="max-w-5xl mx-auto grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <Sparkles className="w-5 h-5 text-blue-400 mb-3" />
              <h2 className="font-bold text-white mb-2">Get a clear starting point</h2>
              <p className="text-sm leading-6 text-slate-400">Each answer begins with the short version before it leads you into a deeper lesson.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <BookOpen className="w-5 h-5 text-blue-400 mb-3" />
              <h2 className="font-bold text-white mb-2">Keep the approved teaching intact</h2>
              <p className="text-sm leading-6 text-slate-400">Every answer points to the existing NTA lessons, articles, and practical resources behind it.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <ArrowRight className="w-5 h-5 text-blue-400 mb-3" />
              <h2 className="font-bold text-white mb-2">Choose one useful next step</h2>
              <p className="text-sm leading-6 text-slate-400">The goal is not more activity. It is a better next decision for the business you actually have.</p>
            </div>
          </div>
        </section>

        {questionsByGroup.map((group) => (
          <section key={group.id} className="px-6 py-16 border-b border-slate-900">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-3xl mb-9">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">NTA Knowledge Library</p>
                <h2 className="text-3xl font-black text-white mb-3">{group.title}</h2>
                <p className="leading-7 text-slate-400">{group.description}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {group.questions.map((question) => (
                  <article key={question.slug} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/55 p-6 transition-colors hover:border-blue-500/50 hover:bg-slate-900">
                    <h3 className="text-xl font-bold leading-snug text-white mb-3">
                      <Link to={getKnowledgeQuestionPath(question)} className="hover:text-blue-300 transition-colors">
                        {question.question}
                      </Link>
                    </h3>
                    <p className="leading-7 text-slate-400 flex-grow">{question.answer}</p>
                    <Link to={getKnowledgeQuestionPath(question)} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300">
                      Read the answer <ArrowRight className="w-4 h-4" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="px-6 py-16 bg-slate-900/45">
          <div className="max-w-3xl mx-auto rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/35 to-slate-900 p-8 text-center">
            <h2 className="text-2xl font-black text-white mb-3">Want to follow the full learning journey?</h2>
            <p className="leading-7 text-slate-400 mb-6">The original Knowledge Library remains the place to explore the connected lessons in depth.</p>
            <Link to="/knowledge" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 transition-colors">
              Explore the Knowledge Library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
