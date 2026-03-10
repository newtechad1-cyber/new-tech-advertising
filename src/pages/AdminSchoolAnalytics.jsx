import React from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '@/components/school-tv/AdminShell';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Video,
  Upload,
} from 'lucide-react';

export default function AdminSchoolAnalytics() {
  const { schoolSlug, currentPath } = useSchoolRoute();

  const stats = [
    { icon: Upload, label: 'Total Submissions', value: '247', change: '+12%' },
    { icon: FileText, label: 'Published Stories', value: '47', change: '+8%' },
    { icon: Video, label: 'Published Videos', value: '34', change: '+5%' },
    { icon: Users, label: 'Student Contributors', value: '142', change: '+18%' },
  ];

  const submissionsByMonth = [
    { month: 'January', submissions: 35, stories: 8, videos: 5 },
    { month: 'February', submissions: 42, stories: 12, videos: 8 },
    { month: 'March', submissions: 58, stories: 15, videos: 10 },
  ];

  const categoryBreakdown = [
    { category: 'Sports', count: 58, percentage: 24 },
    { category: 'Academics', count: 47, percentage: 19 },
    { category: 'Arts', count: 42, percentage: 17 },
    { category: 'Clubs', count: 55, percentage: 22 },
    { category: 'Events', count: 45, percentage: 18 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Analytics
            </h1>
            <p className="text-gray-600 mt-1">Submissions, stories, videos, and participation metrics</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: FileText, label: 'Total Submissions', value: '247', change: '+12%', color: 'bg-blue-50' },
              { icon: FileText, label: 'Published Stories', value: '47', change: '+8%', color: 'bg-green-50' },
              { icon: Video, label: 'Published Videos', value: '34', change: '+5%', color: 'bg-purple-50' },
              { icon: Users, label: 'Contributors', value: '142', change: '+18%', color: 'bg-pink-50' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className={`rounded-lg border border-gray-200 p-6 ${stat.color}`}>
                  <Icon className="h-8 w-8 text-gray-700 mb-4" />
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 font-semibold mt-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {stat.change} this month
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Submissions by Month */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Submissions by Month</h2>
              <div className="space-y-6">
                {submissionsByMonth.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.month}</span>
                      <span className="text-sm font-bold text-gray-900">{item.submissions}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 bg-blue-200 h-8 rounded" style={{ width: `${(item.submissions / 70) * 100}%` }}>
                        <div className="h-full flex items-center justify-end pr-2 text-xs font-bold text-blue-900">
                          {item.submissions}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Submissions by Category</h2>
              <div className="space-y-4">
                {categoryBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Monthly Breakdown</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Month</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Submissions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Stories</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Videos</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Contributors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { month: 'January', submissions: 35, stories: 8, videos: 5, contributors: 28 },
                  { month: 'February', submissions: 42, stories: 12, videos: 8, contributors: 35 },
                  { month: 'March', submissions: 58, stories: 15, videos: 10, contributors: 42 },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.month}</td>
                    <td className="px-6 py-4 text-gray-700">{row.submissions}</td>
                    <td className="px-6 py-4 text-gray-700">{row.stories}</td>
                    <td className="px-6 py-4 text-gray-700">{row.videos}</td>
                    <td className="px-6 py-4 text-gray-700">{row.contributors}</td>
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