import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';

export default function SchoolYearbook() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/yearbook`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Digital Yearbook</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl">
                📖
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Yearbook Section {i}</h3>
                <p className="text-gray-600 mt-2">Browse memories and highlights</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}