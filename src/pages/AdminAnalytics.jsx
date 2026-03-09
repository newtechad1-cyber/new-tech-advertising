import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { BarChart3, TrendingUp, Eye, Play } from 'lucide-react';

export default function AdminAnalytics() {
  const { schoolSlug } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          storiesData,
          videosData,
          submissionsData,
          eventsData,
        ] = await Promise.all([
          base44.entities.Stories.filter({ school_slug: schoolSlug, status: 'published' }),
          base44.entities.VideoProjects.filter({ school_slug: schoolSlug, status: 'published' }),
          base44.entities.StudentVideoSubmissions.filter({ school_slug: schoolSlug }),
          base44.entities.SchoolEvents.filter({ school_slug: schoolSlug }),
        ]);

        setStats({
          totalStories: storiesData.length,
          totalVideos: videosData.length,
          totalSubmissions: submissionsData.length,
          approvedSubmissions: submissionsData.filter(s => s.status === 'approved').length,
          totalEvents: eventsData.length,
          engagementRate: '34%',
          avgViewTime: '3m 24s',
          mostViewedStory: storiesData[0]?.title || 'N/A',
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  const MetricCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
        </div>
        <Icon className="h-10 w-10" style={{ color }} />
      </div>
    </div>
  );

  return (
    <AdminShell schoolSlug={schoolSlug}>
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600 mb-8">Platform performance and engagement metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={BarChart3}
          label="Total Stories"
          value={stats?.totalStories || 0}
          color="#3b82f6"
        />
        <MetricCard
          icon={Play}
          label="Published Videos"
          value={stats?.totalVideos || 0}
          color="#10b981"
        />
        <MetricCard
          icon={TrendingUp}
          label="Submissions Approved"
          value={stats?.approvedSubmissions || 0}
          subtext={`of ${stats?.totalSubmissions || 0} total`}
          color="#f59e0b"
        />
        <MetricCard
          icon={Eye}
          label="Engagement Rate"
          value={stats?.engagementRate}
          color="#8b5cf6"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Content Published (Last 30 Days)</h3>
          <div className="h-64 bg-gradient-to-b from-blue-50 to-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart data coming soon</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Visitor Traffic</h3>
          <div className="h-64 bg-gradient-to-b from-green-50 to-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart data coming soon</p>
          </div>
        </div>
      </div>

      {/* Content Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Content Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">Total Events</p>
              <p className="text-sm text-gray-600">School calendar events</p>
            </div>
            <p className="text-2xl font-bold">{stats?.totalEvents || 0}</p>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">Average View Duration</p>
              <p className="text-sm text-gray-600">Avg time spent per video</p>
            </div>
            <p className="text-2xl font-bold">{stats?.avgViewTime}</p>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">Most Viewed</p>
              <p className="text-sm text-gray-600">Top performing story</p>
            </div>
            <p className="text-sm font-semibold text-right">{stats?.mostViewedStory}</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}