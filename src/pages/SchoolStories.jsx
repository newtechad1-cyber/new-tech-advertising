import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';

export default function SchoolStories() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/stories`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Stories</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900">Story {i}: A Moment in Time</h3>
              <p className="text-gray-600 mt-2">Read about this amazing school moment...</p>
              <p className="text-sm text-gray-500 mt-4">Mar {9 - i}, 2026</p>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}