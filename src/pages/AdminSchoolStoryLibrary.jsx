import React from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Eye,
  Archive,
  BookOpen,
  Calendar,
  User,
  BookMarked,
} from 'lucide-react';

export default function AdminSchoolStoryLibrary() {
  const { schoolSlug, currentPath } = useSchoolRoute();

  const stories = [
    {
      id: 1,
      title: 'Our Robotics Team Won States!',
      author: 'Sarah Kim',
      type: 'Student Story',
      status: 'published',
      date: 'Mar 8, 2026',
      yearbook: true,
    },
    {
      id: 2,
      title: 'Science Fair: Innovation Showcase',
      author: 'Ms. Johnson',
      type: 'Feature Article',
      status: 'published',
      date: 'Mar 7, 2026',
      yearbook: true,
    },
    {
      id: 3,
      title: 'Meet the Spring Softball Team',
      author: 'Coach Wilson',
      type: 'Team Spotlight',
      status: 'published',
      date: 'Mar 5, 2026',
      yearbook: false,
    },
    {
      id: 4,
      title: 'Drama Club Spring Musical Recap',
      author: 'Mr. Martinez',
      type: 'Event Recap',
      status: 'draft',
      date: 'Mar 4, 2026',
      yearbook: false,
    },
    {
      id: 5,
      title: 'Student Spotlight: Emma Chen',
      author: 'Staff',
      type: 'Profile',
      status: 'published',
      date: 'Mar 1, 2026',
      yearbook: true,
    },
  ];

  const typeColors = {
    'Student Story': 'bg-blue-100 text-blue-800',
    'Feature Article': 'bg-purple-100 text-purple-800',
    'Team Spotlight': 'bg-green-100 text-green-800',
    'Event Recap': 'bg-orange-100 text-orange-800',
    'Profile': 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Story Library</h1>
            <p className="text-gray-600 mt-1">{stories.filter(s => s.status === 'published').length} published stories</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">In Yearbook</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{story.title}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="h-4 w-4" />
                        {story.author}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[story.type]}`}>
                        {story.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4" />
                        {story.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        story.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {story.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {story.yearbook && (
                        <div className="flex items-center gap-1 text-blue-600 font-medium">
                          <BookMarked className="h-4 w-4" />
                          Yes
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}