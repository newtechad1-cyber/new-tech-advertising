import React from 'react';
import { Star } from 'lucide-react';

export default function BulldogTVSpotlights() {
  const spotlights = [
    {
      id: 1,
      type: 'Student Spotlight',
      name: 'Alex Chen',
      title: 'Robotics Team Captain',
      image: '🎓',
      story: `Senior robotics team captain Alex has been a leader in the robotics program for four years.

Alex helps mentor younger students, troubleshoot design challenges, and organize the team's preparation for competitions.

Through robotics, Alex says he discovered a passion for engineering and teamwork.

"Being part of this team taught me how to think creatively and solve complex problems," Alex reflected. "I'm grateful for the opportunity to help other students discover the same passion."`,
    },
    {
      id: 2,
      type: 'Teacher Spotlight',
      name: 'Ms. Larson',
      title: 'Science Teacher',
      image: '👨‍🏫',
      story: `Science teacher Ms. Larson has helped expand STEM opportunities for students across the district.

Through hands-on projects and collaborative learning, students are encouraged to explore science, technology, and engineering concepts in creative ways.

Programs like robotics and the STEM showcase continue to grow thanks to her dedication.

"I believe every student has the potential to be a scientist, engineer, or inventor," Ms. Larson said. "My role is to help them discover their curiosity and confidence."`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Spotlights</h1>
          </div>
          <p className="text-pink-100 text-lg">Celebrating the people who make Hampton-Dumont special</p>
        </div>
      </div>

      {/* Spotlights */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {spotlights.map((spotlight) => (
          <div key={spotlight.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-64 flex-shrink-0 h-64 md:h-auto bg-gradient-to-br from-pink-100 to-rose-50 flex items-center justify-center text-8xl">
                {spotlight.image}
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
                      {spotlight.type}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{spotlight.name}</h2>
                  <p className="text-lg text-gray-600 mb-6">{spotlight.title}</p>

                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    {spotlight.story.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}