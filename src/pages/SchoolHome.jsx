import React from 'react';
import { useParams } from 'react-router-dom';
import PublicShell from '@/components/school-tv/PublicShell';

export default function SchoolHome() {
  const { schoolSlug } = useParams();

  return (
    <PublicShell currentPath={`/schools/${schoolSlug}/home`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to {schoolSlug}</h1>
          <p className="text-xl text-gray-600 mt-3">Your digital home for stories, videos, and memories</p>
        </div>

        {/* Featured Content */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-lg font-bold text-gray-900">Digital Yearbook</h3>
            <p className="text-gray-600 mt-2">Explore this year's yearbook</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-4xl mb-3">🎬</div>
            <h3 className="text-lg font-bold text-gray-900">Video Hub</h3>
            <p className="text-gray-600 mt-2">Watch school highlights and events</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-lg font-bold text-gray-900">Spotlights</h3>
            <p className="text-gray-600 mt-2">Celebrate student achievements</p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}