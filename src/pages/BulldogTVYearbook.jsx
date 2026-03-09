import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export default function BulldogTVYearbook() {
  const [selectedPage, setSelectedPage] = useState(null);

  const yearbookPages = [
    {
      id: 1,
      title: 'Fall 2026 Highlights',
      season: 'Fall 2026',
      description: 'The fall season at Hampton-Dumont Schools was filled with exciting events, athletic competitions, and student activities.',
      featuredStories: [
        'Bulldogs Football Season',
        'Homecoming Week',
        'Robotics Club Preparation',
        'Fall Band Performances',
      ],
      gallery: ['🏈', '🎉', '🤖', '🎵'],
    },
    {
      id: 2,
      title: 'Winter Arts & Activities',
      season: 'Winter 2026',
      description: 'Winter brought outstanding performances and creative achievements from students across the district.',
      featuredStories: [
        'Winter Choir Concert',
        'Band Performance Night',
        'Art Classroom Showcase',
        'Theater Rehearsals',
      ],
      gallery: ['🎵', '🎺', '🎨', '🎭'],
    },
    {
      id: 3,
      title: 'Spring STEM Showcase',
      season: 'Spring 2026',
      description: 'Students demonstrated innovation and creativity during the annual STEM showcase.',
      featuredStories: [
        'Science Experiments',
        'Engineering Challenges',
        'Robotics Demonstrations',
        'Project Presentations',
      ],
      gallery: ['🔬', '🏗️', '🤖', '💡'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Digital Yearbook</h1>
          <p className="text-indigo-100 text-lg">A living archive of the Hampton-Dumont school year</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {selectedPage ? (
          /* Yearbook Page Detail */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-12 text-center border-b border-gray-200">
              <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wide mb-3">
                {yearbookPages[selectedPage - 1].season}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {yearbookPages[selectedPage - 1].title}
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {yearbookPages[selectedPage - 1].description}
              </p>
            </div>

            <div className="p-8">
              {/* Featured Stories */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {yearbookPages[selectedPage - 1].featuredStories.map((story, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-900 font-semibold">{story}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
                <div className="grid grid-cols-4 gap-4">
                  {yearbookPages[selectedPage - 1].gallery.map((emoji, idx) => (
                    <div
                      key={idx}
                      className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-4xl"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-8">
              <Button variant="outline" onClick={() => setSelectedPage(null)}>
                Back to Yearbook
              </Button>
            </div>
          </div>
        ) : (
          /* Yearbook Pages Grid */
          <div className="grid md:grid-cols-3 gap-6">
            {yearbookPages.map((page) => (
              <div
                key={page.id}
                onClick={() => setSelectedPage(page.id)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Cover */}
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-5xl mb-3">{page.gallery[0]}</div>
                    <p className="text-sm text-indigo-600 font-semibold uppercase">{page.season}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{page.title}</h3>
                  <p className="text-sm text-gray-700 mb-4">{page.description}</p>
                  <div className="flex gap-2">
                    {page.gallery.map((emoji, idx) => (
                      <span key={idx} className="text-2xl">
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}