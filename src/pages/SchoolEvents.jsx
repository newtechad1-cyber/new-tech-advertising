import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';

export default function SchoolEvents() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/events`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Events</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-bold text-gray-900">School Event {i}</h3>
                <p className="text-gray-600 mt-1">March {10 + i}, 2026 • Gymnasium</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">Upcoming</span>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}