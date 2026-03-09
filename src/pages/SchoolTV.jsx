import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';

export default function SchoolTV() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/tv`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Video Hub</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-600 text-4xl">
                🎬
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">Video {i}</h3>
                <p className="text-sm text-gray-600 mt-1">12 min • 234 views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}