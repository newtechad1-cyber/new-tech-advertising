import React from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Video,
  Calendar,
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export default function AdminSchoolDashboard() {
  const { schoolSlug, currentPath, adminRoutes } = useSchoolRoute();

  const summaryCards = [
    {
      icon: Upload,
      label: 'Pending Submissions',
      value: '12',
      color: 'bg-orange-50 text-orange-600',
      action: 'Review',
      href: adminRoutes.submissions(),
    },
    {
      icon: FileText,
      label: 'Projects in Progress',
      value: '8',
      color: 'bg-blue-50 text-blue-600',
      action: 'View',
      href: adminRoutes.projects(),
    },
    {
      icon: Video,
      label: 'Published Videos',
      value: '34',
      color: 'bg-purple-50 text-purple-600',
      action: 'Library',
      href: adminRoutes.videoLibrary(),
    },
    {
      icon: FileText,
      label: 'Published Stories',
      value: '47',
      color: 'bg-green-50 text-green-600',
      action: 'Library',
      href: adminRoutes.storyLibrary(),
    },
    {
      icon: Calendar,
      label: 'Yearbook Pages',
      value: '23',
      color: 'bg-indigo-50 text-indigo-600',
      action: 'Edit',
      href: adminRoutes.yearbook.root(),
    },
    {
      icon: Users,
      label: 'Student Participation',
      value: '342',
      color: 'bg-pink-50 text-pink-600',
      action: 'View',
      href: adminRoutes.analytics(),
    },
  ];

  const recentActivity = [
    { type: 'submission', user: 'Emma Chen', action: 'submitted a video', time: '5 min ago', status: 'pending' },
    { type: 'published', user: 'Sports Team', action: 'published game highlights', time: '2 hours ago', status: 'success' },
    { type: 'submission', user: 'Jake Morrison', action: 'submitted photos', time: '4 hours ago', status: 'pending' },
    { type: 'published', user: 'Drama Club', action: 'published play recap', time: '1 day ago', status: 'success' },
    { type: 'submission', user: 'Sarah Kim', action: 'submitted a story', time: '1 day ago', status: 'approved' },
  ];

  const needsAttention = [
    { label: 'Copyright flag on submission #1204', priority: 'high', action: 'Review' },
    { label: 'Robotics team video needs caption review', priority: 'medium', action: 'Edit' },
    { label: 'Concert recap missing permission form', priority: 'high', action: 'Contact' },
  ];

  const latestContent = [
    { title: 'Regional Basketball Tournament', type: 'Video', date: 'Mar 8', status: 'published' },
    { title: 'Science Fair Winners Spotlight', type: 'Story', date: 'Mar 7', status: 'published' },
    { title: 'Choir Spring Concert Recap', type: 'Video', date: 'Mar 6', status: 'published' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Hampton-Dumont Community Schools</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Help</Button>
                <Button className="bg-blue-600 hover:bg-blue-700">+ New Project</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Welcome Hero */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 mb-8 shadow-md">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Administrator</h2>
            <p className="opacity-95">You have 12 pending submissions and 3 items that need attention.</p>
          </div>

          {/* Summary Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {summaryCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <a
                  key={idx}
                  href={card.href}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className={`inline-flex p-3 rounded-lg mb-4 ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    {card.action} →
                  </Button>
                </a>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        <span className="text-blue-600">{item.user}</span> {item.action}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {item.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                      {item.status === 'success' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      )}
                      {item.status === 'approved' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Approved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-white rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Needs Attention
              </h3>
              <div className="space-y-4">
                {needsAttention.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">{item.label}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          item.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 text-orange-600 hover:text-orange-700"
                    >
                      {item.action} →
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Published Content */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Latest Published Content
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {latestContent.map((content, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 font-semibold uppercase">{content.type}</p>
                    <h4 className="text-gray-900 font-bold mt-2">{content.title}</h4>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{content.date}</span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}