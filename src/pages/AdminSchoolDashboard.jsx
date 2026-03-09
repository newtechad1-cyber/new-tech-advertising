import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { AlertCircle, CheckCircle2, Clock, Video, BookOpen, Zap, BarChart3, AlertTriangle } from 'lucide-react';

export default function AdminSchoolDashboard() {
  const { schoolSlug } = useParams();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          submissionsData,
          projectsData,
          storiesData,
          videosData,
          pagesData,
          eventsData,
          aiJobsData,
          rendersData,
        ] = await Promise.all([
          base44.entities.StudentVideoSubmissions.filter({ school_slug: schoolSlug }),
          base44.entities.VideoProjects.filter({ school_slug: schoolSlug }),
          base44.entities.Stories.filter({ school_slug: schoolSlug }),
          base44.entities.VideoProjects.filter({ school_slug: schoolSlug, status: 'published' }),
          base44.entities.YearbookPages.filter({ school_slug: schoolSlug }),
          base44.entities.SchoolEvents.filter({ school_slug: schoolSlug }),
          base44.entities.AIContentJobs.filter({ school_slug: schoolSlug }),
          base44.entities.VideoRenderJobs.filter({ school_slug: schoolSlug }),
        ]);

        setStats({
          pendingSubmissions: submissionsData.filter(s => s.status === 'pending').length,
          projectsInProgress: projectsData.filter(p => ['draft', 'collecting_assets', 'ready_for_ai', 'script_generated', 'queued_for_render', 'rendering'].includes(p.status)).length,
          storiesPublished: storiesData.filter(s => s.status === 'published').length,
          videosPublished: videosData.filter(v => v.status === 'published').length,
          yearbookPages: pagesData.filter(p => p.status === 'published').length,
          upcomingEvents: eventsData.filter(e => new Date(e.event_date) > new Date()).length,
          aiJobsPending: aiJobsData.filter(j => j.status === 'pending').length,
          failedRenders: rendersData.filter(r => r.status === 'failed').length,
        });

        // Build recent activity
        const activities = [];
        submissionsData.slice(0, 3).forEach(s => {
          if (s.updated_date) activities.push({
            type: 'submission',
            title: `Submission: ${s.submission_title}`,
            status: s.status,
            date: new Date(s.updated_date),
          });
        });
        activities.sort((a, b) => b.date - a.date);
        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [schoolSlug]);

  if (loading) return <AdminShell schoolSlug={schoolSlug}><div className="text-center py-12">Loading...</div></AdminShell>;

  const StatCard = ({ icon: Icon, label, value, color, route }) => (
    <Link
      to={route}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="h-10 w-10" style={{ color }} />
      </div>
    </Link>
  );

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 mb-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-blue-100">Here's what's happening in your School Story Lab</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={AlertCircle}
          label="Pending Submissions"
          value={stats?.pendingSubmissions || 0}
          color="#ef4444"
          route={`/admin/schools/${schoolSlug}/submissions`}
        />
        <StatCard
          icon={Clock}
          label="Projects In Progress"
          value={stats?.projectsInProgress || 0}
          color="#f59e0b"
          route={`/admin/schools/${schoolSlug}/projects`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Stories Published"
          value={stats?.storiesPublished || 0}
          color="#10b981"
          route={`/admin/schools/${schoolSlug}/story-library`}
        />
        <StatCard
          icon={Video}
          label="Videos Published"
          value={stats?.videosPublished || 0}
          color="#3b82f6"
          route={`/admin/schools/${schoolSlug}/video-library`}
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={BookOpen}
          label="Yearbook Pages"
          value={stats?.yearbookPages || 0}
          color="#8b5cf6"
          route={`/admin/schools/${schoolSlug}/yearbook`}
        />
        <StatCard
          icon={BarChart3}
          label="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          color="#ec4899"
          route={`/admin/schools/${schoolSlug}/events`}
        />
        <StatCard
          icon={Zap}
          label="AI Jobs Pending"
          value={stats?.aiJobsPending || 0}
          color="#f59e0b"
          route={`/admin/schools/${schoolSlug}/ai-lab`}
        />
        <StatCard
          icon={AlertTriangle}
          label="Failed Renders"
          value={stats?.failedRenders || 0}
          color="#dc2626"
          route={`/admin/schools/${schoolSlug}/video-library`}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {activity.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </div>

        {/* Needs Attention */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Needs Attention
          </h3>
          <div className="space-y-3">
            {stats?.pendingSubmissions > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-sm text-red-900 mb-1">{stats.pendingSubmissions} Pending Submissions</p>
                <p className="text-xs text-red-700 mb-2">Review and approve content submissions</p>
                <Link to={`/admin/schools/${schoolSlug}/submissions`} className="text-xs text-red-600 hover:text-red-800 font-semibold">
                  Review Now →
                </Link>
              </div>
            )}
            {stats?.failedRenders > 0 && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="font-semibold text-sm text-orange-900 mb-1">{stats.failedRenders} Failed Render Jobs</p>
                <p className="text-xs text-orange-700 mb-2">Check and retry failed video renders</p>
                <Link to={`/admin/schools/${schoolSlug}/video-library`} className="text-xs text-orange-600 hover:text-orange-800 font-semibold">
                  View Failed →
                </Link>
              </div>
            )}
            {stats?.aiJobsPending > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-semibold text-sm text-yellow-900 mb-1">{stats.aiJobsPending} AI Jobs Pending</p>
                <p className="text-xs text-yellow-700 mb-2">Monitor AI content generation queue</p>
                <Link to={`/admin/schools/${schoolSlug}/ai-lab`} className="text-xs text-yellow-600 hover:text-yellow-800 font-semibold">
                  Check Queue →
                </Link>
              </div>
            )}
            {!stats?.pendingSubmissions && !stats?.failedRenders && !stats?.aiJobsPending && (
              <p className="text-gray-500 text-sm">Everything is running smoothly!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Link to={`/admin/schools/${schoolSlug}/submissions?action=create`} className="bg-white hover:bg-blue-50 p-4 rounded-lg text-center border border-blue-200 transition-colors">
            <p className="font-semibold text-sm">+ New Submission</p>
          </Link>
          <Link to={`/admin/schools/${schoolSlug}/projects?action=create`} className="bg-white hover:bg-blue-50 p-4 rounded-lg text-center border border-blue-200 transition-colors">
            <p className="font-semibold text-sm">+ New Project</p>
          </Link>
          <Link to={`/admin/schools/${schoolSlug}/story-library?action=create`} className="bg-white hover:bg-blue-50 p-4 rounded-lg text-center border border-blue-200 transition-colors">
            <p className="font-semibold text-sm">+ New Story</p>
          </Link>
          <Link to={`/admin/schools/${schoolSlug}/ai-lab`} className="bg-white hover:bg-blue-50 p-4 rounded-lg text-center border border-blue-200 transition-colors">
            <p className="font-semibold text-sm">AI Lab</p>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}