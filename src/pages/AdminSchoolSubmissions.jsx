import React, { useState } from 'react';
import { useSchoolRoute } from '@/components/school-tv/useSchoolRoute';
import SchoolAdminNav from '@/components/school-tv/SchoolAdminNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function AdminSchoolSubmissions() {
  const { schoolSlug, currentPath } = useSchoolRoute();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const submissions = [
    {
      id: 1204,
      contributor: 'Emma Chen',
      type: 'Video',
      title: 'Basketball Game Highlights',
      status: 'pending',
      date: 'Mar 9, 2:30 PM',
      thumbnail: '🎬',
      consent: true,
      notes: 'Good quality, check music rights',
      flag: 'copyright',
    },
    {
      id: 1203,
      contributor: 'Jake Morrison',
      type: 'Photos',
      title: 'Science Fair Setup',
      status: 'approved',
      date: 'Mar 9, 1:15 PM',
      thumbnail: '📸',
      consent: true,
      notes: 'Ready to publish',
    },
    {
      id: 1202,
      contributor: 'Sarah Kim',
      type: 'Story',
      title: 'Our Robotics Team Won!',
      status: 'approved',
      date: 'Mar 8, 4:45 PM',
      thumbnail: '📝',
      consent: true,
      notes: 'Assigned to yearbook',
    },
    {
      id: 1201,
      contributor: 'Marcus Wilson',
      type: 'Video',
      title: 'Robotics Competition Recap',
      status: 'review',
      date: 'Mar 8, 2:20 PM',
      thumbnail: '🎬',
      consent: false,
      notes: 'Missing parent consent form',
      flag: 'consent',
    },
    {
      id: 1200,
      contributor: 'Alex Torres',
      type: 'Photos',
      title: 'Drama Club Rehearsal',
      status: 'rejected',
      date: 'Mar 7, 3:00 PM',
      thumbnail: '📸',
      consent: true,
      notes: 'Blurry images, request resubmission',
    },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    review: 'bg-orange-100 text-orange-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const filteredSubmissions = filterStatus === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filterStatus);

  return (
    <div className="flex h-screen bg-gray-50">
      <SchoolAdminNav schoolSlug={schoolSlug} currentPath={currentPath} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1">Review and approve student submissions</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Filters & Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search submissions..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="review">Needs Review</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Contributor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Submission</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 font-medium">{submission.contributor}</p>
                        {!submission.consent && (
                          <p className="text-xs text-red-600 font-semibold mt-1">⚠ No consent form</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{submission.thumbnail}</span>
                        <div>
                          <p className="text-gray-900 font-medium">{submission.title}</p>
                          {submission.flag && (
                            <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {submission.flag === 'copyright' ? 'Copyright flag' : 'Needs review'}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{submission.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{submission.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {submission.status !== 'approved' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preview Drawer */}
      {selectedSubmission && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Submission #{selectedSubmission.id}</h2>
            <button
              onClick={() => setSelectedSubmission(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Contributor</p>
              <p className="text-gray-900 font-medium">{selectedSubmission.contributor}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Title</p>
              <p className="text-gray-900 font-medium">{selectedSubmission.title}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Type</p>
              <p className="text-gray-900">{selectedSubmission.type}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Content Preview</p>
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                {selectedSubmission.thumbnail}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <p className="text-xs text-gray-600 font-medium uppercase mb-2">AI Notes</p>
              <p className="text-sm text-gray-700">{selectedSubmission.notes}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Consent Status</p>
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedSubmission.consent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {selectedSubmission.consent ? '✓ Consent provided' : '✗ No consent form'}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-3">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Approve
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Reject
            </Button>
            <Button variant="outline" className="w-full">
              Request Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}