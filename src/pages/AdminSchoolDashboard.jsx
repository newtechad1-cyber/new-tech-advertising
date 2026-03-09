import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AdminShell from '@/components/school-tv/AdminShell';
import { AlertCircle, CheckCircle2, Clock, Video, BookOpen, Zap, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';

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

        // Build recent activity from all sources
         const activities = [];

         // Add submissions with priority to pending
         submissionsData.forEach(s => {
           if (s.updated_date) activities.push({
             type: 'submission',
             icon: '📤',
             title: s.submission_title,
             subtitle: `By ${s.contributor_name}`,
             status: s.status,
             priority: s.status === 'pending' ? 1 : (s.status === 'approved' ? 2 : 3),
             date: new Date(s.updated_date),
           });
         });

         // Add stories
         storiesData.slice(0, 3).forEach(story => {
           activities.push({
             type: 'story',
             icon: '📖',
             title: story.title,
             subtitle: story.status,
             status: story.status,
             priority: story.status === 'draft' ? 1 : 2,
             date: new Date(story.updated_date || story.created_date),
           });
         });

         // Sort by priority, then by date
         activities.sort((a, b) => {
           if (a.priority !== b.priority) return a.priority - b.priority;
           return b.date - a.date;
         });

         setRecentActivity(activities.slice(0, 6));
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
      className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex flex-col items-start">
        <p className="text-gray-600 text-xs md:text-sm mb-2">{label}</p>
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
      </div>
    </Link>
  );

  return (
    <AdminShell schoolSlug={schoolSlug}>
      {/* Welcome */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-purple-700 text-white py-12 md:py-16 mb-8 md:mb-10 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ffffff 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 px-6 md:px-8">
          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">Bulldog Story Lab</h1>
          <p className="text-blue-100 text-lg md:text-xl font-semibold">Your content platform at a glance. Quick status of submissions, videos, stories, and AI tasks:</p>
        </div>
      </div>

      {/* Quick Overview */}
       <div className="mb-6 text-xs md:text-sm font-black text-gray-800 uppercase tracking-wider">📊 Key Metrics</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-14">
        <StatCard
          icon={AlertCircle}
          label="Submissions to Review"
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
          label="Stories Live"
          value={stats?.storiesPublished || 0}
          color="#10b981"
          route={`/admin/schools/${schoolSlug}/story-library`}
        />
        <StatCard
          icon={Video}
          label="Videos Live"
          value={stats?.videosPublished || 0}
          color="#3b82f6"
          route={`/admin/schools/${schoolSlug}/video-library`}
        />
      </div>

      <div className="mb-6 text-xs md:text-sm font-black text-gray-800 uppercase tracking-wider">📚 Other Content</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-14">
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
          label="AI Jobs Queued"
          value={stats?.aiJobsPending || 0}
          color="#f59e0b"
          route={`/admin/schools/${schoolSlug}/ai-lab`}
        />
        <StatCard
          icon={AlertTriangle}
          label="Render Issues"
          value={stats?.failedRenders || 0}
          color="#dc2626"
          route={`/admin/schools/${schoolSlug}/video-library`}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Activity */}
         <div className="bg-white rounded-lg shadow-md p-6 order-2 md:order-1">
           <h3 className="text-lg md:text-xl font-bold mb-1">Recent Activity</h3>
           <p className="text-sm text-gray-600 mb-4">Latest content updates across your platform</p>
           {recentActivity.length > 0 ? (
             <div className="space-y-3">
               {recentActivity.map((activity, idx) => (
                 <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                   <span className="text-lg flex-shrink-0">{activity.icon}</span>
                   <div className="flex-1 min-w-0">
                     <p className="font-semibold text-sm text-gray-900 truncate">{activity.title}</p>
                     <div className="flex items-center gap-2 mt-1">
                       <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                         activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                         activity.status === 'approved' || activity.status === 'published' ? 'bg-green-100 text-green-800' :
                         activity.status === 'draft' ? 'bg-blue-100 text-blue-800' :
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
             <div className="text-center py-8">
               <p className="text-gray-500 text-sm">No activity yet</p>
               <p className="text-xs text-gray-400 mt-2">Content and submissions will appear here</p>
             </div>
           )}
         </div>

        {/* Needs Attention */}
         <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500 order-1 md:order-2">
           <h3 className="text-lg md:text-xl font-bold mb-1 flex items-center gap-2">
             <AlertTriangle className="h-5 w-5 text-amber-600" />
             Action Items
           </h3>
           <p className="text-sm text-gray-600 mb-4">Tasks that need your attention</p>
           <div className="space-y-2">
             {stats?.pendingSubmissions > 0 && (
               <Link to={`/admin/schools/${schoolSlug}/submissions`} className="block p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-bold text-red-900">{stats.pendingSubmissions} submissions pending</p>
                     <p className="text-xs text-red-700">Student content waiting for review</p>
                   </div>
                   <span className="text-lg">→</span>
                 </div>
               </Link>
             )}
             {stats?.aiJobsPending > 0 && (
               <Link to={`/admin/schools/${schoolSlug}/ai-lab`} className="block p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-bold text-yellow-900">{stats.aiJobsPending} AI drafts ready</p>
                     <p className="text-xs text-yellow-700">AI-generated content for review</p>
                   </div>
                   <span className="text-lg">→</span>
                 </div>
               </Link>
             )}
             {stats?.failedRenders > 0 && (
               <Link to={`/admin/schools/${schoolSlug}/video-library`} className="block p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-bold text-orange-900">{stats.failedRenders} failed renders</p>
                     <p className="text-xs text-orange-700">Video rendering issues to resolve</p>
                   </div>
                   <span className="text-lg">→</span>
                 </div>
               </Link>
             )}
             {!stats?.pendingSubmissions && !stats?.failedRenders && !stats?.aiJobsPending && (
               <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                 <p className="text-green-900 font-semibold">✓ All caught up!</p>
                 <p className="text-xs text-green-700">No urgent items need your attention</p>
               </div>
             )}
           </div>
         </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 md:mt-14 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-3xl p-8 md:p-10 border-2 border-blue-200 shadow-lg">
        <h3 className="text-2xl md:text-3xl font-black mb-2">Jump Into Workflow</h3>
        <p className="text-gray-600 mb-8">Quick access to core tasks</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Link to={`/admin/schools/${schoolSlug}/submissions`} className="group bg-white hover:bg-red-50 p-6 md:p-8 rounded-2xl text-center border-2 border-red-100 hover:border-red-300 transition-all hover:shadow-lg hover:-translate-y-2">
            <p className="text-4xl md:text-5xl mb-3">📋</p>
            <p className="font-bold text-sm md:text-base text-gray-900 mb-2">Review & Approve</p>
            <p className="text-xs text-gray-500">Student submissions</p>
          </Link>
          <Link to={`/admin/schools/${schoolSlug}/projects`} className="group bg-white hover:bg-blue-50 p-6 md:p-8 rounded-2xl text-center border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg hover:-translate-y-2">
            <p className="text-4xl md:text-5xl mb-3">🎬</p>
            <p className="font-bold text-sm md:text-base text-gray-900 mb-2">Create Video</p>
            <p className="text-xs text-gray-500">Start a project</p>
          </Link>
          <Link to={`/admin/schools/${schoolSlug}/ai-lab`} className="group bg-white hover:bg-yellow-50 p-6 md:p-8 rounded-2xl text-center border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-lg hover:-translate-y-2">
            <p className="text-4xl md:text-5xl mb-3">⚡</p>
            <p className="font-bold text-sm md:text-base text-gray-900 mb-2">AI Content</p>
            <p className="text-xs text-gray-500">Generate & review</p>
          </Link>
          <Link to={`/admin/schools/${schoolSlug}/story-library`} className="group bg-white hover:bg-purple-50 p-6 md:p-8 rounded-2xl text-center border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg hover:-translate-y-2">
            <p className="text-4xl md:text-5xl mb-3">📖</p>
            <p className="font-bold text-sm md:text-base text-gray-900 mb-2">Write Story</p>
            <p className="text-xs text-gray-500">Share updates</p>
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}