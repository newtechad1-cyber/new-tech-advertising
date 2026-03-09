import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Calendar, FileText } from 'lucide-react';

export default function BulldogTVVideos() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: 1,
      title: 'Bulldogs Friday Night Highlights',
      category: 'Athletics',
      date: 'Mar 8, 2026',
      description: 'The Bulldogs brought incredible energy to the field during Friday night\'s game. Students, fans, and the marching band helped create an unforgettable atmosphere.',
      script: 'Friday night lights once again brought the Hampton-Dumont community together.\n\nStudents filled the stands, the band kept the energy high, and the Bulldogs delivered an exciting performance on the field.\n\nMoments like these remind everyone why high school athletics are such an important part of school pride.\n\nFrom kickoff to the final whistle, the Bulldogs showed determination, teamwork, and heart.',
      image: '🏈',
    },
    {
      id: 2,
      title: 'Robotics Club Build Day',
      category: 'STEM',
      date: 'Mar 6, 2026',
      description: 'Students in the robotics club work together to design and build their latest competition robot.',
      script: 'Inside the robotics lab at Hampton-Dumont, creativity and problem-solving are on display.\n\nStudents collaborate to design, build, and program robots for upcoming competitions.\n\nEach challenge helps them develop skills in engineering, teamwork, and innovation.\n\nIt\'s hands-on learning that prepares students for the future.',
      image: '🤖',
    },
    {
      id: 3,
      title: 'A Day at Hampton-Dumont Schools',
      category: 'Student Life',
      date: 'Mar 4, 2026',
      description: 'From classrooms to extracurricular activities, students experience a full day of learning, collaboration, and creativity.',
      script: 'Every day at Hampton-Dumont Schools is filled with opportunities to learn and grow.\n\nStudents explore new ideas in the classroom, work together on projects, and participate in activities that build friendships and confidence.\n\nThese moments shape the experiences that make the school community special.',
      image: '📚',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Bulldog TV</h1>
          <p className="text-purple-100 text-lg">Highlight videos and visual stories from Hampton-Dumont Schools</p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {selectedVideo ? (
          /* Video Detail View */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-900 aspect-video flex items-center justify-center text-8xl">
              {videos[selectedVideo - 1].image}
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {videos[selectedVideo - 1].category}
                </span>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="h-4 w-4" />
                  {videos[selectedVideo - 1].date}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">{videos[selectedVideo - 1].title}</h1>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{videos[selectedVideo - 1].description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Voiceover Script</h2>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4 text-gray-700 leading-relaxed max-h-64 overflow-y-auto">
                    {videos[selectedVideo - 1].script.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setSelectedVideo(null)}
                className="text-blue-600"
              >
                Back to Videos
              </Button>
            </div>
          </div>
        ) : (
          /* Videos Grid */
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video.id)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gray-900 flex items-center justify-center text-6xl group">
                  {video.image}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    {video.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{video.description}</p>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Calendar className="h-4 w-4" />
                    {video.date}
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