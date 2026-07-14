import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, PlayCircle, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import ReactMarkdown from 'react-markdown';
import { businessFoundationsLessons } from '@/data/businessFoundations';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';
import { getJourneyMemory, updateLearningProgress } from '@/lib/journeyMemory';
import RelatedContent from '@/components/knowledge/RelatedContent';

export default function BusinessFoundationsLesson() {
  const { slug } = useParams();
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonIndex = useMemo(() => {
    return businessFoundationsLessons.findIndex(l => l.slug === slug);
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      const memory = getJourneyMemory();
      const progress = memory.learningProgress || {};
      setIsCompleted(!!progress[`business-foundations:${slug}`]);
    }
  }, [slug]);

  const handleMarkComplete = () => {
    updateLearningProgress(`business-foundations:${slug}`, true);
    setIsCompleted(true);
  };

  if (lessonIndex === -1) {
    return <Navigate to="/knowledge/business-foundations" replace />;
  }

  const lesson = businessFoundationsLessons[lessonIndex];
  const totalLessons = businessFoundationsLessons.length;
  const currentStep = lessonIndex + 1;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title={`${lesson.title} | Business Foundations | NTA Knowledge Library`}
        description={lesson.description}
      />
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        
        {/* Lesson Header */}
        <header className="px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
              <Link to="/learning-center" className="hover:text-white transition-colors">Knowledge Library</Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <Link to="/knowledge/business-foundations" className="hover:text-white transition-colors">Business Foundations</Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-blue-400">Lesson {currentStep}</span>
            </div>

            <TrackProgress trackName="Business Foundations" currentStep={currentStep} totalSteps={totalLessons} color="blue" />

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight mt-6">
              {lesson.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-1.5"><BrainCircuit className="w-4 h-4 text-blue-500" /> {lesson.level}</span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">{lesson.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6">
          
          {/* Key Takeaway Box */}
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6 md:p-8 mb-12 shadow-lg shadow-blue-900/5">
            <h2 className="flex items-center gap-2 text-blue-400 font-bold mb-3 uppercase tracking-wide text-sm">
              <CheckCircle2 className="w-5 h-5" /> Key Takeaway
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed font-medium">
              {lesson.takeaway}
            </p>
          </div>

          {/* Lesson Content */}
          <article className="prose prose-invert prose-lg prose-blue max-w-none prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-white prose-ul:text-slate-300">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </article>

          <RelatedContent lesson={lesson} />

          <div className="mt-12 flex justify-center">
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-5 h-5" /> Lesson Complete
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-semibold border border-slate-700 hover:border-slate-600"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-400" /> Mark Lesson Complete
              </button>
            )}
          </div>

          <TrackBottomNav 
            prevLink={lessonIndex > 0 ? `/knowledge/business-foundations/${businessFoundationsLessons[lessonIndex - 1].slug}` : null}
            prevText="← Previous Lesson"
            nextLink={lesson.nextLessonSlug ? `/knowledge/business-foundations/${lesson.nextLessonSlug}` : "/knowledge/business-foundations"}
            nextText={lesson.nextLessonSlug ? "Continue Learning →" : "Complete Collection →"}
            color="blue"
          />

        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}