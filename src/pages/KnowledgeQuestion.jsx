import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, CircleCheck, User } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import {
  KNOWLEDGE_QUESTION_LAST_UPDATED,
  getKnowledgeQuestionBySlug,
  getKnowledgeQuestionPath,
  getRelatedKnowledgeQuestions
} from '@/data/knowledgeQuestions';

const UPDATED_LABEL = 'September 2, 2026';

export default function KnowledgeQuestion() {
  const { questionSlug } = useParams();
  const question = getKnowledgeQuestionBySlug(questionSlug);

  if (!question) {
    return <Navigate to="/knowledge/questions" replace />;
  }

  const relatedQuestions = getRelatedKnowledgeQuestions(question);
  const canonical = 'https://newtechadvertising.com' + getKnowledgeQuestionPath(question);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={question.seoTitle}
        description={question.description}
        canonical={canonical}
        faqs={[{ question: question.question, answer: question.answer }]}
        articleData={{
          title: question.question,
          description: question.description,
          author: 'Rick Hesse',
          datePublished: KNOWLEDGE_QUESTION_LAST_UPDATED,
          dateModified: KNOWLEDGE_QUESTION_LAST_UPDATED,
          slug: getKnowledgeQuestionPath(question)
        }}
      />
      <MarketingNav />

      <main className="flex-grow">
        <article>
          <header className="border-b border-slate-800 bg-slate-900/45 px-6 pt-24 pb-14">
            <div className="max-w-3xl mx-auto">
              <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
                <Link to="/knowledge" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" /> Knowledge Library
                </Link>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <Link to="/knowledge/questions" className="hover:text-white transition-colors">Questions</Link>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <span className="text-slate-300">Answer</span>
              </nav>

              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">Small-business question</p>
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">{question.question}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-9 h-9 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <p>By Rick Hesse <span className="mx-1.5">·</span><time dateTime={KNOWLEDGE_QUESTION_LAST_UPDATED}>Updated {UPDATED_LABEL}</time></p>
              </div>
            </div>
          </header>

          <section className="px-6 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl border border-blue-500/25 bg-gradient-to-br from-blue-950/45 to-slate-900 p-7 md:p-9">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">Short answer</p>
                <h2 className="text-2xl md:text-3xl font-black leading-tight text-white mb-4">Start with what is useful, then keep the people responsible.</h2>
                <p className="speakable text-lg md:text-xl leading-8 text-slate-200">{question.answer}</p>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-black text-white mb-4">Where this fits in a real small business</h2>
                <p className="leading-8 text-slate-300">{question.context}</p>
              </div>

              <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/55 p-6">
                <div className="flex gap-3">
                  <CircleCheck className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white mb-2">One useful next step</h2>
                    <p className="leading-7 text-slate-400">{question.nextStep}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-12">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Go deeper</p>
              <h2 className="text-2xl font-black text-white mb-3">Explore the teaching behind this answer</h2>
              <p className="leading-7 text-slate-400 mb-7">These NTA resources explain the connected ideas without asking you to start over from the beginning.</p>
              <div className="grid gap-4 md:grid-cols-3">
                {question.resources.map((resource) => (
                  <Link key={resource.path} to={resource.path} className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-5 hover:border-blue-500/60 hover:bg-slate-950 transition-colors">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">NTA resource</p>
                    <h3 className="font-bold leading-snug text-white group-hover:text-blue-300 transition-colors">{resource.title}</h3>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-blue-400">Explore it <ArrowRight className="w-4 h-4" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 py-12">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Keep exploring</p>
              <h2 className="text-2xl font-black text-white mb-6">Related questions</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedQuestions.map((relatedQuestion) => (
                  <Link key={relatedQuestion.slug} to={getKnowledgeQuestionPath(relatedQuestion)} className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 hover:border-blue-500/60 transition-colors">
                    <h3 className="font-bold leading-snug text-white mb-3">{relatedQuestion.question}</h3>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400">Read the answer <ArrowRight className="w-4 h-4" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <nav className="border-t border-slate-800 bg-slate-900/35 px-6 py-8" aria-label="Question navigation">
            <div className="max-w-3xl mx-auto flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Link to="/knowledge/questions" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4" /> All small-business questions
              </Link>
              <Link to="/knowledge" className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300">
                Explore the full Knowledge Library <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
