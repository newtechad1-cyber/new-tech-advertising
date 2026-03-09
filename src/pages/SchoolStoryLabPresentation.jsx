import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Sparkles,
  CheckCircle2,
  Target,
  Zap,
} from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'School Story Lab',
    subtitle: 'A Modern Digital Yearbook, Student Media Platform, and AI Storytelling Lab for Schools',
    body: 'Helping schools capture student stories, celebrate achievements, and teach future-ready communication skills.',
    footer: 'Presented by New Tech Advertising',
    type: 'title',
  },
  {
    id: 2,
    title: 'Schools Create Incredible Moments Every Day',
    body: 'From classroom projects to robotics competitions, athletic events, concerts, and student achievements, schools create meaningful moments every day.\n\nYet most of these stories disappear into phones, scattered social media posts, or folders that are never organized.\n\nSchools need a better way to collect, organize, and share the story of their students.',
    type: 'standard',
  },
  {
    id: 3,
    title: 'Imagine One Place That Captures the Story of the Entire School Year',
    body: 'What if your district had a single platform where students, teachers, and staff could collect and share:',
    bullets: [
      'student achievements',
      'school events',
      'athletics and activities',
      'classroom projects',
      'clubs and performing arts',
      'teacher and student spotlights',
    ],
    bodyAfter: 'A living digital archive that grows throughout the year.',
    type: 'bullets',
  },
  {
    id: 4,
    title: 'Introducing School Story Lab',
    subtitle: 'School Story Lab combines three powerful ideas into one platform designed for schools.',
    columns: [
      {
        heading: 'Digital Yearbook',
        text: 'A modern yearbook that grows throughout the school year instead of waiting until graduation.',
        icon: BookOpen,
      },
      {
        heading: 'Student Media Hub',
        text: 'Students and staff submit photos, videos, and stories that highlight school life.',
        icon: Users,
      },
      {
        heading: 'AI Story Lab',
        text: 'Guided AI tools help students write captions, articles, and video scripts responsibly.',
        icon: Sparkles,
      },
    ],
    type: 'three-column',
  },
  {
    id: 5,
    title: 'How the Platform Works',
    steps: [
      {
        number: 1,
        heading: 'Students Submit Content',
        text: 'Students and staff upload photos, videos, and story ideas from school activities.',
      },
      {
        number: 2,
        heading: 'Teachers Review and Approve',
        text: 'Administrators or teachers review submissions before anything is published.',
      },
      {
        number: 3,
        heading: 'Stories and Videos Are Created',
        text: 'The platform organizes content into stories, highlight videos, and yearbook pages.',
      },
      {
        number: 4,
        heading: 'The School Year Comes to Life',
        text: 'Students, families, and the community can explore the stories that define the school year.',
      },
    ],
    type: 'steps',
  },
  {
    id: 6,
    title: 'Students Gain Real-World Skills',
    body: 'School Story Lab helps students build valuable communication and digital media skills.',
    bullets: [
      'digital storytelling',
      'media production',
      'journalism and writing',
      'collaboration and teamwork',
      'responsible AI use',
      'portfolio-building opportunities',
    ],
    quote: 'Students become creators, not just consumers.',
    type: 'bullets-with-quote',
  },
  {
    id: 7,
    title: 'Benefits for Schools and Districts',
    columns: [
      {
        bullets: [
          'Strengthens school pride and culture',
          'Improves communication with parents and the community',
          'Highlights student achievements and programs',
          'Encourages student participation and creativity',
        ],
      },
      {
        bullets: [
          'Modernizes the traditional yearbook',
          'Creates a permanent archive of school memories',
          'Supports digital literacy initiatives',
          'Provides a structured way to introduce AI learning',
        ],
      },
    ],
    type: 'two-column-bullets',
  },
  {
    id: 8,
    title: 'A Safe Way to Introduce AI in Education',
    body: 'Artificial intelligence is becoming part of the modern workplace.\n\nSchool Story Lab introduces AI in a safe, guided environment where students learn how to use it as a creative and communication tool.',
    subtitle: 'Students can use AI to:',
    bullets: [
      'generate interview questions',
      'draft story outlines',
      'create captions for yearbook photos',
      'summarize event highlights',
      'build video scripts',
    ],
    safety: 'All content is teacher-reviewed before publication.',
    type: 'ai-education',
  },
  {
    id: 9,
    title: 'What the Platform Looks Like',
    sections: [
      {
        heading: 'Public School Story Hub',
        text: 'Students, parents, and community members see stories, highlights, and yearbook content.',
      },
      {
        heading: 'Student Submission Portal',
        text: 'Students and staff submit photos, videos, and stories.',
      },
      {
        heading: 'Admin Dashboard',
        text: 'Staff review submissions, organize content, and publish safely.',
      },
    ],
    type: 'three-sections',
  },
  {
    id: 10,
    title: 'Where Schools Use It First',
    grid: [
      'athletics highlights',
      'robotics and STEM programs',
      'concerts and performing arts',
      'classroom projects',
      'student council and clubs',
      'teacher spotlights',
      'graduation and senior recognition',
      'community service events',
    ],
    type: 'grid',
  },
  {
    id: 11,
    title: 'Simple Launch Plan',
    phases: [
      {
        number: 1,
        heading: 'Platform Setup',
        text: 'School branding and platform configuration.',
      },
      {
        number: 2,
        heading: 'Launch',
        text: 'Student submission portal and story hub go live.',
      },
      {
        number: 3,
        heading: 'Staff Training',
        text: 'Teachers and administrators learn the review and publishing workflow.',
      },
      {
        number: 4,
        heading: 'Student Participation',
        text: 'Students begin contributing stories, photos, and videos.',
      },
    ],
    timeline: 'Typical launch time: 2–3 weeks.',
    type: 'phases',
  },
  {
    id: 12,
    title: 'Simple District Pricing',
    pricing: [
      {
        heading: 'District Pilot',
        price: '$2,000 first year pilot program',
      },
      {
        heading: 'Full District License',
        price: '$3,500–$5,000 annually',
      },
    ],
    includes: [
      'platform setup',
      'student submission portal',
      'digital yearbook system',
      'AI storytelling tools',
      'teacher moderation controls',
      'hosting and updates',
    ],
    type: 'pricing',
  },
  {
    id: 13,
    title: 'A New Way to Tell the Story of Your Schools',
    body: 'School Story Lab helps districts celebrate student achievements, strengthen school pride, and create a living archive of the entire school year.\n\nIt is not just a tool — it is a platform that empowers students to share the story of their school community.',
    type: 'closing',
  },
  {
    id: 14,
    title: 'Would Your District Like to Pilot School Story Lab?',
    body: 'We would welcome the opportunity to help your district launch a modern digital yearbook and student storytelling platform.',
    cta: 'Schedule a Pilot Planning Meeting',
    footer: 'New Tech Advertising',
    type: 'cta',
  },
];

