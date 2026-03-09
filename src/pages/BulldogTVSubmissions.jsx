import React from 'react';
import { Upload, User, Calendar, FileText } from 'lucide-react';

export default function BulldogTVSubmissions() {
  const submissions = [
    {
      id: 1,
      student: 'Emma R.',
      category: 'Robotics',
      type: 'Photos',
      count: 3,
      description: 'Robot testing day before competition',
      date: 'Mar 7, 2026',
      status: 'approved',
      thumbnail: '🤖',
    },
    {
      id: 2,
      student: 'Noah T.',
      category: 'Athletics',
      type: 'Video',
      count: 1,
      description: 'Game highlight clip from Friday night',
      date: 'Mar 6, 2026',
      status: 'approved',
      thumbnail: '🏈',
    },
    {
      id: 3,
      student: 'Ava L.',
      category: 'Performing Arts',
      type: 'Video',
      count: 1,
      description: 'Choir rehearsal for winter concert',
      date: 'Mar 5, 2026',
      status: 'approved',
      thumbnail: '🎵',
    },
    {
      id: 4,
      student: 'Marcus J.',
      category: 'Student Life',
      type: 'Photos',
      count: 5,
      description: 'Candid moments from last week\'s pep rally',
      date: 'Mar 4, 2026',
      status: 'approved',
      thumbnail: '📸',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Student Submissions</h1>
          </div>
          <p className="text-green-100 text-lg">See what students are sharing with the community</p>
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-6xl border-b border-gray-200">
                {submission.thumbnail}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">{submission.student}</span>
                    </div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                      {submission.category}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Approved
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-900 font-semibold mb-3">{submission.description}</p>

                {/* Meta Info */}
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {submission.type} ({submission.count} {submission.type === 'Video' ? 'file' : 'files'})
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {submission.date}
                  </div>
                </div>

                {/* Featured Badge */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    ✓ This submission has been featured in the school story hub
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Submit */}
        <div className="mt-16 bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Share Your Story?</h2>
          <p className="text-gray-700 mb-4">
            If you're a student or staff member at Hampton-Dumont Schools, you can submit photos, videos, or stories to be featured on Bulldog TV and in the digital yearbook.
          </p>
          <p className="text-gray-700 mb-6">
            All submissions are reviewed by school staff to ensure they align with our community values and school policies.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Submit Content
          </button>
        </div>
      </div>
    </div>
  );
}