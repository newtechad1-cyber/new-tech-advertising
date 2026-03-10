import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AdminLayout from '@/components/admin/AdminLayout';
import { useSchoolPermissions } from '@/components/school-tv/useSchoolPermissions';
import PermissionGuard from '@/components/school-tv/PermissionGuard';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Eye,
  Archive,
  BookOpen,
  Plus,
  Loader2,
  Search,
} from 'lucide-react';

export default function AdminSchoolStoryLibrary() {
  const { schoolSlug: paramSlug } = useParams();
  const schoolSlug = paramSlug || new URLSearchParams(window.location.search).get('schoolSlug') || 'hampton-dumont';
  const { can } = useSchoolPermissions(schoolSlug);
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await base44.entities.Stories.filter({
          school_slug: schoolSlug,
        });
        setStories(data.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date)));
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  useEffect(() => {
    let filtered = stories;
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStories(filtered);
  }, [stories, selectedStatus, searchTerm]);

  const STATUS_COLORS = {
    draft: 'bg-gray-100 text-gray-800',
    review: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const content = (
    <div>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Story Library</h1>
              <p className="text-gray-600 mt-1">{filteredStories.length} of {stories.length} stories</p>
            </div>
            {can('edit_stories') && (
              <Link
                to={`${createPageUrl('AdminStoryDetail')}?id=new&schoolSlug=${schoolSlug}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Plus className="h-5 w-5" /> New Story
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
          {filteredStories.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Visibility</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStories.map((story) => (
                    <tr key={story.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{story.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[story.status] || 'bg-gray-100'}`}>
                          {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(story.updated_date || story.created_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 capitalize">{story.visibility || 'staff'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {can('edit_stories') ? (
                            <Link
                              to={`${createPageUrl('AdminStoryDetail')}?id=${story.id}&schoolSlug=${schoolSlug}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          ) : (
                            <Edit className="h-4 w-4 text-gray-300 cursor-not-allowed" title="Requires edit_stories permission" />
                          )}
                          {story.status === 'published' && (
                            <a
                              href={`${createPageUrl('SchoolStoryDetail')}?slug=${story.slug}&schoolSlug=${schoolSlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No stories found</p>
              {can('edit_stories') && (
                <Link
                  to={`${createPageUrl('AdminStoryDetail')}?id=new&schoolSlug=${schoolSlug}`}
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Create Your First Story
                </Link>
              )}
            </div>
          )}
        </div>
    </div>
  );

  return <AdminLayout currentPageName="AdminSchoolStoryLibrary">{content}</AdminLayout>;
}