export default function SchoolStoryLabPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Main Slide Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-full max-w-5xl aspect-video bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {/* Slide Content */}
          <div className="flex-1 p-12 overflow-auto flex flex-col justify-between">
            {/* Header */}
            {slide.type === 'title' ? (
              <div className="text-center py-12">
                <h1 className="text-6xl font-bold text-gray-900 mb-6">{slide.title}</h1>
                <p className="text-2xl text-gray-600 mb-8 leading-relaxed">{slide.subtitle}</p>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">{slide.body}</p>
              </div>
            ) : (
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-8">{slide.title}</h1>

                {/* Three Column Layout */}
                {slide.type === 'three-column' && (
                  <div>
                    {slide.subtitle && <p className="text-lg text-gray-700 mb-8">{slide.subtitle}</p>}
                    <div className="grid grid-cols-3 gap-6">
                      {slide.columns.map((col, idx) => {
                        const Icon = col.icon;
                        return (
                          <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                            <Icon className="h-8 w-8 text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{col.heading}</h3>
                            <p className="text-gray-700 leading-relaxed">{col.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Standard Body */}
                {slide.type === 'standard' && (
                  <div className="space-y-4">
                    {slide.body.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-lg text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Bullets */}
                {slide.type === 'bullets' && (
                  <div>
                    <p className="text-lg text-gray-700 mb-6">{slide.body}</p>
                    <ul className="space-y-3 mb-6">
                      {slide.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-lg text-gray-700">
                          <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {slide.bodyAfter && <p className="text-lg text-gray-700 italic">{slide.bodyAfter}</p>}
                  </div>
                )}

                {/* Bullets with Quote */}
                {slide.type === 'bullets-with-quote' && (
                  <div>
                    <p className="text-lg text-gray-700 mb-6">{slide.body}</p>
                    <ul className="space-y-3 mb-8">
                      {slide.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-lg text-gray-700">
                          <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-blue-100 border-l-4 border-blue-600 p-6 italic text-lg text-gray-800">
                      "{slide.quote}"
                    </div>
                  </div>
                )}

                {/* Steps */}
                {slide.type === 'steps' && (
                  <div className="grid grid-cols-4 gap-4">
                    {slide.steps.map((step) => (
                      <div key={step.number} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold mb-4">
                          {step.number}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{step.heading}</h3>
                        <p className="text-sm text-gray-700">{step.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Education */}
                {slide.type === 'ai-education' && (
                  <div className="space-y-6">
                    {slide.body.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-lg text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    {slide.subtitle && <p className="text-lg font-semibold text-gray-900 mt-4">{slide.subtitle}</p>}
                    <ul className="space-y-2">
                      {slide.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-lg text-gray-700">
                          <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-gray-800">
                      <p className="font-semibold text-green-900">Safety: </p>
                      <p>{slide.safety}</p>
                    </div>
                  </div>
                )}

                {/* Two Column Bullets */}
                {slide.type === 'two-column-bullets' && (
                  <div className="grid grid-cols-2 gap-8">
                    {slide.columns.map((col, idx) => (
                      <ul key={idx} className="space-y-3">
                        {col.bullets.map((bullet, bidx) => (
                          <li key={bidx} className="flex items-start gap-3 text-lg text-gray-700">
                            <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                )}

                {/* Three Sections */}
                {slide.type === 'three-sections' && (
                  <div className="grid grid-cols-3 gap-6">
                    {slide.sections.map((section, idx) => (
                      <div key={idx} className="bg-gray-100 rounded-lg p-6 h-40 border border-gray-300 flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-2">{section.heading}</h3>
                        <p className="text-sm text-gray-700 flex-1">{section.text}</p>
                        <div className="text-4xl text-gray-300 text-center py-4">📷</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid */}
                {slide.type === 'grid' && (
                  <div className="grid grid-cols-4 gap-4">
                    {slide.grid.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg p-4 border border-gray-300 text-center">
                        <p className="text-gray-700 font-medium">{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Phases */}
                {slide.type === 'phases' && (
                  <div className="space-y-6">
                    {slide.phases.map((phase) => (
                      <div key={phase.number} className="flex gap-6 items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold">
                          {phase.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{phase.heading}</h3>
                          <p className="text-gray-700">{phase.text}</p>
                        </div>
                      </div>
                    ))}
                    <p className="text-lg text-gray-900 font-semibold mt-8">{slide.timeline}</p>
                  </div>
                )}

                {/* Pricing */}
                {slide.type === 'pricing' && (
                  <div>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      {slide.pricing.map((option, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.heading}</h3>
                          <p className="text-2xl text-blue-600 font-bold">{option.price}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-3">Includes:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {slide.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Closing */}
                {slide.type === 'closing' && (
                  <div className="space-y-4">
                    {slide.body.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-lg text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {slide.type === 'cta' && (
                  <div className="text-center space-y-8 py-6">
                    <p className="text-lg text-gray-700 leading-relaxed">{slide.body}</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg font-semibold">
                      {slide.cta}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Visual Placeholder */}
            {slide.type !== 'title' && (
              <div className="mt-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-3">🖼️</div>
                  <p className="text-gray-500 font-medium">Visual placeholder</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-12 py-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {slide.footer && <p>{slide.footer}</p>}
            </div>
            <div className="text-sm text-gray-600">
              Slide {currentSlide + 1} of {slides.length}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-8 py-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={prevSlide}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>

        {/* Slide Thumbnails */}
        <div className="flex gap-2 overflow-x-auto flex-1 mx-6 max-h-16">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`flex-shrink-0 w-12 h-12 rounded text-sm font-semibold transition-all ${
                idx === currentSlide
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={nextSlide}
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}