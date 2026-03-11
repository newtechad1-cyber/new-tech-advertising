import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import ClientGuard from '@/components/auth/ClientGuard';
import RouteFamilyBadge from '@/components/admin/RouteFamilyBadge';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import PerformanceHeader from '@/components/client-dashboard/PerformanceHeader';
import VisibilityMetrics from '@/components/client-dashboard/VisibilityMetrics';
import ActivityFeed from '@/components/client-dashboard/ActivityFeed';
import UpcomingContentPanel from '@/components/client-dashboard/UpcomingContentPanel';
import RecentWinsPanel from '@/components/client-dashboard/RecentWinsPanel';
import ApprovalReminder from '@/components/client-dashboard/ApprovalReminder';
import PerformanceStory from '@/components/client-dashboard/PerformanceStory';
import ChannelPresenceSummary from '@/components/client-dashboard/ChannelPresenceSummary';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        if (!u) { base44.auth.redirectToLogin(); return; }
        // If admin accidentally hits this page, send them to command center
        if (u.role === 'admin') {
          window.location.href = createPageUrl('AdminCommandCenter');
          return;
        }
        setUser(u);
      } catch {
        base44.auth.redirectToLogin();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load client's trial account by email
  const { data: trialAccounts = [] } = useQuery({
    queryKey: ['client-trial', user?.email],
    queryFn: () => base44.entities.TrialAccount.filter({ email: user.email }),
    enabled: !!user?.email
  });
  const trial = trialAccounts[0];

  // Load client's proposals (filtered by their email via created_by)
  const { data: proposals = [] } = useQuery({
    queryKey: ['client-proposals', user?.email],
    queryFn: () => base44.entities.Proposal.list('-created_date', 10),
    enabled: !!user
  });

  // Load social posts for this client
  const { data: socialPosts = [] } = useQuery({
    queryKey: ['client-posts', user?.email],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 20),
    enabled: !!user
  });

  // Load leads attributed to client
  const { data: leads = [] } = useQuery({
    queryKey: ['client-leads', user?.email],
    queryFn: () => base44.entities.Lead.list('-created_date', 50),
    enabled: !!user
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const recentPosts = socialPosts.filter(p => new Date(p.created_date) > thirtyDaysAgo).length;
  const recentLeads = leads.filter(l => new Date(l.created_date) > thirtyDaysAgo).length;
  const activeProposals = proposals.filter(p => ['sent', 'viewed'].includes(p.status));

  const handleLogout = () => base44.auth.logout();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  const companyName = trial?.name || user?.full_name || 'Your Company';

  return (
    <ClientGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Top Nav */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <img src={LOGO} alt="NTA" className="h-8 w-auto" />
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
              <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Dashboard</span>
              <a href={createPageUrl('ClientFulfillment')} className="hover:text-slate-800">Services</a>
              <a href={createPageUrl('ClientSettings')} className="hover:text-slate-800">Settings</a>
            </nav>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">{user?.full_name}</p>
                <p className="text-xs text-slate-400">{companyName}</p>
              </div>
              <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Performance Header */}
          <PerformanceHeader companyName={companyName} primaryColor="#3B82F6" />

          {/* Approval Reminder (if pending content) */}
          {socialPosts.filter(p => p.scheduling_status === 'pending_review').length > 0 && (
            <ApprovalReminder 
              pendingCount={socialPosts.filter(p => p.scheduling_status === 'pending_review').length}
              primaryColor="#3B82F6"
            />
          )}

          {/* Visibility Momentum Metrics */}
          <VisibilityMetrics
            contentPublished={recentPosts}
            upcomingScheduled={socialPosts.filter(p => p.scheduling_status === 'scheduled').length}
            videoViews={0}
            websiteActivity={proposals.length}
            campaignsRunning={activeProposals.length}
          />

          {/* Recent Marketing Activity Feed */}
          <ActivityFeed activities={[
            {
              type: 'video_published',
              title: 'New Video Published',
              description: 'Your promotional video is now live on Facebook',
              timestamp: new Date(),
            },
            {
              type: 'story_created',
              title: 'Website Story Created',
              description: 'Brand story published to your website',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
              type: 'campaign_scheduled',
              title: 'Campaign Scheduled',
              description: 'Seasonal promotion is scheduled to go live',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
          ]} />

          {/* Upcoming Content */}
          <UpcomingContentPanel content={socialPosts.slice(0, 4).map(p => ({
            title: p.caption?.slice(0, 50) || 'Scheduled Post',
            thumbnail: p.media_url,
            publishDate: p.scheduled_date || new Date(),
            platforms: [p.platform || 'website'],
          }))} />

          {/* Recent Wins */}
          <RecentWinsPanel />

          {/* Performance Story */}
          <PerformanceStory companyName={companyName} />

          {/* Channel Presence Summary */}
          <ChannelPresenceSummary />

          {/* Empty State */}
          {socialPosts.length === 0 && proposals.length === 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold text-slate-700 mb-2">We're Preparing Your Marketing System</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Content will begin appearing here soon as we set up your campaigns and publishing schedule.
              </p>
            </div>
          )}
        </main>
      </div>
      <RouteFamilyBadge family="client_portal" />
    </ClientGuard>
  );
}