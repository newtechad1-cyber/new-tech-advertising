import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { lessonDoorways } from '@/data/lessonDoorways';
import { getKnowledgeQuestionBySlug, getKnowledgeQuestionPath } from '@/data/knowledgeQuestions';

export default function LessonDoorwayQuestions({ lessonPath }) {
  const doorway = lessonDoorways.find((item) => item.lessonPath === lessonPath);
  if (!doorway) return null;

  return (
    <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">Explore another angle</p>
        <h2 className="mb-3 text-2xl font-black text-white">Questions connected to this lesson</h2>
        <p className="mb-6 leading-7 text-slate-400">People come to the same idea with different questions. Choose the one that matters to you now.</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {doorway.questionSlugs.map((slug) => {
            const question = getKnowledgeQuestionBySlug(slug);
            return question && (
              <li key={slug}>
                <Link to={getKnowledgeQuestionPath(question)} className="flex h-full items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-4 font-semibold text-blue-300 hover:border-blue-400 hover:text-white">
                  {question.question}<ArrowRight className="h-4 w-4 flex-shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
