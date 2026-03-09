import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';

export default function SchoolSpotlights() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/spotlights`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Student Spotlights</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center text-white text-5xl">
                ⭐
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Student Spotlight {i}</h3>
                <p className="text-gray-600 mt-2">Celebrating excellence and achievement</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}