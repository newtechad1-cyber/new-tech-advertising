import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { whatIsDigitalTrustLessons } from '@/data/whatIsDigitalTrust';
import { getJourneyMemory } from '@/lib/journeyMemory';

export default function WhatIsDigitalTrustCollection() {
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Read from Journey Memory
    const memory = getJourneyMemory();
    const progress = memory.learningProgress || {};
    
    const completed = whatIsDigitalTrustLessons
      .filter(lesson => progress[`what-is-digital-trust:${lesson.slug}`])
      .map(lesson => lesson.id);
      
    setCompletedLessons(completed);
  }, []);

  const totalLessons = whatIsDigitalTrustLessons.length;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100);
  
  const isAllComplete = totalLessons > 0 && completedLessons.length === totalLessons;
  const firstIncompleteLesson = whatIsDigitalTrustLessons.find(l => !completedLessons.includes(l.id)) || whatIsDigitalTrustLessons[0];
  const primaryButtonText = isAllComplete ? "Review Collection" : completedLessons.length > 0 ? "Continue Journey" : "Start Journey";
  const primaryButtonLink = firstIncompleteLesson ? `/knowledge/what-is-digital-trust/${firstIncompleteLesson.slug}` : "#";

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title="What Is Digital Trust | NTA Knowledge Library"
        description="Learn how digital trust creates the confidence required for a personal relationship to begin and how to build it."
      />
      <MarketingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/learning-center" className="hover:text-white transition-colors">Knowledge Library</Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-slate-300">What Is Digital Trust</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold tracking-wide uppercase mb-6">
            <BookOpen className="w-4 h-4" /> Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            What Is Digital Trust
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Digital trust does not replace personal trust. It creates the confidence required for a personal relationship to begin. Discover how to build and maintain it online.
          </p>
          
          {/* Progress Indicator */}
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-end mb-3">
              <div className="text-left">
                <span className="block text-slate-400 text-sm font-medium mb-1">Your Progress</span>
                <span className="text-white font-bold text-lg">{completedLessons.length} of {totalLessons} Lessons</span>
              </div>
              <div className="text-purple-400 font-bold text-xl">{progressPercent}%</div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-6">
              <Link 
                to={primaryButtonLink}
                className="block w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors text-center"
              >
                {primaryButtonText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lesson List */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <PlayCircle className="text-purple-500 w-6 h-6" /> Collection Lessons
          </h2>
          
          <div className="space-y-4">
            {whatIsDigitalTrustLessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isNext = !isCompleted && (index === 0 || completedLessons.includes(whatIsDigitalTrustLessons[index - 1].id));
              
              return (
                <Link 
                  key={lesson.id}
                  to={`/knowledge/what-is-digital-trust/${lesson.slug}`}
                  className={`block p-6 rounded-2xl border transition-all duration-300 ${
                    isNext 
                      ? 'bg-purple-900/10 border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.05)]' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-purple-500" />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm ${
                          isNext ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-slate-700 text-slate-500'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                        <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md">
                          {lesson.readingTime}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>
                    
                    <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}