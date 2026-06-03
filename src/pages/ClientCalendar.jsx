import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ClientGuard from '@/components/auth/ClientGuard';
import RouteFamilyBadge from '@/components/admin/RouteFamilyBadge';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import ClientNav from '@/components/nav/ClientNav';

import CalendarHeader from '@/components/client-calendar/CalendarHeader';
import CalendarSummary from '@/components/client-calendar/CalendarSummary';
import CalendarViewToggle from '@/components/client-calendar/CalendarViewToggle';
import CalendarFilters from '@/components/client-calendar/CalendarFilters';
import HeroStrip from '@/components/client-calendar/HeroStrip';
import WeeklyTimeline from '@/components/client-calendar/WeeklyTimeline';
import MonthView from '@/components/client-calendar/MonthView';
import WeekView from '@/components/client-calendar/WeekView';
import AgendaView from '@/components/client-calendar/AgendaView';
import UpcomingThisWeek from '@/components/client-calendar/UpcomingThisWeek';
import RecentlyPublished from '@/components/client-calendar/RecentlyPublished';
import MarketingPlanEmptyState from '@/components/client-calendar/MarketingPlanEmptyState';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/6e3c5001c_builtforsmallbusinessespng2.png';

export default function ClientCalendar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        if (!u) { base44.auth.redirectToLogin(); return; }
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

  // Load company
  const { data: clientCompany } = useQuery({
    queryKey: ['client-company', user?.client_id],
    queryFn: async () => {
      if (!user?.client_id) return null;
      const res = await base44.functions.invoke('getClientCompanies', {});
      return res.data.companies?.[0] || null;
    },
    enabled: !!user?.client_id
  });

  // Load video requests for approvals and scheduled content
  const { data: videoRequests = [] } = useQuery({
    queryKey: ['client-videos', user?.client_id],
    queryFn: () => base44.entities.VideoRequests.filter({ client_id: user.client_id }, '-created_date', 100),
    enabled: !!user?.client_id
  });

  // Load scheduled posts
  const { data: scheduledPosts = [] } = useQuery({
    queryKey: ['client-posts', user?.client_id],
    queryFn: () => base44.entities.ScheduledPost.filter({ client_id: user.client_id }, '-scheduled_for', 100),
    enabled: !!user?.client_id
  });

  // Transform data to calendar events
  const calendarEvents = [
    ...videoRequests
      .filter(v => v.status !== 'archived')
      .map(v => ({
        id: v.id,
        title: v.title,
        description: v.goal,
        date: v.scheduled_publish_at || v.created_date,
        thumbnail: v.thumbnail_url,
        status: v.approval_status === 'Approved' ? 'published' :
                v.approval_status === 'Pending' ? 'approval' :
                'draft',
        platforms: [v.platform_destination || 'website'].filter(Boolean),
        caption: v.website_title,
        cta: v.cta_text,
        liveUrl: v.render_output_url,
        time: v.scheduled_publish_at ? new Date(v.scheduled_publish_at).toLocaleTimeString() : null,
      })),
    ...scheduledPosts
      .map(p => ({
        id: p.id,
        title: p.caption?.slice(0, 50) || 'Social Post',
        description: p.caption,
        date: p.scheduled_for,
        thumbnail: null,
        status: p.status === 'published' ? 'published' :
                p.status === 'scheduled' ? 'scheduled' :
                'draft',
        platforms: [p.platform],
        caption: p.caption,
        cta: null,
        liveUrl: null,
        time: p.scheduled_for ? new Date(p.scheduled_for).toLocaleTimeString() : null,
      }))
  ];

  // Apply filters
  const filteredEvents = calendarEvents.filter(e => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (channelFilter !== 'all' && !e.platforms.includes(channelFilter)) return false;
    return true;
  });

  // Calculate metrics
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const needsApproval = calendarEvents.filter(e => e.status === 'approval').length;
  const scheduledThisWeek = calendarEvents.filter(e => {
    const eDate = new Date(e.date);
    return eDate >= now && eDate <= weekEnd && e.status === 'scheduled';
  }).length;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const publishedThisMonth = calendarEvents.filter(e => {
    const eDate = new Date(e.date);
    return eDate.getMonth() === thisMonth && eDate.getFullYear() === thisYear && e.status === 'published';
  }).length;

  const companyName = clientCompany?.business_name || user?.full_name || 'Your Company';

  const handleLogout = () => base44.auth.logout();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <ClientGuard>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <ClientNav />
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <CalendarHeader companyName={companyName} primaryColor="#3B82F6" />

          {/* Hero Strip */}
          {calendarEvents.length > 0 && (
            <HeroStrip 
              nextPost={calendarEvents.find(e => e.status === 'scheduled' || e.status === 'approval')}
              pendingCount={needsApproval}
              campaignRunning={null}
            />
          )}

          {/* Summary Cards */}
          <CalendarSummary
            needsApproval={needsApproval}
            scheduledThisWeek={scheduledThisWeek}
            publishedThisMonth={publishedThisMonth}
            campaignsRunning={0}
          />

          {/* Controls */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CalendarViewToggle currentView={view} onViewChange={setView} />
            <CalendarFilters 
              statusFilter={statusFilter}
              channelFilter={channelFilter}
              onStatusChange={setStatusFilter}
              onChannelChange={setChannelFilter}
              onReset={() => {
                setStatusFilter('all');
                setChannelFilter('all');
              }}
            />
          </div>

          {/* Weekly Timeline */}
          {filteredEvents.length > 0 && (
            <WeeklyTimeline events={filteredEvents} />
          )}

          {/* Calendar View */}
          {filteredEvents.length === 0 ? (
            <MarketingPlanEmptyState />
          ) : (
            <div>
              {view === 'month' && <MonthView events={filteredEvents} />}
              {view === 'week' && <WeekView events={filteredEvents} />}
              {view === 'agenda' && <AgendaView events={filteredEvents} />}
            </div>
          )}

          {/* Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <UpcomingThisWeek events={filteredEvents} />
            </div>
            <div>
              <RecentlyPublished events={filteredEvents} />
            </div>
          </div>
        </main>
      </div>
    </div>
    </ClientGuard>
  );
}