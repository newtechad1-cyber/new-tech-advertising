import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BrainCircuit, PlayCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import ReactMarkdown from 'react-markdown';
import { whatIsDigitalTrustLessons } from '@/data/whatIsDigitalTrust';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';
import { getJourneyMemory, updateLearningProgress } from '@/lib/journeyMemory';
import RelatedContent from '@/components/knowledge/RelatedContent';

export default function WhatIsDigitalTrustLesson() {
  const { slug } = useParams();
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonIndex = useMemo(() => {
    return whatIsDigitalTrustLessons.findIndex(l => l.slug === slug);
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      const memory = getJourneyMemory();
      const progress = memory.learningProgress || {};
      setIsCompleted(!!progress[`what-is-digital-trust:${slug}`]);
    }
  }, [slug]);

  const handleMarkComplete = () => {
    updateLearningProgress(`what-is-digital-trust:${slug}`, true);
    setIsCompleted(true);
  };

  if (lessonIndex === -1) {
    return <Navigate to="/knowledge/what-is-digital-trust" replace />;
  }

  const lesson = whatIsDigitalTrustLessons[lessonIndex];
  const totalLessons = whatIsDigitalTrustLessons.length;
  const currentStep = lessonIndex + 1;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title={`${lesson.title} | What Is Digital Trust | NTA Knowledge Library`}
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
              <Link to="/knowledge/what-is-digital-trust" className="hover:text-white transition-colors">What Is Digital Trust</Link>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="text-purple-400">Lesson {currentStep}</span>
            </div>

            <TrackProgress trackName="What Is Digital Trust" currentStep={currentStep} totalSteps={totalLessons} color="purple" />

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight mt-6">
              {lesson.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-1.5"><BrainCircuit className="w-4 h-4 text-purple-500" /> {lesson.level}</span>
              <span>•</span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">{lesson.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6">
          
          {/* Key Takeaway Box */}
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-6 md:p-8 mb-12 shadow-lg shadow-purple-900/5">
            <h2 className="flex items-center gap-2 text-purple-400 font-bold mb-3 uppercase tracking-wide text-sm">
              <CheckCircle2 className="w-5 h-5" /> Key Takeaway
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed font-medium">
              {lesson.takeaway}
            </p>
          </div>

          {/* Lesson Content */}
          <article className="prose prose-invert prose-lg prose-purple max-w-none prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-strong:text-white prose-ul:text-slate-300">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </article>

          <RelatedContent lesson={lesson} />

          <div className="mt-12 flex justify-center">
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
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
            prevLink={lessonIndex > 0 ? `/knowledge/what-is-digital-trust/${whatIsDigitalTrustLessons[lessonIndex - 1].slug}` : null}
            prevText="← Previous Lesson"
            nextLink={lesson.nextLessonSlug ? `/knowledge/what-is-digital-trust/${lesson.nextLessonSlug}` : "/knowledge/what-is-digital-trust"}
            nextText={lesson.nextLessonSlug ? "Continue Learning →" : "Complete Collection →"}
            color="purple"
          />

        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}